import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano, beginCell } from '@ton/core';
import '@ton/test-utils';
import { JettonMaster } from '../build/JettonMaster/tact_JettonMaster';
import { JettonWallet } from '../build/JettonWallet/tact_JettonWallet';

describe('JettonMaster + JettonWallet', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let admin: SandboxContract<TreasuryContract>;
    let minter: SandboxContract<TreasuryContract>;
    let user: SandboxContract<TreasuryContract>;
    let jettonMaster: SandboxContract<JettonMaster>;

    const content = beginCell().storeUint(0, 8).storeStringTail('https://example.com/meta.json').endCell();

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        admin = await blockchain.treasury('admin');
        minter = await blockchain.treasury('minter');
        user = await blockchain.treasury('user');

        jettonMaster = blockchain.openContract(
            await JettonMaster.fromInit(0n, admin.address, minter.address, content, true),
        );

        const deployResult = await jettonMaster.send(
            deployer.getSender(),
            { value: toNano('0.2') },
            null,
        );
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonMaster.address,
            deploy: true,
            success: true,
        });
    });

    it('deploys with correct jetton data', async () => {
        const data = await jettonMaster.getGetJettonData();
        expect(data.mintable).toBe(true);
        expect(data.totalSupply).toBe(0n);
        expect(data.adminAddress.toString()).toBe(admin.address.toString());
        expect(data.jettonWalletCode).toBeDefined();
    });

    it('mints tokens to user via minter', async () => {
        const amount = toNano('1000');
        const mintResult = await jettonMaster.send(
            minter.getSender(),
            { value: toNano('0.2') },
            {
                $$type: 'Mint',
                queryId: 1n,
                receiver: user.address,
                tonAmount: toNano('0.15'),
                mintMessage: {
                    $$type: 'JettonTransferInternal',
                    queryId: 1n,
                    amount,
                    sender: jettonMaster.address,
                    responseDestination: minter.address,
                    forwardTonAmount: 0n,
                    forwardPayload: beginCell().storeUint(0, 1).endCell().beginParse(),
                },
            },
        );

        expect(mintResult.transactions).toHaveTransaction({ success: true });

        const supply = await jettonMaster.getGetTotalSupply();
        expect(supply).toBe(amount);

        const walletAddress = await jettonMaster.getGetWalletAddress(user.address);
        const userWallet = blockchain.openContract(
            await JettonWallet.fromInit(0n, user.address, jettonMaster.address),
        );
        expect(walletAddress.toString()).toBe(userWallet.address.toString());

        const walletData = await userWallet.getGetWalletData();
        expect(walletData.balance).toBe(amount);
    });

    it('rejects mint from non-minter', async () => {
        const result = await jettonMaster.send(
            user.getSender(),
            { value: toNano('0.2') },
            {
                $$type: 'Mint',
                queryId: 2n,
                receiver: user.address,
                tonAmount: toNano('0.15'),
                mintMessage: {
                    $$type: 'JettonTransferInternal',
                    queryId: 2n,
                    amount: toNano('1'),
                    sender: jettonMaster.address,
                    responseDestination: null,
                    forwardTonAmount: 0n,
                    forwardPayload: beginCell().storeUint(0, 1).endCell().beginParse(),
                },
            },
        );
        expect(result.transactions).toHaveTransaction({
            from: user.address,
            to: jettonMaster.address,
            success: false,
        });
    });
});
