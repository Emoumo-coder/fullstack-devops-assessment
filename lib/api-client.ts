function resolveApiBase(): string {
  const env = process.env.NEXT_PUBLIC_API_URL?.trim()
  if (!env) return "/api" 

  try {
    const u = new URL(env)
    if (!u.pathname || u.pathname === "/") {
      u.pathname = "/api"
      return u.toString().replace(/\/$/, "")
    }
    if (!u.pathname.endsWith("/api")) {
      u.pathname = `${u.pathname.replace(/\/$/, "")}/api`
    }
    return u.toString().replace(/\/$/, "")
  } catch {
    return env
  }
}

const API_BASE_URL = resolveApiBase()

interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

export interface User {
  id: number
  name: string
  email: string
}

export interface Form {
  id: string
  title: string
  description: string
  structure: any
  createdAt?: string
  created_at?: string
  updatedAt?: string
  userId?: string
}

type AuthResponse = { token: string; user: User }

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken")
    }
    return null
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const token = this.getToken()

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers as Record<string, string> | undefined),
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    // Add a timeout to avoid hanging requests
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    let response: Response
    try {
      response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeout)
    }

    const data = (await response.json()) as unknown

    if (!response.ok) {
      const message = (data as any)?.message || "API request failed"
      throw new Error(message)
    }

    return data as ApiResponse<T>
  }

  // Auth endpoints
  async register(name: string, email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>("/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: password,
      }),
    })
  }

  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async logout(): Promise<ApiResponse<{ message?: string }>> {
    return this.request<{ message?: string }>("/logout", {
      method: "POST",
    })
  }

  async getMe(): Promise<ApiResponse<User>> {
    return this.request<User>("/me", {
      method: "GET",
    })
  }

  // Form endpoints
  async getForms(): Promise<ApiResponse<Form[]>> {
    return this.request<Form[]>("/forms", {
      method: "GET",
    })
  }

  async getForm(id: string): Promise<ApiResponse<Form>> {
    return this.request<Form>(`/forms/${id}`, {
      method: "GET",
    })
  }

  async createForm(title: string, description: string, structure: any): Promise<ApiResponse<Form>> {
    return this.request<Form>("/forms", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        structure,
      }),
    })
  }

  async updateForm(id: string, title: string, description: string, structure: any): Promise<ApiResponse<Form>> {
    return this.request<Form>(`/forms/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title,
        description,
        structure,
      }),
    })
  }

  async deleteForm(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/forms/${id}`, {
      method: "DELETE",
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
