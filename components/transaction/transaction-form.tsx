"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface TransactionFormProps {
  onSubmit: (data: {
    description: string
    amount: number
    type: "income" | "expense"
    date: string
  }) => void
}

export default function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense" as "income" | "expense",
    date: new Date().toISOString().split("T")[0],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? value : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.description || !formData.amount) {
      alert("Please fill in all fields")
      return
    }

    onSubmit({
      description: formData.description,
      amount: Number.parseFloat(formData.amount),
      type: formData.type,
      date: formData.date,
    })

    setFormData({
      description: "",
      amount: "",
      type: "expense",
      date: new Date().toISOString().split("T")[0],
    })
  }

  return (
    <Card className="bg-slate-700/50 border-slate-600 p-6">
      <h3 className="text-2xl font-bold text-white mb-6">Add New Transaction</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <Input
              type="text"
              name="description"
              placeholder="e.g., Coffee at Starbucks"
              value={formData.description}
              onChange={handleChange}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Amount</label>
            <Input
              type="number"
              name="amount"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="bg-slate-800 border-slate-600 text-white"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold py-2 rounded-lg transition-all"
        >
          Add Transaction
        </Button>
      </form>
    </Card>
  )
}
