# Fleetmark Backend — API Reference

> Django REST Framework backend for the Fleetmark transportation management platform.

---

## Tech Stack

| Layer            | Technology                              |
| ---------------- | --------------------------------------- |
| Framework        | Django 4.2 + Django REST Framework 3.14 |
| Authentication   | JWT via `djangorestframework-simplejwt`  |
| Database         | SQLite 3 (development)                  |
| Python           | 3.10+                                   |
| Package Manager  | pip                                     |

### Dependencies

```
Django>=4.2,<5.0
djangorestframework>=3.14,<4.0
djangorestframework-simplejwt>=5.2,<6.0
python-dotenv>=1.2.1
sqlparse>=0.5.5
django-stubs>=5.2.0
djangorestframework-stubs>=3.16.0
mypy>=1.15.0
```

---

## Project Structure

```
backend1/
├── manage.py
├── requirements.txt
├── JWT_AUTHENTICATION.md
├── JWT_SUMMARY.md
│
├── config/                  # Project configuration
│   ├── settings.py          # Django settings (REST, JWT, Logging)
│   ├── urls.py              # Root URL routing
│   ├── api_urls.py          # /api/v1/ sub-router
│   ├── wsgi.py
│   └── asgi.py
│
├── core/                    # Shared utilities
│   ├── exceptions.py        # DomainError hierarchy
│   └── exception_handler.py # Custom DRF exception handler
│
├── accounts/                # User management & JWT auth
│   ├── models.py            # Custom User model (AbstractUser)
│   ├── views.py             # UserViewSet (ModelViewSet)
│   ├── urls.py              # JWT token endpoints + user CRUD
│   ├── serializers.py       # UserSerializer, UserCreateSerializer
│   ├── permissions.py       # IsSuperAdmin, IsOwnerOrAdmin, IsDriver, IsPassenger
│   ├── admin.py
│   └── test_jwt.py          # 9 JWT integration tests
│
├── organization/            # Multi-tenant organizations
│   ├── models.py            # Organization model
│   ├── views.py             # OrganizationViewSet
│   ├── urls.py
│   ├── serializer.py
│   └── admin.py
│
├── buses/                   # Bus fleet management
│   ├── models.py            # Bus model (with freeze guard)
│   ├── views.py             # BusListCreateView, BusDetailView
│   ├── urls.py
│   ├── serializers.py
│   ├── permissions.py       # CanCrudBus
│   └── admin.py
│
├── routes/                  # Route management
│   ├── models.py            # Route model (FK → Bus)
│   ├── views.py             # RouteListCreateView, RouteDetailView
│   ├── urls.py
│   ├── serializers.py
│   ├── permissions.py       # CanCrudRoute
│   └── admin.py
│
├── trips/                   # Trip lifecycle management
│   ├── models.py            # Trip model (state machine)
│   ├── views.py             # CRUD + StartTripView, EndTripView
│   ├── urls.py
│   ├── serializers.py
│   ├── permissions.py       # CanCrudTrip, CanManageTripLifecycle
│   └── admin.py
│
└── reservations/            # Seat reservations
    ├── models.py            # Reservation model (FK → Trip)
    ├── views.py             # List/Create + Retrieve/Destroy
    ├── urls.py
    ├── serializers.py
    ├── permissions.py       # CanManageReservation
    └── admin.py
```

---

## Setup & Installation

### 1. Clone & Navigate

```bash
git clone https://github.com/adilx15487/Fleetmark.git
cd Fleetmark/backend1
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate   # Linux/macOS
# venv\Scripts\activate    # Windows
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Environment Variables

Create a `.env` file in `backend1/`:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
```

### 5. Run Migrations

```bash
python manage.py migrate
```

### 6. Create Superuser

```bash
python manage.py createsuperuser
```

### 7. Start Development Server

```bash
python manage.py runserver
```

The API will be available at **`http://127.0.0.1:8000/api/v1/`**

### 8. Run Tests

```bash
python manage.py test accounts
```

> 9 JWT authentication tests — all passing.

---

## Authentication (JWT)

All API endpoints (except token obtain) require a valid JWT Bearer token.

### Token Lifecycle

