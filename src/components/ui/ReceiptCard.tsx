"use client";

import React, { useState } from "react";
import { Order, Stall } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  Printer,
  Share2,
  Check,
  CheckCircle2,
  Utensils,
  Store,
  Clock,
} from "lucide-react";

interface ReceiptCardProps {
  order: Order;
  stall: Stall;
}

export const ReceiptCard: React.FC<ReceiptCardProps> = ({ order, stall }) => {
  const [copied, setCopied] = useState(false);

  const receiptUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/receipt/${order.id}`
      : `/receipt/${order.id}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(receiptUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Could not copy receipt link:", error);
    }
  };

  return (
    <div className="receipt-box w-full max-w-md mx-auto bg-surface border border-line rounded-3xl p-6 shadow-sm text-ink flex flex-col gap-5">
      {/* Receipt Header */}
      <div className="text-center pb-4 border-b border-dashed border-line">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-mono font-bold border border-accent/30 mb-2">
          {stall.stall_number} • 1Main Food District
        </div>
        <h2 className="text-xl font-bold text-ink">{stall.name}</h2>
        <p className="text-xs text-muted mt-0.5">{stall.contact_phone}</p>

        {/* Order Number Banner */}
        <div className="mt-4 p-3 bg-surface-subtle rounded-2xl border border-line">
          <div className="text-[10px] font-semibold tracking-widest uppercase text-muted">
            Order Chit Number
          </div>
          <div className="text-3xl font-bold text-accent tracking-tight font-mono">
            {order.order_number}
          </div>
          <div className="text-xs font-medium text-secondary mt-1 flex items-center justify-center gap-2">
            <span className="capitalize font-bold text-amber-700">
              {order.order_type === "dine_in"
                ? `Dine-In • Table ${order.table_number || "Open"}`
                : "Takeaway / Bungkus"}
            </span>
          </div>
        </div>
      </div>

      {/* Meta timestamps */}
      <div className="flex items-center justify-between text-xs text-muted">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-accent" />
          {new Date(order.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <span>Cashier: {order.cashier_name}</span>
      </div>

      {/* Line Items */}
      <div className="space-y-2.5 py-2 border-y border-dashed border-line">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-start justify-between text-xs">
            <div className="flex items-start gap-2">
              <span className="font-mono font-bold text-accent bg-surface-subtle px-1.5 py-0.5 rounded">
                {item.quantity}x
              </span>
              <div>
                <p className="font-semibold text-ink">{item.name}</p>
                {item.notes && (
                  <p className="text-[11px] text-amber-700 font-medium">
                    Note: {item.notes}
                  </p>
                )}
              </div>
            </div>
            <span className="font-bold text-ink">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Totals & Payment Status */}
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between text-secondary">
          <span>Subtotal</span>
          <span>{formatCurrency(order.total_amount)}</span>
        </div>
        <div className="flex justify-between text-secondary">
          <span>SST / Tax (Included)</span>
          <span>RM 0.00</span>
        </div>
        <div className="flex justify-between text-base font-bold text-ink pt-2 border-t border-line">
          <span>{order.payment_method === "duitnow_qr" ? "Demo Total" : "Total Paid"}</span>
          <span className="text-accent font-mono">
            {formatCurrency(order.total_amount)}
          </span>
        </div>

        {/* Verification Status Pill */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-[11px] text-muted">
            Payment: {order.payment_method === "duitnow_qr" ? "Simulated QR" : "Cash"}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> {order.payment_method === "duitnow_qr" ? "Demo Payment" : "Payment Confirmed"}
          </span>
        </div>
      </div>

      <p className="no-print text-xs text-muted">
        Receipt links work only in the browser profile that created the order.
      </p>

      {/* Actions (Print & Share) */}
      <div className="no-print grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={handlePrint}
          className="py-2.5 px-3 rounded-xl bg-surface-subtle hover:bg-line text-ink text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-line"
        >
          <Printer className="w-4 h-4 text-accent" />
          <span>Print Receipt</span>
        </button>

        <button
          onClick={handleCopy}
          className="py-2.5 px-3 rounded-xl bg-accent hover:bg-accent text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow"
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? "Link Copied!" : "Copy Receipt Link"}</span>
        </button>
      </div>
    </div>
  );
};
