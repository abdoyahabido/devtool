import { useState } from "react";
import { decodeJwt } from "./jwtDecode.js";
import {
  IconAlert,
  IconCheck,
  IconClock,
  IconCopy,
  IconEdit,
  IconInfo,
  IconKey,
  IconTrash,
  IconX,
} from "../icons.jsx";
// Reuse the shared tool styles (header, status banner, toolbar, panels).
import "../json-formatter/JsonFormatter.css";
import "./JwtDecoder.css";

const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEyMzQiLCJuYW1lIjoiQWRhIExvdmVsYWNlIiwiaXNzIjoiaHR0cHM6Ly9hdXRoLmRldnRvb2wuZXhhbXBsZSIsImF1ZCI6ImRldnRvb2wtYXBpIiwiaWF0IjoxNzkwMDgxNDQwLCJuYmYiOjE3OTAwODEzODAsImV4cCI6MTc5MzI3ODI0MCwic2NvcGUiOiJ0b29sczpyZWFkIHRvb2xzOndyaXRlIn0.dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";

const STATUS_LABEL = {
  idle: "Ready",
  success: "Decoded",
  error: "Error",
};

const STATUS_ICON = {
  idle: IconInfo,
  success: IconKey,
  error: IconX,
};

const SECURITY_WARNING =
  "Decoding a JWT does NOT verify its signature. Never trust decoded claims unless the token has been properly verified by the appropriate server.";

