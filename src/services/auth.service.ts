// ── Auth service — JWT login, refresh, verify, session restore ──

import axios from 'axios';
import api from '../lib/axios';
import { API_ENDPOINTS, STORAGE_KEYS } from '../config/api.config';
import type { TokenPair, JwtPayload, User } from '../types/api';

// ── Decode JWT payload (no library needed) ──
export function decodeToken(token: string): JwtPayload {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  );
  return JSON.parse(jsonPayload);
}

// ── Check if token is expired ──
export function isTokenExpired(token: string): boolean {
  try {
    const { exp } = decodeToken(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

// ── Login with username + password ──
export async function login(username: string, password: string): Promise<{ tokens: TokenPair; user: User }> {
  // 1. Obtain JWT tokens
  const { data: tokens } = await api.post<TokenPair>(API_ENDPOINTS.auth.token, {
    username,
    password,
  });

  // 2. Store tokens
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.access);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh);

  // 3. Decode to get user_id, then fetch full profile
  const { user_id } = decodeToken(tokens.access);
  const { data: user } = await api.get<User>(API_ENDPOINTS.users.detail(user_id));

  // 4. Cache user
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

  return { tokens, user };
}

// ── Refresh access token ──
export async function refreshAccessToken(): Promise<string> {
  const refresh = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  if (!refresh) throw new Error('No refresh token');

  const { data } = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}${API_ENDPOINTS.auth.refresh}`,
    { refresh },
  );

  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access);
  if (data.refresh) {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh);
  }

  return data.access;
}

// ── Verify token is still valid ──
export async function verifyToken(token: string): Promise<boolean> {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}${API_ENDPOINTS.auth.verify}`,
      { token },
    );
    return true;
  } catch {
    return false;
  }
}

// ── Restore session on app load ──
export async function restoreSession(): Promise<User | null> {
  const access = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  if (!access) return null;

  // Fast check — if token not expired, use cached user
  if (!isTokenExpired(access)) {
    const cached = localStorage.getItem(STORAGE_KEYS.USER);
    if (cached) return JSON.parse(cached) as User;

    // Token valid but no cached user → fetch
    try {
      const { user_id } = decodeToken(access);
      const { data: user } = await api.get<User>(API_ENDPOINTS.users.detail(user_id));
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return user;
    } catch {
      return null;
    }
  }

  // Token expired → try refresh
  const refresh = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  if (!refresh) {
    clearSession();
    return null;
  }

  try {
    const newAccess = await refreshAccessToken();
    const { user_id } = decodeToken(newAccess);
    const { data: user } = await api.get<User>(API_ENDPOINTS.users.detail(user_id));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  } catch {
    clearSession();
    return null;
  }
}

// ── Logout — clear everything ──
export function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}
