# Video Presentation Context Digital Niaga

This brief is for the **1 Utama Food District** pilot presentation under the **Universiti Malaya SULAM Initiative (WIX2001)**. The percentages below are project targets, not results already achieved. Digital Niaga provides a public stall discovery portal with an interactive 3D spatial layout, alongside lightweight cashier Point of Sale (POS) and kitchen display order routing for hawkers; it does not process live monetary transactions in the prototype demo, replace formal enterprise ERP systems, or guarantee customer footfall increases.

---

## 1 Project aim

Digital Niaga addresses a persistent operational and visibility problem faced by traditional food court hawkers and micro-entrepreneurs: high customer discovery friction, manual handwritten chit errors during peak hours, miscommunication between cashier counters and hot kitchens, and the prohibitive subscription and hardware costs of commercial POS systems.

Through the platform:
- **Diners and visitors** can interactively explore the food district in a **3D spatial layout**, search stalls and dishes, verify prices and photos, and filter by dietary requirements (such as Halal / Muslim-friendly options) without needing account sign-ups or proprietary mobile app downloads.
- **Hawker cashiers** can rapidly record dine-in table numbers or takeaway tags, log custom dish notes, validate cash tender or present DuitNow QR, and instantly print/generate digital customer receipts.
- **Kitchen staff** receive live order chits with audible alerts on a dedicated **Kitchen Display System (KDS)**, advancing ticket statuses (`Pending` $\rightarrow$ `Preparing` $\rightarrow$ `Ready` $\rightarrow$ `Completed`) with zero paper waste.

The app supports structured order handling and transparent discovery; physical food preparation and cash handling remain the stall operators' responsibility.

The project directly advances:
- **SDG 8: Decent Work and Economic Growth** — Empowering informal micro-enterprises and hawkers with accessible, zero-cost digital operational tools to improve business resilience and worker efficiency.
- **SDG 9: Industry, Innovation, and Infrastructure** — Introducing modern spatial web technologies (3D WebGL / Three.js) and real-time event routing to grassroots community food service.
- **SDG 11: Sustainable Cities and Communities** — Preserving and celebrating heritage Malaysian street food and local hawker culture within modern urban commercial centers.

---

## 2 Success criteria

After one month of pilot deployment and structured simulation across stalls at the 1 Utama Food District, the team will collect qualitative and quantitative feedback from participating hawker operators (cashiers, cooks) and food court diners through a post-pilot survey and structured interviews. The primary satisfaction target is **at least 75% positive feedback** among survey respondents. The team will report the total number of responses and the response rate alongside that percentage, while documenting workflow bottlenecks and suggested interface refinements.

The pilot will also compare order-to-kitchen transmission delays and order transcription error rates against documented pre-pilot manual operations, alongside tracking daily stall usage. These measures are targets for evaluation, not claims that the application has already altered overall commercial turnover.

---

## 3 Measurable goals

| Goal | One-month target | How it will be measured |
| :--- | :--- | :--- |
| **Order Transmission Clarity & Error Reduction** | 25% fewer lost, misread, or duplicate food orders compared to manual paper chit baseline | Compare recorded kitchen order discrepancies during peak meal hours (12:00 PM–2:00 PM; 6:30 PM–8:30 PM) against pre-pilot manual paper chit logs. Track voided/re-cooked plates per 100 orders. |
| **Merchant & Diner Adoption** | At least 6 out of 8 pilot stalls active daily; at least 60% of diners discover stalls via the web portal | Monitor daily POS/KDS session activity across pilot stalls (`stall-01` to `stall-08`). Measure public portal page visits, 3D booth inspections, and search autocomplete interactions via web analytics. |
| **Positive User Feedback** | At least 75% of surveyed hawkers and diners rate Digital Niaga positively | Distribute standardized post-pilot questionnaires (System Usability Scale and Likert questions) assessing POS speed, KDS ticket legibility, and 3D portal ease of navigation. Report positive count, total sample, and response rate. |

