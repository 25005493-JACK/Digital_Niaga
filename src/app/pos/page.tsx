"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ONE_UTAMA_STALLS } from "@/data/oneUtamaStalls";
import { MenuItem, OrderItem, OrderType, PaymentMethod, Order } from "@/types";
import { createOrder, getOrdersByStall } from "@/lib/store";
import { formatCurrency, generateDailyOrderNumber } from "@/lib/utils";
import { QRPaymentModal } from "@/components/ui/QRPaymentModal";
import { ReceiptCard } from "@/components/ui/ReceiptCard";
import {
  CreditCard,
  Plus,
  Minus,
  Trash2,
  ChefHat,
  Store,
  ChevronDown,
  Receipt,
  RotateCcw,
  UtensilsCrossed,
  ArrowLeft,
  X,
  MessageSquare,
} from "lucide-react";

export default function CashierPOSPage() {
  // Current Stall Selection (Multi-tenant stall isolation)
  const [selectedStallId, setSelectedStallId] = useState<string>("stall-01");
  useEffect(() => {
    const requestedStall = new URLSearchParams(window.location.search).get("stall");
    if (ONE_UTAMA_STALLS.some((stall) => stall.id === requestedStall)) {
      setSelectedStallId(requestedStall!);
    }
  }, []);
  const currentStall = useMemo(
    () => ONE_UTAMA_STALLS.find((s) => s.id === selectedStallId) || ONE_UTAMA_STALLS[0],
    [selectedStallId]
  );

  // Active Category filter in POS
  const categories = useMemo(() => {
    const set = new Set(currentStall.menu.map((m) => m.category));
    return ["All Items", ...Array.from(set)];
  }, [currentStall]);
  const [activeCategory, setActiveCategory] = useState<string>("All Items");

  // Order state
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>("dine_in");
  const [tableNumber, setTableNumber] = useState<string>("");
  const [isNoteModalOpen, setIsNoteModalOpen] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState<string>("");

  // Payment & Receipt Modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Cart Calculations
  const totalAmount = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  // Filtered Menu Items
  const displayedItems = useMemo(() => {
    if (activeCategory === "All Items") return currentStall.menu;
    return currentStall.menu.filter((m) => m.category === activeCategory);
  }, [currentStall, activeCategory]);

  // Cart actions
  const addToCart = (menuItem: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.menu_item_id === menuItem.id && !i.notes);
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random()}`,
          menu_item_id: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const removeItem = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setTableNumber("");
  };

  const saveNote = (itemId: string) => {
    setCart((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, notes: noteInput.trim() || undefined } : i))
    );
    setIsNoteModalOpen(null);
    setNoteInput("");
  };

  // Finalize Order
  const handleConfirmPayment = async (paymentMethod: PaymentMethod) => {
    const orderNumber = generateDailyOrderNumber(
      getOrdersByStall(currentStall.id).map((order) => order.order_number)
    );
    const newOrder = await createOrder({
      stall_id: currentStall.id,
      order_number: orderNumber,
      order_type: orderType,
      table_number: orderType === "dine_in" ? tableNumber || "Open" : undefined,
      items: cart,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      payment_status: "verified",
      order_status: "pending",
      cashier_id: "cashier-01",
      cashier_name: "Staff Cashier",
    });

    setIsPaymentModalOpen(false);
    setCompletedOrder(newOrder);
    setCart([]);
    setTableNumber("");
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      {/* Top Bar */}
      <header className="glass-panel border-b border-line px-4 py-2.5 sm:px-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            className="p-1.5 rounded-xl bg-surface-subtle hover:bg-line text-secondary transition-colors"
            title="Back to Landing Page"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <BrandLogo size="sm" />
          <span className="hidden sm:inline-block h-4 w-px bg-line" />
          <span className="hidden sm:inline-block text-xs font-bold text-amber-700 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md">
            Cashier POS Mode
          </span>
        </div>

        {/* Stall Switcher Dropdown (Multi-stall isolation) */}
        <div className="flex items-center gap-2 w-full min-w-0 sm:w-auto">
          <div className="relative flex-1 min-w-0 sm:flex-none">
            <select
              aria-label="Select stall"
              value={selectedStallId}
              onChange={(e) => {
                setSelectedStallId(e.target.value);
                setCart([]);
                setTableNumber("");
                setActiveCategory("All Items");
              }}
              className="appearance-none w-full bg-surface border border-line text-accent text-xs sm:text-sm font-semibold py-1.5 pl-3 pr-8 rounded-lg outline-none focus:border-accent cursor-pointer sm:max-w-[360px]"
            >
              {ONE_UTAMA_STALLS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.stall_number}: {s.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-accent absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          <Link
            href={`/kitchen?stall=${currentStall.id}`}
            className="shrink-0 px-3 py-1.5 rounded-lg border border-line bg-surface text-secondary hover:text-accent text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ChefHat className="w-4 h-4 text-rose-700" />
            <span className="hidden md:inline">Switch to Kitchen KDS</span>
          </Link>
        </div>
      </header>

      {/* Main Responsive Grid: Menu Pad + Active Order Chit */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Menu Items Catalog */}
        <section className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-accent text-white"
                    : "bg-surface text-muted hover:text-ink border border-line"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Dishes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {displayedItems.map((item) => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                disabled={!item.is_available}
                className="group relative p-3 rounded-2xl bg-surface border border-line hover:border-accent/50 transition-all text-left flex flex-col justify-between active:scale-95 shadow-md"
              >
                <div>
                  <div className="h-28 sm:h-32 rounded-xl overflow-hidden mb-2 bg-surface-subtle relative">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.is_signature && (
                      <span className="absolute top-1.5 left-1.5 bg-amber-500/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                        SIGNATURE
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-ink group-hover:text-accent transition-colors line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-muted line-clamp-1 mt-0.5">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-line">
                  <span className="text-sm font-bold text-accent">
                    {formatCurrency(item.price)}
                  </span>
                  <div className="p-1 rounded-lg bg-accent-soft text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Right: Active Order Chit (Sidebar on PC, Bottom sheet on Mobile) */}
        <aside className="w-full lg:w-[380px] xl:w-[420px] bg-surface border-t lg:border-t-0 lg:border-l border-line flex flex-col justify-between p-4 sm:p-5 shrink-0 shadow-sm">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-accent" />
                <h3 className="font-bold text-sm sm:text-base text-ink">Current Order Ticket</h3>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-700 hover:text-rose-700 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            {/* Order Type Toggle (Dine-in vs Takeaway) */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-surface-subtle rounded-xl border border-line">
              <button
                type="button"
                onClick={() => setOrderType("dine_in")}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  orderType === "dine_in"
                    ? "bg-accent text-white shadow"
                    : "text-muted hover:text-ink"
                }`}
              >
                Dine-in
              </button>
              <button
                type="button"
                onClick={() => setOrderType("takeaway")}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  orderType === "takeaway"
                    ? "bg-accent text-white shadow"
                    : "text-muted hover:text-ink"
                }`}
              >
                Takeaway
              </button>
            </div>

            {/* Table Number Input if Dine-in */}
            {orderType === "dine_in" && (
              <div className="flex items-center gap-2 bg-surface-subtle px-3 py-2 rounded-xl border border-line">
                <span className="text-xs font-semibold text-muted shrink-0">
                  Table No:
                </span>
                <input
                  type="text"
                  placeholder="e.g. T-04 or Table 12"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm font-bold text-accent outline-none w-full"
                />
              </div>
            )}

            {/* Cart Items List */}
            <div className="max-h-[30vh] lg:max-h-[42vh] overflow-y-auto space-y-2 pr-1">
              {cart.length === 0 ? (
                <div className="py-12 text-center text-muted text-xs sm:text-sm">
                  Cart is empty. Tap items on the menu pad to add to this chit.
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-surface-subtle border border-line flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-ink truncate">{item.name}</p>
                      <p className="text-accent font-mono">{formatCurrency(item.price)}</p>
                      {item.notes ? (
                        <p className="text-[11px] text-amber-700 truncate mt-0.5">
                          Note: {item.notes}
                        </p>
                      ) : null}
                    </div>

                    {/* Quantity controls & note button */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setIsNoteModalOpen(item.id);
                          setNoteInput(item.notes || "");
                        }}
                        title="Add cooking note"
                        className={`p-1.5 rounded-lg border transition-colors ${
                          item.notes
                            ? "bg-amber-500/20 text-amber-700 border-amber-500/40"
                            : "bg-surface-subtle text-muted border-line hover:text-ink"
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center bg-surface-subtle rounded-lg border border-line">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:text-rose-700 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 font-mono font-bold text-ink">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:text-accent transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-muted hover:text-rose-700 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bottom Summary & Checkout Button */}
          <div className="pt-4 border-t border-line space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted font-medium">Subtotal ({cart.length} items)</span>
              <span className="text-xl font-bold text-ink font-mono">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            <button
              onClick={() => setIsPaymentModalOpen(true)}
              disabled={cart.length === 0}
              className="w-full py-3.5 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard className="w-4 h-4" />
              <span>Collect Payment & Verify ({formatCurrency(totalAmount)})</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Cooking Note Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/45 backdrop-blur-sm">
          <div className="bg-surface border border-line rounded-2xl p-5 max-w-sm w-full space-y-3">
            <h4 className="text-sm font-bold text-ink flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-700" />
              Kitchen Cooking Note
            </h4>
            <input
              type="text"
              placeholder="e.g. Less spicy, No onions, Extra gravy"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              className="w-full bg-surface-subtle border border-line rounded-xl px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNoteModalOpen(null)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-muted hover:bg-surface-subtle"
              >
                Cancel
              </button>
              <button
                onClick={() => saveNote(isNoteModalOpen)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-accent hover:bg-accent-hover"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DuitNow QR & Cash Payment Verification Modal */}
      {isPaymentModalOpen && (
        <QRPaymentModal
          stall={currentStall}
          items={cart}
          totalAmount={totalAmount}
          orderType={orderType}
          tableNumber={tableNumber}
          onConfirmOrder={handleConfirmPayment}
          onClose={() => setIsPaymentModalOpen(false)}
        />
      )}

      {/* Completed Order Digital Receipt Modal */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/45 backdrop-blur-sm">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setCompletedOrder(null)}
              className="absolute -top-12 right-0 p-2 rounded-full glass-panel text-secondary hover:text-ink"
            >
              <X className="w-5 h-5" />
            </button>
            <ReceiptCard order={completedOrder} stall={currentStall} />
          </div>
        </div>
      )}
    </div>
  );
}
