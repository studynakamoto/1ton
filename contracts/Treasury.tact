import "@stdlib/deploy";
import "./messages_platform";

contract Treasury(
    owner: Address,
    totalCollected: Int as coins,
    feeCount: Int as uint32,
) {
    receive() {
        let v = context().value;
        if (v > 0) {
            self.totalCollected += v;
            self.feeCount += 1;
        }
    }

    receive(msg: TreasuryFee) {
        let ctx = context();
        require(ctx.value > 0, "Treasury: zero fee");
        self.totalCollected += ctx.value;
        self.feeCount += 1;
    }

    receive(msg: TreasuryWithdraw) {
        require(sender() == self.owner, "Treasury: owner only");
        let available: Int = myBalance() - ton("0.05");
        require(msg.amount <= available, "Treasury: insufficient balance");
        require(msg.amount > 0, "Treasury: zero withdrawal");

        message(MessageParameters{
            to: msg.destination,
            value: msg.amount,
            bounce: false,
            mode: SendPayGasSeparately,
            body: beginCell().storeUint(msg.queryId, 64).endCell(),
        });
    }

    receive(msg: TreasurySetOwner) {
        require(sender() == self.owner, "Treasury: owner only");
        self.owner = msg.newOwner;
    }

    get fun get_treasury_data(): TreasuryData {
        return TreasuryData{
            owner: self.owner,
            balance: myBalance(),
            totalCollected: self.totalCollected,
            feeCount: self.feeCount,
        };
    }

    get fun get_balance(): Int {
        return myBalance();
    }

    get fun get_owner(): Address {
        return self.owner;
    }
}
