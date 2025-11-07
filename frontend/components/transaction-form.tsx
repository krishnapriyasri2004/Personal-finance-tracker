"use client"

import type React from "react"

import { useState } from "react"
import axios from "axios"

interface TransactionFormProps {
  onTransactionAdded: () => void
}

export default function TransactionForm({ onTransactionAdded }: TransactionFormProps) {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<"income" | "expense">("expense")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      await axios.post("http://localhost:8000/transactions/", {
        description,
        amount: Number.parseFloat(amount),
        transaction_type: type,
      })

      setDescription("")
      setAmount("")
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      onTransactionAdded()
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error adding transaction")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Add Transaction</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-300 mb-2">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., McDonald's lunch"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">Amount ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded focus:outline-none focus:border-blue-500"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        {error && <div className="text-red-400 text-sm">{error}</div>}
        {success && <div className="text-green-400 text-sm">Transaction added successfully!</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Transaction"}
        </button>
      </form>
    </div>
  )
}
