"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight, Clock, MapPin, Star } from "lucide-react";
import { Stall } from "@/types";

interface BentoGridProps {
  stalls: Stall[];
  onSelectStall: (stall: Stall) => void;
  onOpenDetails: (stall: Stall) => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ stalls, onSelectStall, onOpenDetails }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {stalls.map((stall) => {
      const signatureDish = stall.menu.find((item) => item.is_signature) || stall.menu[0];
      return (
        <article key={stall.id} className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-md">
          <div className="relative h-44 w-full overflow-hidden bg-surface-subtle">
            <Image
              src={stall.banner_url}
              alt={stall.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <span className="absolute left-3 top-3 rounded-lg bg-white/95 px-2 py-1 text-[11px] font-semibold text-ink shadow-sm">
              {stall.stall_number}
            </span>
          </div>
          <div className="flex flex-1 flex-col p-4">
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="text-base font-semibold leading-snug text-ink">{stall.name}</h3>
              <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-secondary">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {stall.rating}
              </span>
            </div>
            <p className="line-clamp-2 text-xs leading-relaxed text-muted">{stall.tagline}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
              <span>{stall.cuisines.join(" · ")}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{stall.operating_hours.split("-")[0]}</span>
            </div>
            {signatureDish && (
              <div className="mt-4 flex items-center justify-between gap-2 rounded-xl bg-surface-subtle px-3 py-2 text-xs">
                <span className="truncate text-secondary">{signatureDish.name}</span>
                <span className="shrink-0 font-semibold text-accent">RM {signatureDish.price.toFixed(2)}</span>
              </div>
            )}
            <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
              <button
                type="button"
                onClick={() => {
                  onSelectStall(stall);
                  document.getElementById("explore-3d")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-line px-3 py-2 text-xs font-semibold text-secondary transition-colors hover:border-accent/40 hover:text-accent"
              >
                <MapPin className="h-3.5 w-3.5" /> Locate
              </button>
              <button
                type="button"
                onClick={() => onOpenDetails(stall)}
                className="inline-flex items-center justify-center gap-1 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                View menu <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </article>
      );
    })}
  </div>
);
