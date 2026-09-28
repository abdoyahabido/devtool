export function parseJson(text) {
  const trimmed = text.trim();

  if (!trimmed) {
    return {
      ok: false,
      error: "Paste some JSON first.",
    };
  }

  try {
    return {
      ok: true,
      value: JSON.parse(trimmed),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Invalid JSON.",
    };
  }
}

export function formatJson(text) {
  const parsed = parseJson(text);
  if (!parsed.ok) {
    return parsed;
  }

  return {
    ok: true,
    output: JSON.stringify(parsed.value, null, 2),
  };
}

export function minifyJson(text) {
  const parsed = parseJson(text);
  if (!parsed.ok) {
    return parsed;
  }

  return {
    ok: true,
    output: JSON.stringify(parsed.value),
  };
}

export function validateJson(text) {
  const parsed = parseJson(text);
  if (!parsed.ok) {
    return parsed;
  }

  const type = Array.isArray(parsed.value) ? "array" : typeof parsed.value;
  return {
    ok: true,
    message: `Valid JSON (${type}).`,
  };
}
