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

## Run tests

Run all unit and integration tests once:

```bash
npm test
```

Run them with a coverage report (summary in the terminal, full HTML report in `coverage/index.html`):

```bash
npm run test:coverage
```

Tests always use 2026-10-17 as "today", so they give the same results on any date. The latest
results are in [docs/TEST_REPORT.md](docs/TEST_REPORT.md).

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
├── styles/                      design tokens and global styles
├── test/                        test setup and render helper
└── __tests__/                   integration tests (unit tests sit next to the code in __tests__/)
```

## Documentation

- [Requirements](docs/REQUIREMENTS.md): scope, data model, validation rules, user stories
- [Design](docs/DESIGN.md): wireframes, style guide, components, UX behaviour, diagrams
- [Architecture](docs/ARCHITECTURE.md): layers, technology stack, data flow, state, routing
- [Test report](docs/TEST_REPORT.md): latest test results and coverage
- [Code review](docs/CODE_REVIEW.md): findings and fixes
