import { getToken, refreshToken } from "../services/supabase";


interface FetchWithTokenOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: Record<string, unknown> | string | null;
  requireToken?: boolean;
}

export const fetchWithToken = async <T>(
  url: string,
  options: FetchWithTokenOptions = {},
): Promise<{ data: T; status: number }> => {
  const {
    method = "GET",
    headers = {},
    body = null,
    requireToken = true,
  } = options;

  try {
    let token: string | null = null;
    if (requireToken) {
      token = await getToken("accessToken");
      if (!token) {
        throw new Error("Token not found. User might be logged out.");
      }
    }

    const serializedBody =
      body && typeof body === "object" ? JSON.stringify(body) : undefined;

    let response = await fetch(url, {
      method,
      headers: {
        ...headers,
        ...(requireToken ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
      body: serializedBody,
    });

    // Handle token expiration
    if (response.status === 401 && requireToken) {
      console.warn("Token expired, attempting to refresh...");
      await refreshToken();
      const newToken = await getToken("accessToken");

      if (!newToken) {
        throw new Error("Failed to refresh token. User might be logged out.");
      }

      response = await fetch(url, {
        method,
        headers: {
          ...headers,
          Authorization: `Bearer ${newToken}`,
          "Content-Type": "application/json",
        },
        body: serializedBody,
      });
    }

    if (!response.ok) {
      const errorResponse = await response.text();
      throw new Error(
        `HTTP error! Status: ${response.status} - ${response.statusText} - ${errorResponse}`,
      );
    }

    const data: T = (await response.json()) as T;
    return { data, status: response.status }; // Include status in the return value
  } catch (error) {
    console.error("Error during fetchWithToken:", error);
    throw error;
  }
};