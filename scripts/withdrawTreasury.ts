import { Address, toNano } from "@ton/core";
import { NetworkProvider } from "@ton/blueprint";
import { Treasury } from "../build/Treasury/tact_Treasury";

export async function run(provider: NetworkProvider) {
  const ui = provider.ui();
  const sender = provider.sender().address;
  if (!sender) { ui.write("Connect a wallet first."); return; }

  const treasuryAddr = await ui.input("Treasury address");
  const treasury = provider.open(Treasury.fromAddress(Address.parse(treasuryAddr)));

  const data = await treasury.getGetTreasuryData();
  ui.write(`Balance: ${data.balance} nanoTON  |  Total collected: ${data.totalCollected}  |  Fees: ${data.feeCount}`);

  const amountStr = await ui.input("Amount to withdraw (TON, e.g. 5)");
  const amount = toNano(amountStr);

  await treasury.send(
    provider.sender(),
    { value: toNano("0.05") },
    {
      $$type: "TreasuryWithdraw",
      queryId: BigInt(Date.now()),
      amount,
      destination: sender,
    }
  );

  ui.write(`Withdrawal of ${amountStr} TON sent to ${sender.toString()}`);
}
