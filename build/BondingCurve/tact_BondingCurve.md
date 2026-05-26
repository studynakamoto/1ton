# Tact compilation report
Contract: BondingCurve
BoC Size: 2532 bytes

## Structures (Structs and Messages)
Total structures: 40

### DataSize
TL-B: `_ cells:int257 bits:int257 refs:int257 = DataSize`
Signature: `DataSize{cells:int257,bits:int257,refs:int257}`

### SignedBundle
TL-B: `_ signature:fixed_bytes64 signedData:remainder<slice> = SignedBundle`
Signature: `SignedBundle{signature:fixed_bytes64,signedData:remainder<slice>}`

### StateInit
TL-B: `_ code:^cell data:^cell = StateInit`
Signature: `StateInit{code:^cell,data:^cell}`

### Context
TL-B: `_ bounceable:bool sender:address value:int257 raw:^slice = Context`
Signature: `Context{bounceable:bool,sender:address,value:int257,raw:^slice}`

### SendParameters
TL-B: `_ mode:int257 body:Maybe ^cell code:Maybe ^cell data:Maybe ^cell value:int257 to:address bounce:bool = SendParameters`
Signature: `SendParameters{mode:int257,body:Maybe ^cell,code:Maybe ^cell,data:Maybe ^cell,value:int257,to:address,bounce:bool}`

### MessageParameters
TL-B: `_ mode:int257 body:Maybe ^cell value:int257 to:address bounce:bool = MessageParameters`
Signature: `MessageParameters{mode:int257,body:Maybe ^cell,value:int257,to:address,bounce:bool}`

### DeployParameters
TL-B: `_ mode:int257 body:Maybe ^cell value:int257 bounce:bool init:StateInit{code:^cell,data:^cell} = DeployParameters`
Signature: `DeployParameters{mode:int257,body:Maybe ^cell,value:int257,bounce:bool,init:StateInit{code:^cell,data:^cell}}`

### StdAddress
TL-B: `_ workchain:int8 address:uint256 = StdAddress`
Signature: `StdAddress{workchain:int8,address:uint256}`

### VarAddress
TL-B: `_ workchain:int32 address:^slice = VarAddress`
Signature: `VarAddress{workchain:int32,address:^slice}`

### BasechainAddress
TL-B: `_ hash:Maybe int257 = BasechainAddress`
Signature: `BasechainAddress{hash:Maybe int257}`

### Deploy
TL-B: `deploy#946a98b6 queryId:uint64 = Deploy`
Signature: `Deploy{queryId:uint64}`

### DeployOk
TL-B: `deploy_ok#aff90f57 queryId:uint64 = DeployOk`
Signature: `DeployOk{queryId:uint64}`

### FactoryDeploy
TL-B: `factory_deploy#6d0ff13b queryId:uint64 cashback:address = FactoryDeploy`
Signature: `FactoryDeploy{queryId:uint64,cashback:address}`

### JettonWallet$Data
TL-B: `_ balance:coins owner:address minter:address = JettonWallet`
Signature: `JettonWallet{balance:coins,owner:address,minter:address}`

### JettonMinterState
TL-B: `_ totalSupply:coins mintable:bool adminAddress:address jettonContent:^cell jettonWalletCode:^cell = JettonMinterState`
Signature: `JettonMinterState{totalSupply:coins,mintable:bool,adminAddress:address,jettonContent:^cell,jettonWalletCode:^cell}`

### JettonWalletData
TL-B: `_ balance:coins owner:address minter:address code:^cell = JettonWalletData`
Signature: `JettonWalletData{balance:coins,owner:address,minter:address,code:^cell}`

### JettonUpdateContent
TL-B: `jetton_update_content#00000004 queryId:uint64 content:^cell = JettonUpdateContent`
Signature: `JettonUpdateContent{queryId:uint64,content:^cell}`

### JettonTransfer
TL-B: `jetton_transfer#0f8a7ea5 queryId:uint64 amount:coins destination:address responseDestination:address customPayload:Maybe ^cell forwardTonAmount:coins forwardPayload:remainder<slice> = JettonTransfer`
Signature: `JettonTransfer{queryId:uint64,amount:coins,destination:address,responseDestination:address,customPayload:Maybe ^cell,forwardTonAmount:coins,forwardPayload:remainder<slice>}`

