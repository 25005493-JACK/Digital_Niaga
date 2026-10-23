import React from "react";
import Link from "next/link";
import { Store } from "lucide-react";

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
  const iconSize = { sm: "h-8 w-8", md: "h-9 w-9", lg: "h-11 w-11" }[size];
  const textSize = { sm: "text-base", md: "text-lg", lg: "text-xl" }[size];

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className={`${iconSize} flex items-center justify-center rounded-xl bg-accent text-white`}>
        <Store className="h-4 w-4" strokeWidth={2} />
      </span>
      <span className="flex flex-col leading-tight">
        <span className={`${textSize} font-semibold tracking-tight text-ink`}>Digital Niaga</span>
        {showTagline && <span className="text-[10px] font-medium text-muted">Hawker digitalization</span>}
      </span>
    </Link>
  );
};
