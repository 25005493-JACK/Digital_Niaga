"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ONE_UTAMA_STALLS } from "@/data/oneUtamaStalls";
import { Order, Stall } from "@/types";
import { getStoredOrders, subscribeToOrders } from "@/lib/store";
import { ReceiptCard } from "@/components/ui/ReceiptCard";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ArrowLeft, Clock, CheckCircle2, Flame, Loader2 } from "lucide-react";

export default function PublicReceiptPage() {
  const params = useParams();
  const orderId = params?.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    // Look up initial order
    const all = getStoredOrders();
    const found = all.find((o) => o.id === orderId);
    if (found) {
      setOrder(found);
      // Subscribe to real-time status updates on this order
      const unsub = subscribeToOrders(found.stall_id, (updated) => {
        const current = updated.find((o) => o.id === orderId);
        if (current) setOrder(current);
      });
      setLoading(false);
      return () => unsub();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const stall: Stall | undefined = order
    ? ONE_UTAMA_STALLS.find((s) => s.id === order.stall_id) || ONE_UTAMA_STALLS[0]
    : undefined;

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col justify-between p-4 sm:p-6">
      <header className="max-w-md mx-auto w-full flex items-center justify-between pb-6">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to 1 Utama Food District
        </Link>
        <BrandLogo size="sm" />
      </header>

      <main className="max-w-md mx-auto w-full space-y-4">
        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-teal-400" />
            Loading digital receipt...
          </div>
        ) : !order || !stall ? (
          <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <h3 className="text-lg font-bold text-slate-200">Receipt Not Found</h3>
            <p className="text-xs text-slate-400">
              The requested order chit ({orderId}) could not be located.
            </p>
            <Link
              href="/"
              className="inline-block mt-2 px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs"
            >
              Browse Stalls
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Live Status Tracker Pill */}
            <div
              className={`p-4 rounded-2xl border flex items-center gap-3 ${
                order.order_status === "ready"
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                  : order.order_status === "preparing"
                  ? "bg-teal-500/10 border-teal-500/40 text-teal-300"
                  : "bg-amber-500/10 border-amber-500/40 text-amber-300"
              }`}
            >
              {order.order_status === "ready" ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              ) : order.order_status === "preparing" ? (
                <Flame className="w-6 h-6 text-teal-400 shrink-0 animate-bounce" />
              ) : (
                <Clock className="w-6 h-6 text-amber-400 shrink-0 animate-pulse" />
              )}
              <div>
                <p className="text-xs uppercase font-extrabold tracking-wider">
                  Live Cooking Status
                </p>
                <p className="text-base font-black">
                  {order.order_status === "ready"
                    ? "Your order is ready! Please pick up at the counter."
                    : order.order_status === "preparing"
                    ? "Kitchen is cooking your meal now..."
                    : "Order received by kitchen (Pending)"}
                </p>
              </div>
            </div>

            {/* Render Receipt Card */}
            <ReceiptCard order={order} stall={stall} />
          </div>
        )}
      </main>

      <footer className="text-center text-xs text-slate-500 py-6">
        Digital Niaga • Digital E-Receipt Verification
      </footer>
    </div>
  );
}
