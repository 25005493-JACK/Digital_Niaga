"use client";

import React, { useState, useMemo } from "react";
import { FloatingNav } from "@/components/aceternity/FloatingNav";
import { FoodCourt3D } from "@/components/3d/FoodCourt3D";
import { SearchInput } from "@/components/aceternity/SearchInput";
import { BentoGrid } from "@/components/aceternity/BentoGrid";
import { StallModal } from "@/components/ui/StallModal";
import { HAWKER_CENTRE_INFO } from "@/data/oneMainStalls";
import { Stall } from "@/types";
import { useStalls } from "@/lib/menus";
import { MapPin } from "lucide-react";

export default function HomePage() {
  const stalls = useStalls();
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [resetToken, setResetToken] = useState(0);
  const [modalStall, setModalStall] = useState<Stall | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Filter stalls based on category
  const filteredStalls = useMemo(() => {
    if (selectedCategory === "All") return stalls;
    return stalls.filter(
      (s) =>
        s.category === selectedCategory ||
        s.cuisines.some((c) => c.toLowerCase().includes(selectedCategory.toLowerCase()))
    );
  }, [selectedCategory, stalls]);

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
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent">Restoran Kim Seng</p>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Good food, easy to find.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            Discover 11 local stalls at our collaborator, Restoran Kim Seng in Seksyen 17.
          </p>
          <div className="mx-auto mt-8 w-full max-w-3xl text-left">
            <SearchInput
              stalls={stalls}
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
              stalls
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
            <p className="max-w-md text-sm text-muted">Explore the Restoran Kim Seng demo scene. Select a booth to open its menu.</p>
          </div>
          <FoodCourt3D
            stalls={stalls}
            activeStall={selectedStall}
            onSelectStall={handleSelectStallIn3D}
            onResetView={handleReset3D}
            resetToken={resetToken}
          />
          <p className="text-xs leading-relaxed text-muted">
            Stall positions follow the supplied floor plan; dimensions are approximate. Menus await owner updates.
          </p>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-8 flex flex-wrap justify-between gap-6"><div><h3 className="text-2xl font-semibold">Keep your menu fresh</h3><p className="text-secondary mt-2">Update dishes, prices, and photos in your stall owner portal.</p></div><a href="/portal" className="rounded-lg bg-accent text-white px-4 py-3">Manage your menu</a></section>
      </main>

      {/* Footer */}
      <footer className="border-t border-line py-8 px-4 text-center text-xs text-muted space-y-2">
        <p className="font-semibold text-muted">
          Digital Niaga — WIX2001 Service Learning (SULAM) Initiative
        </p>
        <p>
          Empowering Malaysian Hawkers with Spatial Discovery & Photo Menus.
        </p>
        <p className="text-[11px] text-muted">
          Community collaborator: Restoran Kim Seng.
        </p>
      </footer>

      {/* Stall Detail & Photo Menu Modal / Bottom Sheet */}
      <StallModal
        stall={modalStall ? stalls.find(s => s.id === modalStall.id) ?? modalStall : null}
        onClose={() => setModalStall(null)}
        onLocateIn3D={handleSelectStallIn3D}
      />
    </div>
  );
}
