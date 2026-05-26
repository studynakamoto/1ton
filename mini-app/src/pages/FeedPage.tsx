import { useState } from "react";
import { TokenView } from "../App";
import { useTokenFeed, FeedFilter } from "../hooks/useTokens";
import { formatTon, graduationProgress } from "../lib/constants";
import { TokenInfo } from "../lib/types";

interface FeedPageProps {
  onSelectToken: (token: TokenView) => void;
}

const FILTERS: { id: FeedFilter; label: string }[] = [
  { id: "trending",   label: "👁 Spreading Darkness" },
  { id: "new",        label: "⚒️ Freshly Forged"     },
  { id: "graduating", label: "🌋 Nearing Doom"        },
];

export default function FeedPage({ onSelectToken }: FeedPageProps) {
  const [filter, setFilter] = useState<FeedFilter>("trending");
  const { tokens, loading, refresh } = useTokenFeed(filter);

  function handleSelect(t: TokenInfo) {
    onSelectToken({ address: t.address, name: t.name, symbol: t.symbol, imageUrl: t.imageUrl });
  }

  return (
    <div className="page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h1 className="brand-title" style={{ marginBottom: 2 }}>1ton.fun</h1>
          <div style={{ fontSize: 11, color: "var(--text2)", fontStyle: "italic" }}>
            One TON to rule them all
          </div>
        </div>
        <button onClick={refresh} style={{ background: "none", border: "none", color: "var(--text2)", fontSize: 20, cursor: "pointer" }}>↻</button>
      </div>

      <div className="filter-tabs">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`tab-btn${filter === f.id ? " active" : ""}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Summoning from the void…</div>
      ) : tokens.length === 0 ? (
        <div className="empty-state">
          <h3>The market is quiet… for now</h3>
          <p>Even Mordor sleeps between battles. Be the first to forge.</p>
        </div>
      ) : (
        tokens.map((t) => (
          <TokenCard key={t.address} token={t} onSelect={() => handleSelect(t)} />
        ))
      )}
    </div>
  );
}

function TokenCard({ token, onSelect }: { token: TokenInfo; onSelect: () => void }) {
  const progress = graduationProgress(token.realTonReserve);
  const priceDisplay = (Number(token.priceNano) / 1e9).toFixed(9);

  return (
    <div className="card" onClick={onSelect}>
      <div className="card-header">
        <div className="token-avatar">
          {token.imageUrl
            ? <img src={token.imageUrl} alt={token.symbol} />
            : token.symbol.slice(0, 2)}
        </div>
        <div style={{ flex: 1 }}>
          <div className="token-name">{token.name}</div>
          <div className="token-symbol">{token.symbol}</div>
        </div>
        {token.graduated
          ? <span className="badge badge-graduated">⚔️ Ascended</span>
          : progress >= 80
          ? <span className="badge badge-new">🌋 Almost</span>
          : null}
      </div>

      <div className="card-stats">
        <div className="stat">
          <div className="stat-value">{formatTon(token.realTonReserve)} TON</div>
          <div>War chest</div>
        </div>
        <div className="stat">
          <div className="stat-value">{priceDisplay}</div>
          <div>Price (TON)</div>
        </div>
        <div className="stat">
          <div className="stat-value">{progress}%</div>
          <div>To Doom</div>
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {token.description && (
        <p style={{ fontSize: 12, color: "var(--text2)", marginTop: 8, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {token.description}
        </p>
      )}
    </div>
  );
}
