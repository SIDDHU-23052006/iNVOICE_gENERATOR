# Workspace

## Overview

YASI — a premium SAP-style invoice generator (Finance Module) built as a React + Vite single-page web app. All data persists in localStorage (no backend required).

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript**: 5.9
- **Frontend**: React + Vite + Tailwind + shadcn/ui + wouter + framer-motion
- **PDF**: jspdf + html2canvas

## Artifacts

- `artifacts/yasi` — YASI invoice generator (React + Vite, served at `/`)
- `artifacts/api-server` — Express API server (currently only health route)
- `artifacts/mockup-sandbox` — Canvas mockup sandbox

## YASI Pages

- `/` — Intro / landing page with premium gradient hero
- `/login` — Sign Up (Organization or Individual) / Sign In
- `/app/invoice` — Main invoice editor with live tax calculations, preview & PDF download
- `/app/profile` — Profile + invoice preferences

## YASI Storage Keys

- `yasi_profile` — organization or individual profile + branding (logo/signature/stamp base64)
- `yasi_preferences` — currency, invoice number format, tax mode, defaults
- `yasi_draft_invoice` — auto-saved current invoice draft

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/yasi run dev` — run YASI locally (use the workflow instead)
