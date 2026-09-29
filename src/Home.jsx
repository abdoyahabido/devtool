import { Link } from "./router.jsx";
import { tools } from "./tools/registry.js";
import { IconHome, IconLock } from "./tools/icons.jsx";
import { usePageMeta } from "./router.jsx";
import "./Home.css";

const LOCAL_POINTS = [
  "No uploads",
  "No accounts",
  "No tracking",
  "Works offline",
];

export default function Home() {
  usePageMeta({
    title: "Devtool — Free Browser Developer Tools",
    description:
      "Devtool is a small collection of free developer utilities — JSON formatting, JSON to TypeScript types, and JWT inspection — that run entirely in your browser. Nothing is uploaded, ever.",
  });

  return (
    <div className="home">
      <header className="home__hero">
        <p className="home__eyebrow">
          <IconHome />
          Browser utilities · v0.1
        </p>
        <h1 className="home__title">
          Developer tools that never leave your browser
        </h1>
        <p className="home__lede">
          Devtool is a small, fast collection of everyday utilities for
          developers. Every tool runs locally in your browser — your data is
          never uploaded, sent to a server, or stored anywhere.
        </p>

        <ul className="home__chips" aria-label="Privacy guarantees">
          {LOCAL_POINTS.map((point) => (
            <li key={point} className="home__chip">
              <IconLock />
              {point}
            </li>
          ))}
        </ul>
      </header>

      <section aria-labelledby="tools-heading" className="home__tools">
        <h2 id="tools-heading" className="home__heading">
          Tools
        </h2>
        <div className="home__cards">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                to={tool.path}
                className="home__card"
                aria-label={`Open ${tool.name}`}
              >
                <div className="home__card-top">
                  <span className="home__card-icon">
                    <Icon />
                  </span>
                  <span className="home__card-index">Tool {String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="home__card-name">{tool.name}</h3>
                <p className="home__card-desc">{tool.description}</p>
                <span className="home__card-cta">Open tool →</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="home__about" aria-labelledby="about-heading">
        <h2 id="about-heading" className="home__heading">
          Why Devtool?
        </h2>
        <p className="home__about-text">
          Most online developer tools ship your data to a server first —
          including your tokens, API payloads, and config files. Devtool takes
          the opposite approach: every utility is plain JavaScript running in
          this tab. Inspect a JWT, format a config, or generate TypeScript
          types without trusting anyone with the contents.
        </p>
        <p className="home__about-text">
          More tools land over time — the sidebar is where they will appear.
        </p>
      </section>
    </div>
  );
}
