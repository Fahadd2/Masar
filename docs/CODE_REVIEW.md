# Masar — Code Review

| | |
|---|---|
| **Project** | Masar — Vehicle Fleet Manager (Part 1) |
| **Reviewed revision** | `ad15e9a` (all of `src/`, `index.html`, `package.json`, `vite.config.js`, `eslint.config.js`) |
| **Fixes** | `0fa77df` (dependency upgrade during test setup), `9c4dbc0` (review fixes) |
| **Date** | 2026-10-17 |

`file:line` references point to the **reviewed revision `ad15e9a`**. Lines of fixed findings have
since moved or been removed.

## Method

1. Read every source file, looking at the five areas below.
2. Ran `npm run lint`, `npm audit` and the test suite (`npm test`, `npm run test:coverage`).
3. Checked the running app in a browser at 320 px, 375 px and desktop widths, with keyboard only.
4. Fixed every **High** and **Medium** finding (and the cheap Low ones), added tests for them, then
   re-ran lint, build and tests.

Severity: **High** — wrong behaviour, data loss or an exploitable weakness in Part 1. **Medium** — a
real defect or risk with limited impact, or one that would become a problem in Part 2. **Low** — a
minor issue, an edge case or a style concern.

## Summary

| Severity | Found | Fixed | Accepted |
|---|---:|---:|---:|
| High | 0 | 0 | 0 |
| Medium | 4 | 4 | 0 |
| Low | 22 | 7 | 15 |
| **Total** | **26** | **11** | **15** |

No High findings were found. All four Medium findings are fixed.

**After the fixes** (`9c4dbc0`): `npm run lint` → 0 errors, 0 warnings · `npm run build` → success ·
`npm test` → 175 / 175 tests pass · `npm audit` → 0 vulnerabilities.

## Important: what is *not* a security control (NFR-24)

- **The Admin/Viewer role switcher is not security.** The role is a value in React state that anyone
  can change with one click, or by editing JavaScript in their own browser. Hiding buttons and the
  `RequireAdmin` route guard only demonstrate role-based UI.
- **Client-side validation is not security.** `validateVehicle` runs in the form *and* in
  `vehicleService`, but both run in the user's browser and can be bypassed.

This is acceptable in Part 1 only because there is no server and no shared data: each user can only
change the in-memory copy in their own browser tab, which resets on reload. **Part 2 must add real
authentication, server-side authorization (reject create/update/delete from non-Admins with 403)
and server-side validation.** Without those, SEC-1 and SEC-2 would be **High**.

---

## 1. Security

| ID | Severity | File:line | Finding | Recommendation | Status |
|---|---|---|---|---|---|
| SEC-1 | Low (Part 1) | `src/context/RoleContext.jsx:9`, `src/components/layout/RequireAdmin.jsx:8` | The role is client-side state; anyone can switch to Admin. `RequireAdmin` only hides pages. | Part 2: authenticate users and enforce the role on the server for every `POST`/`PUT`/`DELETE`. | Accepted — by design for Part 1 (REQUIREMENTS §7.3, NFR-24); High priority for Part 2. |
| SEC-2 | Low (Part 1) | `src/utils/validateVehicle.js:68`, `src/services/vehicleService.js:59` | All validation runs in the browser and can be bypassed. | Part 2: repeat every rule in REQUIREMENTS §2.2 on the server. | Accepted — by design for Part 1; required in Part 2. |
| SEC-3 | Medium | `package.json` (devDependencies) | Vitest 3.2.7 brought in `tinypool` and `@vitest/mocker` versions with 2 critical and 2 moderate advisories (prototype pollution → code execution, path traversal). Development-only: not in the production bundle (`npm audit --omit=dev` was clean). | Use a Vitest version without the advisories that still supports Vite 7. | **Fixed** in `0fa77df` — Vitest 4.1.12; `npm audit` reports 0 vulnerabilities. |
| SEC-4 | Low | `src/components/vehicles/VehicleForm.jsx:90` | Unexpected save errors showed `error.message` to the user. In Part 2 this could expose server internals (stack traces, SQL messages). | Show fixed, user-friendly messages; log details elsewhere. | **Fixed** in `9c4dbc0` — fixed messages for `NotFoundError` and other errors. |
| SEC-5 | Low | `index.html:1` | No Content-Security-Policy. | Set a CSP header (`default-src 'self'`) on the production host. | Accepted — CSP belongs in the hosting configuration, and Vite's dev server needs inline scripts; add when deploying (Part 2). |
| SEC-6 | Low | `src/pages/VehicleListPage.jsx:47` | The `q` URL parameter has no length limit (the search box has `maxLength={50}`, but a URL can carry more). | Truncate `q` when reading it. | Accepted — `q` is only rendered as text and used in a substring check; a long value costs nothing meaningful. |

