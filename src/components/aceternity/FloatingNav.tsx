"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/BrandLogo";
import {
  Menu,
  X,
  Store,
  LayoutGrid,
  CreditCard,
  ChefHat,
  ShieldCheck,
  MapPin,
} from "lucide-react";

export const FloatingNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-3 sm:top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="glass-panel w-full max-w-5xl rounded-2xl px-4 py-2.5 sm:px-6 sm:py-3 shadow-2xl flex items-center justify-between pointer-events-auto border border-slate-700/50">
        {/* Brand Logo */}
        <BrandLogo size="sm" showTagline={false} />

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
          <Link
            href="#explore-3d"
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            3D Stall Map
          </Link>
          <Link
            href="#stalls"
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all flex items-center gap-1.5"
          >
            <Store className="w-3.5 h-3.5 text-teal-400" />
            Food Stalls
          </Link>

          <div className="h-4 w-px bg-slate-700 mx-1" />

          {/* Stall Owner / Staff Portal Shortcut */}
          <Link
            href="/pos"
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            Cashier POS
          </Link>
          <Link
            href="/kitchen"
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <ChefHat className="w-3.5 h-3.5 text-rose-400" />
            Kitchen KDS
          </Link>
          <Link
            href="/portal"
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 transition-all shadow-md shadow-teal-500/20 flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Owner Portal
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/pos"
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-900 bg-teal-400 flex items-center gap-1"
          >
            <CreditCard className="w-3 h-3" />
            POS
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-4 top-20 glass-panel rounded-2xl p-4 shadow-2xl border border-slate-700/80 pointer-events-auto flex flex-col gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <Link
            href="#explore-3d"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            <MapPin className="w-4 h-4 text-teal-400" />
            Interactive 3D Food Court Map
          </Link>
          <Link
            href="#stalls"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            <Store className="w-4 h-4 text-teal-400" />
            Browse All Stalls & Menus
          </Link>
          <div className="h-px bg-slate-800 my-1" />
          <Link
            href="/pos"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-amber-300 hover:bg-slate-800"
          >
            <CreditCard className="w-4 h-4" />
            Cashier POS Mode
          </Link>
          <Link
            href="/kitchen"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-300 hover:bg-slate-800"
          >
            <ChefHat className="w-4 h-4" />
            Kitchen Display System (KDS)
          </Link>
          <Link
            href="/portal"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 px-3 py-2.5 mt-1 rounded-xl text-sm font-bold text-slate-950 bg-teal-400 hover:bg-teal-300"
          >
            <ShieldCheck className="w-4 h-4" />
            Stall Owner / Staff Switcher
          </Link>
        </div>
      )}
    </header>
  );
};
