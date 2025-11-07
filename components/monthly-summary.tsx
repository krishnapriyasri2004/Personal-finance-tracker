"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"

interface Transaction {
  id: number
  date: string
  description: string
  amount: number
  category: string
  type: "income" | "expense"
}

interface MonthlySummaryProps {
  transactions: Transaction[]
}

export default function MonthlySummary({ transactions }: MonthlySummaryProps) {
  const summary = useMemo(() => {
    const monthlyData: Record<string, { income: number; expenses: number; categories: Record<string, number> }> = {}

    transactions.forEach((t) => {
      const month = t.date.substring(0, 7)
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0, categories: {} }
      }

      if (t.type === "income") {
        monthlyData[month].income += t.amount
      } else {
        monthlyData[month].expenses += Math.abs(t.amount)
        monthlyData[month].categories[t.category] =
          (monthlyData[month].categories[t.category] || 0) + Math.abs(t.amount)
      }
    })

    return monthlyData
  }, [transactions])

  const months = Object.keys(summary).sort().reverse()

  return (
    <div className="space-y-6">
      {months.length === 0 ? (
        <p className="text-slate-400 text-center py-8">No data available</p>
      ) : (
        months.map((month) => {
          const data = summary[month]
          const balance = data.income - data.expenses
          return (
            <Card key={month} className="bg-slate-700 border-slate-600 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">{month}</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-600 p-4 rounded-lg">
                  <p className="text-slate-400 text-sm mb-1">Income</p>
                  <p className="text-2xl font-bold text-emerald-400">${data.income.toFixed(2)}</p>
                </div>
                <div className="bg-slate-600 p-4 rounded-lg">
                  <p className="text-slate-400 text-sm mb-1">Expenses</p>
                  <p className="text-2xl font-bold text-red-400">${data.expenses.toFixed(2)}</p>
                </div>
                <div className="bg-slate-600 p-4 rounded-lg">
                  <p className="text-slate-400 text-sm mb-1">Balance</p>
                  <p className={`text-2xl font-bold ${balance >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    ${balance.toFixed(2)}
                  </p>
                </div>
              </div>

              {Object.keys(data.categories).length > 0 && (
                <div>
                  <p className="text-slate-300 text-sm font-medium mb-3">Expense Breakdown</p>
                  <div className="space-y-2">
                    {Object.entries(data.categories)
                      .sort(([, a], [, b]) => b - a)
                      .map(([category, amount]) => (
                        <div key={category} className="flex justify-between items-center">
                          <span className="text-slate-400">{category}</span>
                          <span className="text-white font-medium">${amount.toFixed(2)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </Card>
          )
        })
      )}
    </div>
  )
}
