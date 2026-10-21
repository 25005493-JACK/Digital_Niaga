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
  QrCode,
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

  const handleCopy = () => {
    navigator.clipboard.writeText(receiptUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="receipt-box w-full max-w-md mx-auto bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col gap-5">
      {/* Receipt Header */}
      <div className="text-center pb-4 border-b border-dashed border-slate-700">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-mono font-bold border border-teal-500/30 mb-2">
          {stall.stall_number} • 1 Utama Food District
        </div>
        <h2 className="text-xl font-black text-white">{stall.name}</h2>
        <p className="text-xs text-slate-400 mt-0.5">{stall.contact_phone}</p>

        {/* Order Number Banner */}
        <div className="mt-4 p-3 bg-slate-950 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-extrabold tracking-widest uppercase text-slate-400">
            Order Chit Number
          </div>
          <div className="text-3xl font-black text-teal-400 tracking-tight font-mono">
            {order.order_number}
          </div>
          <div className="text-xs font-medium text-slate-300 mt-1 flex items-center justify-center gap-2">
            <span className="capitalize font-bold text-amber-300">
              {order.order_type === "dine_in"
                ? `Dine-In • Table ${order.table_number || "Open"}`
                : "Takeaway / Bungkus"}
            </span>
          </div>
        </div>
      </div>

      {/* Meta timestamps */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-teal-400" />
          {new Date(order.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <span>Cashier: {order.cashier_name}</span>
      </div>

      {/* Line Items */}
      <div className="space-y-2.5 py-2 border-y border-dashed border-slate-700">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-start justify-between text-xs">
            <div className="flex items-start gap-2">
              <span className="font-mono font-bold text-teal-400 bg-slate-800 px-1.5 py-0.5 rounded">
                {item.quantity}x
              </span>
              <div>
                <p className="font-semibold text-slate-100">{item.name}</p>
                {item.notes && (
                  <p className="text-[11px] text-amber-300/90 font-medium">
                    Note: {item.notes}
                  </p>
                )}
              </div>
            </div>
            <span className="font-bold text-slate-200">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Totals & Payment Status */}
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between text-slate-300">
          <span>Subtotal</span>
          <span>{formatCurrency(order.total_amount)}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>SST / Tax (Included)</span>
          <span>RM 0.00</span>
        </div>
        <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
          <span>Total Paid</span>
          <span className="text-teal-400 font-mono">
            {formatCurrency(order.total_amount)}
          </span>
        </div>

        {/* Verification Status Pill */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Payment: {order.payment_method === "duitnow_qr" ? "DuitNow QR" : "Cash"}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Payment Verified
          </span>
        </div>
      </div>

      {/* Digital Receipt QR for customer phone scan */}
      <div className="no-print p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-3">
        <div className="p-1.5 bg-white rounded-xl shrink-0">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
              receiptUrl
            )}`}
            alt="Receipt QR"
            className="w-14 h-14"
          />
        </div>
        <div className="text-[11px]">
          <p className="font-bold text-slate-200">Customer Digital Copy</p>
          <p className="text-slate-400 mt-0.5">
            Scan with phone camera or tap share to keep digital receipt.
          </p>
        </div>
      </div>

      {/* Actions (Print & Share) */}
      <div className="no-print grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={handlePrint}
          className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-slate-700"
        >
          <Printer className="w-4 h-4 text-teal-400" />
          <span>Print Receipt</span>
        </button>

        <button
          onClick={handleCopy}
          className="py-2.5 px-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow"
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? "Link Copied!" : "Share Receipt"}</span>
        </button>
      </div>
    </div>
  );
};
