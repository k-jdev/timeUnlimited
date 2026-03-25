"use client"

import { type FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { RiEyeLine, RiEyeOffLine } from "@remixicon/react"

export function ResetPasswordView() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState("")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")

    if (!code || !newPassword || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Demo: just redirect back to login
    router.push("/login")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-120 flex-col gap-6 bg-[#111217]/80 p-10 backdrop-blur-sm"
    >
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-[38px] leading-none text-[#edeef0]">
          Reset your password
        </h1>
        <p className="text-sm font-light text-[#8b8d98]">
          We have sent a password recovery email if you have registered before
        </p>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-4">
        {/* Verification code */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="reset-code"
            className="text-sm font-medium text-[#edeef0]"
          >
            Verification code
          </label>
          <input
            id="reset-code"
            type="text"
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-8 w-full border border-[#2e3135] bg-white/5 px-2 text-sm text-[#edeef0] placeholder:text-[#8b8d98] focus:border-[#8b8d98] focus:outline-none"
          />
        </div>

        {/* New password */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="reset-new-password"
            className="text-sm font-medium text-[#edeef0]"
          >
            New password
          </label>
          <div className="relative">
            <input
              id="reset-new-password"
              type={showNew ? "text" : "password"}
              placeholder="Enter new password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-8 w-full border border-[#2e3135] bg-white/5 px-2 pr-8 text-sm text-[#edeef0] placeholder:text-[#8b8d98] focus:border-[#8b8d98] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowNew((prev) => !prev)}
              className="absolute top-1/2 right-1 flex size-6 -translate-y-1/2 items-center justify-center text-[#8b8d98] hover:text-[#edeef0]"
              tabIndex={-1}
              aria-label={showNew ? "Hide password" : "Show password"}
            >
              {showNew ? (
                <RiEyeLine className="size-4" />
              ) : (
                <RiEyeOffLine className="size-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm password */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="reset-confirm-password"
            className="text-sm font-medium text-[#edeef0]"
          >
            Confirm password
          </label>
          <div className="relative">
            <input
              id="reset-confirm-password"
              type={showConfirm ? "text" : "password"}
              placeholder="Enter confirm new password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-8 w-full border border-[#2e3135] bg-white/5 px-2 pr-8 text-sm text-[#edeef0] placeholder:text-[#8b8d98] focus:border-[#8b8d98] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute top-1/2 right-1 flex size-6 -translate-y-1/2 items-center justify-center text-[#8b8d98] hover:text-[#edeef0]"
              tabIndex={-1}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? (
                <RiEyeLine className="size-4" />
              ) : (
                <RiEyeOffLine className="size-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && <p className="text-xs text-red-400">{error}</p>}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/login/forgot-password")}
          className="flex h-8 items-center justify-center bg-white/6 px-3 text-sm font-medium text-[#8b8d98] transition-colors hover:bg-white/10 hover:text-[#edeef0]"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex h-8 items-center justify-center bg-white/10 px-3 text-sm font-medium text-[#edeef0] transition-colors hover:bg-white/15"
        >
          Update password
        </button>
      </div>
    </form>
  )
}