| Setting              | Value   |
| -------------------- | ------- |
| Access token expiry  | 1 hour  |
| Refresh token expiry | 7 days  |
| Algorithm            | HS256   |
| Auth header prefix   | Bearer  |
| Token rotation       | Enabled |

### Auth Endpoints

| Method | Endpoint                              | Description              | Auth Required |
| ------ | ------------------------------------- | ------------------------ | ------------- |
| POST   | `/api/v1/accounts/token/`             | Obtain access + refresh  | No            |
| POST   | `/api/v1/accounts/token/refresh/`     | Refresh access token     | No            |
| POST   | `/api/v1/accounts/token/verify/`      | Verify a token           | No            |

#### Obtain Token

```bash
curl -X POST http://127.0.0.1:8000/api/v1/accounts/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "pass123"}'
```

**Response** `200 OK`:

```json
{
  "access": "eyJhbGciOiJIUzI1NiIs...",
  "refresh": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Refresh Token

```bash
curl -X POST http://127.0.0.1:8000/api/v1/accounts/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "eyJhbGciOiJIUzI1NiIs..."}'
```

**Response** `200 OK`:

```json
{
  "access": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Using the Token

Include the access token in all subsequent requests:

```bash
curl -H "Authorization: Bearer <access_token>" \
  http://127.0.0.1:8000/api/v1/buses/
```

---

## Database Models

### Entity Relationship

```
Organization  1 ──── * User
Bus           1 ──── * Route
Route         1 ──── * Trip
Trip          1 ──── * Reservation
```

### Organization

| Field | Type          | Constraints |
| ----- | ------------- | ----------- |
| id    | AutoField     | PK          |
| name  | CharField(50) | unique      |

### User (extends `AbstractUser`)

| Field        | Type                   | Constraints                          |
| ------------ | ---------------------- | ------------------------------------ |
| id           | AutoField              | PK                                   |
| username     | CharField              | unique (inherited)                   |
| email        | EmailField             | inherited                            |
| password     | CharField              | hashed (inherited)                   |
| role         | CharField(10)          | choices: `admin`, `driver`, `passenger` (default: `passenger`) |
| organization | FK → Organization      | nullable, CASCADE                    |

**Properties:** `is_org_admin`, `is_driver`, `is_passenger`

### Bus

| Field     | Type                   | Constraints          |
| --------- | ---------------------- | -------------------- |
| id        | AutoField              | PK                   |
| matricule | CharField(50)          |                      |
| capacity  | PositiveIntegerField   | min_value=1          |

**Business Rule:** Cannot modify a bus that is assigned to routes (`FreezeError` — 409).

### Route

| Field     | Type           | Constraints          |
| --------- | -------------- | -------------------- |
| id        | AutoField      | PK                   |
| bus       | FK → Bus       | PROTECT              |
| direction | CharField(100) |                      |

### Trip

| Field         | Type               | Constraints                              |
| ------------- | ------------------ | ---------------------------------------- |
| id            | AutoField          | PK                                       |
| route         | FK → Route         | PROTECT                                  |
| depart_time   | DateTimeField      |                                          |
| status        | CharField(10)      | choices: `CREATED`, `STARTED`, `ENDED` (default: `CREATED`, read-only) |
| start_trip_at | DateTimeField      | nullable, read-only                      |
| end_trip_at   | DateTimeField      | nullable, read-only                      |

**State Machine:**

```
CREATED  ──(start)──>  STARTED  ──(end)──>  ENDED
```

**Business Rules:**
- New trips always start in `CREATED` state
- `route` and `depart_time` are frozen once a trip is `STARTED` or `ENDED`
- Cannot start a trip with zero reservations (`LifecycleError`)
- `start()` sets `start_trip_at` to current time
- `end()` sets `end_trip_at` to current time
- `seats_left()` = `route.bus.capacity - reservations.count()`

### Reservation

| Field           | Type              | Constraints          |
| --------------- | ----------------- | -------------------- |
| id              | AutoField         | PK                   |
| trip            | FK → Trip         | PROTECT              |
| passenger_name  | CharField(100)    |                      |
| created_at      | DateTimeField     | auto_now_add         |

**Business Rules:**
- Can only reserve on trips in `CREATED` status (`LifecycleError`)
- Cannot exceed bus capacity (`CapacityError` — 409)

---

## API Documentation

**Base URL:** `http://127.0.0.1:8000/api/v1/`

### Accounts — Users

| Method | Endpoint                          | Description          | Auth  | Role                        |
| ------ | --------------------------------- | -------------------- | ----- | --------------------------- |
| GET    | `/api/v1/accounts/users/`         | List users           | Yes   | Superadmin, OrgAdmin        |
| POST   | `/api/v1/accounts/users/`         | Create user          | Yes   | Superadmin, OrgAdmin        |
| GET    | `/api/v1/accounts/users/{id}/`    | Retrieve user        | Yes   | Any authenticated           |
| PUT    | `/api/v1/accounts/users/{id}/`    | Update user          | Yes   | Owner, Superadmin, OrgAdmin |
| PATCH  | `/api/v1/accounts/users/{id}/`    | Partial update user  | Yes   | Owner, Superadmin, OrgAdmin |
| DELETE | `/api/v1/accounts/users/{id}/`    | Delete user          | Yes   | Superadmin, OrgAdmin        |

**Queryset Scoping:**
- **Superadmin** → sees all users
- **OrgAdmin** → sees only users in their organization
- **Driver/Passenger** → sees only their own profile

#### Create User — Request Body

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepass123",
  "role": "passenger"
}
```

> New users inherit the creator's `organization` automatically.

#### User Response

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "passenger",
  "organization": {
    "id": 1,
    "name": "1337 School"
  }
}
```

