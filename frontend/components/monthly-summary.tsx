"use client"

interface MonthlySummaryProps {
  summary: {
    month: string
    categories: Record<string, number>
    total: number
  }
}

export default function MonthlySummary({ summary }: MonthlySummaryProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Monthly Summary - {summary.month}</h2>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {Object.entries(summary.categories).map(([category, amount]) => (
          <div key={category} className="flex justify-between items-center pb-2 border-b border-slate-700">
            <span className="text-slate-300">{category}</span>
            <span className="text-white font-medium">${amount.toFixed(2)}</span>
          </div>
        ))}

        <div className="flex justify-between items-center pt-4 mt-4 border-t border-blue-500">
          <span className="text-white font-semibold">Total</span>
          <span className="text-blue-400 font-bold text-lg">${summary.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
