"use client"

import { type FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

export function ForgotPasswordView() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Please enter your email")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong")
        setLoading(false)
        return
      }

      setSubmitted(true)
      setLoading(false)

      // переход на страницу ввода кода
      router.push(`/login/reset-password?email=${encodeURIComponent(email)}`)
    } catch (err) {
      setError("Failed to send verification code")
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-120 flex-col gap-6 bg-[#111113] p-6 backdrop-blur-sm sm:p-10"
    >
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-[38px] leading-none text-[#edeef0]">
          Reset your password
        </h1>
        <p className="text-sm font-light text-[#8b8d98]">
          We will send a 6-digit verification code to the following address to
          verify your account
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="reset-email"
          className="text-sm font-medium text-[#edeef0]"
        >
          Email
        </label>
        <input
          id="reset-email"
          type="email"
          placeholder="hello@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-8 w-full border border-[#2e3135] px-2 text-sm text-[#edeef0] placeholder:text-[#8b8d98] focus:border-[#8b8d98] focus:outline-none"
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="flex h-8 items-center justify-center bg-white/6 px-3 text-sm font-medium text-[#8b8d98] transition-colors hover:bg-white/10 hover:text-[#edeef0]"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex h-8 items-center justify-center bg-white/10 px-3 text-sm font-medium text-[#edeef0] transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Sending..." : "Reset password"}
        </button>
      </div>
    </form>
  )
}
