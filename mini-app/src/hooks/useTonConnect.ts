import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { Address, toNano, beginCell } from "@ton/core";
import { TonClient } from "@ton/ton";
import { TESTNET, LAUNCH_FEE } from "../lib/constants";

export function useTonConnect() {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  const client = new TonClient({
    endpoint: TESTNET
      ? "https://testnet.toncenter.com/api/v2/jsonRPC"
      : "https://toncenter.com/api/v2/jsonRPC",
    apiKey: import.meta.env.VITE_TONCENTER_API_KEY,
  });

  const isConnected = !!wallet;
  const address = wallet?.account?.address ?? null;

  async function connect() {
    await tonConnectUI.openModal();
  }

  async function disconnect() {
    await tonConnectUI.disconnect();
  }

  // Send a generic transaction
  async function sendTransaction(params: {
    to: string;
    value: string; // nanoTON as string
    payload?: string; // base64 encoded BOC
  }) {
    if (!wallet) throw new Error("Wallet not connected");
    await tonConnectUI.sendTransaction({
      validUntil: Math.floor(Date.now() / 1000) + 300,
      messages: [
        {
          address: params.to,
          amount: params.value,
          payload: params.payload,
        },
      ],
    });
  }

  // Build Buy message body — op 1422049996 from tact_BondingCurve.abi
  function buildBuyPayload(queryId: bigint, minTokensOut: bigint): string {
    const cell = beginCell()
      .storeUint(1422049996, 32)
      .storeUint(queryId, 64)
      .storeCoins(minTokensOut)
      .endCell();
    return cell.toBoc().toString("base64");
  }

  // Build LaunchToken message body — op 3373264781 from tact_Factory.abi
  function buildLaunchPayload(params: {
    queryId: bigint;
    name: string;
    symbol: string;
    description: string;
    imageUrl: string;
  }): string {
    const cell = beginCell()
      .storeUint(3373264781, 32)
      .storeUint(params.queryId, 64)
      .storeStringRefTail(params.name)
      .storeStringRefTail(params.symbol)
      .storeStringRefTail(params.description)
      .storeStringRefTail(params.imageUrl)
      .endCell();
    return cell.toBoc().toString("base64");
  }

  // Build JettonTransfer for selling — sent to user's JettonWallet
  function buildSellPayload(params: {
    queryId: bigint;
    amount: bigint;         // tokens to sell
    bondingCurveAddr: string;
    minTonOut: bigint;
  }): string {
    const bc = Address.parse(params.bondingCurveAddr);
    // Forward payload encodes minTonOut for slippage check
    const forwardPayload = beginCell().storeCoins(params.minTonOut).endCell().beginParse();
    const cell = beginCell()
      .storeUint(0xf8a7ea5, 32)       // JettonTransfer op
      .storeUint(params.queryId, 64)
      .storeCoins(params.amount)
      .storeAddress(bc)               // destination = BondingCurve
      .storeAddress(Address.parse(address!)) // response destination = user
      .storeBit(false)                // no custom_payload
      .storeCoins(toNano("0.05"))     // forward TON amount for notification
      .storeBit(false)                // forward_payload inline
      .storeSlice(forwardPayload)
      .endCell();
    return cell.toBoc().toString("base64");
  }

  return {
    isConnected,
    address,
    wallet,
    client,
    connect,
    disconnect,
    sendTransaction,
    buildBuyPayload,
    buildSellPayload,
    buildLaunchPayload,
  };
}
