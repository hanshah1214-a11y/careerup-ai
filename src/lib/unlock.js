// =============================================================
// Unlock codes — signed codes the owner generates after a
// NayaPay payment. The buyer redeems it on the site to unlock
// premium. Works fully in-browser (no backend needed).
//
// Code format: CAREERUP-<plan>.<expiry>.<nonce>.<hmac-sha256>
// The HMAC is computed with siteConfig.unlockSecret, so codes
// can only be created by someone who knows that secret.
// =============================================================
import { siteConfig } from "./config.js";

const PREFIX = "CAREERUP";

async function hmacHex(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomNonce() {
  const buf = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function generateUnlockCode(plan, days = 30) {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  const expiry = expires.toISOString().slice(0, 10);
  const nonce = randomNonce().toUpperCase();
  const payload = `${plan.toUpperCase()}.${expiry}.${nonce}`;
  const sig = await hmacHex(siteConfig.unlockSecret, payload);
  return `${PREFIX}-${payload}.${sig.toUpperCase()}`;
}

export async function verifyUnlockCode(code) {
  const trimmed = String(code || "").trim().toUpperCase().replace(/\s+/g, "");
  if (!trimmed.startsWith(PREFIX + "-")) {
    return { ok: false, error: "Invalid code format." };
  }
  const body = trimmed.slice(PREFIX.length + 1);
  const lastDot = body.lastIndexOf(".");
  if (lastDot < 0) return { ok: false, error: "Invalid code." };
  const payload = body.slice(0, lastDot);
  const sig = body.slice(lastDot + 1);
  if (!payload || !sig) return { ok: false, error: "Invalid code." };

  const parts = payload.split(".");
  if (parts.length !== 3) return { ok: false, error: "Invalid code." };
  const [plan, expiry, nonce] = parts;

  const expected = await hmacHex(siteConfig.unlockSecret, payload);
  if (expected !== sig.toLowerCase()) {
    return { ok: false, error: "Code verification failed. Check for typos." };
  }

  const today = new Date().toISOString().slice(0, 10);
  if (expiry < today) {
    return { ok: false, error: "This code has expired." };
  }

  return {
    ok: true,
    plan: plan === "pro" || plan === "PRO" ? "Pro" : "Premium",
    expiresAt: expiry,
  };
}

const ENT_KEY = "careerup_entitlement_v1";

export function loadEntitlement() {
  try {
    const raw = localStorage.getItem(ENT_KEY);
    if (!raw) return null;
    const ent = JSON.parse(raw);
    const today = new Date().toISOString().slice(0, 10);
    if (ent.expiresAt && ent.expiresAt >= today) return ent;
  } catch {
    /* ignore */
  }
  return null;
}

export function saveEntitlement(ent) {
  localStorage.setItem(ENT_KEY, JSON.stringify(ent));
}

export function clearEntitlement() {
  localStorage.removeItem(ENT_KEY);
}
