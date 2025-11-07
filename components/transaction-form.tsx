"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface TransactionFormProps {
  onAddTransaction: (transaction: any) => void
}

const CATEGORIES = ["Food", "Transport", "Entertainment", "Utilities", "Health", "Shopping", "Other"]

export default function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: "",
    category: "Food",
    type: "expense",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.description || !formData.amount) {
      alert("Please fill all fields")
      return
    }

    const transaction = {
      date: formData.date,
      description: formData.description,
      amount: formData.type === "income" ? Number.parseFloat(formData.amount) : -Number.parseFloat(formData.amount),
      category: formData.type === "income" ? "Income" : formData.category,
      type: formData.type as "income" | "expense",
    }

    onAddTransaction(transaction)
    setFormData({
      date: new Date().toISOString().split("T")[0],
      description: "",
      amount: "",
      category: "Food",
      type: "expense",
    })
  }

  return (
    <Card className="bg-slate-700 border-slate-600 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="bg-slate-600 border-slate-500 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Amount</label>
            <Input
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="bg-slate-600 border-slate-500 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
          <Input
            type="text"
            placeholder="e.g., Coffee, Gas, Salary"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-slate-600 border-slate-500 text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          {formData.type === "expense" && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white">
          Add Transaction
        </Button>
      </form>
    </Card>
  )
}