---

### Organization

| Method | Endpoint                              | Description             | Auth  | Role                        |
| ------ | ------------------------------------- | ----------------------- | ----- | --------------------------- |
| GET    | `/api/v1/organization/`               | List organizations      | Yes   | Any authenticated           |
| POST   | `/api/v1/organization/`               | Create organization     | Yes   | Superadmin, OrgAdmin        |
| GET    | `/api/v1/organization/{id}/`          | Retrieve organization   | Yes   | Any authenticated           |
| PUT    | `/api/v1/organization/{id}/`          | Update organization     | Yes   | Superadmin, OrgAdmin        |
| PATCH  | `/api/v1/organization/{id}/`          | Partial update          | Yes   | Superadmin, OrgAdmin        |
| DELETE | `/api/v1/organization/{id}/`          | Delete organization     | Yes   | Superadmin, OrgAdmin        |

**Queryset Scoping:**
- **Superadmin** → sees all organizations
- **OrgAdmin/others** → sees only their own organization

#### Organization Response

```json
{
  "id": 1,
  "name": "1337 School"
}
```

---

### Buses

| Method | Endpoint                    | Description        | Auth  | Role                        |
| ------ | --------------------------- | ------------------ | ----- | --------------------------- |
| GET    | `/api/v1/buses/`            | List all buses     | Yes   | Any authenticated           |
| POST   | `/api/v1/buses/`            | Create bus         | Yes   | Superadmin, OrgAdmin        |
| GET    | `/api/v1/buses/{id}/`       | Retrieve bus       | Yes   | Any authenticated           |
| PUT    | `/api/v1/buses/{id}/`       | Update bus         | Yes   | Superadmin, OrgAdmin        |
| PATCH  | `/api/v1/buses/{id}/`       | Partial update bus | Yes   | Superadmin, OrgAdmin        |
| DELETE | `/api/v1/buses/{id}/`       | Delete bus         | Yes   | Superadmin, OrgAdmin        |

#### Create / Update Bus — Request Body

```json
{
  "matricule": "BUS-001",
  "capacity": 44
}
```

#### Bus Response

```json
{
  "id": 1,
  "matricule": "BUS-001",
  "capacity": 44
}
```

#### Error: Modify Frozen Bus (409)

```json
{
  "error": "Cannot modify bus assigned to routes",
  "code": "freeze_error"
}
```

---

### Routes

