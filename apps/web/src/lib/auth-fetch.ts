import { refreshAction } from "@/app/_auth/actions";

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

export async function authFetch(url: string, options: FetchOptions = {}): Promise<Response> {
  const { skipAuth, ...fetchOptions } = options;

  let response = await fetch(url, {
    ...fetchOptions,
    credentials: "include",
  });

  if (response.status === 401 && !skipAuth) {
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
        window.location.href = "/login";
        return response;
      }
    }

    response = await fetch(url, {
      ...fetchOptions,
      credentials: "include",
    });
  }

  return response;
}
