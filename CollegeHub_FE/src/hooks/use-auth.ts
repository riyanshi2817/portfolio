import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

const API_BASE =
  (import.meta.env.VITE_BACKEND_URL ??
    import.meta.env.BACKEND_URL ??
    "http://localhost:5000") + "/api/auth"

export type User = {
  _id?: string
  id?: string
  email: string
  role: "STUDENT" | "FACULTY" | "ADMIN"
  createdAt?: string
  updatedAt?: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  email: string
  password: string
  role: "STUDENT" | "FACULTY" | "ADMIN"
}

type AuthMeResponse = {
  user: User
}

type LoginResponse = {
  message: string
  user: User
}

type RegisterResponse = {
  message: string
  user: User
}

type ErrorResponse = {
  message?: string
  error?: string
}

async function fetchAuth<T>(
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
    const err = new Error(errMsg) as Error & { status?: number }
    err.status = res.status
    throw err
  }

  return data as T
}

const AUTH_ME_QUERY_KEY = ["auth", "me"] as const

export function useAuthMe() {
  return useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: () => fetchAuth<AuthMeResponse>("/me"),
    retry: false,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      fetchAuth<LoginResponse>("/login", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY })
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: RegisterPayload) =>
      fetchAuth<RegisterResponse>("/register", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      fetchAuth<{ message: string }>("/logout", {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY })
    },
  })
}
