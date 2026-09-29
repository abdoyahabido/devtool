import { useEffect, useState, useCallback } from "react";

/**
 * Tiny client-side router on the History API — no dependencies.
 *
 * The app renders one of the registered routes based on location.pathname.
 * Vite's dev server serves index.html for unknown paths, so deep links and
 * refreshes work locally; `vite preview` does the same for the build.
 */

/** Navigate to a path, tell React to re-render, and scroll back to top. */
export function navigate(path) {
  if (window.location.pathname === path) {
    return;
  }
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo(0, 0);
}

/** Anchor that navigates in-app instead of reloading the page. */
export function Link({ to, className, children, ...rest }) {
  const handleClick = useCallback(
    (event) => {
      // Let modified clicks (new tab, download, …) behave natively.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      event.preventDefault();
      navigate(to);
    },
    [to],
  );

  return (
    <a href={to} className={className} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

/** Current pathname, updated on back/forward and programmatic navigation. */
export function useRoute() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  return path;
}

/**
 * Per-page document metadata: unique <title>, meta description, and Open
 * Graph tags. Restores nothing on unmount — every route sets its own.
 */
export function usePageMeta({ title, description }) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    const setMeta = (attr, key, content) => {
      if (!content) return;
      let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
  }, [title, description]);
}
