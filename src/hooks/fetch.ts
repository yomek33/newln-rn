import { getToken, refreshToken } from "../services/supabase";

interface FetchWithTokenOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: Record<string, unknown> | null;
  requireToken?: boolean;
}

export const fetchWithToken = async <T>(
  url: string,
  options: FetchWithTokenOptions = {},
): Promise<T> => {
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
    console.log("fetchWithToken", url, method, body, requireToken, token);

    let response = await fetch(url, {
      method,
      headers: {
        ...headers,
        ...(requireToken ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    // トークンが期限切れの場合、リフレッシュを試みる
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
        body: body ? JSON.stringify(body) : undefined,
      });
    }

    if (!response.ok) {
      const errorResponse = await response.text();
      throw new Error(
        `HTTP error! Status: ${response.status} - ${response.statusText} - ${errorResponse}`,
      );
    }

    const data: T = (await response.json()) as T;
    return data;
  } catch (error) {
    console.error("Error during fetchWithToken:", error);
    throw error;
  }
};
