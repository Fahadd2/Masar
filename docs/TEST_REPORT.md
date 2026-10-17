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
| Tests | 171 (171 passed, 0 failed) |
| Result | ✅ All tests pass |
| Statement coverage | 93.32 % |
| Branch coverage | 88.41 % |
| Function coverage | 89.06 % |
| Line coverage | 95.2 % |

## Tests per file

| File | What it covers | Tests | Passed | Failed |
|---|---|---:|---:|---:|
| `src/utils/__tests__/validateVehicle.test.js` | Unit — every validation rule V-PL-1 … V-NS-4 | 82 | 82 | 0 |
| `src/utils/__tests__/dates.test.js` | Unit — local dates, getToday, daysUntil, service state | 19 | 19 | 0 |
| `src/utils/__tests__/format.test.js` | Unit — km, SAR, date formatting | 5 | 5 | 0 |
| `src/utils/__tests__/filterVehicles.test.js` | Unit — search, filters, AND logic, sort | 12 | 12 | 0 |
| `src/utils/__tests__/fleetStats.test.js` | Unit — AC-8.1 counts, AC-8.2 service list | 5 | 5 | 0 |
| `src/services/__tests__/vehicleService.test.js` | Unit — CRUD, copies, nextId (AC-4.7), errors | 19 | 19 | 0 |
| `src/__tests__/addVehicle.test.jsx` | Integration — US-4 add vehicle | 5 | 5 | 0 |
| `src/__tests__/editVehicle.test.jsx` | Integration — US-5 edit vehicle | 6 | 6 | 0 |
| `src/__tests__/deleteVehicle.test.jsx` | Integration — US-6 delete with confirm/cancel | 3 | 3 | 0 |
| `src/__tests__/browse.test.jsx` | Integration — search/filter, dashboard, roles, 404, About, details | 15 | 15 | 0 |
| **Total** | | **171** | **171** | **0** |

## `npm test` output

```text
> masar-fleet-manager@1.0.0 test
> vitest run


 RUN  v4.1.12 C:/Users/fahad/Desktop/fleet-manager


 Test Files  10 passed (10)
      Tests  171 passed (171)
   Start at  23:47:06
   Duration  7.26s (transform 5.38s, setup 6.32s, import 7.27s, tests 9.55s, environment 16.08s)
```

## `npm run test:coverage` output

```text
> masar-fleet-manager@1.0.0 test:coverage
> vitest run --coverage


 RUN  v4.1.12 C:/Users/fahad/Desktop/fleet-manager
      Coverage enabled with v8


 Test Files  10 passed (10)
      Tests  171 passed (171)
   Start at  23:47:15
   Duration  10.30s (transform 4.14s, setup 8.01s, import 5.97s, tests 15.36s, environment 20.79s)

 % Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   93.32 |    88.41 |   89.06 |    95.2 |                   
 ...ponents/common |   76.19 |    85.41 |      65 |   81.08 |                   
  ...irmDialog.jsx |      80 |    83.33 |      80 |   84.61 | 44-45             
  Toast.jsx        |   53.33 |       50 |   33.33 |   58.33 | 21-28             
 ...ents/dashboard |    90.9 |    73.33 |     100 |     100 |                   
  ...ceDueList.jsx |    87.5 |       70 |     100 |     100 | 9,22-27           
  StatCard.jsx     |     100 |       80 |     100 |     100 | 14                
 ...ponents/layout |    86.2 |    77.27 |   66.66 |   92.59 |                   
  Navbar.jsx       |   66.66 |    68.75 |   33.33 |      80 | 34-46             
 ...nents/vehicles |   92.72 |    93.25 |   92.15 |   92.63 |                   
  SearchBar.jsx    |   66.66 |      100 |   66.66 |   66.66 | 28                
  VehicleForm.jsx  |   93.33 |     91.3 |   96.55 |   93.65 | 86-90             
  VehicleTable.jsx |   88.88 |    93.33 |   81.81 |   88.23 | 121,130           
 src/context       |   86.36 |      100 |   72.72 |   94.11 |                   
  ToastContext.jsx |   81.25 |      100 |    62.5 |   91.66 | 12                
 src/hooks         |      92 |    70.58 |   85.71 |    91.3 |                   
  ...umentTitle.js |     100 |       50 |     100 |     100 | 7                 
  useVehicle.js    |      90 |    81.81 |      80 |      90 | 13                
  useVehicles.js   |    92.3 |       50 |   85.71 |    90.9 | 13                
 src/pages         |   92.64 |    77.01 |   96.66 |    95.2 |                   
  ...boardPage.jsx |    90.9 |       75 |     100 |    90.9 | 27                
  ...hiclePage.jsx |     100 |    85.71 |     100 |     100 | 31-32             
  ...tailsPage.jsx |   91.17 |       75 |   83.33 |   93.33 | 54,161            
  ...eListPage.jsx |   88.46 |    75.55 |     100 |   93.75 | 37,69,77          
 src/services      |     100 |    92.85 |     100 |     100 |                   
  ...cleService.js |     100 |    92.85 |     100 |     100 | 8                 
 src/utils         |   98.77 |    97.41 |     100 |     100 |                   
  dates.js         |   96.87 |       96 |     100 |     100 | 50                
  ...erVehicles.js |   95.23 |    93.33 |     100 |     100 | 31                
  ...ateVehicle.js |     100 |    98.95 |     100 |     100 | 32                
-------------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 93.32% ( 559/599 )
Branches     : 88.41% ( 397/449 )
Functions    : 89.06% ( 171/192 )
Lines        : 95.2% ( 496/521 )
================================================================================
```
