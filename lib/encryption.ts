/**
 * lib/encryption.ts
 * AES-256-GCM encryption for Stellar secret keys stored in the database.
 * The key is read from STELLAR_ENCRYPTION_KEY env var (must be ≥ 32 chars).
 * Server-side only — never import this from client components.
 */

import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";

function getKey(): Buffer {
  const raw = process.env.STELLAR_ENCRYPTION_KEY;
  if (!raw || raw.length < 32) {
    throw new Error(
      "STELLAR_ENCRYPTION_KEY must be set and at least 32 characters long"
    );
  }
  // Use exactly 32 bytes (AES-256)
  return Buffer.from(raw.slice(0, 32), "utf-8");
}

/**
 * Encrypts a Stellar secret key for storage.
 * Returns a string in the format: iv(hex):authTag(hex):ciphertext(hex)
 */
export function encryptSecret(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(12); // 96-bit IV recommended for GCM
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf-8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

/**
 * Decrypts a Stellar secret key from storage.
 * Handles backward-compatible plaintext keys (Stellar secret keys start with 'S').
 */
export function decryptSecret(stored: string): string {
  // Backward compat: Stellar secret keys are base32, start with 'S', 56 chars
  if (/^S[A-Z2-7]{55}$/.test(stored)) {
    return stored; // plaintext — legacy key, not yet encrypted
  }
  const parts = stored.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted secret format");
  }
  const [ivHex, authTagHex, ciphertextHex] = parts;
  const key = getKey();
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const ciphertext = Buffer.from(ciphertextHex, "hex");
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString("utf-8");
}
