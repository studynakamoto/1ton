// Contract addresses — replace with deployed testnet/mainnet addresses
export const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_ADDRESS || "";
export const TREASURY_ADDRESS = import.meta.env.VITE_TREASURY_ADDRESS || "";

// Chain config
export const TON_WORKCHAIN = 0;
export const TESTNET = import.meta.env.VITE_TESTNET !== "false";

// Bonding curve constants (match contracts/constants.tact)
export const VIRTUAL_TON_RESERVE = 1_000_000_000n;          // 1 TON in nanoTON
export const VIRTUAL_TOKEN_RESERVE = 1_000_000_000_000n;    // 1T tokens
export const FEE_BPS = 100n;    // 1%
export const BPS_DENOM = 10_000n;
export const GRADUATION_TON = 69_000_000_000n;              // 69 TON in nanoTON
export const DECIMALS = 1_000_000_000n;                      // 9 decimal places
export const LAUNCH_FEE = 1_000_000_000n;                   // 1 TON

// Quote helpers (pure math, mirrors Tact contract logic)
export function quoteBuy(
  tonAmount: bigint,
  realTonReserve: bigint,
  realTokenReserve: bigint
): bigint {
  const tonInNet = (tonAmount * (BPS_DENOM - FEE_BPS)) / BPS_DENOM;
  const vt = VIRTUAL_TON_RESERVE + realTonReserve;
  const vtok = VIRTUAL_TOKEN_RESERVE - realTokenReserve;
  const k = vt * vtok;
  const newVt = vt + tonInNet;
  const newVtok = k / newVt;
  return vtok - newVtok;
}

export function quoteSell(
  tokenAmount: bigint,
  realTonReserve: bigint,
  realTokenReserve: bigint
): bigint {
  const vt = VIRTUAL_TON_RESERVE + realTonReserve;
  const vtok = VIRTUAL_TOKEN_RESERVE - realTokenReserve;
  const k = vt * vtok;
  const newVtok = vtok + tokenAmount;
  const newVt = k / newVtok;
  const gross = vt - newVt;
  return (gross * (BPS_DENOM - FEE_BPS)) / BPS_DENOM;
}

export function currentPrice(realTonReserve: bigint, realTokenReserve: bigint): bigint {
  const vt = VIRTUAL_TON_RESERVE + realTonReserve;
  const vtok = VIRTUAL_TOKEN_RESERVE - realTokenReserve;
  return (vt * DECIMALS) / vtok;
}

export function formatTon(nanoton: bigint, decimals = 3): string {
  const whole = nanoton / DECIMALS;
  const frac = nanoton % DECIMALS;
  const fracStr = frac.toString().padStart(9, "0").slice(0, decimals);
  return `${whole}.${fracStr}`;
}

export function formatTokens(amount: bigint, decimals = 2): string {
  const whole = amount / DECIMALS;
  const frac = amount % DECIMALS;
  const fracStr = frac.toString().padStart(9, "0").slice(0, decimals);
  return `${whole.toLocaleString()}.${fracStr}`;
}

export function graduationProgress(realTonReserve: bigint): number {
  if (realTonReserve >= GRADUATION_TON) return 100;
  return Number((realTonReserve * 100n) / GRADUATION_TON);
}
