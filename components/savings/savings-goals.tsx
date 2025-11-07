"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, Target, TrendingUp } from "lucide-react"

export interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
  priority: "low" | "medium" | "high"
  createdDate: string
}

interface SavingsGoalsProps {
  goals: SavingsGoal[]
  onAddGoal: (goal: Omit<SavingsGoal, "id" | "currentAmount" | "createdDate">) => void
  onRemoveGoal: (goalId: string) => void
  onUpdateGoalAmount: (goalId: string, amount: number) => void
}

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  high: "bg-red-500/20 text-red-300 border-red-500/30",
}

const PRIORITY_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
}

export default function SavingsGoals({ goals, onAddGoal, onRemoveGoal, onUpdateGoalAmount }: SavingsGoalsProps) {
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    deadline: "",
    category: "",
    priority: "medium" as const,
  })

  const [showAddForm, setShowAddForm] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "targetAmount" ? value : value,
    }))
  }

  const handleAddGoal = () => {
    if (!formData.name || !formData.targetAmount || !formData.deadline || !formData.category) {
      alert("Please fill in all fields")
      return
    }

    onAddGoal({
      name: formData.name,
      targetAmount: Math.abs(Number.parseFloat(formData.targetAmount)),
      deadline: formData.deadline,
      category: formData.category,
      priority: formData.priority,
    })

    setFormData({
      name: "",
      targetAmount: "",
      deadline: "",
      category: "",
      priority: "medium",
    })
    setShowAddForm(false)
  }

  const getTotalSavings = () => {
    return goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  }

  const getTotalTarget = () => {
    return goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  }

  const getCompletedGoals = () => {
    return goals.filter((goal) => goal.currentAmount >= goal.targetAmount).length
  }

  const getDaysRemaining = (deadline: string): number => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getProgressColor = (current: number, target: number): string => {
    const percentage = (current / target) * 100
    if (percentage >= 100) return "bg-emerald-500"
    if (percentage >= 75) return "bg-green-500"
    if (percentage >= 50) return "bg-blue-500"
    if (percentage >= 25) return "bg-yellow-500"
    return "bg-orange-500"
  }

  return (
    <div className="space-y-6">
      {/* Add Goal Form */}
      {showAddForm && (
        <Card className="bg-slate-700/50 border-slate-600 p-6">
          <h3 className="text-2xl font-bold text-white mb-6">Create Savings Goal</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Goal Name</label>
                <Input
                  type="text"
                  name="name"
                  placeholder="e.g., Vacation, Emergency Fund"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Target Amount ($)</label>
                <Input
                  type="number"
                  name="targetAmount"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Deadline</label>
                <Input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                <Input
                  type="text"
                  name="category"
                  placeholder="e.g., Travel, Home"
                  value={formData.category}
                  onChange={handleChange}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAddGoal}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold py-2 rounded-lg transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Goal
              </Button>
              <Button
                onClick={() => setShowAddForm(false)}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Add Goal Button */}
      {!showAddForm && (
        <Button
          onClick={() => setShowAddForm(true)}
          className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold py-2 rounded-lg transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Savings Goal
        </Button>
      )}

      {/* Goals Summary */}
      {goals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-700/50 border-slate-600 p-4">
            <p className="text-slate-400 text-sm mb-1">Total Goals</p>
            <p className="text-3xl font-bold text-cyan-400">{goals.length}</p>
          </Card>
          <Card className="bg-slate-700/50 border-slate-600 p-4">
            <p className="text-slate-400 text-sm mb-1">Completed</p>
            <p className="text-3xl font-bold text-emerald-400">{getCompletedGoals()}</p>
          </Card>
          <Card className="bg-slate-700/50 border-slate-600 p-4">
            <p className="text-slate-400 text-sm mb-1">Current Savings</p>
            <p className="text-3xl font-bold text-green-400">${getTotalSavings().toFixed(2)}</p>
          </Card>
          <Card className="bg-slate-700/50 border-slate-600 p-4">
            <p className="text-slate-400 text-sm mb-1">Target Amount</p>
            <p className="text-3xl font-bold text-blue-400">${getTotalTarget().toFixed(2)}</p>
          </Card>
        </div>
      )}

      {/* Goals List */}
      <Card className="bg-slate-700/50 border-slate-600 p-6">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Target className="w-6 h-6" />
          Savings Goals
        </h3>

        {goals.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No savings goals yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const percentage = (goal.currentAmount / goal.targetAmount) * 100
              const daysRemaining = getDaysRemaining(goal.deadline)
              const isCompleted = goal.currentAmount >= goal.targetAmount

              return (
                <div
                  key={goal.id}
                  className={`p-5 rounded-lg border-2 transition-all ${
                    isCompleted
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-slate-800 border-slate-600 hover:border-cyan-500/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-white">{goal.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full border ${PRIORITY_COLORS[goal.priority]}`}>
                          {PRIORITY_LABELS[goal.priority]} Priority
                        </span>
                        {isCompleted && (
                          <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-500/50">
                            Completed!
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400">
                        {goal.category} • Due: {goal.deadline}
                        {daysRemaining > 0 && ` (${daysRemaining} days left)`}
                        {daysRemaining <= 0 && " (Overdue)"}
                      </p>
                    </div>

                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-cyan-400">${goal.currentAmount.toFixed(2)}</p>
                      <p className="text-sm text-slate-400">of ${goal.targetAmount.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400">{percentage.toFixed(1)}% Complete</span>
                      <span className="text-xs text-slate-400">
                        ${(goal.targetAmount - goal.currentAmount).toFixed(2)} remaining
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${getProgressColor(
                          goal.currentAmount,
                          goal.targetAmount,
                        )}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Add Savings */}
                  {!isCompleted && (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Add amount"
                        step="0.01"
                        min="0"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            const input = e.currentTarget
                            const amount = Number.parseFloat(input.value)
                            if (!isNaN(amount) && amount > 0) {
                              onUpdateGoalAmount(goal.id, goal.currentAmount + amount)
                              input.value = ""
                            }
                          }
                        }}
                        className="flex-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 text-sm"
                      />
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement
                          const amount = Number.parseFloat(input.value)
                          if (!isNaN(amount) && amount > 0) {
                            onUpdateGoalAmount(goal.id, goal.currentAmount + amount)
                            input.value = ""
                          }
                        }}
                      >
                        <TrendingUp className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-red-500/20 hover:border-red-500 hover:text-red-400 bg-transparent"
                        onClick={() => onRemoveGoal(goal.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {isCompleted && (
                    <div className="flex gap-2">
                      <Button
                        disabled
                        size="sm"
                        className="flex-1 bg-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 cursor-default"
                      >
                        Goal Completed!
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-red-500/20 hover:border-red-500 hover:text-red-400 bg-transparent"
                        onClick={() => onRemoveGoal(goal.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
