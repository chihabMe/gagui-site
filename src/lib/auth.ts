import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  AdminPayload,
  signAdminToken,
  verifyAdminToken,
} from "./auth-token";

export { ADMIN_COOKIE_NAME, signAdminToken, verifyAdminToken };
export type { AdminPayload };

/**
 * Get the current admin session from request cookies
 */
export async function getAdminSession(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyAdminToken(token);
}

/**
 * Hash a plain text password
 */
export async function hashPassword(plainText: string): Promise<string> {
  return await bcrypt.hash(plainText, 10);
}

/**
 * Compare plain text password with hashed password
 */
export async function comparePassword(
  plainText: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(plainText, hash);
}
