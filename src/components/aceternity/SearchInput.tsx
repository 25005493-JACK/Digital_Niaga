"use client";

import React, { useState, useRef, useEffect } from "react";
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
        <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
        <div className="relative flex items-center bg-slate-900/90 rounded-2xl border border-slate-700/80 px-4 py-3 sm:py-3.5 shadow-xl">
          <Search className="w-5 h-5 text-teal-400 shrink-0 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search stalls or dishes (e.g. Chicken Rice, Char Kuey Teow, Chendol)..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm sm:text-base outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Autocomplete Results Dropdown */}
        {isOpen && query.trim() && (
          <div className="absolute top-full mt-2 inset-x-0 glass-panel rounded-2xl p-2 shadow-2xl z-40 max-h-[70vh] overflow-y-auto border border-slate-700 animate-in fade-in zoom-in-95 duration-150">
            {matchingStalls.length === 0 && matchingDishes.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm">
                No matching stalls or dishes found for <span className="text-teal-400 font-medium">"{query}"</span>.
              </div>
            ) : (
              <div className="space-y-3 p-1">
                {/* Stall Matches */}
                {matchingStalls.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-teal-400 px-3 py-1 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" /> Stalls in 1 Utama Food District
                    </div>
                    <div className="space-y-1 mt-1">
                      {matchingStalls.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            onSelectStall(s);
                            setIsOpen(false);
                          }}
                          className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30">
                              {s.stall_number}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-slate-200 group-hover:text-teal-300 transition-colors">
                                {s.name}
                              </p>
                              <p className="text-xs text-slate-400 line-clamp-1">{s.tagline}</p>
                            </div>
                          </div>
                          <span className="text-xs text-teal-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
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
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 px-3 py-1 flex items-center gap-1.5">
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
                          className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-700">
                              <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-200 group-hover:text-amber-300 transition-colors">
                                {dish.name}
                              </p>
                              <p className="text-xs text-slate-400">
                                at {stall.stall_number} • {stall.name}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-teal-400">
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
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                  : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
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
