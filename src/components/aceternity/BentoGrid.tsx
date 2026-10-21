"use client";

import React from "react";
import { Stall } from "@/types";
import { MapPin, Clock, Star, ArrowUpRight, CheckCircle2 } from "lucide-react";

interface BentoGridProps {
  stalls: Stall[];
  onSelectStall: (stall: Stall) => void;
  onOpenDetails: (stall: Stall) => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  stalls,
  onSelectStall,
  onOpenDetails,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {stalls.map((stall) => {
        const signatureDish = stall.menu.find((m) => m.is_signature) || stall.menu[0];

        return (
          <div
            key={stall.id}
            className="group relative rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-teal-500/50 p-4 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/10 flex flex-col justify-between"
          >
            <div>
              {/* Stall Banner Image with Badges */}
              <div className="relative h-44 rounded-xl overflow-hidden mb-3.5 bg-slate-800">
                <img
                  src={stall.banner_url}
                  alt={stall.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Stall Number Tag */}
                <div className="absolute top-2.5 left-2.5 glass-panel px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold text-teal-300 border border-teal-500/40">
                  {stall.stall_number}
                </div>

                {/* Halal / Rating Badges */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  {stall.is_halal && (
                    <span className="bg-emerald-500/90 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow">
                      HALAL
                    </span>
                  )}
                  <span className="glass-panel px-2 py-0.5 rounded-md text-[11px] font-bold text-amber-300 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {stall.rating}
                  </span>
                </div>

                {/* Stall Name & Tagline on banner */}
                <div className="absolute bottom-2.5 inset-x-2.5">
                  <h3 className="text-base font-bold text-white leading-tight drop-shadow-md">
                    {stall.name}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-1">{stall.tagline}</p>
                </div>
              </div>

              {/* Cuisines & Operating Hours */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <div className="flex items-center gap-1 truncate">
                  {stall.cuisines.map((c, i) => (
                    <span key={i} className="text-slate-300">
                      {c}{i < stall.cuisines.length - 1 ? " • " : ""}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-[11px] shrink-0">
                  <Clock className="w-3 h-3 text-teal-400" />
                  <span>{stall.operating_hours.split("-")[0]}</span>
                </div>
              </div>

              {/* Signature Dish Highlight */}
              {signatureDish && (
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 mb-4 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-400 flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Popular Signature
                    </div>
                    <div className="text-xs font-medium text-slate-200 truncate">
                      {signatureDish.name}
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-teal-300 shrink-0">
                    RM {signatureDish.price.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons: 3D Locator & View Full Menu */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
              <button
                onClick={() => {
                  onSelectStall(stall);
                  const el = document.getElementById("explore-3d");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full py-2 px-2.5 rounded-xl text-xs font-semibold text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 transition-all flex items-center justify-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>3D Locate</span>
              </button>

              <button
                onClick={() => onOpenDetails(stall)}
                className="w-full py-2 px-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center gap-1"
              >
                <span>View Menu</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
