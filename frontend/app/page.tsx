"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import TransactionForm from "@/components/transaction-form"
import TransactionList from "@/components/transaction-list"
import MonthlySummary from "@/components/monthly-summary"
import ExpenseChart from "@/components/expense-chart"

const API_URL = "http://localhost:8000"

export default function Home() {
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState([])
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")
  const [filterMonth, setFilterMonth] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTransactions()
    fetchSummary()
  }, [filterType, filterMonth, filterCategory])

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterType !== "all") params.append("transaction_type", filterType)
      if (filterMonth) params.append("month", filterMonth)
      if (filterCategory) params.append("category", filterCategory)

      const response = await axios.get(`${API_URL}/transactions/?${params}`)
      setTransactions(response.data)
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSummary = async () => {
    try {
      const response = await axios.get(`${API_URL}/transactions/summary`)
      setSummary(response.data)
    } catch (error) {
      console.error("Error fetching summary:", error)
    }
  }

  const handleTransactionAdded = () => {
    fetchTransactions()
    fetchSummary()
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/transactions/${id}`)
      fetchTransactions()
      fetchSummary()
    } catch (error) {
      console.error("Error deleting transaction:", error)
    }
  }

  const handleReclassify = async (id: number, newCategory: string) => {
    try {
      await axios.patch(`${API_URL}/transactions/${id}/reclassify`, { category: newCategory })
      fetchTransactions()
      fetchSummary()
    } catch (error) {
      console.error("Error reclassifying transaction:", error)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Personal Finance Tracker</h1>
          <p className="text-slate-400">Track your income and expenses with intelligent categorization</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form & Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add Transaction Form */}
            <TransactionForm onTransactionAdded={handleTransactionAdded} />

            {/* Chart */}
            {summary.length > 0 && <ExpenseChart summary={summary} />}
          </div>

          {/* Right Column - Filters & Summary */}
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Filters</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded"
                  >
                    <option value="all">All</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">Month (YYYY-MM)</label>
                  <input
                    type="text"
                    placeholder="2025-11"
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">Category</label>
                  <input
                    type="text"
                    placeholder="e.g., Food, Transport"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded"
                  />
                </div>
              </div>
            </div>

            {/* Monthly Summary */}
            {summary.length > 0 && <MonthlySummary summary={summary[summary.length - 1]} />}
          </div>
        </div>

        {/* Transactions List */}
        <div className="mt-8">
          <TransactionList
            transactions={transactions}
            onDelete={handleDelete}
            onReclassify={handleReclassify}
            loading={loading}
          />
        </div>
      </div>
    </main>
  )
}
