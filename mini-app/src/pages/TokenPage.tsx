import { useState } from "react";
import { TokenView } from "../App";
import { useTonConnect } from "../hooks/useTonConnect";
import { useTokenData, usePriceHistory } from "../hooks/useTokens";
import { quoteBuy, quoteSell, formatTon, formatTokens, graduationProgress, DECIMALS } from "../lib/constants";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
} from "recharts";

interface TokenPageProps {
  token: TokenView | null;
}

export default function TokenPage({ token }: TokenPageProps) {
  const { token: data, loading } = useTokenData(token?.address ?? null);
  const priceHistory = usePriceHistory(token?.address ?? null);
  const { isConnected, address, connect, sendTransaction, buildBuyPayload, buildSellPayload } = useTonConnect();

  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);

  if (!token) {
    return (
      <div className="page">
        <div className="empty-state">
          <h3>No token chosen</h3>
          <p>Not all who wander the Dark Market are lost — pick a token.</p>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return <div className="loading">Consulting the palantír…</div>;
  }

  const progress = graduationProgress(data.realTonReserve);
  const priceDisplay = (Number(data.priceNano) / 1e9).toFixed(9);

  let quote: bigint = 0n;
  let quoteDisplay = "—";
  const parsedAmount = parseFloat(amount) || 0;
  if (parsedAmount > 0) {
    try {
      if (side === "buy") {
        const tonIn = BigInt(Math.floor(parsedAmount * 1e9));
        quote = quoteBuy(tonIn, data.realTonReserve, data.realTokenReserve);
        quoteDisplay = formatTokens(quote) + " " + data.symbol;
      } else {
        const tokIn = BigInt(Math.floor(parsedAmount * 1e9));
        quote = quoteSell(tokIn, data.realTonReserve, data.realTokenReserve);
        quoteDisplay = formatTon(quote) + " TON";
      }
    } catch {
      quoteDisplay = "—";
    }
  }

  const BUY_PRESETS  = ["0.1", "0.5", "1", "5"];
  const SELL_PRESETS = ["10", "25", "50", "100"];

  async function handleTrade() {
    if (!address || !data) return;
    setTxError(null);
    setSubmitting(true);
    try {
      const queryId  = BigInt(Date.now());
      const slippage = 95n;

      if (side === "buy") {
        const tonIn  = BigInt(Math.floor(parsedAmount * 1e9));
        const minOut = (quote * slippage) / 100n;
        const payload = buildBuyPayload(queryId, minOut);
        await sendTransaction({ to: data.address, value: tonIn.toString(), payload });
      } else {
        const tokIn     = BigInt(Math.floor(parsedAmount * 1e9));
        const minTonOut = (quote * slippage) / 100n;
        const payload   = buildSellPayload({ queryId, amount: tokIn, bondingCurveAddr: data.address, minTonOut });
        await sendTransaction({
          to: data.jettonMaster,
          value: (100_000_000n).toString(),
          payload,
        });
      }
      setAmount("");
    } catch (e: unknown) {
      setTxError(e instanceof Error ? e.message : "The transaction was cast into the void.");
    } finally {
      setSubmitting(false);
    }
  }

  const chartData = priceHistory.map((p) => ({
    t: new Date(p.t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    p: p.p,
  }));

  return (
    <div className="page">
      {/* Header */}
      <div className="token-header">
        <div className="token-avatar" style={{ width: 48, height: 48, fontSize: 22 }}>
          {data.imageUrl ? <img src={data.imageUrl} alt={data.symbol} /> : data.symbol.slice(0, 2)}
        </div>
        <div>
          <div className="token-name" style={{ fontSize: 18 }}>{data.name}</div>
          <div className="token-symbol">{data.symbol}</div>
        </div>
        {data.graduated
          ? <span className="badge badge-graduated">⚔️ Ascended</span>
          : <span className="badge badge-new">{progress}% to Doom</span>}
      </div>

      {/* Price */}
      <div className="price-row">
        <span className="price-big">{priceDisplay} TON</span>
      </div>

      {/* Meta grid */}
      <div className="token-meta-grid">
        <div className="meta-card">
          <div className="meta-label">War Chest</div>
          <div className="meta-value">{formatTon(data.realTonReserve)} TON</div>
        </div>
        <div className="meta-card">
          <div className="meta-label">Path to Doom</div>
          <div className="meta-value">{progress}% of 69 TON</div>
        </div>
        <div className="meta-card">
          <div className="meta-label">Tokens in Circulation</div>
          <div className="meta-value">{formatTokens(data.realTokenReserve)}</div>
        </div>
        <div className="meta-card">
          <div className="meta-label">Reserve</div>
          <div className="meta-value">{formatTon(data.realTonReserve)} TON</div>
        </div>
      </div>

      <div className="progress-bar" style={{ marginBottom: 14 }}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={chartData}>
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: "var(--text2)" }} interval="preserveStartEnd" />
              <YAxis hide domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [v.toFixed(9) + " TON", "Price"]}
              />
              <Line type="monotone" dataKey="p" stroke="var(--accent-light)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Trade panel */}
      {!isConnected ? (
        <div className="wallet-banner">
          <p>One does not simply trade without a wallet.</p>
          <button className="btn btn-primary" onClick={connect}>Connect Wallet</button>
        </div>
      ) : (
        <>
          <div className="trade-tabs">
            <button className={`trade-tab buy${side === "buy" ? " active" : ""}`} onClick={() => setSide("buy")}>⚔️ Seize</button>
            <button className={`trade-tab sell${side === "sell" ? " active" : ""}`} onClick={() => setSide("sell")}>🗡️ Betray</button>
          </div>

          <div className="amount-presets">
            {(side === "buy" ? BUY_PRESETS : SELL_PRESETS).map((p) => (
              <button key={p} className="preset-btn" onClick={() => setAmount(p)}>{side === "buy" ? `${p} TON` : p}</button>
            ))}
          </div>

          <div className="form-group">
            <label className="form-label">{side === "buy" ? "TON to spend" : `${data.symbol} to betray`}</label>
            <input
              className="form-input"
              type="number"
              placeholder="0.0"
              value={amount}
              min="0"
              onChange={(e) => setAmount(e.target.value)}
            />
            {parsedAmount > 0 && (
              <span className="form-hint">You receive ≈ {quoteDisplay} (5% slippage tolerance)</span>
            )}
          </div>

          {txError && (
            <div style={{ background: "#1a0808", border: "1px solid var(--red)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, color: "#e06060", fontSize: 13 }}>
              {txError}
            </div>
          )}

          <button
            className={`btn btn-${side}`}
            onClick={handleTrade}
            disabled={submitting || parsedAmount <= 0}
          >
            {submitting
              ? "Sending into the void…"
              : side === "buy"
              ? `Seize ${data.symbol}`
              : `Betray ${data.symbol}`}
          </button>
        </>
      )}

      {data.description && (
        <p style={{ marginTop: 16, fontSize: 13, color: "var(--text2)", lineHeight: 1.5, fontStyle: "italic" }}>
          "{data.description}"
        </p>
      )}
    </div>
  );
}
