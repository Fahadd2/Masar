# Masar

**Vehicle Fleet Manager** — a React web app for managing a company's vehicles: browse, search, filter,
add, edit and delete vehicles, and see a dashboard of fleet status and upcoming services.

This is **Part 1** (frontend only): data lives in memory and resets when the page reloads. The Admin /
Viewer role switcher in the navbar is a demonstration feature, **not** a security control.

## Requirements

- [Node.js](https://nodejs.org/) 20.19 or newer (includes npm)

## Install

```bash
npm install
```

## Run (development)

```bash
npm run dev
```

Then open <http://localhost:5173>.

## Build (production)

```bash
npm run build
```

The output goes to `dist/`. To preview the production build locally:

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Project structure

```text
src/
├── services/vehicleService.js   the ONLY module that reads or changes vehicle data
├── data/                        seed vehicles and About page team data
├── constants/                   vehicle types, statuses, departments, roles
├── context/                     role and toast state
├── hooks/                       useVehicles, useVehicle, useDocumentTitle
├── utils/                       dates, formatting, validation, filtering, dashboard stats
├── components/                  layout, vehicles, dashboard and common UI components
├── pages/                       one component per route
└── styles/                      design tokens and global styles
```

## Documentation

- [Requirements](docs/REQUIREMENTS.md)
- [Design](docs/DESIGN.md)
