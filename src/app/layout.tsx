import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Niaga — Restoran Kim Seng Hawker Platform",
  description:
    "Explore authentic Malaysian hawker stalls in 3D at Restoran Kim Seng. Photo menus managed by stall owners by Digital Niaga (SULAM WIX2001).",
  keywords: [
    "Digital Niaga",
    "Restoran Kim Seng",
    "Hawker Center",
    "Malaysian Street Food",
    "3D Hawker Map",
    "SULAM",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f8f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-canvas text-ink antialiased selection:bg-accent-soft selection:text-ink">
        {children}
      </body>
    </html>
  );
}
