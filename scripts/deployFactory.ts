import { Address, toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { Factory } from '../build/Factory/tact_Factory';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    const owner = provider.sender().address;
    if (!owner) {
        ui.write('Connect a wallet first.');
        return;
    }

    const treasuryInput = await ui.input('Treasury address');
    const treasury = Address.parse(treasuryInput);

    const factory = provider.open(await Factory.fromInit(owner, treasury, 0n));

    await factory.send(provider.sender(), { value: toNano('0.2') }, null);

    await provider.waitForDeploy(factory.address);
    ui.write(`Factory deployed: ${factory.address.toString()}`);
}