> *Note:* Increased customer volume during initial promotional testing may cause an apparent spike in overall order tickets. The evaluation will evaluate order throughput times and cooking status progression separately from total volume before attributing operational improvements to digital chit dispatch.

---

## 4 Background

The team conducted stakeholder field research with hawker operators at **1 Utama Food District** (Rainforest Wing, Petaling Jaya). Stall operators highlighted several operational hurdles:
1. **Peak-Hour Chit Chaos**: In peak lunch and dinner rushes, handwritten paper chits get grease-stained, misplaced, or misread by kitchen cooks working over high-flame woks, leading to delayed food preparation and customer disputes.
2. **High Barriers of Commercial POS**: Commercial proprietary POS solutions require proprietary terminal hardware, costly installation fees, and 2%–4% transaction fees or monthly SaaS subscriptions that thin-margin hawkers cannot justify.
3. **Customer Navigation Friction**: The Food District houses diverse food stalls across a large floor area. Diners frequently struggle to locate specific stalls, verify whether a booth is Halal-certified, or view dish prices without walking from stall to stall.

Digital Niaga resolves these pain points by offering a lightweight, responsive web application usable on any existing smartphone, tablet, or laptop. It pairs a **3D spatial stall discovery map** for mall patrons with an **isolated Cashier POS and reactive Kitchen KDS** for stall staff, requiring zero dedicated hardware.

---

## 5 Stakeholders, collaborators, and end users

| Group | Role in the pilot |
| :--- | :--- |
| **Hawker Stall Operators & Cooks** | Primary end users; operate the touch POS at the counter, view incoming kitchen tickets on the KDS, advance cooking statuses, and provide operational feedback. |
| **Food Court Diners & Mall Patrons** | End users; search stalls, explore dishes via the 3D map, check prices and dietary tags, and view live order progress on digital receipts. |
| **Food District Management / Supervisor** | Collaborator; reviews floor plan accuracy, stall booth numbering, operating hours, and pilot readiness. |
| **Project Team** | Designs, builds, tests, deploys, documents, and evaluates the system. |

### Project team responsibilities

| Responsibility | Team member | Assigned contribution |
| :--- | :--- | :--- |
| **Project & App Building Lead** | Tan Wei Feng | Lead overall project execution, system architecture, app development, and presentation. |
| **Project Assistant Lead** | Lee Xin Yi | Assist project leadership, team coordination, task alignment, and presentation support. |
| **App Building** | Teo Zheng Xi | Build application features, user interfaces, and order processing workflows. |
| **App Building** | Teoh Xi Xian | Build application features, reactive state management, and component testing. |
| **Documentation, Reports & Video** | Yee Fei | Lead compilation of project reports, milestone documentation, and video production. |
| **Documentation, Reports & Video** | Ying Chen | Prepare milestone reports, documentation assets, and presentation video materials. |
| **Finance, Timeline & Progress Tracking** | Su Ann | Manage project budget and finance records, timeline tracking, and progress monitoring. |
| **Community & Collaborator Engagement** | Hon Win | Approach community stakeholders, liaise with food court collaborators, and gather feedback. |
| **Community & Collaborator Engagement** | Calvin | Approach community stakeholders, conduct merchant outreach, and coordinate pilot reviews. |

---

## 6 Project scope

### In scope
- **Public Discovery Web Portal**: Responsive landing page with Aceternity UI, multi-category dish search, dietary filters (Halal / Muslim-friendly), and an interactive **Three.js 3D spatial floor plan** representing the 8 booths of 1 Utama Food District.
- **Cashier Point of Sale (POS)**: Touch-optimized menu ordering, dine-in table number / takeaway tags, custom item notes, strict cash tender validation with change calculation, simulated DuitNow QR presentation, and instant receipt generation.
- **Kitchen Display System (KDS)**: Real-time ticket dispatch, Web Audio API chimes for incoming chits, active elapsed timers, and one-touch status progression (`Pending` $\rightarrow$ `Preparing` $\rightarrow$ `Ready` $\rightarrow$ `Completed`).
- **Staff Workspace Portal**: Multi-tenant stall switcher allowing operators to toggle between Booth #01 through Booth #08 with isolated POS and KDS workflows.
- **Customer Digital Receipt**: Dedicated tracking URL (`/receipt/[orderId]`) reflecting live kitchen preparation updates.
- **Bilingual Interface Support**: Formatted with standard Malaysian Ringgit (`RM`) pricing and accessible English / Bahasa Malaysia operational labels.