**Checks with no finding**

- **XSS:** no `dangerouslySetInnerHTML`, `eval` or HTML built from strings (NFR-22). ESLint enforces
  this (`no-eval`, `no-implied-eval`, `no-restricted-syntax` in `eslint.config.js:39-47`). User text,
  the search term and the 404 path are rendered through JSX, which escapes them.
- **Data access boundary:** only `vehicleService.js` imports the seed data (`no-restricted-imports`,
  verified with a probe file); components receive copies (`structuredClone`).
- **Secrets:** none in the repository; the app makes no network requests.
- **Personal data:** seed driver names are fictional (NFR-25).
- **Production dependencies:** `npm audit --omit=dev` → 0 vulnerabilities.

## 2. Performance

| ID | Severity | File:line | Finding | Recommendation | Status |
|---|---|---|---|---|---|
| PERF-1 | Low | `src/pages/VehicleListPage.jsx:63` | Filtering and sorting run on every render, including renders unrelated to the list (e.g. opening the delete dialog). | Wrap in `useMemo` if the list grows large. | Accepted — O(n log n) on ≤ 1,000 vehicles is well inside NFR-13's 200 ms; `useMemo` adds complexity for no visible gain. |
| PERF-2 | Low | `src/pages/AddVehiclePage.jsx:15`, `src/pages/EditVehiclePage.jsx:18` | Add and Edit load the whole vehicle list only to check plate uniqueness; Edit makes two requests (`getById` + `getAll`). | Part 2: call `isPlateTaken()` on blur instead. | Accepted — free with in-memory data; noted for Part 2. |
| PERF-3 | Low | `src/components/vehicles/VehicleTable.jsx:64-114` | Both the desktop table and the mobile cards are rendered; CSS hides one, doubling DOM nodes. | Render one layout based on a media query. | Accepted — keeps the component simple and free of JavaScript media queries; fine at the expected size. |
| PERF-4 | Low | `src/App.jsx:4-10` | All pages are bundled up front (no code splitting): 304 kB JS, 97 kB gzipped. | Lazy-load pages with `React.lazy` if the app grows. | Accepted — small app; loads well within NFR-14. |
| PERF-5 | Low | `src/components/vehicles/VehicleForm.jsx:48` | The form re-validates all 12 fields on every render (every keystroke). | Validate only changed fields. | Accepted — takes microseconds and keeps cross-field rules always correct. |

## 3. Code quality

| ID | Severity | File:line | Finding | Recommendation | Status |
|---|---|---|---|---|---|
| CQ-1 | Medium | `src/pages/VehicleListPage.jsx:36-37`, `src/pages/VehicleDetailsPage.jsx:53-54` | The delete handlers caught **every** error and told the user the vehicle "no longer exists". In Part 2 a network or server error would be reported as a successful delete by someone else. | Show "no longer exists" only for `NotFoundError`; otherwise a generic "could not be deleted, try again". | **Fixed** in `9c4dbc0` (`DeleteVehicleDialog`); test "reports a vehicle that was already deleted". |
| CQ-2 | Low | `src/utils/filterVehicles.js:30-31` | The sort comparator returned `1` when **both** values were empty, so `compare(a, b)` and `compare(b, a)` were both positive — an inconsistent comparator with engine-dependent order. | Return 0 when both are empty. | **Fixed** in `9c4dbc0`; test added. |
| CQ-3 | Low | `src/components/layout/Layout.jsx:10-17` | The "skip the first render" ref broke under React StrictMode (effects run twice in development), so focus jumped to `<main>` on the first page load. | Compare with the previous pathname instead. | **Fixed** in `9c4dbc0`. |
| CQ-4 | Low | `src/components/common/ConfirmDialog.jsx:41-42, 53, 58` | Fixed element ids (`confirm-dialog-title`) would collide if two dialogs were ever mounted. | Use `useId()`. | **Fixed** in `9c4dbc0`. |
| CQ-5 | Low | `eslint.config.js:7` | ESLint also linted the generated `coverage/` report, giving a spurious warning after `npm run test:coverage`. | Ignore `coverage`. | **Fixed** in `9c4dbc0`. |
| CQ-6 | Low | `src/services/vehicleService.js:32` | `resetVehicleData()` is exported mainly so tests can start from fresh data — a test hook in production code. | Keep it documented; remove in Part 2. | Accepted — also used at startup, clearly commented, and it disappears when the service calls the API. |
| CQ-7 | Low | `src/components/vehicles/VehicleForm.jsx:158` | Error-summary links use `document.getElementById` to focus fields. | Use refs. | Accepted — field ids equal the field names and are unique on the page; 12 refs would add complexity. |

## 4. Code reuse

