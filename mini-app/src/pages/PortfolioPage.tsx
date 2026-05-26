import { useState, useEffect } from "react";
import { TokenView } from "../App";
import { useTonConnect } from "../hooks/useTonConnect";
import { HoldingInfo } from "../lib/types";
import { formatTon, formatTokens, DECIMALS } from "../lib/constants";

interface PortfolioPageProps {
  onSelectToken: (token: TokenView) => void;
}

export default function PortfolioPage({ onSelectToken }: PortfolioPageProps) {
  const { isConnected, address, connect } = useTonConnect();
  const [holdings, setHoldings] = useState<HoldingInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    // TODO: replace with real indexer query
    setTimeout(() => {
      setHoldings(MOCK_HOLDINGS);
      setLoading(false);
    }, 400);
  }, [address]);

  const totalValueNano = holdings.reduce(
    (sum, h) => sum + (h.balance * h.priceNano) / DECIMALS,
    0n
  );

  if (!isConnected) {
    return (
      <div className="page">
        <h1 className="page-title">My Precious</h1>
        <div className="wallet-banner">
          <p>We wants it, we needs it — but first, connect your wallet.</p>
          <button className="btn btn-primary" onClick={connect}>Connect Wallet</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">My Precious</h1>

      <div className="portfolio-header">
        <h2>{formatTon(totalValueNano)} TON</h2>
        <p>Your hoard — guard it well</p>
      </div>

      <p style={{ fontSize: 12, color: "var(--text2)", marginBottom: 14, wordBreak: "break-all" }}>
        {address?.slice(0, 8)}…{address?.slice(-6)}
      </p>

      {loading ? (
        <div className="loading">Counting your gold…</div>
      ) : holdings.length === 0 ? (
        <div className="empty-state">
          <h3>Your coffers are empty, fool of a Took</h3>
          <p>Head to the Dark Market and seize something precious.</p>
        </div>
      ) : (
        holdings.map((h) => (
          <HoldingCard
            key={h.tokenAddress}
            holding={h}
            onSelect={() => onSelectToken({ address: h.tokenAddress, name: h.name, symbol: h.symbol, imageUrl: h.imageUrl })}
          />
        ))
      )}
    </div>
  );
}

function HoldingCard({ holding, onSelect }: { holding: HoldingInfo; onSelect: () => void }) {
  const value = (holding.balance * holding.priceNano) / DECIMALS;

  return (
    <div className="card" onClick={onSelect}>
      <div className="card-header">
        <div className="token-avatar">
          {holding.imageUrl ? <img src={holding.imageUrl} alt={holding.symbol} /> : holding.symbol.slice(0, 2)}
        </div>
        <div style={{ flex: 1 }}>
          <div className="token-name">{holding.name}</div>
          <div className="token-symbol">{holding.symbol}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#e8c020" }}>{formatTon(value)} TON</div>
          <div style={{ fontSize: 12, color: "var(--text2)" }}>{formatTokens(holding.balance)}</div>
        </div>
      </div>
    </div>
  );
}

const MOCK_HOLDINGS: HoldingInfo[] = [
  {
    tokenAddress: "EQBm1gvBpVbBc5nMJ4hLM4-SLMbF1bKXQ4RX3_7M1MhfA",
    jettonMaster:  "EQCm1gvBpVbBc5nMJ4hLM4-SLMbF1bKXQ4RX3_7M1MhfB",
    walletAddress: "EQDm1gvBpVbBc5nMJ4hLM4-SLMbF1bKXQ4RX3_7M1MhfX",
    name: "Pepe on TON",
    symbol: "PEPE",
    balance: 42_000_000_000n,
    priceNano: 30_000n,
  },
];