### Deliverables and handover
- Deployed web application hosted on Vercel with mobile, tablet, and desktop browser compatibility.
- Merchant Quick-Start Guide covering cashier chit logging, cash handling checks, and kitchen ticket management.
- 1 Utama Food District 3D Booth coordinate dataset and verified stall menu database.
- Comprehensive Test Summary covering unit tests, Playwright browser smoke test, layout validation (375 px and 1280 px), and known prototype limitations.
- One-month pilot evaluation report detailing survey feedback, order throughput metrics, and cloud scaling recommendations.

### Out of scope
- Live banking clearing or real money acquisition (DuitNow QR display is simulated; live payment requires formal commercial merchant acquiring integration via PayNet/e-wallet APIs).
- Automated customer delivery dispatch or external rider fleet integration (focus is exclusively on walk-in dine-in and self-pickup takeaway).
- Full enterprise inventory stock procurement, supplier ledger, or automated ingredient depletion ERP.
- Remote customer mobile pre-ordering (customer portal is discovery-only to prevent fake or unpaid order chits flooding the kitchen).

### Milestones

| Week | Planned work | Presentation evidence or output |
| :---: | :--- | :--- |
| **1–2** | Project ideation & problem scoping | Problem statement, hawker digitalization pain points, and concept pitch |
| **3** | Stakeholder & collaborator identification; hawker interviews | Hawker interview logs, food court observations, and user journey maps |
| **4** | Proposal presentation | Formal scope, architecture blueprint, and measurable success criteria |
| **5–6** | Prototype building & interim demo | Interactive 3D food court prototype and mobile POS walkthrough |
| **7** | End-product building | Synchronized Cashier POS $\leftrightarrow$ Kitchen KDS reactive order pipeline |
| **8** | Testing, quality assurance & deployment | Playwright test suites, unit tests, and production Vercel deployment |
| **9–10** | Pilot run & feedback collection | Hawker and diner survey responses, issue logs, and usability evaluation |
| **11–12** | Final task preparation | Comprehensive project report, documentation package, and demonstration video |
| **12** | Final submission | Final production build, code repository, and handover documentation |

### Stakeholder reviews and feedback

*Hon Win and Calvin coordinate stakeholder outreach, invitations, and consultation feedback records with hawker operators and food court representatives.*

| Week | Review or contact | Intended participants | Feedback and decision record |
| :---: | :--- | :--- | :--- |
| **3** | Interview on peak-hour order bottlenecks & menu visibility | Hawker stall operators, cooks, and project team | Interview findings documented; established need for zero-hardware POS and public 3D menu discovery. |
| **4** | Proposal & scope alignment review | Food court supervisor, stall representatives, and project team | Confirmed pilot scope (8 stalls), measurable targets, and exclusion of live delivery fleets. |
| **6** | Interactive prototype walkthrough (mobile & tablet) | Invited cashiers and kitchen cooks | Evaluated touch button sizing, category navigation, and high-contrast kitchen ticket readability. |
| **8** | Pilot-readiness & order flow end-to-end check | Stall cashiers, kitchen staff, and project team | Verified cash calculation safety checks, sound alert triggers, and browser tab synchronization. |
| **9–10** | Mid-pilot feedback & usability check | Participating stall staff and food court diners | Gathered survey responses; documented feedback on peak rush chit sorting and mobile layout clarity. |
| **12** | Final handover & evaluation review | Stall operators and project team | Delivered merchant user guides, test summary, pilot evaluation report, and technical recommendations. |

---

## 7 Technical requirements