| ID | Severity | File:line | Finding | Recommendation | Status |
|---|---|---|---|---|---|
| REUSE-1 | Medium | `src/pages/VehicleListPage.jsx:24-43, 140-149`, `src/pages/VehicleDetailsPage.jsx:41-59, 153-162` | The whole delete flow (dialog state, role-switch reset, service call, success/error toasts, dialog markup) was duplicated in two pages, which is how CQ-1 ended up in both. | Extract one component. | **Fixed** in `9c4dbc0` — `components/vehicles/DeleteVehicleDialog.jsx` (also replaces `DeleteMessage.jsx`). |
| REUSE-2 | Low | `src/pages/VehicleDetailsPage.jsx:73-83`, `src/pages/EditVehiclePage.jsx:26-36` | Identical "Vehicle not found / Couldn't load" blocks. | Extract one component. | **Fixed** in `9c4dbc0` — `components/vehicles/VehicleNotFound.jsx`. |
| REUSE-3 | Low | `src/pages/DashboardPage.jsx:28`, `src/pages/VehicleListPage.jsx:69-75` | The "Couldn't load vehicles / Try again" error state is written twice. | Extract a `LoadError` component. | Accepted — two short uses of the shared `EmptyState`; another component adds little. |

## 5. Accessibility

| ID | Severity | File:line | Finding | Recommendation | Status |
|---|---|---|---|---|---|
| A11Y-1 | Medium | `src/components/common/FormField.jsx:10`, `src/components/vehicles/VehicleForm.jsx:98-111` | Required fields were shown only by an asterisk that is hidden from screen readers (`aria-hidden`), and inputs had no `aria-required`, so screen-reader users were not told which fields are required. | Add `aria-required` to required controls (including the driver field when the status is In Use). | **Fixed** in `9c4dbc0`; test "exposes required fields to assistive technology". |
| A11Y-2 | Low | `src/pages/DashboardPage.jsx:36, 45`, `src/pages/VehicleDetailsPage.jsx:68` | Decorative arrows were part of link names ("View all →", "← Back to vehicles"), read aloud as "right arrow". | Wrap the arrows in `aria-hidden` spans. | **Fixed** in `9c4dbc0`. |
| A11Y-3 | Low | `src/components/common/ToastRegion.jsx:9`, `src/components/common/Toast.jsx:20` | Error toasts have `role="alert"` inside a `role="status"` live region; some screen readers may announce them twice. | Use separate polite and assertive regions. | Accepted — the worst case is a repeated announcement; two regions add complexity. |
| A11Y-4 | Low | `src/components/layout/Navbar.jsx:27-34` | The mobile menu closes on link click and Escape but not on a tap outside it, and focus is not moved into it when opened. | Close on outside click; optionally move focus to the first link. | Accepted — the menu is reachable and closable by keyboard and touch; listed in ARCHITECTURE §9. |
| A11Y-5 | Low | `src/components/vehicles/VehicleForm.jsx:179, 204, 225` | Number inputs have `min` but no `max`. | Add `max` attributes. | Accepted — limits are enforced by validation with clear messages; `max` on year would need to change every year. |

**Checks with no finding:** visible labels for every input; status badges and service tags always
include text (NFR-8); keyboard-only use works, with a visible focus ring (NFR-6); the delete dialog
traps focus, focuses Cancel and returns focus on close (native `<dialog>`); page `<h1>`s and
`document.title` update on every route; a skip link to the main content; colour pairs from DESIGN §3
meet WCAG AA contrast.

---

## Changes made by the fixes (`9c4dbc0`)

| File | Change |
|---|---|
| `src/components/vehicles/DeleteVehicleDialog.jsx` | New: confirm + delete + toasts in one place (REUSE-1, CQ-1). |
| `src/components/vehicles/VehicleNotFound.jsx` | New: shared not-found view (REUSE-2). |
| `src/components/vehicles/DeleteMessage.jsx` | Removed (merged into `DeleteVehicleDialog`). |
| `src/pages/VehicleListPage.jsx`, `src/pages/VehicleDetailsPage.jsx`, `src/pages/EditVehiclePage.jsx` | Use the two new components; arrow hidden from screen readers (A11Y-2). |
| `src/components/vehicles/VehicleForm.jsx` | `aria-required` (A11Y-1); fixed error messages (SEC-4). |
| `src/utils/filterVehicles.js` | Consistent comparator (CQ-2). |
| `src/components/common/ConfirmDialog.jsx` | `useId()` ids (CQ-4). |
| `src/components/layout/Layout.jsx` | Previous-path comparison (CQ-3). |
| `src/components/dashboard/StatCard.jsx`, `src/pages/DashboardPage.jsx` | Arrow rendered with `aria-hidden` (A11Y-2). |
| `eslint.config.js` | Ignore `coverage` (CQ-5). |
| Tests | 4 new tests for CQ-1, CQ-2, A11Y-1 and the dialog closing on role switch. |
