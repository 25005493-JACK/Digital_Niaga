"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ONE_MAIN_STALLS } from "@/data/oneMainStalls";
import { Order, OrderStatus } from "@/types";
import { getOrdersByStall, subscribeToOrders, updateOrderStatus } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import {
  ChefHat,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  ChevronDown,
  ArrowLeft,
  Flame,
  Check,
  PackageCheck,
  Utensils,
} from "lucide-react";

export default function KitchenKDSPage() {
  const [selectedStallId, setSelectedStallId] = useState<string>("stall-01");
  useEffect(() => {
    const requestedStall = new URLSearchParams(window.location.search).get("stall");
    if (ONE_MAIN_STALLS.some((stall) => stall.id === requestedStall)) {
      setSelectedStallId(requestedStall!);
    }
  }, []);
  const currentStall = useMemo(
    () => ONE_MAIN_STALLS.find((s) => s.id === selectedStallId) || ONE_MAIN_STALLS[0],
    [selectedStallId]
  );

  const [orders, setOrders] = useState<Order[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filterTab, setFilterTab] = useState<"active" | "ready" | "all">("active");

  const seenOrderIdsRef = useRef<Set<string> | null>(null);

  // Play audio chime on new orders using Web Audio API (zero external assets needed)
  const playChime = useCallback(() => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
      osc.onended = () => { void audioCtx.close(); };
    } catch (e) {
      console.warn("Audio chime prevented by browser autoplay policy:", e);
    }
  }, [soundEnabled]);

  // Subscribe to real-time orders for current stall
  useEffect(() => {
    seenOrderIdsRef.current = null;
    const unsubscribe = subscribeToOrders(currentStall.id, (updated) => {
      const nextIds = new Set(updated.map((order) => order.id));
      if (seenOrderIdsRef.current && updated.some((order) => !seenOrderIdsRef.current!.has(order.id))) {
        playChime();
      }
      seenOrderIdsRef.current = nextIds;
      setOrders(updated);
    });

    return () => unsubscribe();
  }, [currentStall.id, playChime]);

  // Status update handler
  const handleStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, nextStatus);
      setOrders(getOrdersByStall(currentStall.id));
    } catch (error) {
      console.error("Could not update order status:", error);
    }
  };

  // Filter orders based on active tab
  const displayedOrders = useMemo(() => {
    if (filterTab === "active") {
      return orders.filter((o) => o.order_status === "pending" || o.order_status === "preparing");
    }
    if (filterTab === "ready") {
      return orders.filter((o) => o.order_status === "ready");
    }
    return orders; // "all"
  }, [orders, filterTab]);

  // Calculate elapsed minutes since order creation
  const getElapsedMinutes = (dateStr: string) => {
    const elapsedMs = Date.now() - new Date(dateStr).getTime();
    return Math.max(0, Math.floor(elapsedMs / (1000 * 60)));
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      {/* KDS Header */}
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
          <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-secondary bg-surface-subtle border border-line px-2.5 py-1 rounded-md">
            <ChefHat className="w-4 h-4" />
            Kitchen Display System (KDS)
          </span>
        </div>

        {/* Right Tools: Sound Alert Toggle & Stall Switcher */}
        <div className="flex items-center gap-2 w-full min-w-0 sm:w-auto sm:gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              soundEnabled
                ? "bg-accent-soft text-accent border-accent/30"
                : "bg-surface-subtle text-muted border-line"
            }`}
            title="Toggle Kitchen Chime"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-accent" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden md:inline">{soundEnabled ? "Chime On" : "Muted"}</span>
          </button>

          {/* Stall Switcher */}
          <div className="relative flex-1 min-w-0 sm:flex-none">
            <select
              aria-label="Select stall"
              value={selectedStallId}
              onChange={(e) => setSelectedStallId(e.target.value)}
              className="appearance-none w-full bg-surface border border-line text-accent text-xs sm:text-sm font-semibold py-1.5 pl-3 pr-8 rounded-lg outline-none focus:border-accent cursor-pointer sm:max-w-[360px]"
            >
              {ONE_MAIN_STALLS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.stall_number}: {s.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-accent absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          <Link
            href={`/pos?stall=${currentStall.id}`}
            className="shrink-0 px-3 py-1.5 rounded-lg border border-line bg-surface text-secondary hover:text-accent text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <CreditCard className="w-4 h-4 text-amber-700" />
            <span className="hidden md:inline">Cashier POS</span>
          </Link>
        </div>
      </header>

      {/* Tab Filter Bar */}
      <div className="px-4 sm:px-6 py-3 border-b border-line bg-surface-subtle flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilterTab("active")}
            className={`shrink-0 whitespace-nowrap px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
              filterTab === "active"
                ? "bg-accent text-white shadow"
                : "bg-surface text-muted hover:text-ink border border-line"
            }`}
          >
            <span className="sm:hidden">Live</span><span className="hidden sm:inline">Live Cooking Queue</span>
            <span className={`px-1.5 rounded-full text-[10px] font-bold ${filterTab === "active" ? "bg-white/20 text-white" : "bg-surface-subtle text-muted"}`}>
              {orders.filter((o) => o.order_status === "pending" || o.order_status === "preparing").length}
            </span>
          </button>

          <button
            onClick={() => setFilterTab("ready")}
            className={`shrink-0 whitespace-nowrap px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
              filterTab === "ready"
                ? "bg-emerald-700 text-white"
                : "bg-surface text-muted hover:text-ink border border-line"
            }`}
          >
            <span className="sm:hidden">Ready</span><span className="hidden sm:inline">Ready for Pickup</span>
            <span className={`px-1.5 rounded-full text-[10px] font-bold ${filterTab === "ready" ? "bg-white/20 text-white" : "bg-surface-subtle text-muted"}`}>
              {orders.filter((o) => o.order_status === "ready").length}
            </span>
          </button>

          <button
            onClick={() => setFilterTab("all")}
            className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
              filterTab === "all"
                ? "bg-surface-subtle text-ink"
                : "text-muted hover:text-ink"
            }`}
          >
            <span className="sm:hidden">All ({orders.length})</span><span className="hidden sm:inline">All Chits ({orders.length})</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-muted">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live order updates</span>
        </div>
      </div>

      {/* Responsive KDS Tickets Grid */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {displayedOrders.length === 0 ? (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="p-4 rounded-3xl bg-surface border border-line text-accent">
              <PackageCheck className="w-12 h-12 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-bold text-ink">
              Kitchen Queue is All Clear!
            </h3>
            <p className="text-xs text-muted max-w-sm">
              New chits punched in from the Cashier POS for{" "}
              <strong className="text-accent">{currentStall.name}</strong> will pop up here instantly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedOrders.map((order) => {
              const elapsed = getElapsedMinutes(order.created_at);
              const isUrgent = elapsed >= 10;
              const isPending = order.order_status === "pending";
              const isPreparing = order.order_status === "preparing";
              const isReady = order.order_status === "ready";
              const isCompleted = order.order_status === "completed";

              return (
                <div
                  key={order.id}
                  className={`rounded-2xl flex flex-col justify-between p-4 transition-all duration-200 shadow-sm border ${
                    isPending
                      ? "bg-surface border-amber-500/60 ring-1 ring-amber-500/30"
                      : isPreparing
                      ? "bg-surface border-accent/50"
                      : isReady
                      ? "bg-surface border-emerald-500/60"
                      : "bg-surface-subtle border-line opacity-60"
                  }`}
                >
                  {/* Top Bar of Ticket */}
                  <div>
                    <div className="flex items-center justify-between pb-2.5 border-b border-line">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xl font-bold text-ink">
                          {order.order_number}
                        </span>
                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                            isPending
                              ? "bg-amber-500/20 text-amber-700 border border-amber-500/40"
                              : isPreparing
                              ? "bg-accent-soft text-accent border border-accent/30"
                              : isReady
                              ? "bg-emerald-500/20 text-emerald-700 border border-emerald-500/40"
                              : "bg-surface-subtle text-muted"
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </div>

                      {/* Elapsed Timer */}
                      <span
                        className={`text-xs font-mono font-bold flex items-center gap-1 ${
                          isUrgent ? "text-rose-700 animate-pulse font-semibold" : "text-muted"
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        {elapsed}m ago
                      </span>
                    </div>

                    {/* Dining Type & Table */}
                    <div className="py-2 text-xs font-bold text-secondary flex items-center justify-between">
                      <span className="text-accent">
                        {order.order_type === "dine_in"
                          ? `Dine-in · Table ${order.table_number || "Open"}`
                          : "Takeaway"}
                      </span>
                      <span className="text-muted font-mono">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} items
                      </span>
                    </div>

                    {/* Ordered Items List */}
                    <div className="space-y-2 py-2 border-t border-line">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="bg-surface-subtle p-2.5 rounded-xl border border-line">
                          <div className="flex items-start justify-between text-sm">
                            <span className="font-semibold text-ink">
                              {item.name}
                            </span>
                            <span className="font-mono text-base font-bold text-accent ml-2">
                              {item.quantity}x
                            </span>
                          </div>
                          {item.notes && (
                            <div className="mt-1.5 p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-700 text-xs font-bold flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{item.notes}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Progression Buttons */}
                  <div className="pt-3 border-t border-line mt-3 space-y-2">
                    {isPending && (
                      <button
                        onClick={() => handleStatusChange(order.id, "preparing")}
                        className="w-full py-2.5 px-3 rounded-xl bg-accent hover:bg-accent text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                      >
                        <Flame className="w-4 h-4" />
                        <span>Start Cooking (Preparing)</span>
                      </button>
                    )}

                    {isPreparing && (
                      <button
                        onClick={() => handleStatusChange(order.id, "ready")}
                        className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                      >
                        <Check className="w-4 h-4" />
                        <span>Food Ready for Pickup!</span>
                      </button>
                    )}

                    {isReady && (
                      <button
                        onClick={() => handleStatusChange(order.id, "completed")}
                        className="w-full py-2.5 px-3 rounded-xl bg-surface-subtle hover:bg-line text-ink text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-line active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>Complete & Archive Chit</span>
                      </button>
                    )}

                    {isCompleted && (
                      <div className="text-center py-1 text-xs text-muted font-semibold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-muted" /> Completed
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
