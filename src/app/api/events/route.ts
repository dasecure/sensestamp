import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { verifySignature } from "@/lib/hmac";

export const dynamic = "force-dynamic";

/**
 * POST /api/events — Receive proof-of-presence event from ESP32 device
 * 
 * Body:
 * {
 *   "device_id": "ss-001-c6",
 *   "tag_uid": "04:A2:3B:7C:D1:00:00",
 *   "timestamp": 1738346100,
 *   "location": "warehouse-door-3",
 *   "signature": "a3f8c2...e91b",
 *   "battery_mv": 3720,
 *   "fw_version": "0.1.0"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { device_id, tag_uid, timestamp, location, signature, battery_mv, fw_version } = body;

    // Validate required fields
    if (!device_id || !tag_uid || !timestamp || !signature) {
      return NextResponse.json(
        { error: "Missing required fields: device_id, tag_uid, timestamp, signature" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Look up device and get its HMAC secret
    const { data: device, error: deviceError } = await supabase
      .from("ss_devices")
      .select("id, owner_id, hmac_secret, name, location")
      .eq("device_id", device_id)
      .single();

    if (deviceError || !device) {
      return NextResponse.json(
        { error: "Unknown device" },
        { status: 401 }
      );
    }

    // Verify HMAC signature
    const isValid = verifySignature(device_id, tag_uid, timestamp, signature, device.hmac_secret);

    if (!isValid) {
      console.error(`[SenseStamp] Invalid signature for device ${device_id}`);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Validate timestamp (within ±5 minutes to prevent replay)
    const now = Math.floor(Date.now() / 1000);
    const drift = Math.abs(now - timestamp);
    if (drift > 300) {
      return NextResponse.json(
        { error: "Timestamp out of range", drift_seconds: drift },
        { status: 400 }
      );
    }

    // Check for duplicate (same device + tag + timestamp within 10 seconds)
    const { data: existing } = await supabase
      .from("ss_events")
      .select("id")
      .eq("device_id", device_id)
      .eq("tag_uid", tag_uid)
      .gte("timestamp", timestamp - 10)
      .lte("timestamp", timestamp + 10)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "Duplicate event", event_id: existing[0].id },
        { status: 409 }
      );
    }

    // Store the event
    const { data: event, error: insertError } = await supabase
      .from("ss_events")
      .insert({
        device_id: device.id,
        device_code: device_id,
        owner_id: device.owner_id,
        tag_uid,
        timestamp,
        location: location || device.location,
        signature,
        battery_mv: battery_mv || null,
        fw_version: fw_version || null,
        verified: true,
      })
      .select("id, created_at")
      .single();

    if (insertError) {
      console.error("[SenseStamp] Failed to insert event:", insertError);
      return NextResponse.json(
        { error: "Failed to store event" },
        { status: 500 }
      );
    }

    // Update device last_seen and battery
    await supabase
      .from("ss_devices")
      .update({
        last_seen: new Date(timestamp * 1000).toISOString(),
        battery_mv: battery_mv || undefined,
        fw_version: fw_version || undefined,
      })
      .eq("id", device.id);

    // TODO: Send push notification via iotpush
    // await fetch(`https://www.iotpush.com/api/push/${device.owner_id}`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     title: `SenseStamp: ${device.name || device_id}`,
    //     message: `Tag ${tag_uid} scanned at ${location || device.location}`,
    //     tags: "sensestamp,presence",
    //   }),
    // });

    return NextResponse.json({
      ok: true,
      event_id: event.id,
      created_at: event.created_at,
      verified: true,
    });
  } catch (err) {
    console.error("[SenseStamp] Event error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/events — List events (requires API key)
 * 
 * Query params:
 *   ?device_id=ss-001-c6
 *   ?tag_uid=04:A2:3B:7C
 *   ?limit=50
 *   ?offset=0
 */
export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("authorization")?.replace("Bearer ", "");

  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Validate API key and get owner
  const { data: owner, error: authError } = await supabase
    .from("ss_api_keys")
    .select("owner_id")
    .eq("key", apiKey)
    .single();

  if (authError || !owner) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const deviceCode = searchParams.get("device_id");
  const tagUid = searchParams.get("tag_uid");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
  const offset = parseInt(searchParams.get("offset") || "0");

  let query = supabase
    .from("ss_events")
    .select("id, device_code, tag_uid, timestamp, location, battery_mv, fw_version, verified, created_at", { count: "exact" })
    .eq("owner_id", owner.owner_id)
    .order("timestamp", { ascending: false })
    .range(offset, offset + limit - 1);

  if (deviceCode) query = query.eq("device_code", deviceCode);
  if (tagUid) query = query.eq("tag_uid", tagUid);

  const { data: events, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }

  return NextResponse.json({
    events,
    total: count,
    limit,
    offset,
  });
}
