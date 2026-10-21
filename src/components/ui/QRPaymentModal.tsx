"use client";

import React, { useState } from "react";
import { Stall, OrderItem, PaymentMethod } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  X,
  QrCode,
  Banknote,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  Receipt,
} from "lucide-react";
import confetti from "canvas-confetti";

interface QRPaymentModalProps {
  stall: Stall;
  items: OrderItem[];
  totalAmount: number;
  orderType: "dine_in" | "takeaway";
  tableNumber?: string;
  onConfirmOrder: (paymentMethod: PaymentMethod) => Promise<void>;
  onClose: () => void;
}

export const QRPaymentModal: React.FC<QRPaymentModalProps> = ({
  stall,
  items,
  totalAmount,
  orderType,
  tableNumber,
  onConfirmOrder,
  onClose,
}) => {
  const [method, setMethod] = useState<PaymentMethod>("duitnow_qr");
  const [cashTendered, setCashTendered] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tenderedNum = parseFloat(cashTendered) || 0;
  const changeDue = Math.max(0, tenderedNum - totalAmount);

  const handleVerifyPayment = async () => {
    setIsSubmitting(true);
    try {
      await onConfirmOrder(method);
      // Trigger festive celebration confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-150 max-h-[92dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">
              {stall.stall_number} Cashier Checkout
            </span>
            <h3 className="text-lg font-bold text-white">Payment & Verification</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Brief */}
        <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">
              {orderType === "dine_in" ? `Dine-in (Table ${tableNumber || "-"})` : "Takeaway / Bungkus"} • {items.length} items
            </div>
            <div className="text-2xl font-black text-teal-300">
              {formatCurrency(totalAmount)}
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">
            Awaiting Verification
          </span>
        </div>

        {/* Payment Method Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setMethod("duitnow_qr")}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              method === "duitnow_qr"
                ? "bg-teal-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <QrCode className="w-4 h-4" />
            DuitNow QR
          </button>
          <button
            type="button"
            onClick={() => setMethod("cash")}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              method === "cash"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Banknote className="w-4 h-4" />
            Cash Payment
          </button>
        </div>

        {/* DuitNow QR View */}
        {method === "duitnow_qr" ? (
          <div className="flex flex-col items-center justify-center p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-center">
            <p className="text-xs text-slate-300 mb-2 font-medium">
              Customer scans stall DuitNow QR code:
            </p>
            <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-teal-500/30">
              <img
                src={stall.duitnow_qr_url}
                alt="DuitNow QR"
                className="w-48 h-48 object-contain"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Supported by Touch 'n Go, GrabPay, Maybank MAE & all Malaysian banks.
            </p>
          </div>
        ) : (
          /* Cash Calculator View */
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Cash Tendered (RM)
              </label>
              <input
                type="number"
                step="0.10"
                value={cashTendered}
                onChange={(e) => setCashTendered(e.target.value)}
                placeholder="e.g. 50"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-lg font-bold text-amber-300 outline-none focus:border-amber-400"
              />
            </div>

            {/* Quick cash pills */}
            <div className="flex gap-2">
              {[10, 20, 50, 100].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setCashTendered(val.toString())}
                  className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700"
                >
                  RM {val}
                </button>
              ))}
            </div>

            {tenderedNum >= totalAmount && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs">
                <span className="text-emerald-300 font-semibold">Change to Return:</span>
                <span className="text-base font-extrabold text-emerald-400">
                  {formatCurrency(changeDue)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Manual Verification Note */}
        <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center gap-2 text-xs text-slate-300">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Cashier verifies transaction physically, then confirms to push ticket to kitchen.
          </span>
        </div>

        {/* Verification Action Button */}
        <button
          onClick={handleVerifyPayment}
          disabled={isSubmitting || (method === "cash" && tenderedNum < totalAmount && cashTendered !== "")}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sending Order to Kitchen...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Verify Payment & Send Chit to Kitchen</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
