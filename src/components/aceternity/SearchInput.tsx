"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Search, X, MapPin, Utensils, ArrowRight } from "lucide-react";
import { Stall } from "@/types";

interface SearchInputProps {
  stalls: Stall[];
  onSelectStall: (stall: Stall) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  stalls,
  onSelectStall,
  selectedCategory,
  onSelectCategory,
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter matching stalls and matching dishes
  const matchingStalls = query.trim()
    ? stalls.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.stall_number.toLowerCase().includes(query.toLowerCase()) ||
          s.category.toLowerCase().includes(query.toLowerCase()) ||
          s.cuisines.some((c) => c.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const matchingDishes = query.trim()
    ? stalls.flatMap((s) =>
        s.menu
          .filter((m) => m.name.toLowerCase().includes(query.toLowerCase()) || m.description.toLowerCase().includes(query.toLowerCase()))
          .map((m) => ({ dish: m, stall: s }))
      )
    : [];

  const categories = [
    "All",
    "Rice Dishes",
    "Noodles & Soups",
    "Halal / Muslim-Friendly",
    "Malaysian Local",
    "Vegetarian",
    "Beverages",
  ];

  return (
    <div ref={containerRef} className="w-full max-w-3xl mx-auto flex flex-col gap-3">
      {/* Search Input Bar */}
      <div className="relative group">
        <div className="relative flex items-center bg-surface rounded-xl border border-line px-4 py-3 sm:py-3.5 shadow-sm transition-colors focus-within:border-accent">
          <Search className="w-5 h-5 text-accent shrink-0 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search stalls or dishes"
            className="w-full bg-transparent text-ink placeholder-slate-400 text-sm sm:text-base outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
              className="p-1 rounded-full text-muted hover:text-ink hover:bg-surface-subtle"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Autocomplete Results Dropdown */}
        {isOpen && query.trim() && (
          <div className="absolute top-full mt-2 inset-x-0 glass-panel rounded-2xl p-2 shadow-sm z-40 max-h-[70vh] overflow-y-auto border border-line animate-in fade-in zoom-in-95 duration-150">
            {matchingStalls.length === 0 && matchingDishes.length === 0 ? (
              <div className="p-6 text-center text-muted text-sm">
                No matching stalls or dishes found for <span className="text-accent font-medium">&quot;{query}&quot;</span>.
              </div>
            ) : (
              <div className="space-y-3 p-1">
                {/* Stall Matches */}
                {matchingStalls.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-accent px-3 py-1 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" /> Stalls in 1Main Food District
                    </div>
                    <div className="space-y-1 mt-1">
                      {matchingStalls.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            onSelectStall(s);
                            setIsOpen(false);
                          }}
                          className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-subtle transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-accent-soft text-accent border border-accent/30">
                              {s.stall_number}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-ink group-hover:text-accent transition-colors">
                                {s.name}
                              </p>
                              <p className="text-xs text-muted line-clamp-1">{s.tagline}</p>
                            </div>
                          </div>
                          <span className="text-xs text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            Locate in 3D <ArrowRight className="w-3 h-3" />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dish Matches */}
                {matchingDishes.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700 px-3 py-1 flex items-center gap-1.5">
                      <Utensils className="w-3 h-3" /> Dishes & Specialties
                    </div>
                    <div className="space-y-1 mt-1">
                      {matchingDishes.slice(0, 6).map(({ dish, stall }) => (
                        <button
                          key={dish.id}
                          onClick={() => {
                            onSelectStall(stall);
                            setIsOpen(false);
                          }}
                          className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-subtle transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-line">
                              <Image src={dish.image_url} alt={dish.name} fill sizes="32px" className="object-cover" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-ink group-hover:text-amber-700 transition-colors">
                                {dish.name}
                              </p>
                              <p className="text-xs text-muted">
                                at {stall.stall_number} • {stall.name}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-accent">
                            RM {dish.price.toFixed(2)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Category Pills (Horizontal Scroll on Mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-accent text-white"
                  : "bg-surface text-muted hover:text-ink hover:bg-surface-subtle border border-line"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