| Method | Endpoint                      | Description          | Auth  | Role                        |
| ------ | ----------------------------- | -------------------- | ----- | --------------------------- |
| GET    | `/api/v1/routes/`             | List all routes      | Yes   | Any authenticated           |
| POST   | `/api/v1/routes/`             | Create route         | Yes   | Superadmin, OrgAdmin        |
| GET    | `/api/v1/routes/{id}/`        | Retrieve route       | Yes   | Any authenticated           |
| PUT    | `/api/v1/routes/{id}/`        | Update route         | Yes   | Superadmin, OrgAdmin        |
| PATCH  | `/api/v1/routes/{id}/`        | Partial update route | Yes   | Superadmin, OrgAdmin        |
| DELETE | `/api/v1/routes/{id}/`        | Delete route         | Yes   | Superadmin, OrgAdmin        |

#### Create Route — Request Body

```json
{
  "bus": 1,
  "direction": "1337 → Hay Riad → Agdal"
}
```

#### Route Response

```json
{
  "id": 1,
  "bus": 1,
  "direction": "1337 → Hay Riad → Agdal"
}
```

#### Error: Delete Route with Trips (409)

```json
{
  "error": "Cannot delete route with existing trips",
  "code": "protected_delete"
}
```

---

### Trips

| Method | Endpoint                          | Description        | Auth  | Role                                     |
| ------ | --------------------------------- | ------------------ | ----- | ---------------------------------------- |
| GET    | `/api/v1/trips/`                  | List all trips     | Yes   | Any authenticated                        |
| POST   | `/api/v1/trips/`                  | Create trip        | Yes   | Superadmin, OrgAdmin                     |
| GET    | `/api/v1/trips/{id}/`             | Retrieve trip      | Yes   | Any authenticated                        |
| PUT    | `/api/v1/trips/{id}/`             | Update trip        | Yes   | Superadmin, OrgAdmin                     |
| PATCH  | `/api/v1/trips/{id}/`             | Partial update     | Yes   | Superadmin, OrgAdmin                     |
| DELETE | `/api/v1/trips/{id}/`             | Delete trip        | Yes   | Superadmin, OrgAdmin                     |
| POST   | `/api/v1/trips/{id}/start/`       | Start trip         | Yes   | Superadmin, OrgAdmin, Driver             |
| POST   | `/api/v1/trips/{id}/end/`         | End trip           | Yes   | Superadmin, OrgAdmin, Driver             |

#### Create Trip — Request Body

```json
{
  "route": 1,
  "depart_time": "2025-01-15T21:30:00Z"
}
```

> `status`, `start_trip_at`, and `end_trip_at` are **read-only** — managed by the state machine.

#### Trip Response

```json
{
  "id": 1,
  "route": 1,
  "depart_time": "2025-01-15T21:30:00Z",
  "status": "CREATED",
  "start_trip_at": null,
  "end_trip_at": null
}
```

#### Start Trip — Response (200)

```json
{
  "start_trip_at": "2025-01-15T21:30:05.123456Z"
}
```

#### End Trip — Response (200)

```json
{
  "end_trip_at": "2025-01-15T22:45:12.654321Z"
}
```

#### Error: Start Trip with No Reservations (400)

```json
{
  "error": "Cannot start trip with zero reservations",
  "code": "lifecycle_error"
}
```

#### Error: Delete Trip with Reservations (409)

```json
{
  "error": "Cannot delete trip with existing reservations",
  "code": "protected_delete"
}
```

---

### Reservations

| Method | Endpoint                              | Description            | Auth  | Role                                     |
| ------ | ------------------------------------- | ---------------------- | ----- | ---------------------------------------- |
| GET    | `/api/v1/reservations/`               | List all reservations  | Yes   | Any authenticated                        |
| POST   | `/api/v1/reservations/`               | Create reservation     | Yes   | Superadmin, OrgAdmin, Passenger          |
| GET    | `/api/v1/reservations/{id}/`          | Retrieve reservation   | Yes   | Any authenticated                        |
| DELETE | `/api/v1/reservations/{id}/`          | Cancel reservation     | Yes   | Superadmin, OrgAdmin, Passenger          |

#### Create Reservation — Request Body

```json
{
  "trip": 1,
  "passenger_name": "Adil Elbouzaidi"
}
```

#### Reservation Response

```json
{
  "id": 1,
  "trip": 1,
  "passenger_name": "Adil Elbouzaidi",
  "created_at": "2025-01-15T20:00:00.123456Z"
}
```

#### Error: Trip Not in CREATED State (400)