| ID | Requirement | Acceptance evidence |
| :--- | :--- | :--- |
| **TR1** | Responsive web interface optimized for mobile phones (375 px), tablets, and desktop terminals (1280 px+), using Tailwind CSS and Aceternity UI components with zero horizontal overflow. | Visual verification across standard breakpoints; responsive navigation bar and touch-friendly buttons on mobile. |
| **TR2** | Multi-tenant stall isolation supporting 8 independent food booths (`stall-01` to `stall-08`), ensuring each stall's POS chits and kitchen tickets remain strictly segregated. | Selecting a stall filters POS catalog and KDS orders to that specific booth; verified via staff portal switcher. |
| **TR3** | Interactive 3D spatial layout using Three.js, React Three Fiber, and Drei, rendering the 1 Utama Food District booths with camera focus transitions and interactive stall modals. | Clicking any 3D booth smoothly pans the camera, highlights the stall, and displays verified photo menus, pricing, and operating details. |
| **TR4** | Touch-optimized Cashier POS supporting dine-in/takeaway toggles, table numbers, item variant notes, DuitNow QR simulation, and strict cash tender calculation. | POS confirms orders only when tendered cash $\ge$ total bill; validates invalid/empty numeric inputs. |
| **TR5** | Real-time Kitchen Display System (KDS) with sub-second order dispatch via reactive browser event broadcasting (`BroadcastChannel` + `localStorage` / Supabase Realtime) and Web Audio API chimes. | Submitting an order on `/pos` instantly renders a ticket on `/kitchen` with an audible dual-tone chime and color-coded status badge. |
| **TR6** | Customer digital receipt generation (`/receipt/[orderId]`) providing live visual updates on kitchen progress (`Pending` $\rightarrow$ `Preparing` $\rightarrow$ `Ready` $\rightarrow$ `Completed`). | Advancing ticket status in the KDS immediately updates the customer's open receipt view. |
| **TR7** | Robust code quality, automated test coverage, and clear empty/loading error states. | `npm test` passes for store logic and order numbering; Playwright browser smoke test executes POS-to-KDS-to-Receipt flow without errors; TypeScript typecheck passes with zero warnings. |
| **TR8** | Cloud deployment configuration on Vercel with environment variable isolation, Supabase PostgreSQL schema reference with Row-Level Security, and zero committed secrets. | Production build deployed to Vercel Edge; HTTPS access verified; draft database schema documented in `supabase/schema.sql`. |

### Technical setup and resources

| Component or resource | Purpose |
| :--- | :--- |
| **Next.js 14 (App Router), React 18, TypeScript** | Unified framework for responsive front-end pages, routing, and type-safe data handling. |
| **Tailwind CSS & Aceternity UI** | High-performance styling, modern bento-grid layouts, floating navigation, and accessible UI controls. |
| **Three.js, @react-three/fiber, @react-three/drei** | WebGL 3D spatial engine rendering the interactive 1 Utama Food District floor plan. |
| **BroadcastChannel API & LocalStorage Store** | Client-side event broadcasting for reactive, zero-latency POS $\leftrightarrow$ KDS $\leftrightarrow$ Receipt synchronization across tabs. |
| **Web Audio API** | Synthesizes clean dual-tone chimes (587 Hz / 880 Hz) on incoming kitchen orders without relying on external audio assets. |
| **Supabase PostgreSQL & Row Level Security (RLS)** | Architectural reference schema defining tables (`hawker_centres`, `stalls`, `menu_items`, `orders`) and security policies for multi-outlet expansion. |
| **Vercel Edge Network** | Production cloud hosting and static asset delivery. |
| **Node.js Test Runner & Playwright Core** | Automated unit tests and end-to-end browser smoke tests validating core order transactions. |
| **Stall Tablets, Smartphones, and Laptops** | Merchant POS terminals, kitchen monitors, and customer mobile devices using standard web browsers (Chrome, Safari, Edge). |

---

## 8 Project priority matrix

The matrix ranks project deliverables by expected operational pilot value and development effort. Core chit reliability and kitchen communication take precedence over optional visual embellishments.

