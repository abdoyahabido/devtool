import { useState } from "react";
import { jsonToTs } from "./jsonToTs.js";
import {
  IconArrowBraces,
  IconArrowRight,
  IconCode,
  IconCopy,
  IconEdit,
  IconInfo,
  IconTrash,
  IconTypeScript,
  IconX,
} from "../icons.jsx";
// Reuse the shared tool styles (header, status banner, toolbar, panels).
import "../json-formatter/JsonFormatter.css";
import "./JsonToTs.css";

const SAMPLE_JSON = `{
  "name": "Abdo",
  "age": 14,
  "games": ["Roblox", "Minecraft"],
  "profile": {
    "level": 10,
    "premium": true
  }
}`;

const STATUS_LABEL = {
  idle: "Ready",
  success: "Success",
  error: "Error",
};

const STATUS_ICON = {
  idle: IconInfo,
  success: IconCode,
  error: IconX,
};

function formatCount(length) {
  return `${length.toLocaleString()} chars`;
}

export default function JsonToTs() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState({
    type: "idle",
    message: "Paste JSON, then generate TypeScript types.",
  });
  const [copied, setCopied] = useState(false);

  function setError(message) {
    setStatus({ type: "error", message });
    setCopied(false);
  }

  function setSuccess(message, nextOutput) {
    setStatus({ type: "success", message });
    if (typeof nextOutput === "string") {
      setOutput(nextOutput);
    }
    setCopied(false);
  }

  function handleGenerate() {
    const result = jsonToTs(input);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSuccess("TypeScript types generated.", result.output);
  }

  async function handleCopy() {
    if (!output) {
      setError("There is no output to copy yet.");
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setStatus({ type: "success", message: "Output copied to clipboard." });
    } catch {
      setError("Could not copy. Select the output and copy it manually.");
    }
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setCopied(false);
    setStatus({
      type: "idle",
      message: "Cleared. Paste JSON to start again.",
    });
  }

  const StatusIcon = STATUS_ICON[status.type];

  return (
    <section className="json-tool">
      <header className="json-tool__header">
        <div className="json-tool__heading">
          <p className="json-tool__eyebrow">Tool 02</p>
          <h1 className="json-tool__title">JSON → TypeScript</h1>
          <p className="json-tool__lede">
            Paste a JSON object and get matching TypeScript interfaces —
            nested objects, arrays, and all types inferred locally.
          </p>
        </div>
      </header>

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
        <div className="toolbar__group" role="group" aria-label="Code actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleGenerate}
          >
            <IconCode />
            Generate types
          </button>
        </div>

        <div className="toolbar__group">
          <button
            type="button"
            className={`btn btn--copy ${copied ? "is-copied" : ""}`}
            onClick={handleCopy}
            disabled={!output}
          >
            <IconCopy />
            {copied ? "Copied" : "Copy output"}
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

      <div className="panels">
        <div className="panel">
          <div className="panel__bar">
            <span className="panel__label">
              <IconEdit />
              Input
            </span>
            <span className="panel__meta">{formatCount(input.length)}</span>
          </div>
          <textarea
            className="panel__editor"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck="false"
            aria-label="JSON input"
            placeholder={'{\n  "user": {\n    "name": "Ada"\n  }\n}'}
          />
        </div>

        <div className="panels__divider" aria-hidden="true">
          <IconArrowRight />
        </div>

        <div
          className={`panel panel--output ${
            output ? "" : "panel--output-empty"
          }`}
        >
          <div className="panel__bar">
            <span className="panel__label">
              <IconArrowBraces />
              Output
            </span>
            <span className="panel__meta">
              {output ? formatCount(output.length) : "—"}
            </span>
          </div>
          <textarea
            className="panel__editor panel__editor--output"
            value={output}
            readOnly
            spellCheck="false"
            aria-label="Generated TypeScript"
            placeholder="TypeScript interfaces will appear here."
          />
        </div>
      </div>

      <p className="json-tool__tip">
        <IconTypeScript />
        Tip: identical object shapes share one interface — your JSON never
        leaves this tab.
      </p>
    </section>
  );
}
