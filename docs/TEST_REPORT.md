# Masar — Test Report

| | |
|---|---|
| **Generated** | 2026-10-17 |
| **Test runner** | Vitest 4.1.12 (jsdom 26.1.0), React Testing Library 16.3.3, user-event 14.6.8 |
| **Commands** | `npm test`, `npm run test:coverage` |
| **Fixed date** | Every test runs with "today" = 2026-10-17 (`vi.setSystemTime` in `src/test/setup.js`, plus the `today` argument in unit tests), so results do not change as the real date changes. |
| **Data** | Every test starts from the 10 seed vehicles (`resetVehicleData()` before each test); `SIMULATED_LATENCY_MS` is 0 under Vitest. |

## Summary

| Metric | Result |
|---|---|
| Test files | 10 (10 passed, 0 failed) |
| Tests | 175 (175 passed, 0 failed) |
| Result | ✅ All tests pass |
| Statement coverage | 93.94 % |
| Branch coverage | 90.44 % |
| Function coverage | 89.28 % |
| Line coverage | 95.33 % |

## Tests per file

| File | What it covers | Tests | Passed | Failed |
|---|---|---:|---:|---:|
| `src/utils/__tests__/validateVehicle.test.js` | Unit — every validation rule V-PL-1 … V-NS-4 | 82 | 82 | 0 |
| `src/utils/__tests__/dates.test.js` | Unit — local dates, getToday, daysUntil, service state | 19 | 19 | 0 |
| `src/utils/__tests__/format.test.js` | Unit — km, SAR, date formatting | 5 | 5 | 0 |
| `src/utils/__tests__/filterVehicles.test.js` | Unit — search, filters, AND logic, sort | 13 | 13 | 0 |
| `src/utils/__tests__/fleetStats.test.js` | Unit — AC-8.1 counts, AC-8.2 service list | 5 | 5 | 0 |
| `src/services/__tests__/vehicleService.test.js` | Unit — CRUD, copies, nextId (AC-4.7), errors | 19 | 19 | 0 |
| `src/__tests__/addVehicle.test.jsx` | Integration — US-4 add vehicle | 6 | 6 | 0 |
| `src/__tests__/editVehicle.test.jsx` | Integration — US-5 edit vehicle | 6 | 6 | 0 |
| `src/__tests__/deleteVehicle.test.jsx` | Integration — US-6 delete with confirm/cancel | 5 | 5 | 0 |
| `src/__tests__/browse.test.jsx` | Integration — search/filter, dashboard, roles, 404, About, details | 15 | 15 | 0 |
| **Total** | | **175** | **175** | **0** |

## `npm test` output

```text
> masar-fleet-manager@1.0.0 test
> vitest run


 RUN  v4.1.12 C:/Users/fahad/Desktop/fleet-manager


 Test Files  10 passed (10)
      Tests  175 passed (175)
   Start at  23:54:45
   Duration  13.91s (transform 7.76s, setup 9.96s, import 10.31s, tests 24.02s, environment 23.17s)
```

## `npm run test:coverage` output

```text
> masar-fleet-manager@1.0.0 test:coverage
> vitest run --coverage


 RUN  v4.1.12 C:/Users/fahad/Desktop/fleet-manager
      Coverage enabled with v8


 Test Files  10 passed (10)
      Tests  175 passed (175)
   Start at  23:55:03
   Duration  18.71s (transform 8.27s, setup 11.36s, import 10.98s, tests 32.32s, environment 29.27s)

 % Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   93.94 |    90.44 |   89.28 |   95.33 |                   
 ...ponents/common |   77.27 |    91.66 |      65 |   82.05 |                   
  ...irmDialog.jsx |   82.35 |    83.33 |      80 |   86.66 | 47-48             
  Toast.jsx        |   53.33 |     87.5 |   33.33 |   58.33 | 21-28             
 ...ents/dashboard |    90.9 |    76.47 |     100 |     100 |                   
  ...ceDueList.jsx |    87.5 |       70 |     100 |     100 | 9,22-27           
  StatCard.jsx     |     100 |    85.71 |     100 |     100 | 19                
 ...ponents/layout |    86.2 |    77.27 |   66.66 |    92.3 |                   
  Navbar.jsx       |   66.66 |    68.75 |   33.33 |      80 | 34-46             
 ...nents/vehicles |   92.85 |    91.42 |   92.59 |   92.72 |                   
  ...cleDialog.jsx |     100 |       90 |     100 |     100 | 29                
  SearchBar.jsx    |   66.66 |      100 |   66.66 |   66.66 | 28                
  VehicleForm.jsx  |    92.1 |    91.66 |   96.55 |   92.18 | 86-95             
  ...eNotFound.jsx |     100 |       50 |     100 |     100 | 10-11             
  VehicleTable.jsx |   88.88 |    93.33 |   81.81 |   88.23 | 121,130           
 src/context       |   86.36 |      100 |   72.72 |   94.11 |                   
  ToastContext.jsx |   81.25 |      100 |    62.5 |   91.66 | 12                
 src/hooks         |      92 |    70.58 |   85.71 |    91.3 |                   
  ...umentTitle.js |     100 |       50 |     100 |     100 | 7                 
  useVehicle.js    |      90 |    81.81 |      80 |      90 | 13                
  useVehicles.js   |    92.3 |       50 |   85.71 |    90.9 | 13                
 src/pages         |   94.73 |    81.69 |   96.66 |   96.11 |                   
  ...boardPage.jsx |    90.9 |       75 |     100 |    90.9 | 27                
  ...tailsPage.jsx |   95.45 |    88.88 |   83.33 |   94.44 | 120               
  ...eListPage.jsx |   90.47 |    74.35 |     100 |   94.87 | 47,55             
 src/services      |     100 |    92.85 |     100 |     100 |                   
  ...cleService.js |     100 |    92.85 |     100 |     100 | 8                 
 src/utils         |   99.38 |     98.7 |     100 |     100 |                   
  dates.js         |   96.87 |       96 |     100 |     100 | 50                
  ...ateVehicle.js |     100 |    98.95 |     100 |     100 | 32                
-------------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 93.94% ( 559/595 )
Branches     : 90.44% ( 407/450 )
Functions    : 89.28% ( 175/196 )
Lines        : 95.33% ( 491/515 )
================================================================================
```
