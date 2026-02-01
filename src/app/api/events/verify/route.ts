import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * GET /api/events/verify?id=<event_id>
 * 
 * Public endpoint — verify a proof-of-presence record.
 * Returns the event details and verification status.
 * Can be used by third parties to confirm someone was at a location.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("id");

  if (!eventId) {
    return NextResponse.json(
      { error: "Missing event ID. Usage: /api/events/verify?id=<event_id>" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  const { data: event, error } = await supabase
    .from("ss_events")
    .select("id, device_code, tag_uid, timestamp, location, verified, created_at")
    .eq("id", eventId)
    .single();

  if (error || !event) {
    return NextResponse.json(
      { error: "Event not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    verified: event.verified,
    proof: {
      event_id: event.id,
      device_id: event.device_code,
      tag_uid: event.tag_uid,
      timestamp: event.timestamp,
      location: event.location,
      recorded_at: event.created_at,
    },
    message: event.verified
      ? "This proof-of-presence event has been cryptographically verified."
      : "This event could not be verified.",
  });
}
