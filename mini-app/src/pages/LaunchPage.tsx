import { useState } from "react";
import { TokenView } from "../App";
import { useTonConnect } from "../hooks/useTonConnect";
import { FACTORY_ADDRESS, LAUNCH_FEE, formatTon } from "../lib/constants";

interface LaunchPageProps {
  onLaunched: (token: TokenView) => void;
}

export default function LaunchPage({ onLaunched }: LaunchPageProps) {
  const { isConnected, connect, sendTransaction, buildLaunchPayload } = useTonConnect();
  const [name, setName]             = useState("");
  const [symbol, setSymbol]         = useState("");
  const [description, setDesc]      = useState("");
  const [imageUrl, setImageUrl]     = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const feeDisplay = formatTon(LAUNCH_FEE);

  async function handleLaunch() {
    if (!name.trim() || !symbol.trim()) {
      setError("Even Sauron had a name and a symbol.");
      return;
    }
    if (!FACTORY_ADDRESS) {
      setError("The Dark Tower has not yet been built. Set VITE_FACTORY_ADDRESS in .env.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const queryId = BigInt(Date.now());
      const payload = buildLaunchPayload({
        queryId,
        name: name.trim(),
        symbol: symbol.trim().toUpperCase(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
      });
      await sendTransaction({
        to: FACTORY_ADDRESS,
        value: (LAUNCH_FEE + 300_000_000n).toString(),
        payload,
      });
      onLaunched({ address: "", name: name.trim(), symbol: symbol.trim().toUpperCase(), imageUrl: imageUrl.trim() || undefined });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "The Eye of Sauron rejected your offering.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isConnected) {
    return (
      <div className="page">
        <h1 className="page-title">The Forge</h1>
        <div className="wallet-banner">
          <p>You shall not pass — without a wallet.</p>
          <button className="btn btn-primary" onClick={connect}>Connect Wallet</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">The Forge</h1>

      <div className="launch-fee-note">
        The Dark Lord's tribute: <strong>{feeDisplay} TON</strong> — cast into the treasury.
        Your token is forged instantly on the bonding curve and available for all of Middle-earth to trade.
      </div>

      <div className="form-group">
        <label className="form-label">Token Name *</label>
        <input
          className="form-input"
          placeholder="e.g. Precious on TON"
          value={name}
          maxLength={32}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Symbol *</label>
        <input
          className="form-input"
          placeholder="e.g. PRCS"
          value={symbol}
          maxLength={10}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Lore (Description)</label>
        <textarea
          className="form-input"
          placeholder="Speak, friend, and enter…"
          value={description}
          maxLength={256}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Banner Image URL</label>
        <input
          className="form-input"
          placeholder="https://…"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <span className="form-hint">Optional — IPFS link or direct URL</span>
      </div>

      {error && (
        <div style={{ background: "#1a0808", border: "1px solid var(--red)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, color: "#e06060", fontSize: 13 }}>
          {error}
        </div>
      )}

      <button
        className="btn btn-primary"
        onClick={handleLaunch}
        disabled={submitting || !name.trim() || !symbol.trim()}
      >
        {submitting ? "Forging…" : `Cast into the Fire — ${feeDisplay} TON`}
      </button>
    </div>
  );
}
