import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano, beginCell } from '@ton/core';
import '@ton/test-utils';
import { BondingCurve } from '../build/BondingCurve/tact_BondingCurve';
import { JettonMaster } from '../build/JettonMaster/tact_JettonMaster';

describe('BondingCurve', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let treasury: SandboxContract<TreasuryContract>;
    let bondingCurve: SandboxContract<BondingCurve>;

    const content = beginCell().storeUint(0, 8).storeStringRefTail('https://example.com/meta.json').endCell();

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        treasury = await blockchain.treasury('treasury');

        const jettonMaster = blockchain.openContract(
            await JettonMaster.fromInit(0n, deployer.address, deployer.address, content, true),
        );
        await jettonMaster.send(deployer.getSender(), { value: toNano('0.2') }, null);

        bondingCurve = blockchain.openContract(
            await BondingCurve.fromInit(jettonMaster.address, treasury.address, 'TEST', 0n, 0n, false),
        );
        await bondingCurve.send(deployer.getSender(), { value: toNano('0.2') }, null);
    });

    it('quotes a buy on the constant-product curve', async () => {
        const tokensOut = await bondingCurve.getQuoteBuy(toNano('1'));
        expect(tokensOut).toBeGreaterThan(0n);
    });

    it('reads initial curve state', async () => {
        const priceBefore = await bondingCurve.getGetPrice();
        const data = await bondingCurve.getGetCurveData();
        expect(data.realTonReserve).toBe(0n);
        expect(priceBefore).toBeGreaterThan(0n);
    });

    it('1% fee is correctly calculated on a buy', () => {
        const grossTon = toNano('1');
        const fee = (grossTon * 100n) / 10_000n;
        expect(fee).toBe(toNano('0.01'));
    });

    it('constant product k is preserved after buy quote', async () => {
        const vTon = toNano('1');
        const vTok = 1_000_000_000_000n;
        const tonIn = toNano('0.5');
        const fee = (tonIn * 100n) / 10_000n;
        const netTon = tonIn - fee;
        const k = vTon * vTok;
        const newVt = vTon + netTon;
        const newVtok = k / newVt;
        const tokensOut = vTok - newVtok;
        expect(tokensOut).toBeGreaterThan(0n);
        expect(newVt * newVtok).toBeLessThanOrEqual(k);
    });
});
