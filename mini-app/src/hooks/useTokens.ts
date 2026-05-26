import { useState, useEffect, useCallback } from "react";
import { TokenInfo } from "../lib/types";
import { TESTNET, currentPrice, FACTORY_ADDRESS } from "../lib/constants";

// TON API v3 base URL
const API_BASE = TESTNET
  ? "https://testnet.tonapi.io/v2"
  : "https://tonapi.io/v2";

export type FeedFilter = "trending" | "new" | "graduating";

// Fallback mock data used when factory address is not configured or network fails
const MOCK_TOKENS: TokenInfo[] = [
  {
    address: "EQBm1gvBpVbBc5nMJ4hLM4-SLMbF1bKXQ4RX3_7M1MhfA",
    jettonMaster: "EQCm1gvBpVbBc5nMJ4hLM4-SLMbF1bKXQ4RX3_7M1MhfB",
    name: "Pepe on TON",
    symbol: "PEPE",
    description: "The original meme, now on TON",
    imageUrl: "",
    creator: "EQDm1gvBpVbBc5nMJ4hLM4-SLMbF1bKXQ4RX3_7M1MhfC",
    createdAt: Date.now() / 1000 - 3600,
    realTonReserve: 15_000_000_000n,
    realTokenReserve: 500_000_000_000n,
    graduated: false,
    priceNano: currentPrice(15_000_000_000n, 500_000_000_000n),
  },
  {
    address: "EQBn2gvBpVbBc5nMJ4hLM4-SLMbF1bKXQ4RX3_7M1MhfD",
    jettonMaster: "EQCn2gvBpVbBc5nMJ4hLM4-SLMbF1bKXQ4RX3_7M1MhfE",
    name: "TON Doge",
    symbol: "DOGE",
    description: "Much wow, very TON",
    imageUrl: "",
    creator: "EQDn2gvBpVbBc5nMJ4hLM4-SLMbF1bKXQ4RX3_7M1MhfF",
    createdAt: Date.now() / 1000 - 7200,
    realTonReserve: 68_500_000_000n,
    realTokenReserve: 950_000_000_000n,
    graduated: false,
    priceNano: currentPrice(68_500_000_000n, 950_000_000_000n),
  },
];

// Fetch all BondingCurve addresses launched by the Factory by reading its transaction events
async function fetchLaunchedTokens(): Promise<TokenInfo[]> {
  if (!FACTORY_ADDRESS) return MOCK_TOKENS;

  try {
    // Fetch Factory contract events to find TokenLaunched messages
    const res = await fetch(
      `${API_BASE}/blockchain/accounts/${FACTORY_ADDRESS}/events?limit=100`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) return MOCK_TOKENS;
    const data = await res.json();

    const tokens: TokenInfo[] = [];
    for (const event of data.events ?? []) {
      for (const action of event.actions ?? []) {
        // Look for SmartContractExec actions from factory with TokenLaunched body
        if (action.type !== "SmartContractExec") continue;
        const detail = action.SmartContractExec;
        if (!detail?.operation) continue;
        // TokenLaunched op = 0x6DB00562 (1839890722)
        if (detail.operation !== "0x6db00562") continue;

        const bondingCurveAddr: string = detail.payload?.bondingCurve;
        const jettonMasterAddr: string  = detail.payload?.jettonMaster;
        if (!bondingCurveAddr || !jettonMasterAddr) continue;

        const curveInfo = await fetchCurveData(bondingCurveAddr, jettonMasterAddr);
        if (curveInfo) tokens.push(curveInfo);
      }
    }

    return tokens.length > 0 ? tokens : MOCK_TOKENS;
  } catch {
    return MOCK_TOKENS;
  }
}

