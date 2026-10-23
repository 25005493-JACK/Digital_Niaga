"use client";

import { Order, OrderStatus } from "@/types";

const STORAGE_KEY = "digital_niaga_orders_v1";
const BROADCAST_CHANNEL = "digital_niaga_channel";

// Initial seed orders for demonstration
const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: "ord-101",
    stall_id: "stall-01", // Ah Kow Chicken Rice
    order_number: "#A101",
    order_type: "dine_in",
    table_number: "T-04",
    items: [
      {
        id: "item-1",
        menu_item_id: "m01-1",
        name: "Signature Steamed Chicken Rice",
        price: 11.50,
        quantity: 2,
        notes: "Extra chili paste",
      },
      {
        id: "item-2",
        menu_item_id: "m01-3",
        name: "Ipoh Bean Sprouts with Crispy Shallots",
        price: 6.00,
        quantity: 1,
      },
    ],
    total_amount: 29.00,
    payment_method: "duitnow_qr",
    payment_status: "verified",
    order_status: "preparing",
    cashier_id: "cashier-01",
    cashier_name: "Alvin Tan (Cashier)",
    created_at: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "ord-102",
    stall_id: "stall-01",
    order_number: "#A102",
    order_type: "takeaway",
    items: [
      {
        id: "item-3",
        menu_item_id: "m01-2",
        name: "Crispy Roasted Chicken Rice",
        price: 11.50,
        quantity: 1,
        notes: "Soup packed separately",
      },
    ],
    total_amount: 11.50,
    payment_method: "cash",
    payment_status: "verified",
    order_status: "pending",
    cashier_id: "cashier-01",
    cashier_name: "Alvin Tan (Cashier)",
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "ord-103",
    stall_id: "stall-02", // Penang CKT
    order_number: "#A103",
    order_type: "dine_in",
    table_number: "T-12",
    items: [
      {
        id: "item-4",
        menu_item_id: "m02-1",
        name: "Special Duck Egg Char Kuey Teow",
        price: 13.90,
        quantity: 1,
        notes: "No cockles (alergi)",
      },
    ],
    total_amount: 13.90,
    payment_method: "duitnow_qr",
    payment_status: "verified",
    order_status: "pending",
    cashier_id: "cashier-02",
    cashier_name: "Mei Ling (Cashier)",
    created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Helper to get all stored orders
export function getStoredOrders(): Order[] {
  if (typeof window === "undefined") return INITIAL_DEMO_ORDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_ORDERS));
      return INITIAL_DEMO_ORDERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_ORDERS;
  }
}

// Helper to save orders and broadcast changes across tabs/windows
export function saveOrders(orders: Order[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error("Failed to save orders:", err);
    return false;
  }
  try {
    if ("BroadcastChannel" in window) {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL);
      channel.postMessage({ type: "SYNC_ORDERS", orders });
      channel.close();
    }
  } catch (err) {
    console.warn("Order broadcast failed; storage sync remains available:", err);
  }
  return true;
}

// Get orders filtered by stall ID (Multi-tenant stall isolation)
export function getOrdersByStall(stallId: string): Order[] {
  const all = getStoredOrders();
  return all.filter((o) => o.stall_id === stallId);
}

// Find single order by ID
export function getOrderById(orderId: string): Order | undefined {
  const all = getStoredOrders();
  return all.find((o) => o.id === orderId);
}

// Add a new order (Cashier -> Kitchen)
export async function createOrder(orderData: Omit<Order, "id" | "created_at" | "updated_at">): Promise<Order> {
  const newOrder: Order = {
    ...orderData,
    id: `ord-${crypto.randomUUID()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const current = getStoredOrders();
  const updated = [newOrder, ...current];
  if (!saveOrders(updated)) throw new Error("The order could not be saved locally.");

  return newOrder;
}

// Update order status (Kitchen -> Cashier)
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
  const current = getStoredOrders();
  const index = current.findIndex((o) => o.id === orderId);
  if (index === -1) return null;

  current[index] = {
    ...current[index],
    order_status: status,
    updated_at: new Date().toISOString(),
  };

  if (!saveOrders([...current])) throw new Error("The order status could not be saved locally.");

  return current[index];
}

// Hook-like subscription for real-time order listening
export function subscribeToOrders(stallId: string, onUpdate: (orders: Order[]) => void) {
  if (typeof window === "undefined") return () => {};

  // Initial call
  onUpdate(getOrdersByStall(stallId));

  // 1. BroadcastChannel for cross-tab realtime sync
  let channel: BroadcastChannel | null = null;
  if ("BroadcastChannel" in window) {
    channel = new BroadcastChannel(BROADCAST_CHANNEL);
    channel.onmessage = (event) => {
      if (event.data?.type === "SYNC_ORDERS" && Array.isArray(event.data.orders)) {
        const filtered = event.data.orders.filter((o: Order) => o.stall_id === stallId);
        onUpdate(filtered);
      }
    };
  }

  // 2. Storage event listener for fallback browser support
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed: Order[] = JSON.parse(e.newValue);
        onUpdate(parsed.filter((o) => o.stall_id === stallId));
      } catch (err) {
        console.error(err);
      }
    }
  };
  window.addEventListener("storage", handleStorage);

  return () => {
    if (channel) channel.close();
    window.removeEventListener("storage", handleStorage);
  };
}
