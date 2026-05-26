import { useState, useEffect } from "react";
import { init } from "@telegram-apps/sdk-react";
import FeedPage from "./pages/FeedPage";
import LaunchPage from "./pages/LaunchPage";
import TokenPage from "./pages/TokenPage";
import PortfolioPage from "./pages/PortfolioPage";
import NavBar from "./components/NavBar";
import "./App.css";

export type Tab = "feed" | "launch" | "token" | "portfolio";

export interface TokenView {
  address: string;
  name: string;
  symbol: string;
  imageUrl?: string;
}

export default function App() {
  const [tab, setTab] = useState<Tab>("feed");
  const [selectedToken, setSelectedToken] = useState<TokenView | null>(null);

  useEffect(() => {
    try {
      init();
    } catch {
      // Outside Telegram — dev browser mode
    }
  }, []);

  function openToken(token: TokenView) {
    setSelectedToken(token);
    setTab("token");
  }

  function handleTabChange(t: Tab) {
    if (t !== "token") setSelectedToken(null);
    setTab(t);
  }

  return (
    <div className="app">
      <div className="page-content">
        {tab === "feed" && <FeedPage onSelectToken={openToken} />}
        {tab === "launch" && <LaunchPage onLaunched={(t) => { openToken(t); }} />}
        {tab === "token" && <TokenPage token={selectedToken} />}
        {tab === "portfolio" && <PortfolioPage onSelectToken={openToken} />}
      </div>
      <NavBar active={tab} onChange={handleTabChange} />
    </div>
  );
}