```json
{
  "error": "Cannot reserve this non-CREATED trip",
  "code": "lifecycle_error"
}
```

#### Error: Bus Full (409)

```json
{
  "error": "No seats available",
  "code": "capacity_error"
}
```

---

## User Roles & Permissions

| Action                          | Superadmin | OrgAdmin | Driver | Passenger |
| ------------------------------- | :--------: | :------: | :----: | :-------: |
| **Users — List / Create**       | ✅         | ✅ (org) | ❌     | ❌        |
| **Users — View Profile**        | ✅         | ✅       | ✅     | ✅        |
| **Users — Update Own Profile**  | ✅         | ✅       | ✅     | ✅        |
| **Users — Delete**              | ✅         | ✅ (org) | ❌     | ❌        |
| **Organizations — List / View** | ✅ (all)   | ✅ (own) | ✅ (own)| ✅ (own) |
| **Organizations — CUD**         | ✅         | ✅       | ❌     | ❌        |
| **Buses — List / View**         | ✅         | ✅       | ✅     | ✅        |
| **Buses — Create / Update / Delete** | ✅    | ✅       | ❌     | ❌        |
| **Routes — List / View**        | ✅         | ✅       | ✅     | ✅        |
| **Routes — Create / Update / Delete** | ✅   | ✅       | ❌     | ❌        |
| **Trips — List / View**         | ✅         | ✅       | ✅     | ✅        |
| **Trips — Create / Update / Delete** | ✅    | ✅       | ❌     | ❌        |
| **Trips — Start / End**         | ✅         | ✅       | ✅     | ❌        |
| **Reservations — List / View**  | ✅         | ✅       | ✅     | ✅        |
| **Reservations — Create**       | ✅         | ✅       | ❌     | ✅        |
| **Reservations — Delete**       | ✅         | ✅       | ❌     | ✅        |

**(org)** = scoped to their own organization only.

---

## Custom Exception Handling

The API uses a custom exception handler (`core.exception_handler.api_exception_handler`) that translates domain errors into consistent JSON responses:

| Exception Class  | HTTP Status | Code              | Description                                  |
| ---------------- | ----------- | ----------------- | -------------------------------------------- |
| `DomainError`    | 400         | `domain_error`    | Base class for all domain errors             |
| `LifecycleError` | 400         | `lifecycle_error` | Invalid trip state transition                |
| `FreezeError`    | 409         | `freeze_error`    | Attempted modification of frozen entity      |
| `CapacityError`  | 409         | `capacity_error`  | Bus capacity exceeded                        |
| `IntegrityError` | 409         | `integrity_error` | FK constraint — cannot delete with dependents|

**Error Response Format:**

```json
{
  "error": "Human-readable error message",
  "code": "machine_readable_code"
}
```

**Protected Delete Messages:**
- Bus → `"Cannot delete bus assigned to routes"`
- Route → `"Cannot delete route with existing trips"`
- Trip → `"Cannot delete trip with existing reservations"`

---

## Audit Logging

All mutating operations (create, delete, start, end) are logged to the `audit` logger:

```
user=1 action=bus.create bus=5
user=1 action=trip.create trip=3 route=1 transition=NONE->CREATED
user=2 action=trip.start trip=3 transition=CREATED->STARTED
user=2 action=trip.end trip=3 transition=STARTED->ENDED
user=3 action=reservation.create trip=3 reservation=7
user=1 action=reservation.delete trip=3 reservation=7
user=1 action=bus.delete bus=5
user=1 action=route.delete route=2
user=1 action=trip.delete trip=3
```

Log output is written to `logs/audit.log` (configured in `settings.py`).

---

## Django Admin

All models are registered with the Django admin at `/admin/`:

| Model        | List Display                                          | Search Fields                      |
| ------------ | ----------------------------------------------------- | ---------------------------------- |
| User         | (default UserAdmin)                                   | (default)                          |
| Organization | (default)                                             | (default)                          |
| Bus          | id, matricule, capacity                               | matricule                          |
| Route        | id, direction, bus                                    | direction, bus\_\_matricule        |
| Trip         | id, route, status, depart_time, start/end timestamps  | route\_\_direction, bus\_\_matricule |
| Reservation  | id, passenger_name, trip, created_at                  | passenger_name                     |

