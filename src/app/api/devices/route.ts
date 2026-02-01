import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { randomBytes, createHmac } from "crypto";

export const dynamic = "force-dynamic";

/**
 * POST /api/devices — Register a new SenseStamp device
 * 
 * Body:
 * {
 *   "device_id": "ss-001-c6",
 *   "name": "Front Door Sensor",
 *   "location": "warehouse-door-3"
 * }
 * 
 * Returns: device record + HMAC secret (only shown once!)
 */
export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("authorization")?.replace("Bearer ", "");

  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Validate API key
  const { data: owner, error: authError } = await supabase
    .from("ss_api_keys")
    .select("owner_id")
    .eq("key", apiKey)
    .single();

  if (authError || !owner) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  try {
    const { device_id, name, location } = await req.json();

    if (!device_id) {
      return NextResponse.json(
        { error: "Missing required field: device_id" },
        { status: 400 }
      );
    }

    // Check if device already exists
    const { data: existing } = await supabase
      .from("ss_devices")
      .select("id")
      .eq("device_id", device_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Device already registered" },
        { status: 409 }
      );
    }

    // Generate HMAC secret for this device
    const hmacSecret = randomBytes(32).toString("hex");

    const { data: device, error: insertError } = await supabase
      .from("ss_devices")
      .insert({
        device_id,
        owner_id: owner.owner_id,
        name: name || device_id,
        location: location || null,
        hmac_secret: hmacSecret,
      })
      .select("id, device_id, name, location, created_at")
      .single();

    if (insertError) {
      console.error("[SenseStamp] Failed to register device:", insertError);
      return NextResponse.json(
        { error: "Failed to register device" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      device,
      hmac_secret: hmacSecret,
      warning: "Save this HMAC secret — it cannot be retrieved again. Flash it to your device's config.h",
    });
  } catch (err) {
    console.error("[SenseStamp] Device registration error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/devices — List registered devices
 */
export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("authorization")?.replace("Bearer ", "");

  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: owner, error: authError } = await supabase
    .from("ss_api_keys")
    .select("owner_id")
    .eq("key", apiKey)
    .single();

  if (authError || !owner) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  const { data: devices, error } = await supabase
    .from("ss_devices")
    .select("id, device_id, name, location, last_seen, battery_mv, fw_version, created_at")
    .eq("owner_id", owner.owner_id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch devices" }, { status: 500 });
  }

  return NextResponse.json({ devices });
}
