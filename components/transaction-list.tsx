"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Transaction {
  id: number
  date: string
  description: string
  amount: number
  category: string
  type: "income" | "expense"
}

interface TransactionListProps {
  transactions: Transaction[]
  onDelete: (id: number) => void
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {sortedTransactions.length === 0 ? (
        <p className="text-slate-400 text-center py-8">No transactions yet</p>
      ) : (
        sortedTransactions.map((t) => (
          <Card key={t.id} className="bg-slate-700 border-slate-600 p-4 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${t.type === "income" ? "bg-emerald-900 text-emerald-200" : "bg-red-900 text-red-200"}`}
                >
                  {t.category}
                </div>
              </div>
              <p className="text-white font-medium mt-2">{t.description}</p>
              <p className="text-sm text-slate-400">{t.date}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className={`font-bold text-lg ${t.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
                {t.type === "income" ? "+" : "-"}${Math.abs(t.amount).toFixed(2)}
              </p>
              <Button
                onClick={() => onDelete(t.id)}
                size="sm"
                variant="ghost"
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
