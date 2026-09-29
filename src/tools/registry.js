import JsonFormatter from "./json-formatter/JsonFormatter.jsx";
import JsonToTs from "./json-to-ts/JsonToTs.jsx";
import JwtDecoder from "./jwt-decoder/JwtDecoder.jsx";
import { IconBraces, IconKey, IconTypeScript } from "./icons.jsx";

/**
 * Register new developer tools here as the site grows.
 * Each tool exports a React component, a unique id, a URL path, and SEO copy.
 */
export const tools = [
  {
    id: "json-formatter",
    path: "/json-formatter",
    name: "JSON Formatter",
    description: "Format, minify, and validate JSON in the browser.",
    metaTitle: "JSON Formatter & Validator — Devtool",
    metaDescription:
      "Format, minify, and validate JSON instantly. Free, open utility that runs entirely in your browser — no uploads, no accounts.",
    icon: IconBraces,
    component: JsonFormatter,
  },
  {
    id: "json-to-ts",
    path: "/json-to-typescript",
    name: "JSON → TypeScript",
    description: "Generate TypeScript interfaces from JSON.",
    metaTitle: "JSON to TypeScript — Devtool",
    metaDescription:
      "Turn any JSON into clean TypeScript interfaces — nested objects, arrays, and unions inferred locally in your browser.",
    icon: IconTypeScript,
    component: JsonToTs,
  },
  {
    id: "jwt-decoder",
    path: "/jwt-decoder",
    name: "JWT Decoder",
    description: "Inspect decoded JWT header, payload, claims, and signature.",
    metaTitle: "JWT Decoder & Inspector — Devtool",
    metaDescription:
      "Decode a JWT's header, payload, and time claims right in your browser. Nothing is verified or sent anywhere — 100% local.",
    icon: IconKey,
    component: JwtDecoder,
  },
];

export function getToolById(id) {
  return tools.find((tool) => tool.id === id) ?? tools[0];
}

export function getToolByPath(path) {
  return tools.find((tool) => tool.path === path) ?? null;
}
