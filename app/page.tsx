"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import TransactionForm from "@/components/transaction-form"
import TransactionList from "@/components/transaction-list"
import MonthlySummary from "@/components/monthly-summary"
import Dashboard from "@/components/dashboard"
import LoginPage from "@/components/auth/login-page"

type Tab = "dashboard" | "add" | "list" | "summary"

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState([
    { id: 1, date: "2025-11-01", description: "Salary", amount: 5000, category: "Income", type: "income" },
    { id: 2, date: "2025-11-02", description: "Groceries", amount: -120, category: "Food", type: "expense" },
    { id: 3, date: "2025-11-03", description: "Netflix", amount: -15, category: "Entertainment", type: "expense" },
    { id: 4, date: "2025-11-05", description: "Gas", amount: -50, category: "Transport", type: "expense" },
    { id: 5, date: "2025-11-06", description: "Freelance Work", amount: 800, category: "Income", type: "income" },
  ])
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")

  const stats = useMemo(() => {
    const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const expenses = Math.abs(transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0))
    return { income, expenses, balance: income - expenses }
  }, [transactions])

  useEffect(() => {
    const user = localStorage.getItem("finance_user")
    if (user) {
      setIsAuthenticated(true)
      router.push("/dashboard")
    } else {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    const user = localStorage.getItem("finance_user")
    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/auth/login")
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          <p className="mt-4 text-slate-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  const handleAddTransaction = (transaction: any) => {
    setTransactions([...transactions, { ...transaction, id: Math.max(...transactions.map((t) => t.id), 0) + 1 }])
  }

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold">Finance Tracker</h1>
          </div>
          <p className="text-slate-400">Manage your income and expenses with ease</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Balance</p>
                <p className={`text-3xl font-bold ${stats.balance >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  ${stats.balance.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-teal-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Income</p>
                <p className="text-3xl font-bold text-emerald-400">${stats.income.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-emerald-900 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Expenses</p>
                <p className="text-3xl font-bold text-red-400">${stats.expenses.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-red-900 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(["dashboard", "add", "list", "summary"] as const).map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              variant={activeTab === tab ? "default" : "outline"}
              className={`capitalize ${activeTab === tab ? "bg-teal-500 hover:bg-teal-600 border-teal-500" : "border-slate-600 text-slate-300 hover:bg-slate-700"}`}
            >
              {tab === "dashboard" && "Overview"}
              {tab === "add" && "Add Transaction"}
              {tab === "list" && "Transactions"}
              {tab === "summary" && "Monthly Summary"}
            </Button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          {activeTab === "dashboard" && <Dashboard transactions={transactions} />}
          {activeTab === "add" && <TransactionForm onAddTransaction={handleAddTransaction} />}
          {activeTab === "list" && <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />}
          {activeTab === "summary" && <MonthlySummary transactions={transactions} />}
        </div>
      </div>
    </main>
  )
}
