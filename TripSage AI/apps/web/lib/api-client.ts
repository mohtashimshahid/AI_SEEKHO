const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface RequestOptions extends RequestInit {
  token?: string | null;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers = {}, ...rest } = options;
  
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const storedToken = typeof window !== "undefined" ? localStorage.getItem("tripsage_token") : null;
  const authToken = token || storedToken;

  if (authToken) {
    defaultHeaders["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      ...defaultHeaders,
      ...(headers as Record<string, string>),
    },
    ...rest,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ detail: "An unexpected error occurred" }));
    throw new Error(errorBody.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}
