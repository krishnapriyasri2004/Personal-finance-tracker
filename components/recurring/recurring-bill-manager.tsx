"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, Calendar } from "lucide-react"

export interface RecurringBill {
  id: string
  description: string
  amount: number
  category: string
  frequency: "daily" | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly"
  startDate: string
  nextDueDate: string
  isActive: boolean
}

interface RecurringBillManagerProps {
  bills: RecurringBill[]
  onAddBill: (bill: Omit<RecurringBill, "id" | "nextDueDate">) => void
  onRemoveBill: (billId: string) => void
  onToggleBill: (billId: string) => void
  categories: string[]
}

const FREQUENCY_LABELS: Record<string, string> = {
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Bi-weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
}

const FREQUENCY_DAYS: Record<string, number> = {
  daily: 1,
  weekly: 7,
  biweekly: 14,
  monthly: 30,
  quarterly: 90,
  yearly: 365,
}

export default function RecurringBillManager({
  bills,
  onAddBill,
  onRemoveBill,
  onToggleBill,
  categories,
}: RecurringBillManagerProps) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    frequency: "monthly" as const,
    startDate: new Date().toISOString().split("T")[0],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? value : value,
    }))
  }

  const calculateNextDueDate = (startDate: string, frequency: string): string => {
    const date = new Date(startDate)
    const daysToAdd = FREQUENCY_DAYS[frequency as keyof typeof FREQUENCY_DAYS] || 30
    date.setDate(date.getDate() + daysToAdd)
    return date.toISOString().split("T")[0]
  }

  const handleAddBill = () => {
    if (!formData.description || !formData.amount || !formData.category) {
      alert("Please fill in all fields")
      return
    }

    const nextDueDate = calculateNextDueDate(formData.startDate, formData.frequency)

    onAddBill({
      description: formData.description,
      amount: Math.abs(Number.parseFloat(formData.amount)),
      category: formData.category,
      frequency: formData.frequency,
      startDate: formData.startDate,
      isActive: true,
    })

    setFormData({
      description: "",
      amount: "",
      category: "",
      frequency: "monthly",
      startDate: new Date().toISOString().split("T")[0],
    })
  }

  const getUpcomingBills = () => {
    const today = new Date().toISOString().split("T")[0]
    return bills.filter((bill) => bill.isActive && bill.nextDueDate <= today).length
  }

  const getTotalMonthlyAmount = () => {
    return bills
      .filter((bill) => bill.isActive && ["daily", "weekly", "biweekly", "monthly"].includes(bill.frequency))
      .reduce((sum, bill) => {
        if (bill.frequency === "daily") return sum + bill.amount * 30
        if (bill.frequency === "weekly") return sum + bill.amount * 4.33
        if (bill.frequency === "biweekly") return sum + bill.amount * 2.17
        return sum + bill.amount
      }, 0)
  }

  return (
    <div className="space-y-6">
      {/* Add Bill Form */}
      <Card className="bg-slate-700/50 border-slate-600 p-6">
        <h3 className="text-2xl font-bold text-white mb-6">Add Recurring Bill</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <Input
                type="text"
                name="description"
                placeholder="e.g., Netflix Subscription"
                value={formData.description}
                onChange={handleChange}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Amount ($)</label>
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
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Frequency</label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {Object.entries(FREQUENCY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
          </div>

          <Button
            onClick={handleAddBill}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 rounded-lg transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Recurring Bill
          </Button>
        </div>
      </Card>

      {/* Bills Summary */}
      {bills.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-700/50 border-slate-600 p-4">
            <p className="text-slate-400 text-sm mb-1">Total Bills</p>
            <p className="text-3xl font-bold text-orange-400">{bills.filter((b) => b.isActive).length}</p>
          </Card>
          <Card className="bg-slate-700/50 border-slate-600 p-4">
            <p className="text-slate-400 text-sm mb-1">Est. Monthly</p>
            <p className="text-3xl font-bold text-orange-400">${getTotalMonthlyAmount().toFixed(2)}</p>
          </Card>
          <Card className="bg-slate-700/50 border-slate-600 p-4">
            <p className="text-slate-400 text-sm mb-1">Upcoming Due</p>
            <p className="text-3xl font-bold text-red-400">{getUpcomingBills()}</p>
          </Card>
        </div>
      )}

      {/* Bills List */}
      <Card className="bg-slate-700/50 border-slate-600 p-6">
        <h3 className="text-2xl font-bold text-white mb-6">Recurring Bills</h3>

        {bills.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No recurring bills added yet. Add one to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bills.map((bill) => (
              <div
                key={bill.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  bill.isActive
                    ? "bg-slate-800 border-slate-600 hover:border-orange-500/50"
                    : "bg-slate-800/50 border-slate-700 opacity-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className={`font-semibold ${bill.isActive ? "text-white" : "text-slate-400"}`}>
                        {bill.description}
                      </h4>
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300">
                        {FREQUENCY_LABELS[bill.frequency]}
                      </span>
                      {!bill.isActive && (
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-400">Inactive</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>{bill.category}</span>
                      <span>Start: {bill.startDate}</span>
                      <span>Next due: {bill.nextDueDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-400">${bill.amount.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => onToggleBill(bill.id)}
                        variant="outline"
                        size="sm"
                        className={`border-slate-600 text-slate-300 hover:bg-slate-600 ${
                          bill.isActive ? "hover:text-yellow-400" : "hover:text-green-400"
                        }`}
                      >
                        {bill.isActive ? "Pause" : "Resume"}
                      </Button>
                      <Button
                        onClick={() => onRemoveBill(bill.id)}
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300 hover:bg-red-500/20 hover:border-red-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
