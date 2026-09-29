import { getToolByPath, tools } from "./tools/registry.js";
import Home from "./Home.jsx";
import { IconHome, IconLock, IconWrench } from "./tools/icons.jsx";
import { Link, usePageMeta, useRoute } from "./router.jsx";
import "./App.css";

export default function App() {
  const path = useRoute();
  const activeTool = getToolByPath(path);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand" aria-label="Devtool home">
          <span className="brand__mark">DT</span>
          <div className="brand__text">
            <p className="brand__name">Devtool</p>
            <p className="brand__tag">Browser utilities</p>
          </div>
          <span className="brand__version">v0.1</span>
        </Link>

        <p className="nav-label">Menu</p>
        <nav className="nav" aria-label="Developer tools">
          <NavItem
            to="/"
            label="Home"
            description="About Devtool"
            icon={IconHome}
            active={path === "/"}
          />
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <NavItem
                key={tool.id}
                to={tool.path}
                label={tool.name}
                description={tool.description}
                icon={Icon ?? IconWrench}
                active={activeTool?.id === tool.id}
              />
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
            <span className="topbar__tool">
              {activeTool ? activeTool.name : "Home"}
            </span>
          </div>
          <p className="topbar__meta">
            <IconLock />
            Runs locally in your browser
          </p>
        </header>

        <main className="main">
          {activeTool ? (
            <ActiveTool tool={activeTool} />
          ) : (
            <Home />
          )}
        </main>
      </div>
    </div>
  );
}

/** Per-route rendering with document metadata for each tool. */
function ActiveTool({ tool }) {
  const Component = tool.component;
  usePageMeta({
    title: tool.metaTitle,
    description: tool.metaDescription,
  });
  return <Component />;
}

function NavItem({ to, label, description, icon: Icon, active }) {
  return (
    <Link
      to={to}
      className={`nav__item ${active ? "is-active" : ""}`}
      aria-current={active ? "page" : undefined}
    >
      <Icon />
      <span className="nav__item-text">
        <span className="nav__item-name">{label}</span>
        <small className="nav__item-desc">{description}</small>
      </span>
      {active && <span className="nav__dot" aria-hidden="true" />}
    </Link>
  );
}
