export interface TokenInfo {
  address: string;         // BondingCurve contract address
  jettonMaster: string;
  name: string;
  symbol: string;
  description?: string;
  imageUrl?: string;
  creator: string;
  createdAt: number;       // unix timestamp
  realTonReserve: bigint;
  realTokenReserve: bigint;
  graduated: boolean;
  priceNano: bigint;       // nanoTON per token (9 decimals)
}

export interface HoldingInfo {
  tokenAddress: string;    // BondingCurve address
  jettonMaster: string;
  walletAddress: string;
  name: string;
  symbol: string;
  imageUrl?: string;
  balance: bigint;         // token units (9 decimals)
  priceNano: bigint;
}

// Price point for chart
export interface PricePoint {
  t: number;   // unix timestamp
  p: number;   // price in TON (float)
}
