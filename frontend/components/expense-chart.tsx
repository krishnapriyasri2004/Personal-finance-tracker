"use client"

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts"

interface ExpenseChartProps {
  summary: Array<{
    month: string
    categories: Record<string, number>
    total: number
  }>
}

export default function ExpenseChart({ summary }: ExpenseChartProps) {
  const latestMonth = summary[summary.length - 1]
  const data = Object.entries(latestMonth.categories).map(([name, value]) => ({
    name,
    value: Number.parseFloat(value.toFixed(2)),
  }))

  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#6366f1"]

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Expense Breakdown - {latestMonth.month}</h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: $${value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
