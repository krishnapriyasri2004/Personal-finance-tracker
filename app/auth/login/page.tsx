"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { DollarSign } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return false
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email")
      return false
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const userData = {
      name: formData.email.split("@")[0],
      email: formData.email,
      id: Date.now().toString(),
    }

    localStorage.setItem("finance_user", JSON.stringify(userData))
    setLoading(false)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-slate-800 border-slate-700 p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white text-center mb-2">Finance Tracker</h1>
          <p className="text-slate-400 text-center mb-8">Login to manage your finances</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <Input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded text-red-300 text-sm">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold py-2 rounded-lg transition-all"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </Button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-teal-400 hover:text-teal-300 font-semibold transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg text-center">
          <p className="text-slate-400 text-xs mb-2">Demo Credentials:</p>
          <p className="text-slate-300 text-sm font-mono">demo@example.com / password123</p>
        </div>
      </div>
    </div>
  )
}
