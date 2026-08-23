export interface User {
  id: string
  email: string
  password: string
  role: string
  created_at: string
}

export interface SafeUser {
  id: string
  email: string
  role: string
}
