const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require("playwright-core");

const browserPath = process.env.BROWSER_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const baseUrl = process.env.TEST_BASE_URL || "http://127.0.0.1:3087";

async function main() {
  if (!fs.existsSync(browserPath)) throw new Error(`Browser not found: ${browserPath}`);
  const browser = await chromium.launch({ executablePath: browserPath, headless: true });
  try {
    const context = await browser.newContext();
    const pos = await context.newPage();
    await pos.goto(`${baseUrl}/portal`);
    await pos.getByRole("button", { name: /Booth #03/ }).click();
    await pos.getByRole("link", { name: /Launch Cashier POS \(Booth #03\)/ }).click();
    await pos.waitForURL(/\/pos\?stall=stall-03/);
    await pos.waitForFunction(() => document.querySelector("select")?.value === "stall-03");

    const kitchen = await context.newPage();
    await kitchen.goto(`${baseUrl}/kitchen?stall=stall-03`);
    await kitchen.waitForFunction(() => document.querySelector("select")?.value === "stall-03");

    await pos.locator("section .grid button").first().click();
    await pos.getByRole("button", { name: /Collect Payment & Verify/ }).click();
    await pos.getByRole("button", { name: "Cash Payment" }).click();
    const confirm = pos.getByRole("button", { name: /Confirm Cash & Send Chit/ });
    assert.equal(await confirm.isDisabled(), true, "empty cash amount must not confirm");
    await pos.locator('input[type="number"]').fill("0");
    assert.equal(await confirm.isDisabled(), true, "insufficient cash must not confirm");
    await pos.locator('input[type="number"]').fill("100");
    assert.equal(await confirm.isEnabled(), true);
    await confirm.click();
    await pos.locator(".receipt-box").waitFor();

    const order = await pos.evaluate(() => {
      const orders = JSON.parse(localStorage.getItem("digital_niaga_orders_v1"));
      return orders[0];
    });
    assert.equal(order.stall_id, "stall-03");
    assert.equal(order.payment_method, "cash");
    assert.equal(order.order_status, "pending");

    await kitchen.getByText(order.order_number).waitFor();
    await kitchen.getByRole("button", { name: /Start Cooking/ }).click();

    const receipt = await context.newPage();
    await receipt.goto(`${baseUrl}/receipt/${order.id}`);
    await receipt.getByText("Kitchen is cooking your meal now...").waitFor();

    await kitchen.getByRole("button", { name: /Food Ready for Pickup/ }).click();
    await receipt.getByText("Your order is ready! Please pick up at the counter.").waitFor();
    console.log(`Browser flow passed: ${order.order_number} (${order.id})`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
