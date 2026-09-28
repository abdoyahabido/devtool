import { useState } from "react";
import { formatJson, minifyJson, validateJson } from "./jsonUtils.js";
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

  return (
    <section className="json-tool">
      <header className="json-tool__intro">
        <p className="eyebrow">Tool 01</p>
        <h1>JSON Formatter & Validator</h1>
        <p className="lede">
          Paste JSON on the left. Format it, shrink it, or check that it is
          valid — all in your browser.
        </p>
      </header>

      <div className={`status status--${status.type}`} role="status">
        <span className="status__badge">{STATUS_LABEL[status.type]}</span>
        <p className="status__message">{status.message}</p>
      </div>

      <div className="toolbar">
        <button type="button" className="btn btn--primary" onClick={handleFormat}>
          Format JSON
        </button>
        <button type="button" className="btn" onClick={handleMinify}>
          Minify JSON
        </button>
        <button type="button" className="btn" onClick={handleValidate}>
          Validate JSON
        </button>
        <button type="button" className="btn" onClick={handleCopy} disabled={!output}>
          {copied ? "Copied" : "Copy output"}
        </button>
        <button type="button" className="btn btn--ghost" onClick={handleClear}>
          Clear
        </button>
      </div>

      <div className="panels">
        <div className="panel">
          <div className="panel__bar">
            <span className="panel__label">Input</span>
            <span className="panel__meta">{input.length} characters</span>
          </div>
          <textarea
            className="panel__editor"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck="false"
            aria-label="JSON input"
            placeholder='{"hello": "world"}'
          />
        </div>

        <div className="panel">
          <div className="panel__bar">
            <span className="panel__label">Output</span>
            <span className="panel__meta">
              {output ? `${output.length} characters` : "Waiting for result"}
            </span>
          </div>
          <textarea
            className="panel__editor panel__editor--output"
            value={output}
            readOnly
            spellCheck="false"
            aria-label="Formatted JSON output"
            placeholder="Formatted JSON will appear here."
          />
        </div>
      </div>
    </section>
  );
}
