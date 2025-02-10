/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
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

interface WebSocketOptions {
  onMessage?: (data: any) => void;
  onError?: (error: Event) => void;
  onClose?: () => void;
  requireToken?: boolean;
}

export const wsWithToken = async (
  url: string,
  options: WebSocketOptions = {},
): Promise<WebSocket> => {
  const { onMessage, onError, onClose, requireToken = true } = options;

  try {
    let token: string | null = null;

    if (requireToken) {
      token = await getToken("accessToken");
      if (!token) {
        throw new Error("Token not found. User might be logged out.");
      }
    }

    const wsUrl = requireToken ? `${url}?token=${token}` : url;
    let ws: WebSocket = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("✅ WebSocket connected:", wsUrl);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (onMessage) onMessage(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("❌ WebSocket message parse error:", error.message);
        } else {
          console.error("❌ WebSocket message parse error: Unknown error");
        }
      }
    };

    ws.onerror = (event) => {
      console.error("❌ WebSocket error:", event);
      if (onError) onError(event);
    };

    ws.onclose = async (event) => {
      console.warn("⚠️ WebSocket closed:", event.code, event.reason);

      if (event.code === 4010 && requireToken) {
        console.warn("🔄 Token expired, attempting to refresh...");

        try {
          await refreshToken();
          const newToken = await getToken("accessToken");

          if (!newToken) {
            console.error(
              "❌ Failed to refresh token. User might be logged out.",
            );
            return;
          }

          console.log("🔄 Reconnecting WebSocket with new token...");
          ws = await wsWithToken(url, options);
        } catch (refreshError: unknown) {
          if (refreshError instanceof Error) {
            console.error(
              "❌ WebSocket reconnect failed:",
              refreshError.message,
            );
          } else {
            console.error("❌ WebSocket reconnect failed: Unknown error");
          }
        }
      }

      if (onClose) onClose();
    };

    return ws;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error during wsWithToken:", error.message);
    } else {
      console.error("❌ Error during wsWithToken: Unknown error");
    }
    throw error;
  }
};
