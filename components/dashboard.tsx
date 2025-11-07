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
  id: number
  date: string
  description: string
  amount: number
  category: string
  type: "income" | "expense"
}

interface DashboardProps {
  transactions: Transaction[]
}

export default function Dashboard({ transactions }: DashboardProps) {
  const chartData = useMemo(() => {
    const categoryData: Record<string, number> = {}
    transactions.forEach((t) => {
      if (t.type === "expense") {
        categoryData[t.category] = (categoryData[t.category] || 0) + Math.abs(t.amount)
      }
    })
    return Object.entries(categoryData).map(([name, value]) => ({ name, value }))
  }, [transactions])

  const monthlyData = useMemo(() => {
    const months: Record<string, { income: number; expenses: number }> = {}
    transactions.forEach((t) => {
      const month = t.date.substring(0, 7)
      if (!months[month]) months[month] = { income: 0, expenses: 0 }
      if (t.type === "income") months[month].income += t.amount
      else months[month].expenses += Math.abs(t.amount)
    })
    return Object.entries(months).map(([month, data]) => ({ month, ...data }))
  }, [transactions])

  const COLORS = ["#14b8a6", "#8b5cf6", "#f59e0b", "#ef4444", "#3b82f6", "#10b981", "#ec4899", "#f97316"]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category */}
        <Card className="bg-slate-700 border-slate-600 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Expenses by Category</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-slate-400">No expense data</div>
          )}
        </Card>

        {/* Monthly Trend */}
        <Card className="bg-slate-700 border-slate-600 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Trend</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                  formatter={(value) => `$${value}`}
                />
                <Legend />
                <Bar dataKey="income" stackId="a" fill="#10b981" />
                <Bar dataKey="expenses" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-slate-400">No data</div>
          )}
        </Card>
      </div>

      {/* Recent Transactions Summary */}
      <Card className="bg-slate-700 border-slate-600 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {transactions
            .slice(-5)
            .reverse()
            .map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 bg-slate-600 rounded-lg">
                <div>
                  <p className="text-white font-medium">{t.description}</p>
                  <p className="text-sm text-slate-400">{t.category}</p>
                </div>
                <p className={`font-bold ${t.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
                  {t.type === "income" ? "+" : "-"}${Math.abs(t.amount).toFixed(2)}
                </p>
              </div>
            ))}
        </div>
      </Card>
    </div>
  )
}
