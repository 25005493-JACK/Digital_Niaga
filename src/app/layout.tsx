import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Niaga — 1 Utama Food District Hawker Platform",
  description:
    "Explore authentic Malaysian hawker stalls in 3D at 1 Utama Food District. Integrated cashier-to-kitchen ordering system by Digital Niaga (SULAM WIX2001).",
  keywords: [
    "Digital Niaga",
    "1 Utama Food District",
    "Hawker Center",
    "Malaysian Street Food",
    "3D Hawker Map",
    "SULAM",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#090d16",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090d16] text-slate-100 antialiased selection:bg-teal-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
