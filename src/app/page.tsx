"use client";

import React, { useState, useMemo } from "react";
import { FloatingNav } from "@/components/aceternity/FloatingNav";
import { FoodCourt3D } from "@/components/3d/FoodCourt3D";
import { SearchInput } from "@/components/aceternity/SearchInput";
import { BentoGrid } from "@/components/aceternity/BentoGrid";
import { StallModal } from "@/components/ui/StallModal";
import { ONE_UTAMA_STALLS, HAWKER_CENTRE_INFO } from "@/data/oneUtamaStalls";
import { Stall } from "@/types";
import { MapPin } from "lucide-react";

export default function HomePage() {
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [resetToken, setResetToken] = useState(0);
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
    setResetToken((value) => value + 1);
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      {/* Floating Modern Aceternity Navbar */}
      <FloatingNav />

      {/* Main Content */}
      <main className="flex-1 pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-14 sm:space-y-20">
        {/* Hero Section */}
        <section className="relative isolate overflow-visible rounded-[28px] border border-line bg-surface px-5 pb-8 pt-12 text-center sm:px-10 sm:pb-10 sm:pt-16">
          <div className="hero-dots pointer-events-none absolute inset-0 z-0 rounded-[28px] opacity-50" />
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent">1 Utama Food District · Petaling Jaya</p>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Good food, easy to find.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            Explore a Food District-inspired hall, browse demo menus, and try the interactive stall finder.
          </p>
          <div className="mx-auto mt-8 w-full max-w-3xl text-left">
            <SearchInput
              stalls={ONE_UTAMA_STALLS}
              onSelectStall={handleSelectStallFromSearch}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
          <p className="mt-5 inline-flex items-center gap-1.5 text-xs text-muted">
            <MapPin className="h-3.5 w-3.5" /> {HAWKER_CENTRE_INFO.location}
          </p>
        </section>

        {/* Stalls Directory Bento Section */}
        <section id="stalls" className="space-y-6 scroll-mt-24 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-line pb-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">Explore</p>
              <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Food stalls</h2>
            </div>
            <div className="text-xs text-muted">
              Showing{" "}
              <span className="text-accent font-bold">{filteredStalls.length}</span>{" "}
              sample stalls
            </div>
          </div>

          <BentoGrid
            stalls={filteredStalls}
            onSelectStall={handleSelectStallIn3D}
            onOpenDetails={(stall) => setModalStall(stall)}
          />
        </section>

        <section id="explore-3d" className="space-y-5 scroll-mt-24">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">Find your way</p>
              <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Explore the 3D map</h2>
            </div>
            <p className="max-w-md text-sm text-muted">Explore a scene inspired by Food District at 1 Utama. Select a demo booth to open its menu.</p>
          </div>
          <FoodCourt3D
            stalls={ONE_UTAMA_STALLS}
            activeStall={selectedStall}
            onSelectStall={handleSelectStallIn3D}
            onResetView={handleReset3D}
            resetToken={resetToken}
          />
          <p className="text-xs leading-relaxed text-muted">
            Hall outline based on the supplied 1 Utama map crop; individual demo booth positions are illustrative. The venue is at {HAWKER_CENTRE_INFO.location}.{" "}
            <a className="text-accent underline underline-offset-2" href="https://www.1utama.com.my/mall-shop/food-district-s346-s347/" target="_blank" rel="noreferrer">View the official venue listing</a>.
          </p>
        </section>

        {/* Cashier to Kitchen SULAM Showcase Info */}
        <section className="rounded-2xl border border-line bg-surface p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">For stall teams</p>
            <h3 className="text-xl font-semibold text-ink sm:text-2xl">Run your counter and kitchen</h3>
            <p className="text-sm text-secondary leading-relaxed">
              Open the demo stall terminal to use the touch-friendly <strong>Cashier POS</strong> (with simulated QR payment and digital chits) and the <strong>Kitchen Display System (KDS)</strong> in another tab of the same browser.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="/pos"
              className="px-4 py-2.5 rounded-lg border border-line text-secondary text-xs sm:text-sm font-semibold transition-colors hover:bg-surface-subtle"
            >
              Launch Cashier POS
            </a>
            <a
              href="/kitchen"
              className="px-4 py-2.5 rounded-lg border border-line text-secondary text-xs sm:text-sm font-semibold transition-colors hover:bg-surface-subtle"
            >
              Launch Kitchen KDS
            </a>
            <a
              href="/portal"
              className="px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              Stall Switcher Hub
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-line py-8 px-4 text-center text-xs text-muted space-y-2">
        <p className="font-semibold text-muted">
          Digital Niaga — WIX2001 Service Learning (SULAM) Initiative
        </p>
        <p>
          Empowering Malaysian Hawkers with Spatial Discovery & Realtime Order Management.
        </p>
        <p className="text-[11px] text-muted">
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
