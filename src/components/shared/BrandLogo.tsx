import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = "",
  size = "md",
  showTagline = false,
}) => {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 group transition-transform active:scale-95 ${className}`}
    >
      {/* Brand Icon: Hawker Awning + Location Pin combo */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Awning Canopy */}
          <path
            d="M15 32 C 15 28, 25 24, 50 24 C 75 24, 85 28, 85 32 L 80 44 C 77 44, 75 42, 73 40 C 70 45, 63 45, 60 40 C 57 45, 50 45, 47 40 C 44 45, 37 45, 34 40 C 31 45, 24 45, 20 44 Z"
            fill="#0ea5e9"
          />
          {/* Awning Stripes */}
          <path
            d="M34 25 L 34 42 C 37 44, 43 44, 47 40 L 47 24 Z"
            fill="#0284c7"
          />
          <path
            d="M60 25 L 60 41 C 64 44, 70 44, 73 40 L 73 25 Z"
            fill="#0369a1"
          />
          {/* Location Pin Shape Base */}
          <path
            d="M50 42 C 36 42, 26 52, 26 64 C 26 77, 44 92, 50 96 C 56 92, 74 77, 74 64 C 74 52, 64 42, 50 42 Z"
            fill="#0f172a"
            stroke="#14b8a6"
            strokeWidth="4"
          />
          {/* Pin Center Circle */}
          <circle cx="50" cy="63" r="10" fill="#2dd4bf" />
          {/* Small Top Antenna/Pin */}
          <circle cx="78" cy="22" r="5" fill="#f59e0b" />
          <line x1="74" y1="26" x2="68" y2="34" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <span
          className={`font-black tracking-tight flex items-center gap-1.5 ${textSizes[size]}`}
        >
          <span className="text-slate-100">Digital</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400">
            Niaga
          </span>
        </span>
        {showTagline && (
          <span className="text-[10px] tracking-widest uppercase text-teal-400 font-semibold -mt-1">
            Hawker Digitalization
          </span>
        )}
      </div>
    </Link>
  );
};
