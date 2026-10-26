# Digital Niaga (1Main Food District Demo)
*A Modern Hawker Digitalization Platform — Universiti Malaya SULAM Initiative (WIX2001)*

---

## 🌟 Overview

**Digital Niaga** is a web-based hawker digitalization application engineered to empower local Malaysian hawkers. It bridges the gap between public customer discovery and seamless back-of-house operations:
1. **Public Discovery Portal**: Search stalls and dishes, view verified photo menus and prices, and interactively explore stall booth locations in a **3D Hawker Centre spatial layout** (No online customer orders).
2. **Cashier Point of Sale (POS)**: Touch-friendly chit creation, table numbers / takeaway tags, simulated QR payment or cash collection, and digital receipt generation.
3. **Kitchen Display System (KDS)**: Order updates between tabs in the same browser, audible chimes, and one-touch status progression (`Pending` $\rightarrow$ `Preparing` $\rightarrow$ `Ready` $\rightarrow$ `Completed`).
4. **Stall Filtering**: Each stall's orders and menu appear separately in the browser demo.

This is a prototype. The QR images are examples and cannot receive payment. Orders live in browser storage, so receipt links and kitchen updates work only in the same browser profile. Authentication, secure cross-device sync, and payment integration are required before production use.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript)
- **Styling & Components**: [Tailwind CSS](https://tailwindcss.com/), [Aceternity UI](https://ui.aceternity.com/) patterns, [Lucide React](https://lucide.dev/)
- **3D Spatial Engine**: [Three.js](https://threejs.org/), [@react-three/fiber](https://r3f.docs.pmnd.rs/), [@react-three/drei](https://github.com/pmndrs/drei)
- **Optional database schema reference**: [Supabase](https://supabase.com/) PostgreSQL with Row Level Security (not connected to the prototype order flow)
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

### 4. Optional: Supabase Schema Reference
To inspect the draft database schema:
1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and execute the script in [`supabase/schema.sql`](./supabase/schema.sql).
3. Create `.env.local` based on [`.env.example`](./.env.example):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

The SQL file is a starting schema with authenticated order policies. The prototype has no sign-in flow or matching seeded stall IDs, so setting credentials alone does not enable cross-device orders or public receipts. Do not deploy it as a production system without completing those pieces.

### Checks

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

For the optional Chrome interaction test, start the built app with `npm run start -- -p 3087` in one terminal, then run `npm run test:browser` in another. Set `BROWSER_PATH` if Chrome is installed elsewhere.

---

## 📱 Page & Feature Directory

- **`/`**: Public Discovery Landing Page with interactive 3D map of 1Main Food District, autocomplete search bar, and Bento stall grid.
- **`/pos`**: Cashier Point of Sale terminal with simulated QR payment, cash collection, and digital receipts.
- **`/kitchen`**: Kitchen Display System with live tickets and audio alert chimes.
- **`/portal`**: Hawker Owner & Staff Hub for switching stalls (#01 to #08) and operational roles.
- **`/receipt/[orderId]`**: Digital receipt with cooking status in the browser profile where the order was created.

---

## 🚢 Deploying to Vercel

1. Push this repository to GitHub or GitLab.
2. Import the project into your [Vercel Dashboard](https://vercel.com/new).
3. Click **Deploy** to host the prototype. A hosted build still stores orders locally in each browser; it is not a shared production POS.
