"use client"

import { type FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { RiArrowRightLine, RiEyeLine, RiEyeOffLine } from "@remixicon/react"
import { useAuth } from "@/hooks/useAuth"

export function LoginView() {
  const router = useRouter()
  const { isAuthenticated, isLoaded, login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  // Redirect if already authenticated
  if (isLoaded && isAuthenticated) {
    router.replace("/admin/inventory")
    return null
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    const success = login(email, password)
    if (success) {
      router.push("/admin/inventory")
    } else {
      setError("Invalid email or password")
    }
  }

  if (!isLoaded) {
    return <div className="h-120 w-120" />
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-120 flex-col gap-6 bg-[#111113] p-10 backdrop-blur-sm"
    >
      {/* Title */}
      <h1 className="font-serif text-[38px] leading-none text-[#edeef0]">
        Log in
      </h1>

      {/* Fields */}
      <div className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="login-email"
            className="text-sm font-medium text-[#edeef0]"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-8 w-full border border-[#2e3135] px-2 text-sm text-[#edeef0] placeholder:text-[#8b8d98] focus:border-[#8b8d98] focus:outline-none"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="login-password"
            className="text-sm font-medium text-[#edeef0]"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-8 w-full border border-[#2e3135] px-2 pr-8 text-sm text-[#edeef0] placeholder:text-[#8b8d98] focus:border-[#8b8d98] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-1 flex size-6 -translate-y-1/2 items-center justify-center text-[#8b8d98] hover:text-[#edeef0]"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <RiEyeLine className="size-4" />
              ) : (
                <RiEyeOffLine className="size-4" />
              )}
            </button>
          </div>
        </div>

        {/* Forgot password */}
        <button
          type="button"
          onClick={() => router.push("/login/forgot-password")}
          className="self-start px-1 text-xs text-[#8b8d98] hover:text-[#edeef0]"
          tabIndex={-1}
        >
          Forgot password?
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-xs text-red-400">{error}</p>}

      {/* Submit */}
      <button
        type="submit"
        className="flex h-8 w-full items-center justify-center gap-2 bg-white/6 text-sm font-medium text-[#8b8d98] transition-colors hover:bg-white/10 hover:text-[#edeef0]"
      >
        Log in
        <RiArrowRightLine className="size-4" />
      </button>
    </form>
  )
}
