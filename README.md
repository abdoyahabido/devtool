# Devtool

A small collection of browser-based developer utilities. The first tool is a JSON formatter, minifier, and validator. There is no backend or database.

## Run locally

1. Install [Node.js](https://nodejs.org/) (version 18 or newer).
2. Open a terminal in this project folder.
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open the URL shown in the terminal (usually `http://localhost:5173`).

## Project layout

- `src/App.jsx` — site shell and tool navigation
- `src/tools/registry.js` — add new tools here later
- `src/tools/json-formatter/` — the JSON Formatter MVP
