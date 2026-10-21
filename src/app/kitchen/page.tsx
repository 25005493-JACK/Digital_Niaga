"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ONE_UTAMA_STALLS } from "@/data/oneUtamaStalls";
import { Order, OrderStatus } from "@/types";
import { subscribeToOrders, updateOrderStatus } from "@/lib/store";
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
  const currentStall = useMemo(
    () => ONE_UTAMA_STALLS.find((s) => s.id === selectedStallId) || ONE_UTAMA_STALLS[0],
    [selectedStallId]
  );

  const [orders, setOrders] = useState<Order[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filterTab, setFilterTab] = useState<"active" | "ready" | "all">("active");

  const prevOrderCountRef = useRef<number>(0);

  // Play audio chime on new orders using Web Audio API (zero external assets needed)
  const playChime = () => {
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
    } catch (e) {
      console.warn("Audio chime prevented by browser autoplay policy:", e);
    }
  };

  // Subscribe to real-time orders for current stall
  useEffect(() => {
    const unsubscribe = subscribeToOrders(currentStall.id, (updated) => {
      // Trigger chime if a new order arrives
      if (prevOrderCountRef.current > 0 && updated.length > prevOrderCountRef.current) {
        playChime();
      }
      prevOrderCountRef.current = updated.length;
      setOrders(updated);
    });

    return () => unsubscribe();
  }, [currentStall.id, soundEnabled]);

  // Status update handler
  const handleStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    await updateOrderStatus(orderId, nextStatus);
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
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      {/* KDS Header */}
      <header className="glass-panel border-b border-slate-800 px-4 py-3 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Back to Landing Page"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <BrandLogo size="sm" />
          <span className="hidden sm:inline-block h-4 w-px bg-slate-700" />
          <span className="flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded-md">
            <ChefHat className="w-4 h-4" />
            Kitchen Display System (KDS)
          </span>
        </div>

        {/* Right Tools: Sound Alert Toggle & Stall Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              soundEnabled
                ? "bg-teal-500/10 text-teal-300 border-teal-500/30"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
            title="Toggle Kitchen Chime"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-teal-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden md:inline">{soundEnabled ? "Chime On" : "Muted"}</span>
          </button>

          {/* Stall Switcher */}
          <div className="relative">
            <select
              value={selectedStallId}
              onChange={(e) => setSelectedStallId(e.target.value)}
              className="appearance-none bg-slate-900 border border-slate-700 text-teal-300 text-xs sm:text-sm font-bold py-1.5 pl-3 pr-8 rounded-xl outline-none focus:border-teal-400 cursor-pointer shadow-md"
            >
              {ONE_UTAMA_STALLS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.stall_number}: {s.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-teal-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          <Link
            href="/pos"
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Cashier POS</span>
          </Link>
        </div>
      </header>

      {/* Tab Filter Bar */}
      <div className="px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterTab("active")}
            className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              filterTab === "active"
                ? "bg-teal-500 text-slate-950 shadow"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <span>Live Cooking Queue</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900/30 font-black">
              {orders.filter((o) => o.order_status === "pending" || o.order_status === "preparing").length}
            </span>
          </button>

          <button
            onClick={() => setFilterTab("ready")}
            className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              filterTab === "ready"
                ? "bg-emerald-500 text-slate-950 shadow"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <span>Ready for Pickup</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900/30 font-black">
              {orders.filter((o) => o.order_status === "ready").length}
            </span>
          </button>

          <button
            onClick={() => setFilterTab("all")}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              filterTab === "all"
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All Chits ({orders.length})
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Realtime WebSocket Connected</span>
        </div>
      </div>

      {/* Responsive KDS Tickets Grid */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {displayedOrders.length === 0 ? (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 text-teal-400">
              <PackageCheck className="w-12 h-12 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">
              Kitchen Queue is All Clear!
            </h3>
            <p className="text-xs text-slate-400 max-w-sm">
              New chits punched in from the Cashier POS for{" "}
              <strong className="text-teal-300">{currentStall.name}</strong> will pop up here instantly.
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
                  className={`rounded-2xl flex flex-col justify-between p-4 transition-all duration-200 shadow-xl border ${
                    isPending
                      ? "bg-slate-900 border-amber-500/60 ring-1 ring-amber-500/30"
                      : isPreparing
                      ? "bg-slate-900 border-teal-500/60"
                      : isReady
                      ? "bg-slate-900 border-emerald-500/60"
                      : "bg-slate-950/60 border-slate-800 opacity-60"
                  }`}
                >
                  {/* Top Bar of Ticket */}
                  <div>
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xl font-black text-white">
                          {order.order_number}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            isPending
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              : isPreparing
                              ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                              : isReady
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </div>

                      {/* Elapsed Timer */}
                      <span
                        className={`text-xs font-mono font-bold flex items-center gap-1 ${
                          isUrgent ? "text-rose-400 animate-pulse font-extrabold" : "text-slate-400"
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        {elapsed}m ago
                      </span>
                    </div>

                    {/* Dining Type & Table */}
                    <div className="py-2 text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span className="text-teal-300">
                        {order.order_type === "dine_in"
                          ? `🍽️ Dine-in (Table ${order.table_number || "Open"})`
                          : "🥡 Takeaway / Bungkus"}
                      </span>
                      <span className="text-slate-400 font-mono">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} items
                      </span>
                    </div>

                    {/* Ordered Items List */}
                    <div className="space-y-2 py-2 border-t border-slate-800/80">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                          <div className="flex items-start justify-between text-sm">
                            <span className="font-extrabold text-white">
                              {item.name}
                            </span>
                            <span className="font-mono text-base font-black text-teal-400 ml-2">
                              {item.quantity}x
                            </span>
                          </div>
                          {item.notes && (
                            <div className="mt-1.5 p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{item.notes}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Progression Buttons */}
                  <div className="pt-3 border-t border-slate-800 mt-3 space-y-2">
                    {isPending && (
                      <button
                        onClick={() => handleStatusChange(order.id, "preparing")}
                        className="w-full py-2.5 px-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                      >
                        <Flame className="w-4 h-4" />
                        <span>Start Cooking (Preparing)</span>
                      </button>
                    )}

                    {isPreparing && (
                      <button
                        onClick={() => handleStatusChange(order.id, "ready")}
                        className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                      >
                        <Check className="w-4 h-4" />
                        <span>Food Ready for Pickup!</span>
                      </button>
                    )}

                    {isReady && (
                      <button
                        onClick={() => handleStatusChange(order.id, "completed")}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-slate-700 active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Complete & Archive Chit</span>
                      </button>
                    )}

                    {isCompleted && (
                      <div className="text-center py-1 text-xs text-slate-500 font-semibold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" /> Completed
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
