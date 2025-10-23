import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const raw = queryKey.join("/") as string;
    const env = (import.meta as any)?.env || {};
    const base = env?.VITE_API_BASE_URL as string | undefined;

    // Always resolve to an absolute URL in the browser using current origin.
    // In dev, if a base is provided, use it; otherwise fall back to origin.
    const isBrowser = typeof window !== "undefined";
    const resolvedUrl = (() => {
      // If raw is already absolute, use as-is
      if (/^https?:\/\//i.test(raw)) return raw;
      if (env?.PROD) {
        return isBrowser ? new URL(raw, window.location.origin).href : raw;
      }
      if (base) {
        return new URL(raw, base).href;
      }
      return isBrowser ? new URL(raw, window.location.origin).href : raw;
    })();

    const res = await fetch(resolvedUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
