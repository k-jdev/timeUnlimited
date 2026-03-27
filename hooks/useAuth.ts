import { useState, useEffect } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setIsLoaded(true);
  }, []);

 
  async function login(email: string, password: string) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return false;
      }

      // сохраняем токен
      localStorage.setItem("token", data.token);

      setIsAuthenticated(true);
      return true;
    } catch (e) {
      return false;
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  }

  return {
    isAuthenticated,
    isLoaded,
    login,
    logout,
  };
}
