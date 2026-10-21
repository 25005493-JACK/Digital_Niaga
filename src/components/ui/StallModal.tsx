"use client";

import React from "react";
import { Stall } from "@/types";
import {
  X,
  MapPin,
  Clock,
  Phone,
  Star,
  CheckCircle2,
  Flame,
  Info,
} from "lucide-react";

interface StallModalProps {
  stall: Stall | null;
  onClose: () => void;
  onLocateIn3D: (stall: Stall) => void;
}

export const StallModal: React.FC<StallModalProps> = ({
  stall,
  onClose,
  onLocateIn3D,
}) => {
  if (!stall) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Container: Bottom Sheet on Mobile, Centered Modal on PC */}
      <div className="relative w-full sm:max-w-2xl max-h-[88dvh] sm:max-h-[85vh] bg-slate-900 border border-slate-700 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        {/* Header Banner */}
        <div className="relative h-44 sm:h-52 w-full bg-slate-800 shrink-0">
          <img
            src={stall.banner_url}
            alt={stall.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full glass-panel text-slate-300 hover:text-white hover:bg-slate-800 transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on Banner */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="glass-panel px-3 py-1 rounded-xl text-xs font-mono font-extrabold text-teal-300 border border-teal-500/40">
              {stall.stall_number}
            </span>
            {stall.is_halal && (
              <span className="bg-emerald-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-xl shadow">
                100% HALAL
              </span>
            )}
            <span className="glass-panel px-2.5 py-1 rounded-xl text-xs font-bold text-amber-300 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {stall.rating}
            </span>
          </div>

          {/* Stall Name */}
          <div className="absolute bottom-3 left-4 right-4">
            <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow">
              {stall.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5 line-clamp-1">
              {stall.tagline}
            </p>
          </div>
        </div>

        {/* Action & Info Bar */}
        <div className="px-5 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 text-xs">
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-400" />
              {stall.operating_hours}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-teal-400" />
              {stall.contact_phone}
            </span>
          </div>

          <button
            onClick={() => {
              onLocateIn3D(stall);
              onClose();
              const el = document.getElementById("explore-3d");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-all flex items-center gap-1.5 shadow"
          >
            <MapPin className="w-3.5 h-3.5" />
            Locate Booth in 3D Map
          </button>
        </div>

        {/* Public Notice Banner (No customer online order) */}
        <div className="mx-5 my-2.5 px-3 py-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300 flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0 text-teal-400" />
          <span>
            <strong>In-Person Dining:</strong> Digital Niaga is a public discovery portal. Please place your order at Booth {stall.stall_number} counter!
          </span>
        </div>

        {/* Scrollable Menu Section */}
        <div className="flex-1 overflow-y-auto px-5 pb-6 pt-1 space-y-4">
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              About This Stall
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
              {stall.description}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Full Photo Menu ({stall.menu.length} items)</span>
              <span className="text-[11px] text-teal-400">All prices in MYR</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stall.menu.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 flex gap-3 transition-colors"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-slate-800 border border-slate-700/60">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-bold text-slate-100 truncate">
                          {item.name}
                        </span>
                        {item.is_signature && (
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                            Signature
                          </span>
                        )}
                        {item.spicy_level ? (
                          <span className="flex items-center text-rose-400 text-[10px]">
                            {Array.from({ length: item.spicy_level }).map((_, i) => (
                              <Flame key={i} className="w-3 h-3 fill-rose-500" />
                            ))}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-sm font-extrabold text-teal-400 mt-1">
                      RM {item.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
