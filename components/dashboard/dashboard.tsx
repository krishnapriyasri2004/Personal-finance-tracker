"use client"

import { useMemo } from "react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card } from "@/components/ui/card"

interface Transaction {
  id: string
  description: string
  amount: number
  type: "income" | "expense"
  category: string
  date: string
  autoTagged: boolean
}

interface DashboardProps {
  transactions: Transaction[]
}

export default function Dashboard({ transactions }: DashboardProps) {
  const categoryData = useMemo(() => {
    const categories = {} as Record<string, number>
    transactions.forEach((t) => {
      if (t.type === "expense") {
        categories[t.category] = (categories[t.category] || 0) + Math.abs(t.amount)
      }
    })
    return Object.entries(categories)
      .map(([name, value]) => ({ name, value: Number.parseFloat(value.toFixed(2)) }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  const monthlyData = useMemo(() => {
    const months = {} as Record<string, { income: number; expense: number }>
    transactions.forEach((t) => {
      const month = new Date(t.date).toLocaleDateString("en-US", { month: "short" })
      if (!months[month]) months[month] = { income: 0, expense: 0 }
      if (t.type === "income") {
        months[month].income += t.amount
      } else {
        months[month].expense += Math.abs(t.amount)
      }
    })
    return Object.entries(months)
      .map(([name, value]) => ({
        name,
        income: Number.parseFloat(value.income.toFixed(2)),
        expense: Number.parseFloat(value.expense.toFixed(2)),
      }))
      .slice(-6)
  }, [transactions])

  const topCategories = categoryData.slice(0, 5)

  const COLORS = ["#14b8a6", "#06b6d4", "#8b5cf6", "#ec4899", "#f59e0b"]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown Pie Chart */}
        <Card className="bg-slate-700/50 border-slate-600 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Expense Breakdown</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={topCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {topCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400">No expense data available</div>
          )}
        </Card>

        {/* Category List */}
        <Card className="bg-slate-700/50 border-slate-600 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Categories</h3>
          <div className="space-y-3">
            {categoryData.length > 0 ? (
              categoryData.map((cat, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    ></div>
                    <span className="text-slate-300 font-medium">{cat.name}</span>
                  </div>
                  <span className="text-red-400 font-semibold">${cat.value.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <div className="text-slate-400 text-center py-8">No categories yet</div>
            )}
          </div>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card className="bg-slate-700/50 border-slate-600 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Monthly Income vs Expenses</h3>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                formatter={(value) => `$${value.toFixed(2)}`}
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}
              />
              <Legend />
              <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-slate-400">No data available</div>
        )}
      </Card>
    </div>
  )
}
