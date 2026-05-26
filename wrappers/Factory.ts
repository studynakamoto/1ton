import { Address, beginCell, Cell, Contract, ContractProvider, Sender, toNano } from "@ton/core";

export class Factory implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromAddress(address: Address) {
    return new Factory(address);
  }

  async sendLaunchToken(
    provider: ContractProvider,
    via: Sender,
    params: {
      queryId: bigint;
      name: string;
      symbol: string;
      description: string;
      imageUrl: string;
    }
  ) {
    await provider.internal(via, {
      value: toNano("1"),
      sendMode: 1,
      body: beginCell()
        .storeUint(0x1a2b3c4d, 32) // LaunchToken op
        .storeUint(params.queryId, 64)
        .storeStringTail(params.name)
        .storeRef(beginCell().storeStringTail(params.symbol).endCell())
        .storeRef(beginCell().storeStringTail(params.description).endCell())
        .storeRef(beginCell().storeStringTail(params.imageUrl).endCell())
        .endCell(),
    });
  }

  async getTokenCount(provider: ContractProvider): Promise<number> {
    const result = await provider.get("get_token_count", []);
    return Number(result.stack.readBigNumber());
  }

  async getLaunchFee(provider: ContractProvider): Promise<bigint> {
    const result = await provider.get("get_launch_fee", []);
    return result.stack.readBigNumber();
  }

  async getOwner(provider: ContractProvider): Promise<Address> {
    const result = await provider.get("get_owner", []);
    return result.stack.readAddress();
  }
}
