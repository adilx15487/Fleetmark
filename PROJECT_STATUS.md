# 🚌 FLEETMARK — PROJECT STATUS REPORT

> **Generated:** March 2, 2026
> **Repo:** [github.com/adilx15487/Fleetmark](https://github.com/adilx15487/Fleetmark)
> **Live:** [fleetmark.vercel.app](https://fleetmark.vercel.app/)
> **Branch:** `main`

---

## 📊 OVERALL PROGRESS

```
██████████████████████░░░░░░░░░  70% Complete
```

| Category      | Progress                          | % Done |
|---------------|-----------------------------------|--------|
| **Frontend**  | `████████████████████░░░░░░░░░░`  | **85%** |
| **Backend**   | `██████████████████░░░░░░░░░░░░`  | **75%** |
| **Integration** | `██████████░░░░░░░░░░░░░░░░░░░` | **35%** |
| **DevOps**    | `██████░░░░░░░░░░░░░░░░░░░░░░░░`  | **20%** |
| **Testing**   | `████████████░░░░░░░░░░░░░░░░░░`  | **40%** |
| **OVERALL**   | `█████████████████████░░░░░░░░░`  | **70%** |

### Codebase Metrics

| Metric | Value |
|--------|-------|
| Frontend files (`.tsx` / `.ts`) | 70 files |
| Frontend lines of code | ~39,300 |
| Backend files (`.py`) | 66 files |
| Backend lines of code | ~3,100 |
| Total source files | **136** |
| Dependencies (npm) | 8 production + 10 dev |
| Dependencies (pip) | 9 packages |

---

## ✅ WHAT IS 100% DONE

### Frontend — Landing Page (Adil)
- [x] Navbar (transparent → solid on scroll, responsive mobile menu)
- [x] Hero (gradient background, stats, animated dashboard preview)
- [x] Features ("What This Project Is About" — problem→solution paired rows)
- [x] Who We Are (team member cards with horizontal scroll, 5 members)
- [x] Auth Section (tabbed Login/Signup with role selector + 42 OAuth button)
- [x] Subscribe (email subscription CTA)
- [x] Footer (links, copyright)

### Frontend — Admin Dashboard (Adil)
- [x] Admin Layout (sidebar + topbar shell)
- [x] Collapsible Sidebar (responsive drawer on mobile)
- [x] Topbar (search, notifications bell, profile dropdown)
- [x] Reusable Modal component
- [x] Overview (stat cards, line chart, donut chart, activity table, quick actions)
- [x] Bus Management (search, data table, status badges, CRUD modal)
- [x] Route & Stops (expandable route cards, stops timeline, add route modal)
- [x] User Management (search + role filter, user table, invite modal)
- [x] Schedule Management (weekly calendar grid, color-coded slots, legend)
- [x] Reports & Analytics (date range, stat cards, bar chart, line chart, top routes)
- [x] Notifications (filter tabs, notification cards, send notification modal)

### Frontend — Passenger Dashboard (Adil)
- [x] Passenger Layout (sidebar + topbar)
- [x] Passenger Overview (stats, upcoming ride, reservation summary)
- [x] Reserve a Seat (select stop → auto bus assignment, date pick, confirm)
- [x] My Reservations (upcoming rides, history, cancel)
- [x] Browse Routes (search routes, view stops & schedules)
- [x] Notifications inbox
- [x] Profile Settings (edit details, preferences)
- [x] Student Onboarding flow
- [x] Schedule Status Banner

### Frontend — Driver Dashboard (Adil)
- [x] Driver Layout (sidebar + topbar)
- [x] Driver Overview (today's stats, assigned trips)
- [x] My Route (assigned route with stops timeline)
- [x] Passenger List (manifest — who's on the bus)
- [x] Driver Notifications
- [x] Driver Profile

### Frontend — Auth Flow (Adil)
- [x] AuthContext (login, loginWith42, setUserRole, logout, session restore)
- [x] ProtectedRoute guard (role-based redirect)
- [x] AuthCallback page (42 OAuth return handler)
- [x] RoleSelection page (first-time 42 user picks role)
- [x] 42 OAuth redirect (`window.location.href` to intra.42.fr)
- [x] JWT storage (access + refresh in localStorage)
- [x] Auto-refresh on 401 (axios interceptor with queue)
- [x] Mock mode toggle (`VITE_USE_MOCK=true`)

### Frontend — Infrastructure (Adil)
- [x] React Router v6 wiring (all routes, lazy loading, code splitting)
- [x] Custom hooks: `useHorizontalScroll`, `useDocumentTitle`, `useLoadingState`
- [x] Error mapper (`errorMapper.ts` — backend error codes → user messages)
- [x] UI components: EmptyState, ErrorState, Skeleton
- [x] Toast context (notifications system)
- [x] Schedule context (1337 night shuttle data)
- [x] Reservation context (bus stop data, auto bus assignment logic)
- [x] React Query setup (stale time, retry, client provider)
- [x] 404 Not Found page
- [x] Vercel deployment config (`vercel.json` SPA rewrite)
- [x] TypeScript — 0 build errors

### Backend — API (Mohamed + Abderrahman)
- [x] Django project scaffold (config, apps, manage.py)
- [x] Custom User model (AbstractUser + role + org + 42 OAuth fields)
- [x] Organization model + CRUD API
- [x] Bus model (matricule, capacity, freeze guard) + CRUD API
- [x] Route model (bus FK, direction) + CRUD API
- [x] Trip model (route FK, lifecycle state machine: CREATED→STARTED→ENDED) + CRUD API
- [x] Reservation model (trip FK, passenger_name) + CRUD API
- [x] Trip start/end lifecycle endpoints (`POST /trips/:id/start/`, `/trips/:id/end/`)
- [x] Custom domain exceptions (`LifecycleError`, `FreezeError`, `CapacityError`, `IntegrityError`)
- [x] Custom exception handler (DomainError → `{error, code}` format)
- [x] Protected delete cascade prevention (bus→routes, route→trips, trip→reservations)
- [x] Role-based permissions per app (`CanCrudBus`, `CanCrudRoute`, etc.)
- [x] JWT authentication (SimpleJWT — access 1h, refresh 7d, rotation)
- [x] Audit logging (all CRUD + lifecycle operations → `audit.log`)
- [x] 42 OAuth callback endpoint (`POST /accounts/42/callback/`)
- [x] Set role endpoint (`PATCH /accounts/set-role/`)
- [x] API URL routing (`/api/v1/` prefix, 6 app urlconfs)

### Backend — Frontend Compatibility
- [x] All 10 endpoint paths match frontend `api.config.ts`
- [x] All field names match (zero mismatches)
- [x] All 5 error codes mapped in frontend `errorMapper.ts`
- [x] JWT token format compatible (SimpleJWT defaults)

### Integration — API Layer (Adil)
- [x] Axios client with JWT interceptors (`src/lib/axios.ts`)
- [x] API endpoint config — single source of truth (`src/config/api.config.ts`)
- [x] Service layer — typed functions for all resources:
  - `auth.service.ts` (login, refresh, verify, restoreSession, loginWith42Code, setUserRole)
  - `bus.service.ts` (CRUD)
  - `route.service.ts` (CRUD)
  - `trip.service.ts` (CRUD + start/end)
  - `reservation.service.ts` (CRUD)
  - `user.service.ts` (CRUD)
  - `organization.service.ts` (CRUD)
- [x] React Query hooks (`useApi.ts` — 272 lines, all resources covered)
- [x] TypeScript API types (`src/types/api.ts` — 149 lines, mirrors Django models)
- [x] Vite proxy (`/api` → `http://127.0.0.1:8000`)

### Testing (Phase 18)
- [x] Integration test suite (`test_integration.sh` — 42 tests)
- [x] Test results: **39/42 PASS** (93%)
- [x] 10/10 Auth tests passing
- [x] 12/12 Admin CRUD tests passing
- [x] 7/8 Edge case tests passing
- [x] Test report documented (`MERGE_TEST_REPORT.md`)

---

## 🔄 WHAT IS IN PROGRESS

| Feature | % Done | What's Working | What's Missing |
|---------|--------|----------------|----------------|
| **42 OAuth (real flow)** | 80% | Backend endpoint done, 42 redirect works, code received | CORS fix tested, final end-to-end confirmation pending |
| **Frontend ↔ Backend wiring** | 35% | Service layer + hooks built, auth login works | Admin/Passenger/Driver pages still render mock data |
| **Mock → Real data migration** | 10% | `USE_MOCK` flag exists, auth service uses real API | 14+ pages still import from `mockData.ts` / `passengerMockData.ts` / `driverMockData.ts` |

### Pages Still Using Mock Data

| Page | Mock Data Source | Needs |
|------|-----------------|-------|
| Admin Overview | `mockData.ts` | Wire to `/api/v1/` stats endpoints |
| Admin Bus Management | `mockData.ts` | Replace with `useBuses()` hook |
| Admin Route & Stops | `mockData.ts` | Replace with `useRoutes()` hook |
| Admin User Management | `mockData.ts` | Replace with `useUsers()` hook |
| Admin Schedule | `mockData.ts` | Replace with real schedule data |
| Admin Reports | `mockData.ts` | Replace with real analytics data |
| Admin Notifications | `mockData.ts` | Replace with real notifications |
| Passenger Overview | `passengerMockData.ts` | Wire to reservation + trip APIs |
| Passenger Routes | `passengerMockData.ts` | Wire to routes API |
| Passenger Notifications | `passengerMockData.ts` | Wire to notifications API |
| Profile Settings | `passengerMockData.ts` | Wire to user profile API |
| Driver Overview | `driverMockData.ts` | Wire to trips + routes API |
| Driver My Route | `driverMockData.ts` | Wire to assigned route API |
| Driver Passenger List | `driverMockData.ts` | Wire to reservation manifest API |
| Driver Notifications | `driverMockData.ts` | Wire to notifications API |
| Driver Profile | `driverMockData.ts` | Wire to user profile API |

---

## ⏳ WHAT IS NOT STARTED YET

| Feature | Priority | Est. Time | Category |
|---------|----------|-----------|----------|
| `django-cors-headers` installation & config | 🔴 High | 10 min | Backend |
| Fix `ValueError` → `LifecycleError` in `Trip.start()` / `Trip.end()` | 🔴 High | 5 min | Backend |
| Connect Admin pages to real API (7 pages) | 🔴 High | 4 hours | Integration |
| Connect Passenger pages to real API (6 pages) | 🔴 High | 3 hours | Integration |
| Connect Driver pages to real API (5 pages) | 🔴 High | 2 hours | Integration |
| Production backend deployment (Railway/Render) | 🔴 High | 2 hours | DevOps |
| SSL certificate for backend | 🔴 High | 30 min | DevOps |
| Notifications API (backend) | 🟡 Medium | 4 hours | Backend |
| Schedule API (backend) | 🟡 Medium | 3 hours | Backend |
| Reports/Analytics API (backend) | 🟡 Medium | 3 hours | Backend |
| Real-time seat count updates | 🟡 Medium | 2 hours | Backend |
| Write tests for 3/night reservation limit | 🟡 Medium | 1 hour | Testing |
| Write tests for 30min lock rule | 🟡 Medium | 1 hour | Testing |
| Write tests for home stop → bus assignment | 🟡 Medium | 1 hour | Testing |
| End-to-end testing all 3 roles | 🟡 Medium | 2 hours | Testing |
| Database migration to PostgreSQL (production) | 🟡 Medium | 1 hour | DevOps |
| Environment variable management (prod secrets) | 🟡 Medium | 30 min | DevOps |
| Loading skeletons for all async pages | 🟢 Low | 2 hours | Frontend |
| Form validation (Zod or native) | 🟢 Low | 3 hours | Frontend |
| Accessibility audit (ARIA, focus management) | 🟢 Low | 2 hours | Frontend |
| Mobile testing on real devices | 🟢 Low | 1 hour | Testing |
| Cross-browser testing (Chrome/Firefox/Safari) | 🟢 Low | 1 hour | Testing |
| Performance testing with multiple users | 🟢 Low | 2 hours | Testing |
| Security audit (JWT permissions, input sanitization) | 🟢 Low | 2 hours | Testing |

---

## 🐛 KNOWN BUGS TO FIX

| # | Bug | File | Line | Severity | Fix | Assigned To |
|---|-----|------|------|----------|-----|-------------|
| 1 | `Trip.start()` raises `ValueError` instead of `LifecycleError` → HTTP 500 on zero-reservation trip | `backend1/trips/models.py` | 89-93 | 🔴 **High** | Change `ValueError(…)` → `LifecycleError(…)` | **Ayoub** |
| 2 | `Trip.end()` raises `ValueError` instead of `LifecycleError` | `backend1/trips/models.py` | 98-99 | 🔴 **High** | Same pattern fix | **Ayoub** |
| 3 | No `django-cors-headers` → production CORS failure | `backend1/config/settings.py` | — | 🟡 **Medium** | `pip install django-cors-headers` + middleware + config | **Ayoub** |
| 4 | Test script ordering — Trip 1 reused across test categories | `test_integration.sh` | — | 🟢 **Low** | Isolate trips per test category | **Ayoub** |
| 5 | `_check_structural_freeze` raises `ValueError` instead of `FreezeError` | `backend1/trips/models.py` | 67 | 🟡 **Medium** | Change to `FreezeError` for consistent error handling | **Abderrahman** |
| 6 | `ALLOWED_HOSTS = []` — will reject requests in production | `backend1/config/settings.py` | 43 | 🔴 **High** | Add production domain to `ALLOWED_HOSTS` | **Aamir** |
| 7 | `SECRET_KEY` hardcoded in settings (insecure for production) | `backend1/config/settings.py` | 39 | 🔴 **High** | Move to environment variable | **Aamir** |
| 8 | `DEBUG = True` in production | `backend1/config/settings.py` | 42 | 🔴 **High** | Set `DEBUG = os.environ.get('DEBUG', 'False') == 'True'` | **Aamir** |

---

## 👥 TASK ASSIGNMENT PER PERSON

### 🎨 Adil Bourji — Frontend Developer

| # | Task | Priority | Est. Time | Status |
|---|------|----------|-----------|--------|
| 1 | Wire Admin Overview to real API | 🔴 High | 30 min | ⏳ Todo |
| 2 | Wire Admin Bus Management → `useBuses()` | 🔴 High | 30 min | ⏳ Todo |
| 3 | Wire Admin Route & Stops → `useRoutes()` | 🔴 High | 30 min | ⏳ Todo |
| 4 | Wire Admin User Management → `useUsers()` | 🔴 High | 30 min | ⏳ Todo |
| 5 | Wire Admin Schedule to real API | 🔴 High | 30 min | ⏳ Todo |
| 6 | Wire Admin Reports to real API | 🟡 Medium | 30 min | ⏳ Todo |
| 7 | Wire Admin Notifications to real API | 🟡 Medium | 30 min | ⏳ Todo |
| 8 | Wire Passenger pages to real API (6 pages) | 🔴 High | 3 hours | ⏳ Todo |
| 9 | Wire Driver pages to real API (5 pages) | 🔴 High | 2 hours | ⏳ Todo |
| 10 | Add loading skeletons for all async pages | 🟡 Medium | 2 hours | ⏳ Todo |
| 11 | Add form validation (Zod / native) | 🟡 Medium | 3 hours | ⏳ Todo |
| 12 | 42 OAuth final debugging | 🔴 High | 1 hour | 🔄 In Progress |
| 13 | Polish UI for 1337 school demo | 🟢 Low | 2 hours | ⏳ Todo |
| 14 | Accessibility audit (ARIA, focus) | 🟢 Low | 2 hours | ⏳ Todo |

**Adil's Priority Order:**
1. Finish 42 OAuth end-to-end (TODAY)
2. Wire Admin pages to real API (Admin Bus, Routes, Users first)
3. Wire Passenger pages to real API
4. Wire Driver pages to real API
5. Loading skeletons + form validation
6. Polish + accessibility

---

### ⚙️ Mohamed Lahrech — Backend Developer

| # | Task | Priority | Est. Time | Status |
|---|------|----------|-----------|--------|
| 1 | Build Notifications API (model, serializer, views, urls) | 🔴 High | 4 hours | ⏳ Todo |
| 2 | Build Schedule API (weekly schedule model + endpoints) | 🔴 High | 3 hours | ⏳ Todo |
| 3 | Build Reports/Analytics API (stats aggregation endpoints) | 🟡 Medium | 3 hours | ⏳ Todo |
| 4 | Add `user` FK to Reservation model (currently `passenger_name` only) | 🔴 High | 30 min | ⏳ Todo |
| 5 | Add "my reservations" endpoint (`GET /reservations/?user=me`) | 🔴 High | 30 min | ⏳ Todo |
| 6 | Add 3/night reservation limit enforcement | 🟡 Medium | 1 hour | ⏳ Todo |
| 7 | Add 30-minute lock rule before departure | 🟡 Medium | 1 hour | ⏳ Todo |
| 8 | Add real-time seat count to trip serializer | 🟡 Medium | 30 min | ⏳ Todo |
| 9 | Seed database with 1337 school data (buses, routes, stops) | 🟡 Medium | 1 hour | ⏳ Todo |
| 10 | Add user profile update endpoint | 🟢 Low | 30 min | ⏳ Todo |

**Mohamed's Priority Order:**
1. Add `user` FK to Reservation + "my reservations" (TODAY)
2. Notifications API (needed by all 3 dashboards)
3. Schedule API (needed by Admin)
4. Reports API (needed by Admin)
5. Business rules (3/night limit, 30min lock)
6. Seed data for 1337

---

### ⚙️ Abderrahman Chakour — Backend Developer

| # | Task | Priority | Est. Time | Status |
|---|------|----------|-----------|--------|
| 1 | Prepare backend for production deployment | 🔴 High | 2 hours | ⏳ Todo |
| 2 | Extract `SECRET_KEY` to env variable | 🔴 High | 5 min | ⏳ Todo |
| 3 | Set `DEBUG = False` for production | 🔴 High | 5 min | ⏳ Todo |
| 4 | Configure `ALLOWED_HOSTS` for production domain | 🔴 High | 5 min | ⏳ Todo |
| 5 | Configure `STATIC_ROOT` + `collectstatic` | 🔴 High | 15 min | ⏳ Todo |
| 6 | Switch from SQLite → PostgreSQL for production | 🟡 Medium | 1 hour | ⏳ Todo |
| 7 | Fix `ValueError` → `FreezeError` in `_check_structural_freeze` | 🟡 Medium | 5 min | ⏳ Todo |
| 8 | Add stops model to Route (currently just `direction` string) | 🟡 Medium | 2 hours | ⏳ Todo |
| 9 | Write `Procfile` / `railway.json` for deployment | 🔴 High | 30 min | ⏳ Todo |
| 10 | Add Gunicorn / Uvicorn to requirements.txt | 🔴 High | 5 min | ⏳ Todo |
| 11 | Write management command for data seeding | 🟡 Medium | 1 hour | ⏳ Todo |
| 12 | Add API pagination (DRF `PageNumberPagination`) | 🟢 Low | 30 min | ⏳ Todo |

**Abderrahman's Priority Order:**
1. Production settings (SECRET_KEY, DEBUG, ALLOWED_HOSTS) (TODAY)
2. Gunicorn + Procfile for Railway
3. PostgreSQL config for production
4. Fix structural freeze ValueError
5. Add stops model to Route
6. Data seeding command

---

### 🧪 Ayoub El Haouti — Backend + Testing & Debugging

| # | Task | Priority | Est. Time | Status |
|---|------|----------|-----------|--------|
| 1 | Fix ValueError→LifecycleError bug in `trips/models.py` | 🔴 Critical | 5 min | ⏳ Todo |
| 2 | Install + config `django-cors-headers` | 🔴 High | 10 min | ⏳ Todo |
| 3 | Re-run test suite → target 42/42 pass | 🔴 High | 30 min | ⏳ Todo |
| 4 | Fix test script ordering (FAIL 3.1) | 🟡 Medium | 5 min | ⏳ Todo |
| 5 | Write tests: 3/night reservation limit | 🟡 Medium | 1 hour | ⏳ Todo |
| 6 | Write tests: 30min lock rule | 🟡 Medium | 1 hour | ⏳ Todo |
| 7 | Write tests: home stop → bus assignment | 🟡 Medium | 1 hour | ⏳ Todo |
| 8 | Test 42 OAuth full flow (end-to-end) | 🟡 Medium | 2 hours | ⏳ Todo |
| 9 | End-to-end test all 3 roles | 🟡 Medium | 2 hours | ⏳ Todo |
| 10 | Test all API endpoints with Postman collection | 🟡 Medium | 2 hours | ⏳ Todo |
| 11 | Mobile testing (real device) | 🟢 Low | 1 hour | ⏳ Todo |
| 12 | Cross-browser testing (Chrome/Firefox/Safari) | 🟢 Low | 1 hour | ⏳ Todo |
| 13 | Security audit (JWT + role permissions) | 🟢 Low | 2 hours | ⏳ Todo |
| 14 | Monitor error logs after each deployment | 🟢 Low | ongoing | ⏳ Todo |

**Ayoub's Priority Order:**
1. Fix ValueError → LifecycleError (TODAY — 5 min)
2. Install CORS headers (TODAY — 10 min)
3. Re-run tests → 42/42 (TODAY — 30 min)
4. Write new tests for 1337 business rules
5. End-to-end testing with 42 OAuth
6. Mobile + browser testing before launch

---

### 🔒 Aamir Tahtah — DevOps & Security

| # | Task | Priority | Est. Time | Status |
|---|------|----------|-----------|--------|
| 1 | Deploy backend to Railway (or Render) | 🔴 High | 2 hours | ⏳ Todo |
| 2 | Configure SSL certificate | 🔴 High | 30 min | ⏳ Todo |
| 3 | Set environment variables on Railway | 🔴 High | 15 min | ⏳ Todo |
| 4 | Update Vercel env vars (API base URL → production backend) | 🔴 High | 10 min | ⏳ Todo |
| 5 | Set up PostgreSQL on Railway | 🟡 Medium | 30 min | ⏳ Todo |
| 6 | Configure `ALLOWED_HOSTS` with production domain | 🔴 High | 5 min | ⏳ Todo |
| 7 | Move 42 OAuth secrets to env (remove from source) | 🔴 High | 10 min | ⏳ Todo |
| 8 | Set up CI/CD pipeline (GitHub Actions) | 🟡 Medium | 2 hours | ⏳ Todo |
| 9 | Configure health check endpoint | 🟢 Low | 15 min | ⏳ Todo |
| 10 | Set up monitoring/alerting | 🟢 Low | 1 hour | ⏳ Todo |
| 11 | Security headers (HSTS, CSP, X-Frame) | 🟢 Low | 30 min | ⏳ Todo |
| 12 | Rate limiting on auth endpoints | 🟢 Low | 30 min | ⏳ Todo |

**Aamir's Priority Order:**
1. Deploy backend to Railway + SSL (TODAY)
2. Set env vars on Railway + Vercel
3. PostgreSQL setup
4. Move secrets out of source code
5. CI/CD pipeline
6. Security headers + rate limiting

---

## 🗓️ SUGGESTED TIMELINE TO FINISH

### Day 1-2 (March 2-3) — Critical Bugs + Backend Deploy

| Who | Task | Time |
|-----|------|------|
| **Ayoub** | Fix ValueError→LifecycleError + install CORS + re-run tests | 1 hour |
| **Abderrahman** | Production settings (SECRET_KEY, DEBUG, ALLOWED_HOSTS, Gunicorn) | 2 hours |
| **Aamir** | Deploy backend to Railway + SSL + env vars | 3 hours |
| **Adil** | Finish 42 OAuth end-to-end + verify on production | 2 hours |
| **Mohamed** | Add `user` FK to Reservation + "my reservations" endpoint | 1 hour |

### Day 3-4 (March 4-5) — API Completion + Frontend Wiring

| Who | Task | Time |
|-----|------|------|
| **Mohamed** | Build Notifications + Schedule API | 7 hours |
| **Abderrahman** | PostgreSQL migration + Stops model + seed data | 4 hours |
| **Adil** | Wire all 7 Admin pages to real API | 4 hours |
| **Ayoub** | Write tests for 1337 rules + Postman collection | 4 hours |
| **Aamir** | Update Vercel env vars + CI/CD pipeline setup | 3 hours |

### Day 5-6 (March 6-7) — Integration + Testing

| Who | Task | Time |
|-----|------|------|
| **Adil** | Wire Passenger (6 pages) + Driver (5 pages) to real API | 5 hours |
| **Mohamed** | Reports API + business rules (3/night limit, 30min lock) | 4 hours |
| **Ayoub** | End-to-end testing all 3 roles + 42 OAuth flow | 4 hours |
| **Abderrahman** | Data seeding for 1337 + API pagination | 2 hours |
| **Aamir** | Security headers + rate limiting + monitoring | 2 hours |

### Day 7 (March 8) — Polish + Launch Prep

| Who | Task | Time |
|-----|------|------|
| **Adil** | Loading skeletons + form validation + accessibility | 4 hours |
| **Ayoub** | Mobile + cross-browser testing | 2 hours |
| **Ayoub** | Security audit (JWT + permissions) | 2 hours |
| **Aamir** | Final deploy + domain config + smoke test | 2 hours |
| **Everyone** | Launch checklist verification | 1 hour |

---

## 🚀 LAUNCH CHECKLIST

### Technical Requirements
- [ ] Backend deployed and accessible via HTTPS
- [ ] Frontend Vercel env vars pointing to production backend
- [ ] `django-cors-headers` installed and configured
- [ ] `DEBUG = False` in production
- [ ] `SECRET_KEY` from environment variable
- [ ] `ALLOWED_HOSTS` includes production domain
- [ ] PostgreSQL database (not SQLite) in production
- [ ] Gunicorn / Uvicorn as WSGI server
- [ ] Static files collected (`collectstatic`)
- [ ] All API endpoints responding correctly
- [ ] JWT auth working end-to-end (login → refresh → protected routes)
- [ ] 42 OAuth working with production redirect URI

### Content Requirements
- [ ] 1337 school bus data seeded (2 buses, 2 routes, real stops)
- [ ] At least 1 admin, 1 driver, 1 passenger test user
- [ ] Sample trips and reservations for demo

### Security Requirements
- [ ] 42 OAuth client secret NOT in source code
- [ ] Django SECRET_KEY NOT in source code
- [ ] CORS configured for specific origins (not `*`)
- [ ] HTTPS enforced
- [ ] JWT token rotation working
- [ ] Role-based access enforced on every endpoint
- [ ] Rate limiting on `/accounts/token/` endpoint

### Performance Requirements
- [ ] API response times < 200ms (measured in production)
- [ ] Frontend bundle optimized (lazy loading working)
- [ ] Database queries optimized (no N+1)
- [ ] Gzip compression enabled

### 1337 School Requirements
- [ ] Students can login with 42 Intra account
- [ ] Students auto-assigned to 1337 organization
- [ ] Night shuttle routes match real stops (OCP, Nakhil, etc.)
- [ ] 3/night reservation limit enforced
- [ ] 30-minute lock before departure
- [ ] Students see only their campus buses

---

## ⚡ CRITICAL PATH

The following tasks MUST be completed in order — each blocks the next:

```
1. Fix ValueError→LifecycleError (Ayoub)
   └── 2. Install django-cors-headers (Ayoub)
       └── 3. Production settings (Abderrahman)
           └── 4. Deploy backend to Railway (Aamir)
               └── 5. Update Vercel env vars (Aamir)
                   └── 6. 42 OAuth with production redirect (Adil)
                       └── 7. Wire frontend pages to real API (Adil)
                           └── 8. End-to-end testing (Ayoub)
                               └── 9. Launch ✅
```

### Dependency Map

| If THIS is not done... | ...THEN this cannot start |
|------------------------|--------------------------|
| CORS headers installed | Production frontend cannot talk to backend |
| Backend deployed | Frontend can only use mock data |
| Vercel env vars updated | Frontend still points to localhost |
| `user` FK on Reservation | "My Reservations" page stays mock |
| Notifications API built | Notification pages stay mock (all dashboards) |
| Schedule API built | Admin Schedule page stays mock |
| Reports API built | Admin Reports page stays mock |

### Parallel Work (no dependencies)

These can happen simultaneously:
- Mohamed builds Notifications API **while** Abderrahman preps production settings
- Adil wires Admin pages **while** Aamir deploys backend
- Ayoub writes tests **while** everyone else builds features

---

## 📈 ESTIMATED COMPLETION DATE

### Assumptions
- Team of 4 active developers + 1 tester
- ~4-6 productive hours per person per day
- Working daily

### Calculation

| Person | Remaining Work | Days Needed |
|--------|---------------|-------------|
| Adil (Frontend) | ~18 hours | 3-4 days |
| Mohamed (Backend) | ~15 hours | 3 days |
| Abderrahman (Backend) | ~8 hours | 2 days |
| Ayoub (Testing) | ~16 hours | 3-4 days |
| Aamir (DevOps) | ~8 hours | 2 days |

### Timeline Estimates

| Scenario | Completion Date | Conditions |
|----------|----------------|------------|
| **Best case** 🟢 | **March 7, 2026** | Everyone works 6h/day, no major blockers |
| **Expected** 🟡 | **March 10, 2026** | ~4h/day, minor issues, some rework |
| **Worst case** 🔴 | **March 14, 2026** | Unexpected bugs, scope creep, availability issues |

### Risk Factors
- Railway deployment issues (account setup, billing)
- 42 API rate limits or downtime
- PostgreSQL migration data issues
- Browser compatibility problems on Safari

---

## 📁 FILE STRUCTURE REFERENCE

```
Fleetmark/
├── src/                          # Frontend (React + TypeScript)
│   ├── components/               # 22 componentsgg
│   │   ├── admin/                # Sidebar, Topbar, Modal
│   │   ├── passenger/            # PassengerSidebar, Topbar, Onboarding, Banner
│   │   ├── driver/               # DriverSidebar, DriverTopbar
│   │   ├── ui/                   # EmptyState, ErrorState, Skeleton
│   │   └── *.tsx                 # Landing: Navbar, Hero, Features, WhoWeAre, Auth, etc.
│   ├── pages/                    # 21 pages
│   │   ├── admin/                # 8 pages (Layout, Overview, Buses, Routes, Users, Schedule, Reports, Notifications)
│   │   ├── passenger/            # 7 pages (Layout, Overview, Reserve, Reservations, Routes, Notifications, Profile)
│   │   ├── driver/               # 6 pages (Layout, Overview, MyRoute, PassengerList, Notifications, Profile)
│   │   └── *.tsx                 # AuthCallback, RoleSelection, NotFound
│   ├── services/                 # 7 API service modules
│   ├── context/                  # 4 context providers (Auth, Toast, Schedule, Reservation)
│   ├── hooks/                    # 4 custom hooks
│   ├── config/                   # API endpoint config
│   ├── lib/                      # Axios client, error mapper
│   ├── types/                    # TypeScript API types
│   └── data/                     # 3 mock data files (to be removed)
├── backend1/                     # Backend (Django + DRF)
│   ├── accounts/                 # User model, JWT, 42 OAuth, permissions
│   ├── buses/                    # Bus model, CRUD, freeze guard
│   ├── routes/                   # Route model, CRUD
│   ├── trips/                    # Trip model, lifecycle state machine
│   ├── reservations/             # Reservation model, capacity checks
│   ├── organization/             # Organization model
│   ├── core/                     # Domain exceptions, exception handler
│   └── config/                   # Django settings, URL routing
├── PROJECT.md                    # Project management document
├── PROJECT_STATUS.md             # This file
├── MERGE_TEST_REPORT.md          # 42-test integration report (39/42 pass)
└── test_integration.sh           # Automated test suite
```

---

<sub>Report generated March 2, 2026 · Fleetmark Team · 5 members</sub>
