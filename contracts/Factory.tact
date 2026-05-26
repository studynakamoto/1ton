import "@stdlib/deploy";
import "./JettonMaster";
import "./BondingCurve";
import "./messages_platform";
import "./constants";

const DEPLOY_GAS: Int = ton("0.2");
const STORAGE_RESERVE: Int = ton("0.1");
const PROTOCOL_KEEP: Int = ton("0.3");

contract Factory(
    owner: Address,
    treasury: Address,
    tokenCount: Int as uint32,
) {
    receive() {
        cashback(sender());
    }

    receive(msg: LaunchToken) {
        let ctx = context();
        require(ctx.value >= LAUNCH_FEE, "Factory: must send at least 1 TON");
        require(!msg.name.asSlice().empty(), "Factory: empty name");
        require(!msg.symbol.asSlice().empty(), "Factory: empty symbol");

        let contentCell: Cell = self.buildContent(
            msg.name,
            msg.symbol,
            msg.description,
            msg.imageUrl,
        );

        let jmInitTmp: StateInit = initOf JettonMaster(0, myAddress(), myAddress(), contentCell, true);
        let bcInitTmp: StateInit = initOf BondingCurve(
            contractAddress(jmInitTmp),
            self.treasury,
            msg.name,
            0,
            0,
            false,
        );
        let bcAddr: Address = contractAddress(bcInitTmp);

        let jmInit: StateInit = initOf JettonMaster(0, myAddress(), bcAddr, contentCell, true);
        let jmAddr: Address = contractAddress(jmInit);

        let bcInit: StateInit = initOf BondingCurve(jmAddr, self.treasury, msg.name, 0, 0, false);
        let bcAddrFinal: Address = contractAddress(bcInit);

        self.tokenCount += 1;

        deploy(DeployParameters{
            value: DEPLOY_GAS + STORAGE_RESERVE,
            bounce: true,
            mode: SendPayGasSeparately,
            init: jmInit,
        });

        deploy(DeployParameters{
            value: DEPLOY_GAS + STORAGE_RESERVE,
            bounce: true,
            mode: SendPayGasSeparately,
            init: bcInit,
        });

        message(MessageParameters{
            to: self.treasury,
            value: PROTOCOL_KEEP,
            bounce: false,
            mode: SendPayGasSeparately,
            body: beginCell().storeUint(0xFEE0, 32).storeAddress(sender()).endCell(),
        });

        message(MessageParameters{
            to: sender(),
            value: 0,
            bounce: false,
            mode: SendRemainingValue,
            body: TokenLaunched{
                queryId: msg.queryId,
                jettonMaster: jmAddr,
                bondingCurve: bcAddrFinal,
                creator: sender(),
                name: msg.name,
                symbol: msg.symbol,
            }.toCell(),
        });
    }

    receive(msg: FactoryWithdraw) {
        require(sender() == self.owner, "Factory: owner only");
        require(msg.amount <= myBalance() - ton("0.1"), "Factory: insufficient balance");
        message(MessageParameters{
            to: self.owner,
            value: msg.amount,
            bounce: false,
            mode: SendPayGasSeparately,
            body: beginCell().storeUint(msg.queryId, 64).endCell(),
        });
    }

    fun buildContent(name: String, symbol: String, description: String, imageUrl: String): Cell {
        let nameSB: StringBuilder = beginString();
        nameSB.append(name);
        let symbolSB: StringBuilder = beginString();
        symbolSB.append(symbol);
        let descSB: StringBuilder = beginString();
        descSB.append(description);
        let imageSB: StringBuilder = beginString();
        imageSB.append(imageUrl);
        return beginCell()
            .storeUint(0, 8)
            .storeRef(
                beginCell()
                    .storeUint(0x0b, 8)
                    .storeRef(nameSB.toCell())
                    .storeRef(symbolSB.toCell())
                    .storeRef(descSB.toCell())
                    .storeRef(imageSB.toCell())
                    .endCell(),
            )
            .endCell();
    }

    get fun get_token_count(): Int {
        return self.tokenCount;
    }

    get fun get_owner(): Address {
        return self.owner;
    }

    get fun get_treasury(): Address {
        return self.treasury;
    }

    get fun get_launch_fee(): Int {
        return LAUNCH_FEE;
    }

    get fun compute_addresses(
        name: String,
        symbol: String,
        description: String,
        imageUrl: String,
    ): DeployedAddresses {
        let contentCell: Cell = self.buildContent(name, symbol, description, imageUrl);
        let jmInitTmp: StateInit = initOf JettonMaster(0, myAddress(), myAddress(), contentCell, true);
        let bcInitTmp: StateInit = initOf BondingCurve(
            contractAddress(jmInitTmp),
            self.treasury,
            name,
            0,
            0,
            false,
        );
        let bcAddr: Address = contractAddress(bcInitTmp);
        let jmInit: StateInit = initOf JettonMaster(0, myAddress(), bcAddr, contentCell, true);
        let jmAddr: Address = contractAddress(jmInit);
        let bcInitFinal: StateInit = initOf BondingCurve(jmAddr, self.treasury, name, 0, 0, false);
        return DeployedAddresses{
            jettonMaster: jmAddr,
            bondingCurve: contractAddress(bcInitFinal),
        };
    }
}
