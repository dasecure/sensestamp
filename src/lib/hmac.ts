import { createHmac } from "crypto";

/**
 * Verify HMAC-SHA256 signature from SenseStamp device.
 * Message format: device_id|tag_uid|timestamp
 */
export function verifySignature(
  deviceId: string,
  tagUid: string,
  timestamp: number,
  signature: string,
  secret: string
): boolean {
  const message = `${deviceId}|${tagUid}|${timestamp}`;
  const expected = createHmac("sha256", secret)
    .update(message)
    .digest("hex");
  return expected === signature;
}

export function generateSignature(
  deviceId: string,
  tagUid: string,
  timestamp: number,
  secret: string
): string {
  const message = `${deviceId}|${tagUid}|${timestamp}`;
  return createHmac("sha256", secret)
    .update(message)
    .digest("hex");
}
