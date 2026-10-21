"use client";

import React, { useState, useMemo } from "react";
import { FloatingNav } from "@/components/aceternity/FloatingNav";
import { FoodCourt3D } from "@/components/3d/FoodCourt3D";
import { SearchInput } from "@/components/aceternity/SearchInput";
import { BentoGrid } from "@/components/aceternity/BentoGrid";
import { StallModal } from "@/components/ui/StallModal";
import { ONE_UTAMA_STALLS, HAWKER_CENTRE_INFO } from "@/data/oneUtamaStalls";
import { Stall } from "@/types";
import {
  MapPin,
  Store,
  Sparkles,
  ArrowDown,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass,
} from "lucide-react";

export default function HomePage() {
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [modalStall, setModalStall] = useState<Stall | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Filter stalls based on category
  const filteredStalls = useMemo(() => {
    if (selectedCategory === "All") return ONE_UTAMA_STALLS;
    if (selectedCategory === "Halal / Muslim-Friendly") {
      return ONE_UTAMA_STALLS.filter((s) => s.is_halal);
    }
    return ONE_UTAMA_STALLS.filter(
      (s) =>
        s.category === selectedCategory ||
        s.cuisines.some((c) => c.toLowerCase().includes(selectedCategory.toLowerCase()))
    );
  }, [selectedCategory]);

  const handleSelectStallFromSearch = (stall: Stall) => {
    setSelectedStall(stall);
    setModalStall(stall);
  };

  const handleSelectStallIn3D = (stall: Stall) => {
    setSelectedStall(stall);
    setModalStall(stall);
  };

  const handleReset3D = () => {
    setSelectedStall(null);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-teal-500 selection:text-slate-950">
      {/* Floating Modern Aceternity Navbar */}
      <FloatingNav />

      {/* Main Content */}
      <main className="flex-1 pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12 sm:space-y-16">
        {/* Hero Section */}
        <section className="relative text-center pt-4 sm:pt-8 flex flex-col items-center">
          {/* SULAM Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-4 backdrop-blur-md animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>WIX2001 SULAM Project • Digital Niaga</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl leading-tight">
            Discover Authentic Hawker Flavors at{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400">
              1 Utama Food District
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            Explore 8 iconic food stalls, view full photo menus with transparent prices, and pinpoint exact stall booths using our interactive 3D hawker centre map.
          </p>

          {/* Quick Stats Pill Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-300">
            <span className="flex items-center gap-1.5 glass-panel px-3 py-1.5 rounded-xl">
              <Store className="w-4 h-4 text-teal-400" />
              <strong>{HAWKER_CENTRE_INFO.totalStalls} Authentic Stalls</strong>
            </span>
            <span className="flex items-center gap-1.5 glass-panel px-3 py-1.5 rounded-xl">
              <Clock className="w-4 h-4 text-teal-400" />
              <span>{HAWKER_CENTRE_INFO.operatingHours}</span>
            </span>
            <span className="flex items-center gap-1.5 glass-panel px-3 py-1.5 rounded-xl">
              <MapPin className="w-4 h-4 text-teal-400" />
              <span>LG Highstreet, 1 Utama</span>
            </span>
          </div>

          {/* Vanish / Autocomplete Search Input */}
          <div className="w-full mt-8">
            <SearchInput
              stalls={ONE_UTAMA_STALLS}
              onSelectStall={handleSelectStallFromSearch}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        </section>

        {/* 3D Hawker Centre Interactive Map Section */}
        <section id="explore-3d" className="space-y-4 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">
                <Compass className="w-4 h-4" /> Spatial Stall Locator
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Interactive 3D Hawker Centre Layout
              </h2>
            </div>
            <p className="text-xs text-slate-400 sm:text-right max-w-md">
              Tap any stall booth or signboard to inspect its location, daily specialties, and full menu chits.
            </p>
          </div>

          {/* 3D Canvas Box */}
          <FoodCourt3D
            stalls={ONE_UTAMA_STALLS}
            activeStall={selectedStall}
            onSelectStall={handleSelectStallIn3D}
            onResetView={handleReset3D}
          />
        </section>

        {/* Stalls Directory Bento Section */}
        <section id="stalls" className="space-y-6 scroll-mt-24 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <div className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">
                Explore Menu Catalogs
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Food Stalls Directory
              </h2>
            </div>
            <div className="text-xs text-slate-400">
              Showing{" "}
              <span className="text-teal-400 font-bold">{filteredStalls.length}</span>{" "}
              stalls in 1 Utama Food District
            </div>
          </div>

          <BentoGrid
            stalls={filteredStalls}
            onSelectStall={handleSelectStallIn3D}
            onOpenDetails={(stall) => setModalStall(stall)}
          />
        </section>

        {/* Cashier to Kitchen SULAM Showcase Info */}
        <section className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-700/60 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-widest">
              Integrated Stall Suite
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Are you a Hawker Stall Owner or Staff?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Log into your stall terminal to access your touch-friendly <strong>Cashier POS</strong> (with DuitNow QR verification and digital chits) and synchronized <strong>Kitchen Display System (KDS)</strong>.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="/pos"
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs sm:text-sm font-bold transition-all"
            >
              Launch Cashier POS
            </a>
            <a
              href="/kitchen"
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs sm:text-sm font-bold transition-all"
            >
              Launch Kitchen KDS
            </a>
            <a
              href="/portal"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 text-xs sm:text-sm font-black transition-all shadow-lg shadow-teal-500/20"
            >
              Stall Switcher Hub
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <p className="font-semibold text-slate-400">
          Digital Niaga — WIX2001 Service Learning (SULAM) Initiative
        </p>
        <p>
          Empowering Malaysian Hawkers with Spatial Discovery & Realtime Order Management.
        </p>
        <p className="text-[11px] text-slate-600">
          Demo Location: 1 Utama Food District, Petaling Jaya, Selangor.
        </p>
      </footer>

      {/* Stall Detail & Photo Menu Modal / Bottom Sheet */}
      <StallModal
        stall={modalStall}
        onClose={() => setModalStall(null)}
        onLocateIn3D={handleSelectStallIn3D}
      />
    </div>
  );
}
