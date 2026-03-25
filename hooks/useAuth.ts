"use client"

import { useEffect, useState } from "react"

const AUTH_KEY = "admin_auth"
const VALID_EMAIL = "admin@mail.com"
const VALID_PASSWORD = "3–sgxVm?2Gv%RCz"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem(AUTH_KEY) === "true")
    setIsLoaded(true)
  }, [])

  function login(email: string, password: string): boolean {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      localStorage.setItem(AUTH_KEY, "true")
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  function logout() {
    localStorage.removeItem(AUTH_KEY)
    setIsAuthenticated(false)
  }

  return { isAuthenticated, isLoaded, login, logout }
}
