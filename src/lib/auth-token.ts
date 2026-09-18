const JWT_SECRET_STRING =
  process.env.ADMIN_JWT_SECRET ||
  "9f8e4b7c2a1d6e5f308291aa84b6c9342718efbc726d19a35e801b74c2df4a59";

export const ADMIN_COOKIE_NAME = "mondeiptv_admin_session";

export interface AdminPayload {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  exp?: number;
}

function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return atob(base64);
}

async function getCryptoKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(JWT_SECRET_STRING),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signAdminToken(payload: AdminPayload): Promise<string> {
  const key = await getCryptoKey();
  const header = { alg: "HS256", typ: "JWT" };

  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
  const tokenPayload = { ...payload, exp };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));
  const data = `${encodedHeader}.${encodedPayload}`;

  const enc = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(data)
  );

  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureString = String.fromCharCode(...signatureArray);
  const encodedSignature = base64UrlEncode(signatureString);

  return `${data}.${encodedSignature}`;
}

export async function verifyAdminToken(
  token: string
): Promise<AdminPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, sigB64] = parts;
    const data = `${headerB64}.${payloadB64}`;

    const key = await getCryptoKey();
    const enc = new TextEncoder();

    // Decode signature
    const sigBinStr = base64UrlDecode(sigB64);
    const sigBuf = new Uint8Array(sigBinStr.length);
    for (let i = 0; i < sigBinStr.length; i++) {
      sigBuf[i] = sigBinStr.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBuf,
      enc.encode(data)
    );

    if (!isValid) return null;

    const payloadJson = base64UrlDecode(payloadB64);
    const payload: AdminPayload = JSON.parse(payloadJson);

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name || null,
      role: payload.role || "ADMIN",
    };
  } catch {
    return null;
  }
}
