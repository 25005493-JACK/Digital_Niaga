"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";

const navLinks = [
  { href: "#stalls", label: "Explore stalls" },
  { href: "#explore-3d", label: "3D map" },
];

export const FloatingNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-4 sm:top-5">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-2xl border border-line bg-white/95 px-4 py-2.5 shadow-sm backdrop-blur-md sm:px-5">
        <BrandLogo size="sm" />
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-sm font-medium text-secondary transition-colors hover:bg-surface-subtle hover:text-ink">
              {link.label}
            </Link>
          ))}
          <Link href="/portal" className="ml-3 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover">
            Owner portal
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="rounded-lg p-2 text-secondary hover:bg-surface-subtle md:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {mobileMenuOpen && (
        <div className="mx-auto mt-2 flex w-full max-w-6xl flex-col rounded-2xl border border-line bg-white p-2 shadow-sm md:hidden">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-secondary hover:bg-surface-subtle">
              {link.label}
            </Link>
          ))}
          <Link href="/portal" onClick={() => setMobileMenuOpen(false)} className="mt-1 rounded-lg bg-accent px-3 py-2.5 text-center text-sm font-semibold text-white">
            Owner portal
          </Link>
        </div>
      )}
    </header>
  );
};
