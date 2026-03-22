import { randomBytes } from "crypto";

/**
 * Genera un código de descuento único y legible.
 * Formato: RIZO-XXXXXX (sin caracteres ambiguos como 0/O/I/1)
 */
export function generateDiscountCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);
  const suffix = Array.from(bytes)
    .map((b) => chars[b % chars.length])
    .join("");
  return `RIZO-${suffix}`;
}
