"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

export interface Budget {
  category: string
  limit: number
  spent: number
}

interface BudgetManagerProps {
  budgets: Budget[]
  onSaveBudgets: (budgets: Budget[]) => void
  categories: string[]
}

const DEFAULT_CATEGORIES = ["Food", "Transport", "Entertainment", "Utilities", "Health", "Shopping", "Rent", "Other"]

export default function BudgetManager({ budgets, onSaveBudgets, categories = DEFAULT_CATEGORIES }: BudgetManagerProps) {
  const [newCategory, setNewCategory] = useState("")
  const [newLimit, setNewLimit] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleAddBudget = () => {
    if (!newCategory || !newLimit) {
      alert("Please fill in all fields")
      return
    }

    const categoryToAdd = newCategory === "custom" ? newCategory : newCategory
    const existingBudget = budgets.find((b) => b.category === categoryToAdd)

    if (existingBudget && editingId !== categoryToAdd) {
      alert("Budget for this category already exists")
      return
    }

    const updatedBudgets = budgets.filter((b) => b.category !== categoryToAdd)
    updatedBudgets.push({
      category: categoryToAdd,
      limit: Number.parseFloat(newLimit),
      spent: existingBudget?.spent || 0,
    })

    onSaveBudgets(updatedBudgets)
    setNewCategory("")
    setNewLimit("")
    setEditingId(null)
  }

  const handleDeleteBudget = (category: string) => {
    const updatedBudgets = budgets.filter((b) => b.category !== category)
    onSaveBudgets(updatedBudgets)
  }

  const handleEditBudget = (budget: Budget) => {
    setNewCategory(budget.category)
    setNewLimit(budget.limit.toString())
    setEditingId(budget.category)
  }

  return (
    <div className="space-y-6">
      {/* Add/Edit Budget Form */}
      <Card className="bg-slate-700/50 border-slate-600 p-6">
        <h3 className="text-2xl font-bold text-white mb-6">Set Budget</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              <label className="block text-sm font-medium text-slate-300 mb-2">Budget Limit ($)</label>
              <Input
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={newLimit}
                onChange={(e) => setNewLimit(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-end gap-2">
              <Button
                onClick={handleAddBudget}
                className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                {editingId ? "Update" : "Add"}
              </Button>
              {editingId && (
                <Button
                  onClick={() => {
                    setNewCategory("")
                    setNewLimit("")
                    setEditingId(null)
                  }}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Budget List */}
      <Card className="bg-slate-700/50 border-slate-600 p-6">
        <h3 className="text-2xl font-bold text-white mb-6">Active Budgets</h3>

        {budgets.length === 0 ? (
          <div className="text-center py-8 text-slate-400">No budgets set yet. Create one to get started!</div>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => {
              const percentage = (budget.spent / budget.limit) * 100
              const isWarning = percentage >= 75
              const isExceeded = budget.spent > budget.limit

              return (
                <div key={budget.category} className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-white font-semibold">{budget.category}</h4>
                      <p className={`text-sm ${isExceeded ? "text-red-400" : "text-slate-400"}`}>
                        ${budget.spent.toFixed(2)} of ${budget.limit.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${isExceeded ? "text-red-400" : isWarning ? "text-yellow-400" : "text-emerald-400"}`}
                      >
                        {isExceeded
                          ? `Over by $${(budget.spent - budget.limit).toFixed(2)}`
                          : `${percentage.toFixed(0)}%`}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-700 rounded-full h-2 mb-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isExceeded ? "bg-red-500" : isWarning ? "bg-yellow-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditBudget(budget)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-600"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteBudget(budget.category)}
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:bg-slate-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
