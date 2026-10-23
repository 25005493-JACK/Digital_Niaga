const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const { webcrypto } = require("node:crypto");

function loadTypeScript(file, dependencies, globals = {}) {
  const source = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    require: (id) => {
      if (!(id in dependencies)) throw new Error(`Unexpected dependency: ${id}`);
      return dependencies[id];
    },
    console,
    crypto: webcrypto,
    ...globals,
  }, { filename: file });
  return exports;
}

function createStore() {
  const values = new Map();
  const listeners = new Map();
  const localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  class BroadcastChannel {
    constructor() { this.onmessage = null; BroadcastChannel.channels.add(this); }
    postMessage(message) {
      for (const channel of BroadcastChannel.channels) {
        if (channel !== this) channel.onmessage?.({ data: message });
      }
    }
    close() { BroadcastChannel.channels.delete(this); }
  }
  BroadcastChannel.channels = new Set();
  const window = {
    BroadcastChannel,
    addEventListener: (name, callback) => listeners.set(name, callback),
    removeEventListener: (name) => listeners.delete(name),
  };
  const store = loadTypeScript("src/lib/store.ts", {
    "./supabase": { isSupabaseConfigured: () => false, supabase: {} },
  }, { window, localStorage, BroadcastChannel, console: { error() {}, warn() {} } });
  return { store, localStorage, values, listeners };
}

test("order numbers advance within a day and ignore older formats", () => {
  const { generateDailyOrderNumber } = loadTypeScript("src/lib/utils.ts", {
    clsx: { clsx: () => "" },
    "tailwind-merge": { twMerge: (value) => value },
  });
  const first = generateDailyOrderNumber([]);
  assert.match(first, /^#A\d{8}-001$/);
  const second = generateDailyOrderNumber([first, "#A101"]);
  assert.equal(second, `${first.slice(0, -3)}002`);
});

test("orders have unique IDs and stay isolated by stall", async () => {
  const { store } = createStore();
  const base = {
    order_number: "#A001", order_type: "takeaway",
    items: [{ id: "item", menu_item_id: "menu", name: "Meal", price: 12, quantity: 1 }],
    total_amount: 12, payment_method: "cash", payment_status: "verified",
    order_status: "pending", cashier_id: "cashier", cashier_name: "Cashier",
  };
  const first = await store.createOrder({ ...base, stall_id: "stall-01" });
  const second = await store.createOrder({ ...base, stall_id: "stall-02" });
  assert.notEqual(first.id, second.id);
  assert.equal(store.getOrdersByStall("stall-01").some((order) => order.id === second.id), false);
  assert.equal(store.getOrdersByStall("stall-02").some((order) => order.id === second.id), true);
  await store.updateOrderStatus(first.id, "ready");
  assert.equal(store.getOrderById(first.id).order_status, "ready");
});

test("order subscribers receive cross-tab updates and stop after unsubscribe", async () => {
  const { store } = createStore();
  const snapshots = [];
  const unsubscribe = store.subscribeToOrders("stall-02", (orders) => snapshots.push(orders));
  assert.equal(snapshots.length, 1);
  const order = await store.createOrder({
    stall_id: "stall-02", order_number: "#A002", order_type: "takeaway", items: [],
    total_amount: 1, payment_method: "cash", payment_status: "verified",
    order_status: "pending", cashier_id: "cashier", cashier_name: "Cashier",
  });
  assert.equal(snapshots.at(-1).some((item) => item.id === order.id), true);
  const count = snapshots.length;
  unsubscribe();
  await store.updateOrderStatus(order.id, "preparing");
  assert.equal(snapshots.length, count);
});

test("failed local persistence rejects checkout", async () => {
  const { store, localStorage } = createStore();
  localStorage.setItem = () => { throw new Error("quota exceeded"); };
  await assert.rejects(store.createOrder({
    stall_id: "stall-01", order_number: "#A003", order_type: "takeaway", items: [],
    total_amount: 1, payment_method: "cash", payment_status: "verified",
    order_status: "pending", cashier_id: "cashier", cashier_name: "Cashier",
  }), /could not be saved locally/);
});