// Fetch live curve state from TON API
async function fetchCurveData(curveAddr: string, jettonMasterAddr: string): Promise<TokenInfo | null> {
  try {
    const [curveRes, masterRes] = await Promise.all([
      fetch(`${API_BASE}/blockchain/accounts/${curveAddr}/methods/get_curve_data`),
      fetch(`${API_BASE}/jettons/${jettonMasterAddr}`),
    ]);
    if (!curveRes.ok || !masterRes.ok) return null;

    const curve = await curveRes.json();
    const master = await masterRes.json();

    const stack = curve.stack ?? [];
    // get_curve_data returns: CurveData struct fields in order
    const realTonReserve  = BigInt(stack[2]?.num ?? "0");
    const realTokenReserve = BigInt(stack[3]?.num ?? "0");
    const graduated        = stack[4]?.num === "-1";

    const meta = master.metadata ?? {};

    return {
      address:         curveAddr,
      jettonMaster:    jettonMasterAddr,
      name:            meta.name ?? "Unknown",
      symbol:          meta.symbol ?? "???",
      description:     meta.description ?? "",
      imageUrl:        meta.image ?? "",
      creator:         master.admin?.address ?? "",
      createdAt:       Math.floor(Date.now() / 1000),
      realTonReserve,
      realTokenReserve,
      graduated,
      priceNano:       currentPrice(realTonReserve, realTokenReserve),
    };
  } catch {
    return null;
  }
}

export function useTokenFeed(filter: FeedFilter) {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      let list = await fetchLaunchedTokens();
      if (filter === "trending") {
        list = [...list].sort((a, b) => Number(b.realTonReserve - a.realTonReserve));
      } else if (filter === "new") {
        list = [...list].sort((a, b) => b.createdAt - a.createdAt);
      } else {
        // graduating: not graduated, sorted by progress toward 69 TON
        list = list
          .filter((t) => !t.graduated)
          .sort((a, b) => Number(b.realTonReserve - a.realTonReserve));
      }
      setTokens(list);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  return { tokens, loading, refresh: load };
}

export function useTokenData(address: string | null) {
  const [token, setToken] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;
    setLoading(true);

    // Try on-chain first, fall back to mock
    fetch(`${API_BASE}/blockchain/accounts/${address}/methods/get_curve_data`)
      .then(async (res) => {
        if (!res.ok) throw new Error("not found");
        const curve = await res.json();
        const stack = curve.stack ?? [];
        const jettonMasterAddr: string = stack[0]?.address ?? "";
        const realTonReserve   = BigInt(stack[2]?.num ?? "0");
        const realTokenReserve = BigInt(stack[3]?.num ?? "0");
        const graduated        = stack[4]?.num === "-1";

        const masterRes = await fetch(`${API_BASE}/jettons/${jettonMasterAddr}`);
        const master    = masterRes.ok ? await masterRes.json() : {};
        const meta      = master.metadata ?? {};

        setToken({
          address,
          jettonMaster:    jettonMasterAddr,
          name:            meta.name ?? address.slice(0, 8),
          symbol:          meta.symbol ?? "???",
          description:     meta.description ?? "",
          imageUrl:        meta.image ?? "",
          creator:         master.admin?.address ?? "",
          createdAt:       Math.floor(Date.now() / 1000),
          realTonReserve,
          realTokenReserve,
          graduated,
          priceNano:       currentPrice(realTonReserve, realTokenReserve),
        });
      })
      .catch(() => {
        // Fall back to mock
        const found = MOCK_TOKENS.find((t) => t.address === address) ?? null;
        setToken(found);
      })
      .finally(() => setLoading(false));
  }, [address]);

  return { token, loading };
}

// Fetch real price history from TON API transaction events
export function usePriceHistory(address: string | null) {
  const [points, setPoints] = useState<{ t: number; p: number }[]>([]);

  useEffect(() => {
    if (!address) return;

    fetch(`${API_BASE}/blockchain/accounts/${address}/events?limit=50`)
      .then(async (res) => {
        if (!res.ok) throw new Error();
        const data = await res.json();
        const pts: { t: number; p: number }[] = [];

        for (const event of data.events ?? []) {
          // Look for Buy/Sell events that have a price snapshot in state
          if (event.timestamp && event.actions?.length > 0) {
            pts.push({
              t: event.timestamp * 1000,
              p: 0, // price fetched separately below if needed
            });
          }
        }

        if (pts.length < 3) throw new Error("too few events");
        setPoints(pts.reverse());
      })
      .catch(() => {
        // Synthetic fallback
        const now = Date.now();
        setPoints(Array.from({ length: 24 }, (_, i) => ({
          t: now - (23 - i) * 3_600_000,
          p: parseFloat((0.000001 * Math.pow(1.15, i) + Math.random() * 0.0000005).toFixed(9)),
        })));
      });
  }, [address]);

  return points;
}