/** Human-readable local date/time, or "—" for non-finite numbers. */
function formatTimestamp(unixSeconds) {
  if (typeof unixSeconds !== "number" || !Number.isFinite(unixSeconds)) {
    return null;
  }
  const date = new Date(unixSeconds * 1000);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Small helper so claim cards render consistently. */
function ClaimCard({ label, value, extra, tone = "neutral" }) {
  return (
    <div className={`claims__card claims__card--${tone}`}>
      <p className="claims__card-label">{label}</p>
      <p className="claims__card-value" title={String(value)}>
        {value}
      </p>
      {extra}
    </div>
  );
}

function CopyButton({ text, onCopied, onError, disabled }) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopied();
      setTimeout(() => setCopied(false), 1600);
    } catch {
      onError();
    }
  }

  return (
    <button
      type="button"
      className={`btn btn--copy btn--small ${copied ? "is-copied" : ""}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {copied ? <IconCheck /> : <IconCopy />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function JwtDecoder() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState({
    type: "idle",
    message: "Paste a JWT, then decode it to inspect header and payload.",
  });
  const [copied, setCopied] = useState(false);
  const [now] = useState(() => Date.now());

  function setError(message) {
    setResult(null);
    setStatus({ type: "error", message });
    setCopied(false);
  }

  function setSuccess(message) {
    setStatus({ type: "success", message });
    setCopied(false);
  }

  function handleDecode() {
    const decoded = decodeJwt(input);

    if (!decoded.ok) {
      setError(decoded.error);
      return;
    }

    setResult(decoded);
    setSuccess("JWT decoded successfully.");
  }

  async function handleCopyOutput() {
    if (!result) {
      setError("There is no decoded output to copy yet.");
      return;
    }

    const text = [
      `// header\n${JSON.stringify(result.header, null, 2)}`,
      `// payload\n${JSON.stringify(result.payload, null, 2)}`,
      `// signature\n${result.signature}`,
    ].join("\n\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setStatus({ type: "success", message: "Decoded JWT copied to clipboard." });
    } catch {
      setError("Could not copy. Select the output and copy it manually.");
    }
  }

  function handleClear() {
    setInput("");
    setResult(null);
    setCopied(false);
    setStatus({
      type: "idle",
      message: "Cleared. Paste a JWT to start again.",
    });
  }

  const StatusIcon = STATUS_ICON[status.type];
  const headerJson = result ? JSON.stringify(result.header, null, 2) : "";
  const payloadJson = result ? JSON.stringify(result.payload, null, 2) : "";
  const claims = result ? result.payload : null;

  return (
    <section className="json-tool">
      <header className="json-tool__header">
        <div className="json-tool__heading">
          <p className="json-tool__eyebrow">Tool 03</p>
          <h1 className="json-tool__title">JWT Decoder &amp; Inspector</h1>
          <p className="json-tool__lede">
            Paste a JWT to inspect its decoded header, payload, time claims,
            and signature — entirely in your browser.
          </p>
        </div>
      </header>

      <div className="warning" role="note">
        <IconAlert />
        <p>{SECURITY_WARNING}</p>
      </div>

      <div
        className={`status status--${status.type}`}
        role="status"
        aria-live="polite"
      >
        <span className="status__icon" aria-hidden="true">
          <StatusIcon />
        </span>
        <p className="status__message">{status.message}</p>
        <span className="status__badge">{STATUS_LABEL[status.type]}</span>
      </div>

      <div className="toolbar">
        <div className="toolbar__group" role="group" aria-label="JWT actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleDecode}
          >
            <IconKey />
            Decode JWT
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setInput(SAMPLE_JWT);
              setResult(null);
              setCopied(false);
              setStatus({
                type: "idle",
                message: "Sample token loaded. Press Decode JWT.",
              });
            }}
          >
            <IconEdit />
            Load example
          </button>
        </div>

        <div className="toolbar__group">
          <button
            type="button"
            className={`btn btn--copy ${copied ? "is-copied" : ""}`}
            onClick={handleCopyOutput}
            disabled={!result}
            title="Copy header, payload, and signature"
          >
            <IconCopy />
            {copied ? "Copied" : "Copy decoded"}
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={handleClear}
          >
            <IconTrash />
            Clear
          </button>
        </div>
      </div>

      <div className="panel jwt-input">
        <div className="panel__bar">
          <span className="panel__label">
            <IconEdit />
            Token
          </span>
          <span className="panel__meta">
            {input ? formatCount(input.length) : "—"}
          </span>
        </div>
        <textarea
          className="panel__editor jwt-input__editor"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          spellCheck="false"
          aria-label="JWT input"
          placeholder="eyJhbGciOi…  (a JWT, optionally starting with “Bearer ”)"
          rows={4}
        />
      </div>

      {result && (
        <div className="jwt-results">
          <div className="jwt-results__grid">
            <section className="panel">
              <div className="panel__bar">
                <span className="panel__label">
                  <IconEdit />
                  Header
                </span>
                <CopyButton
                  text={headerJson}
                  onCopied={() => setSuccess("Header copied to clipboard.")}
                  onError={() =>
                    setError("Could not copy. Select the output and copy it manually.")
                  }
                />
              </div>
              <pre className="panel__code">{headerJson}</pre>
            </section>

            <section className="panel">
              <div className="panel__bar">
                <span className="panel__label">
                  <IconEdit />
                  Payload
                </span>
                <CopyButton
                  text={payloadJson}
                  onCopied={() => setSuccess("Payload copied to clipboard.")}
                  onError={() =>
                    setError("Could not copy. Select the output and copy it manually.")
                  }
                />
              </div>
              <pre className="panel__code">{payloadJson}</pre>
            </section>
          </div>

          <section className="panel">
            <div className="panel__bar">
              <span className="panel__label">
                <IconClock />
                Claims
              </span>
              <span className="panel__bar-right">
                <span className="panel__meta">
                  Now: {new Date(now).toLocaleString()}
                </span>
                <CopyButton
                  text={payloadJson}
                  onCopied={() => setSuccess("Payload copied to clipboard.")}
                  onError={() =>
                    setError("Could not copy. Select the output and copy it manually.")
                  }
                />
              </span>
            </div>
            <div className="claims">
              {claims.exp !== undefined && (
                <ClaimCard
                  label="exp — Expires"
                  value={claims.exp}
                  tone={claims.exp * 1000 <= now ? "bad" : "good"}
                  extra={
                    <p className="claims__card-extra">
                      {formatTimestamp(claims.exp) ?? "Unrecognized timestamp"}
                      {" · "}
                      {claims.exp * 1000 <= now ? "Expired" : "Still valid"}
                    </p>
                  }
                />
              )}
              {claims.iat !== undefined && (
                <ClaimCard
                  label="iat — Issued at"
                  value={claims.iat}
                  extra={
                    <p className="claims__card-extra">
                      {formatTimestamp(claims.iat) ?? "Unrecognized timestamp"}
                    </p>
                  }
                />
              )}
              {claims.nbf !== undefined && (
                <ClaimCard
                  tone={claims.nbf * 1000 > now ? "warn" : "neutral"}
                  label="nbf — Not before"
                  value={claims.nbf}
                  extra={
                    <p className="claims__card-extra">
                      {formatTimestamp(claims.nbf) ?? "Unrecognized timestamp"}
                      {" · "}
                      {claims.nbf * 1000 > now ? "Not yet active" : "Active"}
                    </p>
                  }
                />
              )}
              {claims.iss !== undefined && (
                <ClaimCard label="iss — Issuer" value={claims.iss} />
              )}
              {claims.sub !== undefined && (
                <ClaimCard label="sub — Subject" value={claims.sub} />
              )}
              {claims.aud !== undefined && (
                <ClaimCard
                  label="aud — Audience"
                  value={
                    Array.isArray(claims.aud) ? claims.aud.join(", ") : claims.aud
                  }
                />
              )}
            </div>
          </section>
        </div>
      )}

      {result && (
        <section className="panel">
          <div className="panel__bar">
            <span className="panel__label">
              <IconKey />
              Signature
            </span>
            <span className="panel__meta">
              Shown verbatim — not verified
            </span>
          </div>
          <pre className="panel__code panel__code--sig">{result.signature || "—"}</pre>
        </section>
      )}
    </section>
  );
}

function formatCount(length) {
  return `${length.toLocaleString()} chars`;
}
