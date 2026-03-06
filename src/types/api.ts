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

export interface AuthCallbackResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    role: 'admin' | 'passenger';
    is_new_user: boolean;
    home_stop: string | null;
  };
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
  home_stop?: string | null;
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
  depart_time: string;
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
  user: number;
  user_name: string;
  user_role: string;
  created_at: string;
}

export interface ReservationCreate {
  trip: number;
  user: number;
}

// ═══════════════════════════════════════
//  API Error
// ═══════════════════════════════════════

export interface ApiError {
  error?: string;
  code?: string;
  detail?: string;
  [key: string]: unknown;
}

export type ApiErrorCode =
  | 'domain_error'
  | 'lifecycle_error'
  | 'freeze_error'
  | 'capacity_error'
  | 'integrity_error';

