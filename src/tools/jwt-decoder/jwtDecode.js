/**
 * JWT decode helpers.
 *
 * Pure functions: split the token, Base64URL-decode, JSON-parse. No crypto,
 * no verification, no network. Decoding is NOT verification — the UI must
 * always say so.
 */

/**
 * Decode a JWT string into { ok, header, payload, signature } or
 * { ok: false, error }.
 *
 * Accepts an optional "Bearer " prefix. The signature segment is returned
 * verbatim (it may be empty for unsecured alg=none tokens).
 */
export function decodeJwt(text) {
  const trimmed = text.trim();

  if (!trimmed) {
    return { ok: false, error: "Paste a JWT first." };
  }

  const token = trimmed.replace(/^Bearer\s+/i, "");
  const parts = token.split(".");

  if (parts.length !== 3) {
    return {
      ok: false,
      error: `Not a JWT: expected 3 dot-separated segments (header.payload.signature), got ${parts.length}.`,
    };
  }

  const [headerPart, payloadPart, signaturePart] = parts;

  if (!headerPart || !payloadPart) {
    return {
      ok: false,
      error: "JWT header and payload segments must not be empty.",
    };
  }

  const header = decodeSegment(headerPart);
  if (!header.ok) {
    return { ok: false, error: `Invalid header segment: ${header.error}` };
  }

  const payload = decodeSegment(payloadPart);
  if (!payload.ok) {
    return { ok: false, error: `Invalid payload segment: ${payload.error}` };
  }

  return {
    ok: true,
    header: header.value,
    payload: payload.value,
    signature: signaturePart,
  };
}

/** Decode one Base64URL segment and JSON-parse its contents. */
function decodeSegment(segment) {
  if (!/^[A-Za-z0-9_-]*={0,2}$/.test(segment)) {
    return {
      ok: false,
      error: "contains characters that are not valid Base64URL.",
    };
  }

  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

  let json;
  try {
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    json = new TextDecoder().decode(bytes);
  } catch {
    return { ok: false, error: "could not be Base64URL-decoded." };
  }

  try {
    return { ok: true, value: JSON.parse(json) };
  } catch {
    return { ok: false, error: "does not contain valid JSON." };
  }
}
