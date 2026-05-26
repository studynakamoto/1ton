import { Address, beginCell, Cell, Contract, ContractProvider, Sender, toNano } from "@ton/core";

export class BondingCurve implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromAddress(address: Address) {
    return new BondingCurve(address);
  }

  async sendBuy(
    provider: ContractProvider,
    via: Sender,
    params: {
      queryId: bigint;
      minTokensOut: bigint;
      value: bigint;
    }
  ) {
    await provider.internal(via, {
      value: params.value,
      sendMode: 1,
      body: beginCell()
        .storeUint(0x4a77c3f9, 32) // Buy op
        .storeUint(params.queryId, 64)
        .storeCoins(params.minTokensOut)
        .storeBit(false) // no referrer
        .endCell(),
    });
  }

  async getCurveData(provider: ContractProvider) {
    const result = await provider.get("get_curve_data", []);
    return {
      jettonMaster: result.stack.readAddress(),
      treasury: result.stack.readAddress(),
      realTonReserve: result.stack.readBigNumber(),
      realTokenReserve: result.stack.readBigNumber(),
      graduated: result.stack.readBoolean(),
      virtualTonReserve: result.stack.readBigNumber(),
      virtualTokenReserve: result.stack.readBigNumber(),
    };
  }

  async quoteBuy(provider: ContractProvider, tonAmount: bigint): Promise<bigint> {
    const result = await provider.get("quote_buy", [
      { type: "int", value: tonAmount },
    ]);
    return result.stack.readBigNumber();
  }

  async quoteSell(provider: ContractProvider, tokenAmount: bigint): Promise<bigint> {
    const result = await provider.get("quote_sell", [
      { type: "int", value: tokenAmount },
    ]);
    return result.stack.readBigNumber();
  }

  async getPrice(provider: ContractProvider): Promise<bigint> {
    const result = await provider.get("get_price", []);
    return result.stack.readBigNumber();
  }

  async isGraduated(provider: ContractProvider): Promise<boolean> {
    const result = await provider.get("is_graduated", []);
    return result.stack.readBoolean();
  }
}
