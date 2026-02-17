export type SignupRole = "driver" | "rider";

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role: SignupRole;
  home_location: string | null;
  work_location: string | null;
  timings: string | null;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

const SIGNUP_ENDPOINT = "/api/auth/signup";
const LOGIN_ENDPOINT = "/api/auth/login";
const ME_ENDPOINT = "/api/auth/me";
const LOGOUT_ENDPOINT = "/api/auth/logout";

const buildUrl = (path: string) =>
  API_BASE_URL.length > 0 ? `${API_BASE_URL}${path}` : path;

const TOKEN_KEY = "carconnect_token";
const TOKEN_COOKIE = "carconnect_token";
const COOKIE_MAX_AGE_DAYS = 7;

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

/** Set token in localStorage and cookie (for middleware route protection) */
export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${COOKIE_MAX_AGE_DAYS * 86400}; samesite=lax`;
}

/** Clear token from localStorage and cookie */
export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
}

/** Check if user has an auth token (for route guards) */
export function hasAuthToken(): boolean {
  if (typeof window === "undefined") return false;
  return !!window.localStorage.getItem(TOKEN_KEY);
}

async function handleJsonResponse(response: Response) {
  const data = await response
    .json()
    .catch(() => ({ message: "Unexpected response from server." }));

  if (!response.ok) {
    const message =
      typeof data?.message === "string"
        ? data.message
        : "Something went wrong. Please try again.";
    throw new Error(message);
  }

  return data;
}

export async function signup(payload: SignupPayload) {
  const response = await fetch(buildUrl(SIGNUP_ENDPOINT), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleJsonResponse(response);
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    token?: string;
    user?: {
      role?: SignupRole;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export async function login(payload: LoginPayload) {
  const response = await fetch(buildUrl(LOGIN_ENDPOINT), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleJsonResponse(response) as Promise<LoginResponse>;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: SignupRole;
  created_at: string;
}

export interface GetCurrentUserResponse {
  success: boolean;
  data: {
    user: User;
  };
}

/**
 * Get current authenticated user details
 * Requires authentication token in localStorage
 */
export async function getCurrentUser(): Promise<GetCurrentUserResponse> {
  const token = getToken();
  if (!token) {
    throw new Error("You must be signed in to get user details.");
  }

  const response = await fetch(buildUrl(ME_ENDPOINT), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return handleJsonResponse(response) as Promise<GetCurrentUserResponse>;
}

/**
 * Logout the current user.
 * Calls the API to notify the server, then caller should clear token and redirect.
 */
export async function logout(): Promise<{
  success: boolean;
  message?: string;
}> {
  const token = getToken();
  if (!token) {
    return { success: true };
  }

  try {
    const response = await fetch(buildUrl(LOGOUT_ENDPOINT), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = (await response.json()) as {
      success?: boolean;
      message?: string;
    };
    return { success: response.ok, message: data.message };
  } catch {
    return { success: false };
  }
}