| Impact / effort | Lower effort | Higher effort |
| :--- | :--- | :--- |
| **High impact** | Strict cash calculation checks; audible Web Audio chimes; clear order status badges; RM currency formatting; dietary (Halal) filter tags. | Interactive 3D spatial food district floor plan; synchronized POS-to-KDS reactive event bus; multi-tenant stall switcher; responsive mobile POS layout. |
| **Lower impact** | Confetti celebrations on order completion; stall search autocomplete; receipt copy-link helpers. | Future live merchant acquiring payment gateway (PayNet DuitNow API); cloud multi-branch accounting analytics; customer SMS notifications. |

**Pilot Implementation Order:**
1. **Core POS & Cash Handling**: Touch ordering, cart manipulation, and payment validation.
2. **KDS & Reactive Dispatch**: Real-time ticket dispatch, audible chimes, and status progression.
3. **3D Spatial Discovery Portal & Digital Receipts**: Stall finder, interactive booth models, and live customer receipts.
4. **Multi-Tenant Isolation & Cloud Architecture**: Role-based access schemas and production deployment.

---

## 9 Process breakdown structure

| ID | Process and sub-process | Planned output | Weeks |
| :---: | :--- | :--- | :---: |
| **1.0** | **Discover the problem** | Agreed 1 Utama Food District problem statement | 1–3 |
| 1.1 | Identify stakeholders and conduct hawker interviews | Interview notes, peak-hour bottlenecks, and user needs | 3 |
| 1.2 | Catalog stalls, booth floor plans, and pricing structures | 8-booth stall inventory and initial technical requirements | 3–4 |
| **2.0** | **Plan and prototype** | Approved project proposal and UI/UX prototypes | 4–6 |
| 2.1 | Define pilot scope, success metrics, and payment/security limits | Formal proposal and evaluation plan | 4 |
| 2.2 | Design mobile POS wireframes, KDS ticket layouts, and 3D booth models | Wireframes, 3D prototypes, and stakeholder feedback | 5–6 |
| **3.0** | **Build the pilot** | Functional Digital Niaga web application | 7–8 |
| 3.1 | Implement 3D discovery portal, search input, and Bento stall grid | Public discovery interface | 7 |
| 3.2 | Build Cashier POS, payment modals, and Kitchen Display System | Merchant order execution engine | 7–8 |
| 3.3 | Implement automated test suites, responsive checks, and Vercel release | Verified build and production deployment | 8 |
| **4.0** | **Run and evaluate** | Pilot operational evidence | 9–10 |
| 4.1 | Simulate peak meal shifts across pilot stalls with live ticket routing | Daily order history and ticket turnaround metrics | 9–10 |
| 4.2 | Collect post-pilot survey feedback from operators and diners | Survey analysis, usability metrics, and gap analysis | 9–10 |
| **5.0** | **Present and hand over** | Final project submission materials | 11–12 |
| 5.1 | Record demonstration video, prepare infographics, and compile report | Presentation video, slides, and user guides | 11–12 |
| 5.2 | Submit the app, evidence, and evaluation | Final submission package | 12 |

---

## Pilot operating loop

1. **Discovery**: The diner accesses the public web portal on their smartphone or laptop, exploring the 3D model of 1 Utama Food District to locate stalls, inspect verified dish photos, and review prices.
2. **Order Creation**: At the stall counter, the cashier selects dishes on the touch-friendly POS, logs the table number or takeaway preference, and enters the tendered payment.
3. **Dispatch**: The POS validates the cash amount or displays the DuitNow QR, generates a customer receipt, and broadcasts the order to the kitchen.
4. **Kitchen Intake**: The stall's Kitchen Display System receives the ticket in real time, plays an audible chime, and displays the dish breakdown and notes under `Pending`.
5. **Preparation**: Kitchen cooks tap **"Start Cooking"**, shifting the order status to `Preparing`. When plated, they tap **"Food Ready for Pickup"**, moving the status to `Ready`.
6. **Customer Pickup**: The diner checks their digital receipt URL on their phone, sees that their meal is ready, and collects their tray from the booth counter.
7. **Completion**: Kitchen or cashier staff mark the ticket as `Completed`, clearing the active queue while logging the order in daily records.
