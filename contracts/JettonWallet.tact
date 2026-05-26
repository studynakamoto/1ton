import "./messages";
import "./constants";

// TEP-74 Jetton wallet — per-owner balance; transfers and burns
contract JettonWallet(
    balance: Int as coins,
    owner: Address,
    minter: Address,
) {
    receive(msg: JettonTransfer) {
        forceBasechain(msg.destination);
        require(sender() == self.owner, "JettonWallet: unauthorized");

        self.balance -= msg.amount;
        require(self.balance >= 0, "JettonWallet: negative balance");
        require(msg.forwardPayload.bits() >= 1, "JettonWallet: invalid forward payload");

        let ctx = context();
        let fwdCount = 1 + sign(msg.forwardTonAmount);
        require(
            ctx.value >
                msg.forwardTonAmount +
                fwdCount * ctx.readForwardFee() +
                (2 * getComputeFee(gasForTransfer, false) + minTonsForStorage),
            "JettonWallet: insufficient TON for fees",
        );

        deploy(DeployParameters{
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: JettonTransferInternal{
                queryId: msg.queryId,
                amount: msg.amount,
                sender: self.owner,
                responseDestination: msg.responseDestination,
                forwardTonAmount: msg.forwardTonAmount,
                forwardPayload: msg.forwardPayload,
            }.toCell(),
            init: initOf JettonWallet(0, msg.destination, self.minter),
        });
    }

    receive(msg: JettonTransferInternal) {
        self.balance += msg.amount;

        let wallet: StateInit = initOf JettonWallet(0, msg.sender, self.minter);
        if (!wallet.hasSameBasechainAddress(sender())) {
            require(self.minter == sender(), "JettonWallet: invalid sender");
        }

        let ctx: Context = context();
        let msgValue: Int = ctx.value;
        let tonBalanceBeforeMsg = myBalance() - msgValue;

        if (msg.forwardTonAmount > 0) {
            let fwdFee: Int = ctx.readForwardFee();
            msgValue -= msg.forwardTonAmount + fwdFee;
            message(MessageParameters{
                to: self.owner,
                value: msg.forwardTonAmount,
                mode: SendPayGasSeparately,
                bounce: false,
                body: JettonNotification{
                    queryId: msg.queryId,
                    amount: msg.amount,
                    sender: msg.sender,
                    forwardPayload: msg.forwardPayload,
                }.toCell(),
            });
        }

        nativeReserve(max(tonBalanceBeforeMsg, minTonsForStorage), ReserveAtMost);

        if (msg.responseDestination != null && msgValue > 0) {
            message(MessageParameters{
                to: msg.responseDestination!!,
                value: msgValue,
                mode: SendRemainingBalance + SendIgnoreErrors,
                bounce: false,
                body: JettonExcesses{queryId: msg.queryId}.toCell(),
            });
        }
    }

    receive(msg: JettonBurn) {
        require(sender() == self.owner, "JettonWallet: unauthorized burn");

        self.balance -= msg.amount;
        require(self.balance >= 0, "JettonWallet: negative balance after burn");

        let ctx = context();
        let fwdFee: Int = ctx.readForwardFee();
        require(
            ctx.value > fwdFee + 2 * getComputeFee(gasForBurn, false),
            "JettonWallet: insufficient TON for burn",
        );

        message(MessageParameters{
            to: self.minter,
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: JettonBurnNotification{
                queryId: msg.queryId,
                amount: msg.amount,
                sender: self.owner,
                responseDestination: msg.responseDestination,
            }.toCell(),
        });
    }

    bounced(msg: bounced<JettonTransferInternal>) {
        self.balance += msg.amount;
    }

    bounced(msg: bounced<JettonBurnNotification>) {
        self.balance += msg.amount;
    }

    get fun get_wallet_data(): JettonWalletData {
        return JettonWalletData{
            balance: self.balance,
            owner: self.owner,
            minter: self.minter,
            code: myCode(),
        };
    }
}