### JettonTransferInternal
TL-B: `jetton_transfer_internal#178d4519 queryId:uint64 amount:coins sender:address responseDestination:address forwardTonAmount:coins forwardPayload:remainder<slice> = JettonTransferInternal`
Signature: `JettonTransferInternal{queryId:uint64,amount:coins,sender:address,responseDestination:address,forwardTonAmount:coins,forwardPayload:remainder<slice>}`

### JettonNotification
TL-B: `jetton_notification#7362d09c queryId:uint64 amount:coins sender:address forwardPayload:remainder<slice> = JettonNotification`
Signature: `JettonNotification{queryId:uint64,amount:coins,sender:address,forwardPayload:remainder<slice>}`

### JettonBurn
TL-B: `jetton_burn#595f07bc queryId:uint64 amount:coins responseDestination:address customPayload:Maybe ^cell = JettonBurn`
Signature: `JettonBurn{queryId:uint64,amount:coins,responseDestination:address,customPayload:Maybe ^cell}`

### JettonBurnNotification
TL-B: `jetton_burn_notification#7bdd97de queryId:uint64 amount:coins sender:address responseDestination:address = JettonBurnNotification`
Signature: `JettonBurnNotification{queryId:uint64,amount:coins,sender:address,responseDestination:address}`

### JettonExcesses
TL-B: `jetton_excesses#d53276db queryId:uint64 = JettonExcesses`
Signature: `JettonExcesses{queryId:uint64}`

### ProvideWalletAddress
TL-B: `provide_wallet_address#2c76b973 queryId:uint64 ownerAddress:address includeAddress:bool = ProvideWalletAddress`
Signature: `ProvideWalletAddress{queryId:uint64,ownerAddress:address,includeAddress:bool}`

### TakeWalletAddress
TL-B: `take_wallet_address#d1735400 queryId:uint64 walletAddress:address ownerAddress:Maybe ^cell = TakeWalletAddress`
Signature: `TakeWalletAddress{queryId:uint64,walletAddress:address,ownerAddress:Maybe ^cell}`

### Mint
TL-B: `mint#00000015 queryId:uint64 receiver:address tonAmount:coins mintMessage:JettonTransferInternal{queryId:uint64,amount:coins,sender:address,responseDestination:address,forwardTonAmount:coins,forwardPayload:remainder<slice>} = Mint`
Signature: `Mint{queryId:uint64,receiver:address,tonAmount:coins,mintMessage:JettonTransferInternal{queryId:uint64,amount:coins,sender:address,responseDestination:address,forwardTonAmount:coins,forwardPayload:remainder<slice>}}`

### CloseMinting
TL-B: `close_minting#00000016  = CloseMinting`
Signature: `CloseMinting{}`

### ChangeOwner
TL-B: `change_owner#00000003 queryId:uint64 newOwner:address = ChangeOwner`
Signature: `ChangeOwner{queryId:uint64,newOwner:address}`

### JettonSetMinter
TL-B: `jetton_set_minter#00000017 queryId:uint64 minter:address = JettonSetMinter`
Signature: `JettonSetMinter{queryId:uint64,minter:address}`

### Buy
TL-B: `buy#54c2c2cc queryId:uint64 minTokensOut:coins = Buy`
Signature: `Buy{queryId:uint64,minTokensOut:coins}`

### LaunchToken
TL-B: `launch_token#c90fef8d queryId:uint64 name:^string symbol:^string description:^string imageUrl:^string = LaunchToken`
Signature: `LaunchToken{queryId:uint64,name:^string,symbol:^string,description:^string,imageUrl:^string}`

### TokenLaunched
TL-B: `token_launched#6daa8122 queryId:uint64 jettonMaster:address bondingCurve:address creator:address name:^string symbol:^string = TokenLaunched`
Signature: `TokenLaunched{queryId:uint64,jettonMaster:address,bondingCurve:address,creator:address,name:^string,symbol:^string}`

### FactoryWithdraw
TL-B: `factory_withdraw#a0f63af3 queryId:uint64 amount:coins = FactoryWithdraw`
Signature: `FactoryWithdraw{queryId:uint64,amount:coins}`

