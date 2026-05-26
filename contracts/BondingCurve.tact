import "@stdlib/deploy";
import "./JettonWallet";
import "./messages";
import "./messages_platform";
import "./constants";

const VIRTUAL_TON_RESERVE: Int = ton("1");
const VIRTUAL_TOKEN_RESERVE: Int = 1_000_000_000_000;
const MIN_TON_FOR_STORAGE: Int = ton("0.05");
const GAS_MINT: Int = ton("0.05");
const GAS_FEE_SEND: Int = ton("0.02");
const GAS_BURN: Int = ton("0.03");
const DECIMALS: Int = 1_000_000_000;

contract BondingCurve(
    jettonMaster: Address,
    treasury: Address,
    tokenName: String,
    realTonReserve: Int as coins,
    realTokenReserve: Int as coins,
    graduated: Bool,
) {
    inline fun myJettonWallet(): Address {
        return contractAddress(initOf JettonWallet(0, myAddress(), self.jettonMaster));
    }

    receive() {
        cashback(sender());
    }

    receive(msg: Buy) {
        require(!self.graduated, "BondingCurve: graduated");
        let ctx = context();
        require(
            ctx.value > GAS_MINT + GAS_FEE_SEND + MIN_TON_FOR_STORAGE,
            "BondingCurve: insufficient TON",
        );

        let tonInGross: Int = ctx.value - GAS_MINT - GAS_FEE_SEND - MIN_TON_FOR_STORAGE;
        let fee: Int = tonInGross * FEE_BPS / BPS_DENOM;
        let tonInNet: Int = tonInGross - fee;

        let vt: Int = VIRTUAL_TON_RESERVE + self.realTonReserve;
        let vtok: Int = VIRTUAL_TOKEN_RESERVE - self.realTokenReserve;
        let k: Int = vt * vtok;
        let newVt: Int = vt + tonInNet;
        let newVtok: Int = k / newVt;
        let tokensOut: Int = vtok - newVtok;

        require(tokensOut > 0, "BondingCurve: zero tokens out");
        require(tokensOut >= msg.minTokensOut, "BondingCurve: slippage");

        self.realTonReserve += tonInNet;
        self.realTokenReserve += tokensOut;

        message(MessageParameters{
            to: self.jettonMaster,
            value: GAS_MINT,
            bounce: true,
            mode: SendPayGasSeparately,
            body: Mint{
                queryId: msg.queryId,
                receiver: sender(),
                tonAmount: GAS_MINT,
                mintMessage: JettonTransferInternal{
                    queryId: msg.queryId,
                    amount: tokensOut,
                    sender: self.jettonMaster,
                    responseDestination: sender(),
                    forwardTonAmount: 0,
                    forwardPayload: beginCell().storeUint(0, 1).endCell().beginParse(),
                },
            }.toCell(),
        });

        message(MessageParameters{
            to: self.treasury,
            value: fee,
            bounce: false,
            mode: SendPayGasSeparately,
            body: TreasuryFee{queryId: msg.queryId, tokenName: self.tokenName}.toCell(),
        });

        if (self.realTonReserve >= GRADUATION_TON && !self.graduated) {
            self.graduated = true;
            self.initiateGraduation(msg.queryId);
        }
    }

    receive(msg: JettonNotification) {
        require(!self.graduated, "BondingCurve: graduated");
        require(sender() == self.myJettonWallet(), "BondingCurve: not from jetton wallet");
        require(msg.amount > 0, "BondingCurve: zero sell");

        let tokensIn: Int = msg.amount;
        let vt: Int = VIRTUAL_TON_RESERVE + self.realTonReserve;
        let vtok: Int = VIRTUAL_TOKEN_RESERVE - self.realTokenReserve;
        let k: Int = vt * vtok;
        let newVtok: Int = vtok + tokensIn;
        let newVt: Int = k / newVtok;
        let tonOutGross: Int = vt - newVt;

        require(tonOutGross > 0, "BondingCurve: zero TON out");
        require(tonOutGross <= self.realTonReserve, "BondingCurve: insufficient reserves");

        let minTonOut: Int = 0;
        let payload: Slice = msg.forwardPayload;
        if (payload.bits() >= 64) {
            minTonOut = payload.loadCoins();
        }

        let fee: Int = tonOutGross * FEE_BPS / BPS_DENOM;
        let tonOutNet: Int = tonOutGross - fee;
        require(tonOutNet >= minTonOut, "BondingCurve: slippage");

        self.realTonReserve -= tonOutGross;
        self.realTokenReserve -= tokensIn;

        message(MessageParameters{
            to: self.myJettonWallet(),
            value: GAS_BURN,
            bounce: true,
            mode: SendPayGasSeparately,
            body: JettonBurn{
                queryId: msg.queryId,
                amount: tokensIn,
                responseDestination: msg.sender,
                customPayload: null,
            }.toCell(),
        });

        message(MessageParameters{
            to: msg.sender,
            value: tonOutNet,
            bounce: false,
            mode: SendPayGasSeparately,
            body: beginCell().storeUint(msg.queryId, 64).endCell(),
        });

        message(MessageParameters{
            to: self.treasury,
            value: fee,
            bounce: false,
            mode: SendPayGasSeparately,
            body: TreasuryFee{queryId: msg.queryId, tokenName: self.tokenName}.toCell(),
        });
    }

    fun initiateGraduation(queryId: Int) {
        message(MessageParameters{
            to: self.jettonMaster,
            value: ton("0.05"),
            bounce: false,
            mode: SendPayGasSeparately,
            body: CloseMinting{}.toCell(),
        });
        // Ston.fi pool creation will be wired here
        message(MessageParameters{
            to: self.treasury,
            value: ton("0.02"),
            bounce: false,
            mode: SendPayGasSeparately,
            body: beginCell()
                .storeUint(0xDEAD, 32)
                .storeUint(queryId, 64)
                .endCell(),
        });
    }

    get fun get_curve_data(): CurveData {
        return CurveData{
            jettonMaster: self.jettonMaster,
            treasury: self.treasury,
            realTonReserve: self.realTonReserve,
            realTokenReserve: self.realTokenReserve,
            graduated: self.graduated,
            virtualTonReserve: VIRTUAL_TON_RESERVE,
            virtualTokenReserve: VIRTUAL_TOKEN_RESERVE,
        };
    }

    get fun quote_buy(tonAmount: Int): Int {
        let tonInNet: Int = tonAmount * (BPS_DENOM - FEE_BPS) / BPS_DENOM;
        let vt: Int = VIRTUAL_TON_RESERVE + self.realTonReserve;
        let vtok: Int = VIRTUAL_TOKEN_RESERVE - self.realTokenReserve;
        let k: Int = vt * vtok;
        let newVt: Int = vt + tonInNet;
        let newVtok: Int = k / newVt;
        return vtok - newVtok;
    }

    get fun quote_sell(tokenAmount: Int): Int {
        let vt: Int = VIRTUAL_TON_RESERVE + self.realTonReserve;
        let vtok: Int = VIRTUAL_TOKEN_RESERVE - self.realTokenReserve;
        let k: Int = vt * vtok;
        let newVtok: Int = vtok + tokenAmount;
        let newVt: Int = k / newVtok;
        let tonOutGross: Int = vt - newVt;
        return tonOutGross * (BPS_DENOM - FEE_BPS) / BPS_DENOM;
    }

    get fun get_price(): Int {
        let vt: Int = VIRTUAL_TON_RESERVE + self.realTonReserve;
        let vtok: Int = VIRTUAL_TOKEN_RESERVE - self.realTokenReserve;
        return vt * DECIMALS / vtok;
    }

    get fun is_graduated(): Bool {
        return self.graduated;
    }
}
