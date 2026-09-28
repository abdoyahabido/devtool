import JsonFormatter from "./json-formatter/JsonFormatter.jsx";
import { IconBraces } from "./icons.jsx";

/**
 * Register new developer tools here as the site grows.
 * Each tool should export a React component, a unique id, and an optional icon.
 */
export const tools = [
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Format, minify, and validate JSON in the browser.",
    icon: IconBraces,
    component: JsonFormatter,
  },
];

export function getToolById(id) {
  return tools.find((tool) => tool.id === id) ?? tools[0];
}
