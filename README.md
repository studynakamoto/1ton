# 1ton.fun

Pump.fun-style memecoin launcher on TON. Pay **1 TON** to deploy a TEP-74 jetton with a constant-product bonding curve; **1%** swap fees go to the treasury. At **69 TON** market cap, graduation to Ston.fi is planned.

## Stack

- **Contracts:** Tact → FunC via [Blueprint](https://github.com/ton-org/blueprint)
- **Network:** TON testnet (see `blueprint.config.ts`)
- **Frontend:** React + Vite Telegram Mini App in `mini-app/`

## Contracts

| Contract | Role |
|----------|------|
| `JettonMaster` | TEP-74 minter; factory admin, bonding curve minter |
| `JettonWallet` | Per-user balances |
| `BondingCurve` | x·y=k buys/sells, fees, graduation hook |
| `Factory` | 1 TON launch → deploy master + curve |
| `Treasury` | Fee collection, owner withdraw |

## Commands

```bash
npm install
npm run build          # compile all Tact contracts (required before tests)
npm test               # sandbox tests
npm run deploy         # blueprint run (interactive)
```

Deploy scripts: `scripts/deployTreasury.ts`, `scripts/deployFactory.ts`.

## Development order

1. Jetton (TEP-74) ✓
2. Bonding curve + factory integration tests
3. Testnet deploy
4. Mini App + TON Connect on 1ton.fun
