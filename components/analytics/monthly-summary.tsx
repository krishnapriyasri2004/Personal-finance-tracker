"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
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

interface MonthlySummaryProps {
  transactions: Transaction[]
  onReclassify?: (id: string, newCategory: string) => void
}

export default function MonthlySummary({ transactions }: MonthlySummaryProps) {
  const summaryData = useMemo(() => {
    const summary = {} as Record<
      string,
      {
        month: string
        income: number
        expenses: number
        categories: Record<string, number>
      }
    >

    transactions.forEach((t) => {
      const date = new Date(t.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const monthLabel = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

      if (!summary[monthKey]) {
        summary[monthKey] = {
          month: monthLabel,
          income: 0,
          expenses: 0,
          categories: {},
        }
      }

      if (t.type === "income") {
        summary[monthKey].income += t.amount
      } else {
        summary[monthKey].expenses += Math.abs(t.amount)
        summary[monthKey].categories[t.category] = (summary[monthKey].categories[t.category] || 0) + Math.abs(t.amount)
      }
    })

    return Object.values(summary).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
  }, [transactions])

  const chartData = summaryData.map((m) => ({
    month: m.month,
    income: Number.parseFloat(m.income.toFixed(2)),
    expenses: Number.parseFloat(m.expenses.toFixed(2)),
  }))

  return (
    <div className="space-y-6">
      {/* Chart */}
      <Card className="bg-slate-700/50 border-slate-600 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Monthly Overview</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                formatter={(value) => `$${value.toFixed(2)}`}
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}
              />
              <Legend />
              <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expenses" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-slate-400">No data available</div>
        )}
      </Card>

      {/* Detailed Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {summaryData.map((month) => (
          <Card key={month.month} className="bg-slate-700/50 border-slate-600 p-4">
            <h4 className="font-semibold text-white mb-3">{month.month}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-slate-600">
                <span className="text-slate-400">Total Income:</span>
                <span className="text-emerald-400 font-semibold">${month.income.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-600">
                <span className="text-slate-400">Total Expenses:</span>
                <span className="text-red-400 font-semibold">${month.expenses.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-300 font-medium">Net:</span>
                <span
                  className={`font-bold ${month.income - month.expenses >= 0 ? "text-emerald-400" : "text-red-400"}`}
                >
                  ${(month.income - month.expenses).toFixed(2)}
                </span>
              </div>

              {/* Category Breakdown */}
              {Object.keys(month.categories).length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-600">
                  <p className="text-xs text-slate-400 mb-2">Expense Breakdown:</p>
                  <div className="space-y-1">
                    {Object.entries(month.categories)
                      .sort((a, b) => b[1] - a[1])
                      .map(([category, amount]) => (
                        <div key={category} className="flex justify-between text-xs">
                          <span className="text-slate-400">{category}:</span>
                          <span className="text-slate-300">${(amount as number).toFixed(2)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
