// 1ton.fun platform messages (factory, curve, treasury)

message Buy {
    queryId: Int as uint64;
    minTokensOut: Int as coins;
}

message LaunchToken {
    queryId: Int as uint64;
    name: String;
    symbol: String;
    description: String;
    imageUrl: String;
}

message TokenLaunched {
    queryId: Int as uint64;
    jettonMaster: Address;
    bondingCurve: Address;
    creator: Address;
    name: String;
    symbol: String;
}

message FactoryWithdraw {
    queryId: Int as uint64;
    amount: Int as coins;
}

message TreasuryFee {
    queryId: Int as uint64;
    tokenName: String;
}

message TreasuryWithdraw {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
}

message TreasurySetOwner {
    newOwner: Address;
}

struct CurveData {
    jettonMaster: Address;
    treasury: Address;
    realTonReserve: Int as coins;
    realTokenReserve: Int as coins;
    graduated: Bool;
    virtualTonReserve: Int as coins;
    virtualTokenReserve: Int as coins;
}

struct DeployedAddresses {
    jettonMaster: Address;
    bondingCurve: Address;
}

struct TreasuryData {
    owner: Address;
    balance: Int as coins;
    totalCollected: Int as coins;
    feeCount: Int as uint32;
}
