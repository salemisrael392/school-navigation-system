# SR University Campus Wayfinding & Web Portal

An interactive campus navigation and student web portal for **SR University** (Ananthasagar, Hasanparthy, Warangal, Telangana). 

Designed as a modern, responsive web application for desktop, tablet, and mobile browsers, this portal provides interactive wayfinding, architectural vector mapping, building floor plans, class timetable integration, an official campus directory, and emergency assistance services.

---

## Features

- **Interactive Vector Campus Map**:
  - Precision vector blueprint rendering of campus academic blocks (Block A–E), central library, administrative tower, food courts, auditoriums, innovation center, hostels, and sports complexes.
  - Layer toggles for 3D perspective shading, floor levels, greenery zones, and arterial pathways.
  - Simulated GPS location beacon with compass heading visualization.

- **Turn-by-Turn Wayfinding**:
  - Point-to-point routing between any two campus facilities, seminar halls, laboratories, or administrative desks.
  - Live maneuver progression, estimated walking times, distance calculation, and accessible path preferences.

- **Smart Class Timetable & Schedule**:
  - Weekly class schedule with automatic detection of your next upcoming period.
  - One-click navigation link to plot the shortest walking route from your current location directly to the classroom.

- **Campus Directory & Quick Search**:
  - Real-time search across buildings, faculty departments, computer centers, ATMs, cafeterias, and health centers.
  - Instant keyboard navigation shortcut (`/` or `Cmd+K`) to focus search.
  - Category filters with active counts (Academic, Labs, Library, Food, Hostels, Sports, Admin).

- **Freshers Hub & Orientation Guide**:
  - Step-by-step checklist for new student registration, ID card issuance, Wi-Fi onboarding, and library cards.
  - Essential campus survival tips, gate timings, transportation links, and auto-rickshaw fare guides.

- **Emergency SOS & Campus Safety**:
  - Instant one-tap calling to the 24/7 Campus Security Control Room, University Health Center, Women's Safety Cell, and Ambulance Services.
  - Emergency contact directory with protocols for medical triage and on-campus security.

- **Offline Map & Entry Sync**:
  - Client-side offline campus map caching for low-connectivity zones.
  - QR scanner to instantly load entry gate wayfinding routes at Gates 1 & 2.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation**: [Motion](https://motion.dev/)

---

## Getting Started

### Prerequisites

- Node.js (version 18.x or later recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/sru-campus-portal.git
   cd sru-campus-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure any optional API keys or base URLs.

4. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build

To compile the production-ready optimized build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## License

This project is licensed under the MIT License.
