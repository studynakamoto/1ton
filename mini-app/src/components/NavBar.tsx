import { Tab } from "../App";

interface NavBarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: "feed",      icon: "🗺️", label: "Dark Market" },
  { id: "launch",    icon: "🔥", label: "The Forge"   },
  { id: "portfolio", icon: "💍", label: "My Precious" },
];

export default function NavBar({ active, onChange }: NavBarProps) {
  return (
    <nav className="nav-bar">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`nav-item${active === t.id ? " active" : ""}`}
          onClick={() => onChange(t.id)}
        >
          <span className="nav-icon">{t.icon}</span>
          {t.label}
        </button>
      ))}
    </nav>
  );
}
