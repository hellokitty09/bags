#!/usr/bin/env tsx
import "dotenv/config";
import { registerWebhook, listWebhooks, deleteWebhook } from "../apps/web/lib/helius";

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (cmd === "list") {
    const hooks = await listWebhooks();
    console.log(JSON.stringify(hooks, null, 2));
    return;
  }

  if (cmd === "delete") {
    const id = args[1];
    if (!id) throw new Error("usage: delete <webhookID>");
    await deleteWebhook(id);
    console.log(`deleted ${id}`);
    return;
  }

  const mint = cmd;
  if (!mint) {
    console.error(
      "usage: register-helius-webhook.ts <mint>\n       register-helius-webhook.ts list\n       register-helius-webhook.ts delete <id>",
    );
    process.exit(1);
  }

  const base = process.env.NEXT_PUBLIC_APP_URL;
  if (!base) throw new Error("NEXT_PUBLIC_APP_URL must be set");
  const secret = process.env.HELIUS_WEBHOOK_SECRET;
  if (!secret) throw new Error("HELIUS_WEBHOOK_SECRET must be set");

  const result = await registerWebhook({
    webhookUrl: `${base}/api/webhooks/helius`,
    accountAddresses: [mint],
    transactionTypes: ["SWAP", "TRANSFER", "NFT_SALE"],
    authHeader: secret,
  });

  console.log(`registered webhook ${result.webhookID} for mint ${mint}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
