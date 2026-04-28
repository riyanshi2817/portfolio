const BACKEND_BASE =
  import.meta.env.VITE_BACKEND_URL ??
  import.meta.env.BACKEND_URL ??
  "http://localhost:5000"

export const API_BASE = `${BACKEND_BASE}/api`
export const SOCKET_URL = BACKEND_BASE

type ErrorResponse = {
  message?: string
  error?: string
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  const data = (await res.json().catch(() => ({}))) as T & ErrorResponse

  if (!res.ok) {
    const errMsg = data.message ?? data.error ?? "Request failed"
    throw new Error(errMsg)
  }

  return data as T
}

export async function apiFetchFormData<T>(
  path: string,
  formData: FormData,
  options?: Omit<RequestInit, "body" | "headers"> & { method?: "POST" | "PATCH" }
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    method: options?.method ?? "POST",
    credentials: "include",
    body: formData,
  })

  const data = (await res.json().catch(() => ({}))) as T & ErrorResponse

  if (!res.ok) {
    const errMsg = data.message ?? data.error ?? "Request failed"
    throw new Error(errMsg)
  }

  return data as T
}
