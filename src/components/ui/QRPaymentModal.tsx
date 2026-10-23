"use client";

import React, { useState } from "react";
import Image from "next/image";
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
  const [submitError, setSubmitError] = useState("");

  const tenderedNum = Number(cashTendered);
  const changeDue = Math.max(0, tenderedNum - totalAmount);
  const cashIsSufficient = cashTendered.trim() !== "" && Number.isFinite(tenderedNum) && tenderedNum >= totalAmount;

  const handleVerifyPayment = async () => {
    if (isSubmitting || (method === "cash" && !cashIsSufficient)) return;
    setSubmitError("");
    setIsSubmitting(true);
    try {
      await onConfirmOrder(method);
    } catch (err) {
      console.error(err);
      setSubmitError("The order could not be saved. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/45 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-surface border border-line rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col gap-4 animate-in zoom-in-95 duration-150 max-h-[92dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <div>
            <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
              {stall.stall_number} Cashier Checkout
            </span>
            <h3 className="text-lg font-bold text-ink">Payment & Verification</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-muted hover:text-ink hover:bg-surface-subtle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Brief */}
        <div className="bg-surface-subtle p-3.5 rounded-2xl border border-line flex items-center justify-between">
          <div>
            <div className="text-xs text-muted">
              {orderType === "dine_in" ? `Dine-in (Table ${tableNumber || "-"})` : "Takeaway / Bungkus"} • {items.length} items
            </div>
            <div className="text-2xl font-bold text-accent">
              {formatCurrency(totalAmount)}
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 border border-amber-500/20">
            Awaiting Verification
          </span>
        </div>

        {/* Payment Method Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-surface-subtle rounded-2xl border border-line">
          <button
            type="button"
            onClick={() => setMethod("duitnow_qr")}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              method === "duitnow_qr"
                ? "bg-accent text-white shadow-md"
                : "text-muted hover:text-ink"
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
                ? "bg-amber-500 text-white shadow-md"
                : "text-muted hover:text-ink"
            }`}
          >
            <Banknote className="w-4 h-4" />
            Cash Payment
          </button>
        </div>

        {/* DuitNow QR View */}
        {method === "duitnow_qr" ? (
          <div className="flex flex-col items-center justify-center p-4 bg-surface-subtle rounded-2xl border border-line text-center">
            <p className="text-xs text-secondary mb-2 font-medium">
              Demo QR code for this stall. It cannot accept payments.
            </p>
            <div className="p-3 bg-white rounded-2xl shadow-sm border-4 border-accent/30">
              <Image
                src={stall.duitnow_qr_url}
                alt="Demo QR code; not a payment destination"
                width={192}
                height={192}
                unoptimized
                className="w-48 h-48 object-contain"
              />
            </div>
            <p className="text-[11px] text-muted mt-2">
              Payment is simulated for this prototype. Do not send money to this code.
            </p>
          </div>
        ) : (
          /* Cash Calculator View */
          <div className="p-4 bg-surface-subtle rounded-2xl border border-line space-y-3">
            <div>
              <label className="text-xs font-semibold text-secondary block mb-1">
                Cash Tendered (RM)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={cashTendered}
                onChange={(e) => setCashTendered(e.target.value)}
                placeholder="e.g. 50"
                className="w-full bg-surface border border-line rounded-xl px-3.5 py-2.5 text-lg font-bold text-amber-700 outline-none focus:border-amber-400"
              />
            </div>

            {/* Quick cash pills */}
            <div className="flex gap-2">
              {[10, 20, 50, 100].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setCashTendered(val.toString())}
                  className="flex-1 py-1.5 rounded-lg bg-surface-subtle hover:bg-line text-xs font-bold text-ink border border-line"
                >
                  RM {val}
                </button>
              ))}
            </div>

            {cashIsSufficient && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold">Change to Return:</span>
                <span className="text-base font-semibold text-emerald-700">
                  {formatCurrency(changeDue)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Manual Verification Note */}
        <div className="p-2.5 rounded-xl bg-surface-subtle border border-line flex items-center gap-2 text-xs text-secondary">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            {method === "cash"
              ? "Confirm the cash received before sending the ticket to kitchen."
              : "Simulate QR payment verification to send the ticket to kitchen."}
          </span>
        </div>

        {/* Verification Action Button */}
        {submitError && <p role="alert" className="text-sm text-rose-700">{submitError}</p>}
        <button
          onClick={handleVerifyPayment}
          disabled={isSubmitting || (method === "cash" && !cashIsSufficient)}
          className="w-full py-3.5 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sending Order to Kitchen...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>{method === "cash" ? "Confirm Cash & Send Chit to Kitchen" : "Simulate QR Payment & Send Chit"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
