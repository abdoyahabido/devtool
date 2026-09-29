/**
 * JSON → TypeScript type generator.
 *
 * Pure functions only: parse input JSON, walk the value tree, and emit
 * interface/type declarations. No DOM, no React — easy to test and reuse.
 */

/**
 * Parse JSON text into { ok, value } or { ok: false, error }.
 */
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

/** Map a JSON value to its TS primitive type name. */
function primitiveType(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

/** Interface names emitted during the current generation run. */
const seenNames = new Set();

/** Object shapes already emitted, by JSON signature → interface name. */
const seenShapes = new Map();

/**
 * Generate TypeScript interfaces from a JSON string.
 *
 * - Objects become `interface X { ... }` (parents listed before children)
 * - Identical object shapes share a single interface
 * - Arrays collapse to one element type, or a union when mixed
 * - Top-level non-object values emit a `type Root = ...` alias
 *
 * Returns { ok: true, output } or { ok: false, error }.
 */
export function jsonToTs(text) {
  seenNames.clear();
  seenShapes.clear();

  const parsed = parseJson(text);
  if (!parsed.ok) {
    return parsed;
  }

  /** Reserved interface blocks, in declaration (parent-first) order. */
  const blocks = [];

  /**
   * Return the TS type reference for `value`.
   * `name` is the PascalCase candidate name if `value` is an object
   * that needs its own interface.
   */
  function typeFor(value, name) {
    switch (primitiveType(value)) {
      case "string":
        return "string";
      case "number":
        return "number";
      case "boolean":
        return "boolean";
      case "null":
        return "null";
      case "array": {
        if (value.length === 0) {
          return "unknown[]";
        }
        const types = elementTypesOf(value, name);
        // Parenthesize multi-element unions so `string | number[]` never
        // binds the wrong way: (string | number)[].
        return types.length === 1 ? `${types[0]}[]` : `(${types.join(" | ")})[]`;
      }
      case "object": {
        // Reuse the interface when an identical shape was already emitted,
        // even if the values differ.
        const signature = shapeSignature(value);
        const existingName = seenShapes.get(signature);
        if (existingName) {
          return existingName;
        }

        const interfaceName = uniqueName(name);
        seenShapes.set(signature, interfaceName);

        // Reserve the block first so parents render before their children.
        const block = { name: interfaceName, lines: [] };
        blocks.push(block);

        for (const [key, childValue] of Object.entries(value)) {
          const tsType = typeFor(childValue, toPascalCase(key));
          block.lines.push(`  ${propertyKey(key)}: ${tsType};`);
        }
        return interfaceName;
      }
      default:
        // Not producible by JSON.parse; fall back gracefully anyway.
        return "unknown";
    }
  }

  /** TS type references for every element of an array (deduplicated). */
  function elementTypesOf(arrayValue, name) {
    return [...new Set(arrayValue.map((item) => typeFor(item, name)))];
  }

  const rootType = primitiveType(parsed.value);
  let output;

  if (rootType === "object") {
    typeFor(parsed.value, "Root");
    output = blocks.map(renderBlock).join("\n\n");
  } else if (rootType === "array") {
    if (parsed.value.length === 0) {
      output = "type Root = unknown[];";
    } else {
      const inner = joinUnion(elementTypesOf(parsed.value, "RootItem"));
      const declared = blocks.map(renderBlock).join("\n\n");
      output = declared
        ? `type Root = ${inner};\n\n${declared}`
        : `type Root = ${inner};`;
    }
  } else {
    output = `type Root = ${typeFor(parsed.value, "Root")};`;
  }

  return { ok: true, output };
}

/** Render one reserved block as an interface declaration. */
function renderBlock(block) {
  if (block.lines.length === 0) {
    return `interface ${block.name} {}`;
  }
  return `interface ${block.name} {\n${block.lines.join("\n")}\n}`;
}

/** Single type stays as-is; multiple types become a union. */
function joinUnion(types) {
  return types.length === 1 ? types[0] : types.join(" | ");
}

/**
 * Recursive structural signature of a JSON value: same keys with the same
 * value types (in any order) produce the same signature, regardless of the
 * actual values. Used to share interfaces between identical shapes.
 */
function shapeSignature(value) {
  switch (primitiveType(value)) {
    case "array": {
      // Element order is irrelevant: dedupe, then sort for stability.
      const elements = [...new Set(value.map(shapeSignature))].sort();
      return `[${elements.join(",")}]`;
    }
    case "object": {
      const entries = Object.entries(value)
        .map(([key, child]) => `${propertyKey(key)}:${shapeSignature(child)}`)
        .sort();
      return `{${entries.join(",")}}`;
    }
    default:
      return primitiveType(value);
  }
}

/** PascalCase identifier from an object key ("user_name" → "UserName"). */
function toPascalCase(key) {
  const parts = String(key)
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1));
  return parts.join("") || "Item";
}

/** Quote object keys that are not valid TS identifiers. */
function propertyKey(key) {
  if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key)) {
    return key;
  }
  return JSON.stringify(key);
}

/** First non-colliding name: Profile → Profile2 → Profile3… */
function uniqueName(base) {
  let name = base;
  let counter = 2;
  while (seenNames.has(name)) {
    name = `${base}${counter}`;
    counter += 1;
  }
  seenNames.add(name);
  return name;
}
