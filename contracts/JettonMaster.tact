import "./JettonWallet";
import "./messages";
import "./constants";

// TEP-74 Jetton master — admin (factory) + minter (bonding curve)
contract JettonMaster(
    totalSupply: Int as coins,
    admin: Address,
    minter: Address,
    jettonContent: Cell,
    mintable: Bool,
) {
    receive() {
        cashback(sender());
    }

    receive(msg: Mint) {
        require(sender() == self.minter, "JettonMaster: only minter can mint");
        require(self.mintable, "JettonMaster: minting closed");

        let ctx = context();
        require(
            ctx.value >
                minTonsForStorage +
                msg.mintMessage.forwardTonAmount +
                ctx.readForwardFee() +
                2 * getComputeFee(gasForTransfer, false),
            "JettonMaster: insufficient gas for mint",
        );

        self.totalSupply += msg.mintMessage.amount;

        deploy(DeployParameters{
            value: 0,
            bounce: true,
            mode: SendRemainingValue | SendBounceIfActionFail,
            body: msg.mintMessage.toCell(),
            init: getJettonWalletInit(msg.receiver),
        });
    }

    receive(msg: JettonBurnNotification) {
        let senderStd = parseStdAddress(sender().asSlice());
        let wallet = getJettonBasechainWalletByOwner(msg.sender);

        require(
            senderStd.workchain == Basechain && senderStd.address == wallet.hash!!,
            "JettonMaster: unauthorized burn",
        );

        self.totalSupply -= msg.amount;

        if (msg.responseDestination != null) {
            message(MessageParameters{
                to: msg.responseDestination!!,
                body: JettonExcesses{queryId: msg.queryId}.toCell(),
                value: 0,
                bounce: false,
                mode: SendRemainingValue | SendIgnoreErrors,
            });
        }
    }

    receive(msg: ProvideWalletAddress) {
        let ownerWorkchain: Int = parseStdAddress(msg.ownerAddress.asSlice()).workchain;
        let targetJettonWallet: BasechainAddress = (ownerWorkchain == Basechain)
            ? contractBasechainAddress(initOf JettonWallet(0, msg.ownerAddress, myAddress()))
            : emptyBasechainAddress();

        message(MessageParameters{
            body: makeTakeWalletAddressMsg(targetJettonWallet, msg),
            to: sender(),
            value: 0,
            mode: SendRemainingValue,
        });
    }

    receive(msg: JettonUpdateContent) {
        require(sender() == self.admin, "JettonMaster: admin only");
        self.jettonContent = msg.content;
    }

    receive(msg: JettonSetMinter) {
        require(sender() == self.admin, "JettonMaster: admin only");
        self.minter = msg.minter;
    }

    receive(msg: ChangeOwner) {
        require(sender() == self.admin, "JettonMaster: admin only");
        self.admin = msg.newOwner;
    }

    receive(msg: CloseMinting) {
        require(
            sender() == self.admin || sender() == self.minter,
            "JettonMaster: unauthorized close mint",
        );
        self.mintable = false;
        cashback(sender());
    }

    bounced(msg: bounced<JettonTransferInternal>) {
        self.totalSupply -= msg.amount;
    }

    get fun get_jetton_data(): JettonMinterState {
        return JettonMinterState{
            totalSupply: self.totalSupply,
            mintable: self.mintable,
            adminAddress: self.admin,
            jettonContent: self.jettonContent,
            jettonWalletCode: codeOf JettonWallet,
        };
    }

    get fun get_wallet_address(ownerAddress: Address): Address {
        return getJettonWalletByOwner(ownerAddress);
    }

    get fun get_minter(): Address {
        return self.minter;
    }

    get fun get_total_supply(): Int {
        return self.totalSupply;
    }
}

inline fun makeTakeWalletAddressMsg(targetJettonWallet: BasechainAddress, msg: ProvideWalletAddress): Cell {
    return beginCell()
        .storeUint(TakeWalletAddressOpcode, 32)
        .storeUint(msg.queryId, 64)
        .storeBasechainAddress(targetJettonWallet)
        .storeMaybeRef(msg.includeAddress ? beginCell().storeAddress(msg.ownerAddress).endCell() : null)
        .endCell();
}

inline fun getJettonWalletInit(address: Address): StateInit {
    return initOf JettonWallet(0, address, myAddress());
}

inline fun getJettonWalletByOwner(jettonWalletOwner: Address): Address {
    return contractAddress(getJettonWalletInit(jettonWalletOwner));
}

inline fun getJettonBasechainWalletByOwner(jettonWalletOwner: Address): BasechainAddress {
    return contractBasechainAddress(getJettonWalletInit(jettonWalletOwner));
}
