"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ONE_UTAMA_STALLS } from "@/data/oneUtamaStalls";
import { isSupabaseConfigured } from "@/lib/supabase";
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
  const currentStall = ONE_UTAMA_STALLS.find((s) => s.id === selectedStallId) || ONE_UTAMA_STALLS[0];
  const supabaseActive = isSupabaseConfigured();

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col p-4 sm:p-8">
      {/* Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between pb-8 border-b border-slate-800">
        <BrandLogo size="md" showTagline={true} />
        <Link
          href="/"
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-bold text-slate-300 transition-colors flex items-center gap-1.5"
        >
          <span>Public Landing Page</span>
          <ExternalLink className="w-4 h-4" />
        </Link>
      </header>

      {/* Main Hub */}
      <main className="max-w-5xl mx-auto w-full py-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-mono font-bold border border-teal-500/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Hawker Owner & Staff Control Hub
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Digital Niaga Management Suite
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Select your hawker stall below to launch your dedicated <strong>Cashier POS</strong> or <strong>Kitchen Display System</strong>. Each stall runs with strict independent data isolation.
          </p>
        </div>

        {/* 1. Select Stall */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <Store className="w-4 h-4 text-teal-400" />
              Active Stall Selection (1 Utama Food District)
            </h3>
            <span className="text-xs text-teal-400 font-mono font-bold">
              {currentStall.stall_number}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ONE_UTAMA_STALLS.map((s) => {
              const isSelected = s.id === selectedStallId;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedStallId(s.id)}
                  className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between h-24 ${
                    isSelected
                      ? "bg-teal-500/10 border-teal-400 text-white shadow-lg shadow-teal-500/10 ring-1 ring-teal-400"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <span className="text-[11px] font-mono font-extrabold text-teal-400">
                    {s.stall_number}
                  </span>
                  <p className="text-xs font-bold line-clamp-2 leading-snug">
                    {s.name}
                  </p>
                  <span className="text-[10px] text-slate-500">{s.category}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. Role Launchpad: Cashier vs Kitchen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cashier POS Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl group transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                Cashier Point of Sale (POS)
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Counter interface designed for phone/tablet cashiers. Tap menu items, configure dine-in table numbers or takeaway, display the stall’s DuitNow QR code, verify transactions manually, and print digital receipts.
              </p>
            </div>

            <Link
              href="/pos"
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <span>Launch Cashier POS ({currentStall.stall_number})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Kitchen Display KDS Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-rose-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl group transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <ChefHat className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white group-hover:text-rose-300 transition-colors">
                Kitchen Display System (KDS)
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Wall or counter display for the kitchen cook line. Subscribes in real-time via WebSockets to new order tickets with audio pings. Progress tickets from Pending &rarr; Preparing &rarr; Ready with 1-tap.
              </p>
            </div>

            <Link
              href="/kitchen"
              className="w-full py-3.5 px-4 rounded-2xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-500/20 active:scale-95"
            >
              <span>Launch Kitchen KDS ({currentStall.stall_number})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 3. Multi-Device & Supabase Status Card */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h4 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <Database className="w-4 h-4 text-teal-400" />
            System & Realtime Integration Status
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div>
                <span className="font-bold text-slate-200">Browser Realtime Sync: Active</span>
                <p className="text-slate-400 mt-0.5">
                  Orders created in Cashier automatically appear in Kitchen across split browser windows or tabs.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  supabaseActive ? "bg-emerald-400" : "bg-teal-400"
                } shrink-0`}
              />
              <div>
                <span className="font-bold text-slate-200">
                  Supabase PostgreSQL: {supabaseActive ? "Live Connected" : "Local Mock Simulation Active"}
                </span>
                <p className="text-slate-400 mt-0.5">
                  {supabaseActive
                    ? "Production database connected via environment variables."
                    : "Zero-config demo mode ready. Connect Supabase anytime via .env.local."}
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-2xl text-xs text-teal-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <span>
              <strong>Tip for demo & evaluation:</strong> Open the <strong>Cashier POS</strong> in one browser window and the <strong>Kitchen KDS</strong> in a second window side-by-side. When you place an order in Cashier, watch it arrive in Kitchen with an instant chime!
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
