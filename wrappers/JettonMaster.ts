import { Address, beginCell, Cell, Contract, ContractProvider, Sender, toNano } from "@ton/core";

export type JettonMasterConfig = {
  admin: Address;
  minter: Address;
  content: Cell;
};

export function jettonMasterConfigToCell(config: JettonMasterConfig): Cell {
  return beginCell()
    .storeAddress(config.admin)
    .storeAddress(config.minter)
    .storeRef(config.content)
    .endCell();
}

export function buildOnchainContent(params: {
  name: string;
  symbol: string;
  description: string;
  image: string;
}): Cell {
  return beginCell()
    .storeUint(0, 8) // snake format prefix
    .storeRef(
      beginCell()
        .storeStringTail(params.name)
        .storeRef(beginCell().storeStringTail(params.symbol).endCell())
        .storeRef(beginCell().storeStringTail(params.description).endCell())
        .storeRef(beginCell().storeStringTail(params.image).endCell())
        .endCell()
    )
    .endCell();
}

export class JettonMaster implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromAddress(address: Address) {
    return new JettonMaster(address);
  }

  async getJettonData(provider: ContractProvider) {
    const result = await provider.get("get_jetton_data", []);
    return {
      totalSupply: result.stack.readBigNumber(),
      mintable: result.stack.readBoolean(),
      adminAddress: result.stack.readAddress(),
      content: result.stack.readCell(),
      walletCode: result.stack.readCell(),
    };
  }

  async getWalletAddress(provider: ContractProvider, owner: Address): Promise<Address> {
    const result = await provider.get("get_wallet_address", [
      { type: "slice", cell: beginCell().storeAddress(owner).endCell() },
    ]);
    return result.stack.readAddress();
  }

  async getTotalSupply(provider: ContractProvider): Promise<bigint> {
    const result = await provider.get("get_total_supply", []);
    return result.stack.readBigNumber();
  }

  async getMinter(provider: ContractProvider): Promise<Address> {
    const result = await provider.get("get_minter", []);
    return result.stack.readAddress();
  }

  async sendMint(
    provider: ContractProvider,
    via: Sender,
    params: {
      queryId: bigint;
      destination: Address;
      amount: bigint;
      responseDestination?: Address;
      forwardTonAmount?: bigint;
    },
    value: bigint = toNano("0.1")
  ) {
    await provider.internal(via, {
      value,
      sendMode: 1,
      body: beginCell()
        .storeUint(0x642b7d07, 32)
        .storeUint(params.queryId, 64)
        .storeAddress(params.destination)
        .storeCoins(params.amount)
        .storeAddress(params.responseDestination ?? null)
        .storeCoins(params.forwardTonAmount ?? 0n)
        .storeBit(false) // empty forward payload
        .endCell(),
    });
  }
}
