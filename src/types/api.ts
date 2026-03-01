// ── Fleetmark API Types — mirrors Django REST Framework models ──

// ═══════════════════════════════════════
//  Auth
// ═══════════════════════════════════════

export interface TokenPair {
  access: string;
  refresh: string;
}

export interface TokenRefreshResponse {
  access: string;
}

export interface JwtPayload {
  user_id: number;
  exp: number;
  iat: number;
  jti: string;
  token_type: 'access' | 'refresh';
}

// ═══════════════════════════════════════
//  Organization
// ═══════════════════════════════════════

export interface Organization {
  id: number;
  name: string;
}

export type OrganizationCreate = Pick<Organization, 'name'>;

// ═══════════════════════════════════════
//  User / Accounts
// ═══════════════════════════════════════

export type UserRole = 'admin' | 'driver' | 'passenger';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  organization: Organization | null;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export type UserUpdate = Partial<Omit<UserCreate, 'password'>>;

// ═══════════════════════════════════════
//  Bus
// ═══════════════════════════════════════

export interface Bus {
  id: number;
  matricule: string;
  capacity: number;
}

export type BusCreate = Omit<Bus, 'id'>;
export type BusUpdate = Partial<BusCreate>;

// ═══════════════════════════════════════
//  Route
// ═══════════════════════════════════════

export interface ApiRoute {
  id: number;
  bus: number;
  direction: string;
}

export interface ApiRouteCreate {
  bus: number;
  direction: string;
}

export type ApiRouteUpdate = Partial<ApiRouteCreate>;

// ═══════════════════════════════════════
//  Trip
// ═══════════════════════════════════════

export type TripStatus = 'CREATED' | 'STARTED' | 'ENDED';

export interface Trip {
  id: number;
  route: number;
  depart_time: string; // ISO 8601
  status: TripStatus;
  start_trip_at: string | null;
  end_trip_at: string | null;
}

export interface TripCreate {
  route: number;
  depart_time: string;
}

export type TripUpdate = Partial<TripCreate>;

export interface TripStartResponse {
  start_trip_at: string;
}

export interface TripEndResponse {
  end_trip_at: string;
}

// ═══════════════════════════════════════
//  Reservation
// ═══════════════════════════════════════

export interface Reservation {
  id: number;
  trip: number;
  passenger_name: string;
  created_at: string; // ISO 8601
}

export interface ReservationCreate {
  trip: number;
  passenger_name: string;
}

// ═══════════════════════════════════════
//  API Error
// ═══════════════════════════════════════

export interface ApiError {
  error: string;
  code: string;
}

export type ApiErrorCode =
  | 'domain_error'
  | 'lifecycle_error'
  | 'freeze_error'
  | 'capacity_error'
  | 'integrity_error';
