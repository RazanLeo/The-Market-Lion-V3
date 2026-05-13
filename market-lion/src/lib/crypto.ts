import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

// 32-byte hex key from env. Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
const KEY = Buffer.from(process.env.BROKER_ENC_KEY || "0".repeat(64), "hex");

export function encrypt(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", KEY, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("hex"), tag.toString("hex"), enc.toString("hex")].join(":");
}

export function decrypt(c: string): string {
  try {
    const [ivHex, tagHex, encHex] = c.split(":");
    const iv  = Buffer.from(ivHex,  "hex");
    const tag = Buffer.from(tagHex, "hex");
    const enc = Buffer.from(encHex, "hex");
    const decipher = createDecipheriv("aes-256-gcm", KEY, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(enc), decipher.final()]).toString("utf8");
  } catch {
    return c; // return raw if not encrypted (migration safety)
  }
}
