import { refreshAction } from "@/app/_auth/actions";

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

export async function authFetch(url: string, options: FetchOptions = {}): Promise<Response> {
  const { skipAuth, ...fetchOptions } = options;

  // First attempt
  let response = await fetch(url, fetchOptions);

  // If 401 and not skipping auth, try to refresh
  if (response.status === 401 && !skipAuth) {
    // Wait for ongoing refresh or start a new one
    if (isRefreshing && refreshPromise) {
      await refreshPromise;
    } else {
      isRefreshing = true;
      refreshPromise = refreshAction()
        .then(() => true)
        .catch(() => false)
        .finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
      
      const refreshSuccess = await refreshPromise;
      
      if (!refreshSuccess) {
        // Refresh failed, redirect to login
        window.location.href = "/login";
        return response;
      }
    }

    // Retry the original request after refresh
    response = await fetch(url, fetchOptions);
  }

  return response;
}
