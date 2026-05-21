import { env } from "@realityware/env";
import type { BetterAuthPlugin } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";

const ENCRYPTION_KEY_HEX = env.ENCRYPTION_SECRET_KEY; // Must be exactly 64 hex characters (32 bytes)

async function getKey(): Promise<CryptoKey> {
  if (!ENCRYPTION_KEY_HEX || ENCRYPTION_KEY_HEX.length !== 64) {
    throw new Error("ENCRYPTION_SECRET_KEY must be a 64-character hex string.");
  }
  const rawKey = new Uint8Array(
    ENCRYPTION_KEY_HEX.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
  );
  return crypto.subtle.importKey("raw", rawKey, { name: "AES-GCM" }, false, [
    "encrypt",
    "decrypt",
  ]);
}

export async function encryptData(plaintext: string): Promise<string> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(plaintext),
  );

  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);

  return Buffer.from(combined).toString("base64url");
}

export async function decryptData(encryptedBase64Url: string): Promise<string> {
  const key = await getKey();
  const combined = Buffer.from(encryptedBase64Url, "base64url");

  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext,
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

export function encryptPlugin(): BetterAuthPlugin {
  return {
    id: "decrypt-session-pii",
    hooks: {
      after: [
        {
          matcher: (context) => context.path === "/get-session",
          handler: createAuthMiddleware(async (ctx) => {
            const returned = ctx.context.returned;
            if (!returned || typeof returned !== "object") return;

            const sessionResponse = returned as {
              user?: {
                encrypted_name?: string | null;
                name?: string | null;
              } | null;
            };

            const user = sessionResponse.user;
            if (!user) return;

            const encryptedName = user.encrypted_name;
            if (!encryptedName) return;

            try {
              user.name = await decryptData(encryptedName);
            } catch {
              console.error("Failed to decrypt user name for session response");
              user.name = null;
            }
          }),
        },
      ],
    },
  };
}
