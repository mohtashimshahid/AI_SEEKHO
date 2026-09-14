const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface RequestOptions extends RequestInit {
  token?: string | null;
  allowGuestAutoLogin?: boolean;
}

export async function ensureAuthToken(): Promise<string> {
  if (typeof window === "undefined") return "";
  let token = localStorage.getItem("tripsage_token");
  if (!token) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/guest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.access_token) {
          localStorage.setItem("tripsage_token", data.access_token);
          token = data.access_token;
        }
      }
    } catch (e) {
      console.warn("Could not auto-provision guest session", e);
    }
  }
  return token || "";
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers = {}, allowGuestAutoLogin = true, ...rest } = options;
  
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  let storedToken = typeof window !== "undefined" ? localStorage.getItem("tripsage_token") : null;
  let authToken = token || storedToken;

  const isAuthEndpoint = endpoint.startsWith("/auth/login") || endpoint.startsWith("/auth/register") || endpoint.startsWith("/health");

  if (!authToken && allowGuestAutoLogin && !isAuthEndpoint) {
    authToken = await ensureAuthToken();
  }

  if (authToken) {
    defaultHeaders["Authorization"] = `Bearer ${authToken}`;
  }

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      ...defaultHeaders,
      ...(headers as Record<string, string>),
    },
    ...rest,
  });

  // If unauthorized, retry once with a fresh guest session
  if (response.status === 401 && allowGuestAutoLogin && typeof window !== "undefined" && !isAuthEndpoint) {
    localStorage.removeItem("tripsage_token");
    const freshToken = await ensureAuthToken();
    if (freshToken) {
      defaultHeaders["Authorization"] = `Bearer ${freshToken}`;
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          ...defaultHeaders,
          ...(headers as Record<string, string>),
        },
        ...rest,
      });
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ detail: "An unexpected error occurred" }));
    throw new Error(errorBody.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}

