const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    // In browser, if no explicit API URL set, default to relative /api/v1
    return "/api/v1";
  }
  return "http://127.0.0.1:8000/api/v1";
};

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: "include", // Send HttpOnly cookies (§11.1)
  };

  const apiBase = getApiBaseUrl();
  const url = endpoint.startsWith("http") ? endpoint : `${apiBase}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
