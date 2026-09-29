import { useState } from "react";
import { formatJson, minifyJson, validateJson } from "./jsonUtils.js";
import {
  IconArrowBraces,
  IconArrowRight,
  IconBraces,
  IconCheck,
  IconCompress,
  IconCopy,
  IconEdit,
  IconInfo,
  IconShieldCheck,
  IconSparkle,
  IconTrash,
  IconX,
} from "../icons.jsx";
import "./JsonFormatter.css";

const SAMPLE_JSON = `{
  "name": "Devtool",
  "version": 1,
  "features": ["format", "minify", "validate"]
}`;

const STATUS_LABEL = {
  idle: "Ready",
  success: "Success",
  error: "Error",
};

const STATUS_ICON = {
  idle: IconInfo,
  success: IconCheck,
  error: IconX,
};

function formatBytes(length) {
  return `${length.toLocaleString()} chars`;
}

export default function JsonFormatter() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState({
    type: "idle",
    message: "Paste JSON, then format, minify, or validate.",
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

  function handleFormat() {
    const result = formatJson(input);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSuccess("JSON formatted successfully.", result.output);
  }

  function handleMinify() {
    const result = minifyJson(input);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSuccess("JSON minified successfully.", result.output);
  }

  function handleValidate() {
    const result = validateJson(input);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSuccess(result.message);
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
          <p className="json-tool__eyebrow">Tool 01</p>
          <h1 className="json-tool__title">JSON Formatter &amp; Validator</h1>
          <p className="json-tool__lede">
            Paste JSON on the left. Format it, shrink it, or check that it is
            valid — all locally in your browser.
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
        <div className="toolbar__group" role="group" aria-label="JSON actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleFormat}
          >
            <IconSparkle />
            Format
          </button>
          <button type="button" className="btn" onClick={handleMinify}>
            <IconCompress />
            Minify
          </button>
          <button type="button" className="btn" onClick={handleValidate}>
            <IconShieldCheck />
            Validate
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
            <span className="panel__meta">{formatBytes(input.length)}</span>
          </div>
          <textarea
            className="panel__editor"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck="false"
            aria-label="JSON input"
            placeholder={'{\n  "hello": "world"\n}'}
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
              {output ? formatBytes(output.length) : "—"}
            </span>
          </div>
          <textarea
            className="panel__editor panel__editor--output"
            value={output}
            readOnly
            spellCheck="false"
            aria-label="Formatted JSON output"
            placeholder="Formatted or minified JSON will appear here."
          />
        </div>
      </div>

      <p className="json-tool__tip">
        <IconBraces />
        Tip: everything runs client-side — your JSON never leaves this tab.
      </p>
    </section>
  );
}
