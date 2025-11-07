"use client"

import { useState, useMemo } from "react"
import { Trash2, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
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

interface TransactionListProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
  onReclassify: (id: string, newCategory: string) => void
}

const CATEGORIES = ["Food", "Transport", "Entertainment", "Utilities", "Health", "Shopping", "Rent", "Salary", "Other"]

export default function TransactionList({ transactions, onDelete, onReclassify }: TransactionListProps) {
  const [filterMonth, setFilterMonth] = useState<string>("")
  const [filterType, setFilterType] = useState<string>("")
  const [filterCategory, setFilterCategory] = useState<string>("")
  const [reclassifyId, setReclassifyId] = useState<string | null>(null)

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const tMonth = new Date(t.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })
      const monthMatch = !filterMonth || tMonth === filterMonth
      const typeMatch = !filterType || t.type === filterType
      const categoryMatch = !filterCategory || t.category === filterCategory
      return monthMatch && typeMatch && categoryMatch
    })
  }, [transactions, filterMonth, filterType, filterCategory])

  const months = useMemo(() => {
    const uniqueMonths = new Set<string>()
    transactions.forEach((t) => {
      uniqueMonths.add(new Date(t.date).toLocaleDateString("en-US", { month: "long", year: "numeric" }))
    })
    return Array.from(uniqueMonths).sort()
  }, [transactions])

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-slate-700/50 border-slate-600 p-4">
        <h3 className="text-sm font-semibold text-white mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-2">Month</label>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Months</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Transactions List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="bg-slate-700 border-slate-600 p-4 hover:bg-slate-650 transition">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white">{transaction.description}</h4>
                    {transaction.autoTagged && (
                      <span className="px-2 py-0.5 bg-teal-500/20 text-teal-300 text-xs rounded">Auto-tagged</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    <span>•</span>
                    {reclassifyId === transaction.id ? (
                      <select
                        value={transaction.category}
                        onChange={(e) => {
                          onReclassify(transaction.id, e.target.value)
                          setReclassifyId(null)
                        }}
                        autoFocus
                        className="bg-slate-800 border border-slate-500 text-white rounded px-2 py-1 text-xs"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <button
                        onClick={() => setReclassifyId(transaction.id)}
                        className="text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Tag className="w-4 h-4" />
                        {transaction.category}
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <p className={`font-bold text-lg ${transaction.amount > 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {transaction.amount > 0 ? "+" : ""} ${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(transaction.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-slate-400">
            No transactions found. Add your first transaction to get started!
          </div>
        )}
      </div>

      <div className="text-sm text-slate-400 text-center">
        Showing {filteredTransactions.length} of {transactions.length} transactions
      </div>
    </div>
  )
}