---

## Testing

```bash
# Run all tests
python manage.py test

# Run JWT tests only
python manage.py test accounts
```

### Test Coverage (9 tests)

| Test                                              | Description                                      |
| ------------------------------------------------- | ------------------------------------------------ |
| `test_obtain_jwt_token_with_valid_credentials`    | Obtain access + refresh tokens                   |
| `test_obtain_token_with_invalid_credentials`      | Reject wrong password (401)                      |
| `test_access_protected_endpoint_with_valid_token` | Access buses with valid JWT                      |
| `test_access_protected_endpoint_without_token`    | Reject unauthenticated request (401/403)         |
| `test_access_protected_endpoint_with_invalid_token` | Reject invalid token (401)                     |
| `test_refresh_token`                              | Refresh access using refresh token               |
| `test_verify_token`                               | Verify valid token (200)                         |
| `test_verify_invalid_token`                       | Reject invalid token verification (401)          |
| `test_token_for_different_roles`                  | All roles (superadmin, driver, passenger) can auth |

---

## Quick Reference — All Endpoints

| Method | Endpoint                              | Description              |
| ------ | ------------------------------------- | ------------------------ |
| POST   | `/api/v1/accounts/token/`             | Obtain JWT tokens        |
| POST   | `/api/v1/accounts/token/refresh/`     | Refresh access token     |
| POST   | `/api/v1/accounts/token/verify/`      | Verify token validity    |
| GET    | `/api/v1/accounts/users/`             | List users               |
| POST   | `/api/v1/accounts/users/`             | Create user              |
| GET    | `/api/v1/accounts/users/{id}/`        | Retrieve user            |
| PUT    | `/api/v1/accounts/users/{id}/`        | Update user              |
| PATCH  | `/api/v1/accounts/users/{id}/`        | Partial update user      |
| DELETE | `/api/v1/accounts/users/{id}/`        | Delete user              |
| GET    | `/api/v1/organization/`               | List organizations       |
| POST   | `/api/v1/organization/`               | Create organization      |
| GET    | `/api/v1/organization/{id}/`          | Retrieve organization    |
| PUT    | `/api/v1/organization/{id}/`          | Update organization      |
| PATCH  | `/api/v1/organization/{id}/`          | Partial update           |
| DELETE | `/api/v1/organization/{id}/`          | Delete organization      |
| GET    | `/api/v1/buses/`                      | List buses               |
| POST   | `/api/v1/buses/`                      | Create bus               |
| GET    | `/api/v1/buses/{id}/`                 | Retrieve bus             |
| PUT    | `/api/v1/buses/{id}/`                 | Update bus               |
| PATCH  | `/api/v1/buses/{id}/`                 | Partial update bus       |
| DELETE | `/api/v1/buses/{id}/`                 | Delete bus               |
| GET    | `/api/v1/routes/`                     | List routes              |
| POST   | `/api/v1/routes/`                     | Create route             |
| GET    | `/api/v1/routes/{id}/`                | Retrieve route           |
| PUT    | `/api/v1/routes/{id}/`                | Update route             |
| PATCH  | `/api/v1/routes/{id}/`                | Partial update route     |
| DELETE | `/api/v1/routes/{id}/`                | Delete route             |
| GET    | `/api/v1/trips/`                      | List trips               |
| POST   | `/api/v1/trips/`                      | Create trip              |
| GET    | `/api/v1/trips/{id}/`                 | Retrieve trip            |
| PUT    | `/api/v1/trips/{id}/`                 | Update trip              |
| PATCH  | `/api/v1/trips/{id}/`                 | Partial update trip      |
| DELETE | `/api/v1/trips/{id}/`                 | Delete trip              |
| POST   | `/api/v1/trips/{id}/start/`           | Start trip               |
| POST   | `/api/v1/trips/{id}/end/`             | End trip                 |
| GET    | `/api/v1/reservations/`               | List reservations        |
| POST   | `/api/v1/reservations/`               | Create reservation       |
| GET    | `/api/v1/reservations/{id}/`          | Retrieve reservation     |
| DELETE | `/api/v1/reservations/{id}/`          | Cancel reservation       |
