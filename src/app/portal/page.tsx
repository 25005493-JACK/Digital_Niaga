"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ONE_MAIN_STALLS } from "@/data/oneMainStalls";
import {
  CreditCard,
  ChefHat,
  Store,
  Database,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Laptop,
  Smartphone,
  Info,
} from "lucide-react";

export default function PortalPage() {
  const [selectedStallId, setSelectedStallId] = useState<string>("stall-01");
  const currentStall = ONE_MAIN_STALLS.find((s) => s.id === selectedStallId) || ONE_MAIN_STALLS[0];
  const supabaseActive = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
  );

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col p-4 sm:p-8">
      {/* Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between pb-8 border-b border-line">
        <BrandLogo size="md" showTagline={true} />
        <Link
          href="/"
          className="px-4 py-2 rounded-xl bg-surface-subtle hover:bg-line text-xs sm:text-sm font-bold text-secondary transition-colors flex items-center gap-1.5"
        >
          <span>Public Landing Page</span>
          <ExternalLink className="w-4 h-4" />
        </Link>
      </header>

      {/* Main Hub */}
      <main className="max-w-5xl mx-auto w-full py-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-semibold border border-accent/20 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Staff workspace
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            Choose your stall
          </h1>
          <p className="text-sm text-muted mt-1 max-w-2xl">
            Select a hawker stall below to launch its <strong>Cashier POS</strong> or <strong>Kitchen Display System</strong>. This prototype filters each stall’s orders in the browser.
          </p>
        </div>

        {/* 1. Select Stall */}
        <section className="bg-surface border border-line rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm sm:text-base text-ink flex items-center gap-2">
              <Store className="w-4 h-4 text-accent" />
              Active Stall Selection (1Main Food District)
            </h3>
            <span className="text-xs text-accent font-mono font-bold">
              {currentStall.stall_number}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ONE_MAIN_STALLS.map((s) => {
              const isSelected = s.id === selectedStallId;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedStallId(s.id)}
                  className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between h-24 ${
                    isSelected
                      ? "bg-accent-soft border-accent text-ink"
                      : "bg-surface-subtle border-line text-muted hover:text-ink hover:border-line"
                  }`}
                >
                  <span className="text-[11px] font-mono font-semibold text-accent">
                    {s.stall_number}
                  </span>
                  <p className="text-xs font-bold line-clamp-2 leading-snug">
                    {s.name}
                  </p>
                  <span className="text-[10px] text-muted">{s.category}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. Role Launchpad: Cashier vs Kitchen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cashier POS Card */}
          <div className="bg-surface border border-line hover:border-accent/40 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-colors">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-accent-soft flex items-center justify-center text-accent">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-ink">
                Cashier Point of Sale (POS)
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Counter interface designed for phone/tablet cashiers. Tap menu items, configure dine-in table numbers or takeaway, simulate a QR payment or record cash received, and print digital receipts.
              </p>
            </div>

            <Link
              href={`/pos?stall=${currentStall.id}`}
              className="w-full py-3 px-4 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <span>Launch Cashier POS ({currentStall.stall_number})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Kitchen Display KDS Card */}
          <div className="bg-surface border border-line hover:border-accent/40 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-colors">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-accent-soft flex items-center justify-center text-accent">
                <ChefHat className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-ink">
                Kitchen Display System (KDS)
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Wall or counter display for the kitchen cook line. Receives order tickets across tabs in the same browser with audio pings. Progress tickets from Pending &rarr; Preparing &rarr; Ready with 1-tap.
              </p>
            </div>

            <Link
              href={`/kitchen?stall=${currentStall.id}`}
              className="w-full py-3 px-4 rounded-lg border border-line bg-surface hover:bg-surface-subtle text-ink font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <span>Launch Kitchen KDS ({currentStall.stall_number})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 3. Multi-Device & Supabase Status Card */}
        <section className="bg-surface border border-line rounded-2xl p-6 space-y-4">
          <h4 className="font-bold text-sm text-ink flex items-center gap-2">
            <Database className="w-4 h-4 text-accent" />
            System & Realtime Integration Status
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-surface-subtle rounded-2xl border border-line flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div>
                <span className="font-bold text-ink">Browser Realtime Sync: Active</span>
                <p className="text-muted mt-0.5">
                  Orders created in Cashier automatically appear in Kitchen across split browser windows or tabs.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-surface-subtle rounded-2xl border border-line flex items-center gap-3">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  supabaseActive ? "bg-emerald-400" : "bg-accent"
                } shrink-0`}
              />
              <div>
                <span className="font-bold text-ink">
                  Supabase PostgreSQL: {supabaseActive ? "Credentials Configured" : "Not Configured"}
                </span>
                <p className="text-muted mt-0.5">
                  {supabaseActive
                    ? "Credentials are present. This prototype still stores orders in the browser."
                    : "Orders are stored in this browser only. The demo needs no database setup."}
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-accent-soft border border-accent/20 rounded-2xl text-xs text-accent flex items-start gap-2.5">
            <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <span>
              <strong>Tip for demo & evaluation:</strong> Open the <strong>Cashier POS</strong> in one browser window and the <strong>Kitchen KDS</strong> in a second window side-by-side. When you place an order in Cashier, watch it arrive in Kitchen with an instant chime!
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
