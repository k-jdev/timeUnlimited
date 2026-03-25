"use client"

import { type FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

export function ForgotPasswordView() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    router.push("/login/reset-password")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-120 flex-col gap-6 bg-[#111113] p-10 backdrop-blur-sm"
    >
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-[38px] leading-none text-[#edeef0]">
          Reset your password
        </h1>
        <p className="text-sm font-light text-[#8b8d98]">
          We will send a 6-digit verification code to the following address to
          verify your account
        </p>
      </div>

      {/* Email */}
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

      {/* Actions */}
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
          className="flex h-8 items-center justify-center bg-white/10 px-3 text-sm font-medium text-[#edeef0] transition-colors hover:bg-white/15"
        >
          Reset password
        </button>
      </div>
    </form>
  )
}
