import { Address, toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { Treasury } from '../build/Treasury/tact_Treasury';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    const owner = provider.sender().address;
    if (!owner) {
        ui.write('Connect a wallet with TON Connect or mnemonic.');
        return;
    }

    const treasury = provider.open(await Treasury.fromInit(owner, 0n, 0n));

    await treasury.send(provider.sender(), { value: toNano('0.1') }, null);

    await provider.waitForDeploy(treasury.address);
    ui.write(`Treasury deployed: ${treasury.address.toString()}`);
}
