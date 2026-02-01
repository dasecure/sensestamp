-- ============================================================
-- SenseStamp Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- API Keys for authenticating dashboard/API requests
CREATE TABLE ss_api_keys (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid NOT NULL,
  key text NOT NULL UNIQUE,
  name text DEFAULT 'Default',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_ss_api_keys_key ON ss_api_keys(key);

-- Registered devices
CREATE TABLE ss_devices (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id text NOT NULL UNIQUE,          -- e.g. "ss-001-c6"
  owner_id uuid NOT NULL,
  name text,                                -- e.g. "Front Door Sensor"
  location text,                            -- e.g. "warehouse-door-3"
  hmac_secret text NOT NULL,                -- HMAC-SHA256 key for this device
  last_seen timestamptz,
  battery_mv integer,
  fw_version text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_ss_devices_device_id ON ss_devices(device_id);
CREATE INDEX idx_ss_devices_owner ON ss_devices(owner_id);

-- Proof-of-presence events
CREATE TABLE ss_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id uuid NOT NULL REFERENCES ss_devices(id),
  device_code text NOT NULL,                -- denormalized device_id string for fast queries
  owner_id uuid NOT NULL,
  tag_uid text NOT NULL,                    -- NFC tag UID e.g. "04:A2:3B:7C:D1:00:00"
  timestamp bigint NOT NULL,                -- Unix timestamp from device
  location text,
  signature text NOT NULL,                  -- HMAC-SHA256 signature
  battery_mv integer,
  fw_version text,
  verified boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_ss_events_owner ON ss_events(owner_id);
CREATE INDEX idx_ss_events_device ON ss_events(device_code);
CREATE INDEX idx_ss_events_tag ON ss_events(tag_uid);
CREATE INDEX idx_ss_events_timestamp ON ss_events(timestamp DESC);
CREATE INDEX idx_ss_events_dedup ON ss_events(device_code, tag_uid, timestamp);

-- ============================================================
-- Enable RLS (Row Level Security)
-- ============================================================
ALTER TABLE ss_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE ss_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE ss_events ENABLE ROW LEVEL SECURITY;

-- Service key bypasses RLS, so API routes work.
-- Add user-facing policies later when dashboard auth is added.

-- ============================================================
-- Helper: Generate a random API key
-- Usage: SELECT generate_ss_api_key('your-user-uuid');
-- ============================================================
CREATE OR REPLACE FUNCTION generate_ss_api_key(p_owner_id uuid)
RETURNS text AS $$
DECLARE
  v_key text;
BEGIN
  v_key := 'ss_' || encode(gen_random_bytes(24), 'hex');
  INSERT INTO ss_api_keys (owner_id, key) VALUES (p_owner_id, v_key);
  RETURN v_key;
END;
$$ LANGUAGE plpgsql;
