import { useState, useEffect } from "react"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        setIsAuthenticated(res.ok)
      })
      .catch(() => {
        setIsAuthenticated(false)
      })
      .finally(() => {
        setIsLoaded(true)
      })
  }, [])

  async function login(email: string, password: string) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        return false
      }

      setIsAuthenticated(true)
      return true
    } catch (e) {
      return false
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    setIsAuthenticated(false)
  }

  return {
    isAuthenticated,
    isLoaded,
    login,
    logout,
  }
}
