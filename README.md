# Digital Niaga (1 Utama Food District Demo)
*A Modern Hawker Digitalization Platform — Universiti Malaya SULAM Initiative (WIX2001)*

---

## 🌟 Overview

**Digital Niaga** is a web-based hawker digitalization application engineered to empower local Malaysian hawkers. It bridges the gap between public customer discovery and seamless back-of-house operations:
1. **Public Discovery Portal**: Search stalls and dishes, view verified photo menus and prices, and interactively explore stall booth locations in a **3D Hawker Centre spatial layout** (No online customer orders).
2. **Cashier Point of Sale (POS)**: Fast touch-optimized chit creation, table numbers / takeaway tags, DuitNow QR display, manual payment verification, and digital receipt generation.
3. **Kitchen Display System (KDS)**: Real-time ticket dispatch powered by **Supabase Realtime WebSockets** with audible chimes and one-touch status progression (`Pending` $\rightarrow$ `Preparing` $\rightarrow$ `Ready` $\rightarrow$ `Completed`).
4. **Stall Isolation**: Multi-tenant architecture ensuring each hawker operates independently with private orders and menus.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript)
- **Styling & Components**: [Tailwind CSS](https://tailwindcss.com/), [Aceternity UI](https://ui.aceternity.com/) patterns, [Lucide React](https://lucide.dev/)
- **3D Spatial Engine**: [Three.js](https://threejs.org/), [@react-three/fiber](https://r3f.docs.pmnd.rs/), [@react-three/drei](https://github.com/pmndrs/drei)
- **Database & Realtime**: [Supabase](https://supabase.com/) (PostgreSQL + Realtime WebSockets + Row Level Security)
- **Deployment**: [Vercel](https://vercel.com/) Edge Network

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node 20 / 24)
- npm or pnpm

### 2. Installation
```bash
npm install
```

### 3. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> [!NOTE]
> The prototype includes an automatic in-browser reactive state broadcaster (`BroadcastChannel` + `localStorage`). You can test the realtime Cashier $\leftrightarrow$ Kitchen integration immediately without setting up a remote database.

### 4. Optional: Supabase Setup
To connect your production Supabase database:
1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and execute the script in [`supabase/schema.sql`](./supabase/schema.sql).
3. Create `.env.local` based on [`.env.example`](./.env.example):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

---

## 📱 Page & Feature Directory

- **`/`**: Public Discovery Landing Page with interactive 3D map of 1 Utama Food District, autocomplete search bar, and Bento stall grid.
- **`/pos`**: Cashier Point of Sale terminal with DuitNow QR verification modal and digital receipts.
- **`/kitchen`**: Kitchen Display System with live tickets and audio alert chimes.
- **`/portal`**: Hawker Owner & Staff Hub for switching stalls (#01 to #08) and operational roles.
- **`/receipt/[orderId]`**: Live customer-facing digital receipt with real-time cooking status.

---

## 🚢 Deploying to Vercel

1. Push this repository to GitHub or GitLab.
2. Import the project into your [Vercel Dashboard](https://vercel.com/new).
3. (Optional) Add your Supabase environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. Vercel will automatically configure the build and provide an HTTPS production URL.