### TreasuryFee
TL-B: `treasury_fee#2723fcb4 queryId:uint64 tokenName:^string = TreasuryFee`
Signature: `TreasuryFee{queryId:uint64,tokenName:^string}`

### TreasuryWithdraw
TL-B: `treasury_withdraw#81749110 queryId:uint64 amount:coins destination:address = TreasuryWithdraw`
Signature: `TreasuryWithdraw{queryId:uint64,amount:coins,destination:address}`

### TreasurySetOwner
TL-B: `treasury_set_owner#a3e02f23 newOwner:address = TreasurySetOwner`
Signature: `TreasurySetOwner{newOwner:address}`

### CurveData
TL-B: `_ jettonMaster:address treasury:address realTonReserve:coins realTokenReserve:coins graduated:bool virtualTonReserve:coins virtualTokenReserve:coins = CurveData`
Signature: `CurveData{jettonMaster:address,treasury:address,realTonReserve:coins,realTokenReserve:coins,graduated:bool,virtualTonReserve:coins,virtualTokenReserve:coins}`

### DeployedAddresses
TL-B: `_ jettonMaster:address bondingCurve:address = DeployedAddresses`
Signature: `DeployedAddresses{jettonMaster:address,bondingCurve:address}`

### TreasuryData
TL-B: `_ owner:address balance:coins totalCollected:coins feeCount:uint32 = TreasuryData`
Signature: `TreasuryData{owner:address,balance:coins,totalCollected:coins,feeCount:uint32}`

### BondingCurve$Data
TL-B: `_ jettonMaster:address treasury:address tokenName:^string realTonReserve:coins realTokenReserve:coins graduated:bool = BondingCurve`
Signature: `BondingCurve{jettonMaster:address,treasury:address,tokenName:^string,realTonReserve:coins,realTokenReserve:coins,graduated:bool}`

## Get methods
Total get methods: 5

## get_curve_data
No arguments

## quote_buy
Argument: tonAmount

## quote_sell
Argument: tokenAmount

## get_price
No arguments

## is_graduated
No arguments

## Exit codes
* 2: Stack underflow
* 3: Stack overflow
* 4: Integer overflow
* 5: Integer out of expected range
* 6: Invalid opcode
* 7: Type check error
* 8: Cell overflow
* 9: Cell underflow
* 10: Dictionary error
* 11: 'Unknown' error
* 12: Fatal error
* 13: Out of gas error
* 14: Virtualization error
* 32: Action list is invalid
* 33: Action list is too long
* 34: Action is invalid or not supported
* 35: Invalid source address in outbound message
* 36: Invalid destination address in outbound message
* 37: Not enough Toncoin
* 38: Not enough extra currencies
* 39: Outbound message does not fit into a cell after rewriting
* 40: Cannot process a message
* 41: Library reference is null
* 42: Library change action error
* 43: Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree
* 50: Account state size exceeded limits
* 128: Null reference exception
* 129: Invalid serialization prefix
* 130: Invalid incoming message
* 131: Constraints error
* 132: Access denied
* 133: Contract stopped
* 134: Invalid argument
* 135: Code of a contract was not found
* 136: Invalid standard address
* 138: Not a basechain address
* 4737: BondingCurve: zero sell
* 7080: JettonWallet: insufficient TON for fees
* 7558: BondingCurve: insufficient reserves
* 13677: BondingCurve: not from jetton wallet
* 16529: BondingCurve: zero tokens out
* 27494: JettonWallet: negative balance after burn
* 39024: BondingCurve: zero TON out
* 39156: JettonWallet: insufficient TON for burn
* 48033: JettonWallet: unauthorized burn
* 48702: BondingCurve: slippage
* 52736: JettonWallet: invalid sender
* 53423: BondingCurve: insufficient TON
* 55384: BondingCurve: graduated
* 56172: JettonWallet: invalid forward payload
* 60848: JettonWallet: negative balance
* 61866: JettonWallet: unauthorized

## Trait inheritance diagram

```mermaid
graph TD
BondingCurve
BondingCurve --> BaseTrait
```

## Contract dependency diagram

```mermaid
graph TD
BondingCurve
BondingCurve --> JettonWallet
```