import { useState } from "react";
import { getToolById, tools } from "./tools/registry.js";
import { IconLock, IconWrench } from "./tools/icons.jsx";
import "./App.css";

export default function App() {
  const [activeToolId, setActiveToolId] = useState(tools[0].id);
  const activeTool = getToolById(activeToolId);
  const ActiveComponent = activeTool.component;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand__mark">DT</span>
          <div className="brand__text">
            <p className="brand__name">Devtool</p>
            <p className="brand__tag">Browser utilities</p>
          </div>
          <span className="brand__version">v0.1</span>
        </div>

        <p className="nav-label" id="tools-label">
          Tools
        </p>
        <nav className="nav" aria-label="Developer tools">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                type="button"
                className={`nav__item ${tool.id === activeTool.id ? "is-active" : ""}`}
                onClick={() => setActiveToolId(tool.id)}
              >
                {Icon ? <Icon /> : <IconWrench />}
                <span className="nav__item-text">
                  <span className="nav__item-name">{tool.name}</span>
                  <small className="nav__item-desc">{tool.description}</small>
                </span>
                {tool.id === activeTool.id && (
                  <span className="nav__dot" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar__footer">
          <p className="sidebar__hint">
            New tools plug in from <code>src/tools/registry.js</code>.
          </p>
          <span className="sidebar__badge">100% local</span>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="topbar__brand">
            <span className="topbar__product">Devtool</span>
            <span className="topbar__divider" aria-hidden="true">
              /
            </span>
            <span className="topbar__tool">{activeTool.name}</span>
          </div>
          <p className="topbar__meta">
            <IconLock />
            Runs locally in your browser
          </p>
        </header>

        <main className="main">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
}
