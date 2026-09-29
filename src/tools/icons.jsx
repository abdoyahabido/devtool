/**
 * Minimal inline SVG icons (stroke-based, 20×20 grid, currentColor).
 * Keeps the app dependency-free — no icon library needed.
 */
const base = {
  width: "1em",
  height: "1em",
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

const I = ({ children, className = "" }) => (
  <svg {...base} className={`icon ${className}`.trim()}>
    {children}
  </svg>
);

/** Curly braces — JSON Formatter nav icon & input panel. */
export function IconBraces() {
  return (
    <I>
      <path d="M7.5 3.5c-2 0-2 1.2-2 2.2s.4 2.3-1.5 2.6v1.4c1.9.3 1.5 1.6 1.5 2.6s0 2.2 2 2.2" />
      <path d="M12.5 3.5c2 0 2 1.2 2 2.2s-.4 2.3 1.5 2.6v1.4c-1.9.3-1.5 1.6-1.5 2.6s0 2.2-2 2.2" />
    </I>
  );
}

/** Generic wrench — placeholder slot for future unthemed tools. */
export function IconWrench() {
  return (
    <I>
      <path d="M13.7 5.5a3.6 3.6 0 0 0-4.9 4.4L3.5 15.2a1.4 1.4 0 0 0 2 2l5.3-5.3a3.6 3.6 0 0 0 4.4-4.9l-2.3 2.3-2.1-.6-.6-2.1 2.3-2.3Z" />
    </I>
  );
}

/** Padlock — "runs locally" privacy badge. */
export function IconLock() {
  return (
    <I>
      <rect x="4.5" y="9" width="11" height="7.5" rx="1.8" />
      <path d="M7 9V6.8a3 3 0 0 1 6 0V9" />
      <circle cx="10" cy="12.7" r="1" fill="currentColor" stroke="none" />
    </I>
  );
}

/** Checkmark — success state & copied feedback. */
export function IconCheck() {
  return (
    <I>
      <path d="M4.5 10.5l3.5 3.5 7.5-8" />
    </I>
  );
}

/** Cross — error state. */
export function IconX() {
  return (
    <I>
      <path d="M5.5 5.5l9 9M14.5 5.5l-9 9" />
    </I>
  );
}

/** Info dot — idle/ready state. */
export function IconInfo() {
  return (
    <I>
      <circle cx="10" cy="10" r="7.2" />
      <path d="M10 9v4.2" />
      <circle cx="10" cy="6.4" r="0.9" fill="currentColor" stroke="none" />
    </I>
  );
}

/** Two stacked squares — copy. */
export function IconCopy() {
  return (
    <I>
      <rect x="7" y="7" width="9" height="9" rx="1.6" />
      <path d="M13 4.5H5.6A1.6 1.6 0 0 0 4 6.1V13" />
    </I>
  );
}

/** Trash can — clear. */
export function IconTrash() {
  return (
    <I>
      <path d="M4 6h12M8 6V4.8A1.3 1.3 0 0 1 9.3 3.5h1.4A1.3 1.3 0 0 1 12 4.8V6M6 6l.7 9.4a1.5 1.5 0 0 0 1.5 1.4h3.6a1.5 1.5 0 0 0 1.5-1.4L14 6M8.4 9v5M11.6 9v5" />
    </I>
  );
}

/** Right arrow — panels divider. */
export function IconArrowRight() {
  return (
    <I>
      <path d="M4 10h11M11.5 6.5L15 10l-3.5 3.5" />
    </I>
  );
}

/** Sparkle — format (beautify). */
export function IconSparkle() {
  return (
    <I>
      <path d="M10 3.5c.5 2.8 1.7 4 4.5 4.5-2.8.5-4 1.7-4.5 4.5-.5-2.8-1.7-4-4.5-4.5 2.8-.5 4-1.7 4.5-4.5Z" />
      <path d="M15.5 12.5c.25 1.4.85 2 2.25 2.25-1.4.25-2 .85-2.25 2.25-.25-1.4-.85-2-2.25-2.25 1.4-.25 2-.85 2.25-2.25Z" />
    </I>
  );
}

/** Inward arrows — minify (compress). */
export function IconCompress() {
  return (
    <I>
      <path d="M12.5 4 10 6.5 7.5 4M10 6.5V11M12.5 16 10 13.5 7.5 16M10 13.5V9" />
      <path d="M4 12.5 6.5 10 4 7.5M16 12.5 13.5 10 16 7.5" />
    </I>
  );
}

/** Shield with check — validate. */
export function IconShieldCheck() {
  return (
    <I>
      <path d="M10 3 4.8 4.9v4.6c0 3.4 2.2 5.7 5.2 7 3-1.3 5.2-3.6 5.2-7V4.9L10 3Z" />
      <path d="M7.6 9.8l1.8 1.8 3.2-3.4" />
    </I>
  );
}

/** {..} arrow — output panel. */
export function IconArrowBraces() {
  return (
    <I>
      <path d="M6 4.5c-1.6 0-1.6.9-1.6 1.7s.3 1.8-1.2 2.1v1.4c1.5.3 1.2 1.3 1.2 2.1s0 1.7 1.6 1.7" />
      <path d="M10.5 10h5.5M13.5 7.5 16 10l-2.5 2.5" />
    </I>
  );
}

/** Code brackets — generate action. */
export function IconCode() {
  return (
    <I>
      <path d="M7 6 3 10l4 4M13 6l4 4-4 4" />
    </I>
  );
}

/** Home — landing page nav. */
export function IconHome() {
  return (
    <I>
      <path d="M3.5 9.2 10 3.5l6.5 5.7M5 8v8h10V8" />
      <path d="M8.2 16v-4.4h3.6V16" />
    </I>
  );
}

/** Rounded TS square — JSON → TypeScript tool. */
export function IconTypeScript() {
  return (
    <I>
      <rect x="2.5" y="2.5" width="15" height="15" rx="3" />
      <text
        x="10"
        y="13.4"
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="700"
        fill="currentColor"
        stroke="none"
        fontFamily="inherit"
      >
        TS
      </text>
    </I>
  );
}

/** Key — JWT Decoder & Inspector tool. */
export function IconKey() {
  return (
    <I>
      <circle cx="7" cy="13" r="3.4" />
      <path d="M9.5 10.5 16 4M13.5 6.5l2.2 2.2M11.5 8.5l2.2 2.2" />
    </I>
  );
}

/** Triangle alert — security warnings. */
export function IconAlert() {
  return (
    <I>
      <path d="M10 3.2 2.8 16.2a.9.9 0 0 0 .8 1.4h12.8a.9.9 0 0 0 .8-1.4L10 3.2Z" />
      <path d="M10 8v4" />
      <circle cx="10" cy="14.6" r="0.9" fill="currentColor" stroke="none" />
    </I>
  );
}

/** Clock — time-based claims. */
export function IconClock() {
  return (
    <I>
      <circle cx="10" cy="10" r="7.2" />
      <path d="M10 5.8V10l3 2" />
    </I>
  );
}

/** Pencil-in-square — input/edit panel. */
export function IconEdit() {
  return (
    <I>
      <path d="M16.5 10.4v4.1a1.7 1.7 0 0 1-1.7 1.7H5.5a1.7 1.7 0 0 1-1.7-1.7V5.2a1.7 1.7 0 0 1 1.7-1.7h4.1" />
      <path d="M8.2 11.8l6.6-6.6a1.3 1.3 0 0 1 1.8 0l.2.2a1.3 1.3 0 0 1 0 1.8l-6.6 6.6-2.6.6.6-2.6Z" />
    </I>
  );
}
