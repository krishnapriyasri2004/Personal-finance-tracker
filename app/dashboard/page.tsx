"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { DollarSign, TrendingUp, TrendingDown, LogOut, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Dashboard from "@/components/dashboard/dashboard"
import TransactionForm from "@/components/transaction/transaction-form"
import TransactionList from "@/components/transaction/transaction-list"
import MonthlySummary from "@/components/analytics/monthly-summary"
import BudgetManager from "@/components/budget/budget-manager"
import DailyExpenseAlert from "@/components/alerts/daily-expense-alert"
import AlertSettingsComponent, { type AlertSettings } from "@/components/alerts/alert-settings"
import FamilyMemberManager, { type FamilyMember } from "@/components/family/family-member-manager"
import RecurringBillManager from "@/components/recurring/recurring-bill-manager"
import SavingsGoals, { type SavingsGoal } from "@/components/savings/savings-goals"

type Tab = "overview" | "add" | "transactions" | "summary" | "budget" | "alerts" | "family" | "recurring" | "savings"

interface Transaction {
  id: string
  description: string
  amount: number
  type: "income" | "expense"
  category: string
  date: string
  autoTagged: boolean
}

interface Budget {
  category: string
  limit: number
  spent: number
}

interface RecurringBill {
  id: string
  description: string
  amount: number
  category: string
  frequency: "daily" | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly"
  startDate: string
  nextDueDate: string
  isActive: boolean
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Food: ["restaurant", "uber eats", "mcdonald", "grocery", "walmart", "pizza", "coffee", "starbucks"],
  Transport: ["uber", "lyft", "gas", "parking", "transit", "metro", "train"],
  Entertainment: ["netflix", "hulu", "spotify", "game", "movie", "theater", "concert"],
  Utilities: ["electric", "water", "gas bill", "internet", "phone"],
  Health: ["doctor", "pharmacy", "gym", "health", "medical", "hospital"],
  Shopping: ["amazon", "store", "mall", "shopping", "target", "costco"],
  Rent: ["rent", "mortgage", "landlord", "lease"],
  Salary: ["salary", "paycheck", "bonus", "freelance", "income"],
}

export default function DashboardPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const [userName, setUserName] = useState("")
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [alertSettings, setAlertSettings] = useState<AlertSettings>({
    enabled: true,
    dailyLimit: 100,
    warnPercentage: 75,
  })
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [recurringBills, setRecurringBills] = useState<RecurringBill[]>([])
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])

  useEffect(() => {
    const user = localStorage.getItem("finance_user")
    const savedTransactions = localStorage.getItem("finance_transactions")
    const savedBudgets = localStorage.getItem("finance_budgets")
    const savedAlerts = localStorage.getItem("finance_alert_settings")
    const savedFamily = localStorage.getItem("finance_family_members")
    const savedRecurring = localStorage.getItem("finance_recurring_bills")
    const savedSavings = localStorage.getItem("finance_savings_goals")

    if (!user) {
      router.push("/")
      return
    }

    const userData = JSON.parse(user)
    setUserName(userData.name)

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    } else {
      const sampleData: Transaction[] = [
        {
          id: "1",
          description: "Monthly Salary",
          amount: 5000,
          type: "income",
          category: "Salary",
          date: new Date().toISOString().split("T")[0],
          autoTagged: true,
        },
        {
          id: "2",
          description: "Grocery Shopping at Walmart",
          amount: -150,
          type: "expense",
          category: "Food",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          autoTagged: true,
        },
        {
          id: "3",
          description: "Netflix Subscription",
          amount: -15,
          type: "expense",
          category: "Entertainment",
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          autoTagged: true,
        },
        {
          id: "4",
          description: "Uber to Airport",
          amount: -45,
          type: "expense",
          category: "Transport",
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          autoTagged: true,
        },
        {
          id: "5",
          description: "Freelance Project Payment",
          amount: 800,
          type: "income",
          category: "Salary",
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          autoTagged: true,
        },
      ]
      setTransactions(sampleData)
      localStorage.setItem("finance_transactions", JSON.stringify(sampleData))
    }

    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets))
    }

    if (savedAlerts) {
      setAlertSettings(JSON.parse(savedAlerts))
    }

    if (savedFamily) {
      setFamilyMembers(JSON.parse(savedFamily))
    } else {
      const defaultMember: FamilyMember = {
        id: "primary-" + Date.now(),
        name: userData.name,
        email: userData.email || "primary@family.local",
        role: "primary",
        joinDate: new Date().toISOString().split("T")[0],
        color: "#14b8a6",
      }
      setFamilyMembers([defaultMember])
      localStorage.setItem("finance_family_members", JSON.stringify([defaultMember]))
    }

    if (savedRecurring) {
      setRecurringBills(JSON.parse(savedRecurring))
    }

    if (savedSavings) {
      setSavingsGoals(JSON.parse(savedSavings))
    }
  }, [router])

  const autoCategorizeTransaction = (description: string): string => {
    const lowerDesc = description.toLowerCase()
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some((keyword) => lowerDesc.includes(keyword))) {
        return category
      }
    }
    return "Other"
  }

  const handleAddTransaction = (data: {
    description: string
    amount: number
    type: "income" | "expense"
    date: string
  }) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description: data.description,
      amount: data.type === "expense" ? -Math.abs(data.amount) : Math.abs(data.amount),
      type: data.type,
      category: autoCategorizeTransaction(data.description),
      date: data.date,
      autoTagged: true,
    }

    const updatedTransactions = [newTransaction, ...transactions]
    setTransactions(updatedTransactions)
    localStorage.setItem("finance_transactions", JSON.stringify(updatedTransactions))
  }

  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter((t) => t.id !== id)
    setTransactions(updatedTransactions)
    localStorage.setItem("finance_transactions", JSON.stringify(updatedTransactions))
  }

  const handleReclassify = (id: string, newCategory: string) => {
    const updatedTransactions = transactions.map((t) =>
      t.id === id ? { ...t, category: newCategory, autoTagged: false } : t,
    )
    setTransactions(updatedTransactions)
    localStorage.setItem("finance_transactions", JSON.stringify(updatedTransactions))
  }

  const stats = useMemo(() => {
    const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const expenses = Math.abs(transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0))

    const updatedBudgets = budgets.map((budget) => {
      const categorySpent = Math.abs(
        transactions
          .filter((t) => t.type === "expense" && t.category === budget.category)
          .reduce((sum, t) => sum + t.amount, 0),
      )
      return { ...budget, spent: categorySpent }
    })

    if (JSON.stringify(updatedBudgets) !== JSON.stringify(budgets)) {
      setBudgets(updatedBudgets)
      localStorage.setItem("finance_budgets", JSON.stringify(updatedBudgets))
    }

    return { income, expenses, balance: income - expenses }
  }, [transactions, budgets])

  const handleSaveBudgets = (updatedBudgets: Budget[]) => {
    setBudgets(updatedBudgets)
    localStorage.setItem("finance_budgets", JSON.stringify(updatedBudgets))
  }

  const handleLogout = () => {
    localStorage.removeItem("finance_user")
    localStorage.removeItem("finance_transactions")
    localStorage.removeItem("finance_budgets")
    localStorage.removeItem("finance_alert_settings")
    localStorage.removeItem("finance_family_members")
    localStorage.removeItem("finance_recurring_bills")
    localStorage.removeItem("finance_savings_goals")
    router.push("/")
  }

  const categories = Array.from(new Set(transactions.map((t) => t.category)))

  const handleSaveAlertSettings = (settings: AlertSettings) => {
    setAlertSettings(settings)
    localStorage.setItem("finance_alert_settings", JSON.stringify(settings))
  }

  const handleAddFamilyMember = (member: Omit<FamilyMember, "id">) => {
    const newMember: FamilyMember = {
      ...member,
      id: "member-" + Date.now(),
    }
    const updatedMembers = [...familyMembers, newMember]
    setFamilyMembers(updatedMembers)
    localStorage.setItem("finance_family_members", JSON.stringify(updatedMembers))
  }

  const handleRemoveFamilyMember = (memberId: string) => {
    const updatedMembers = familyMembers.filter((m) => m.id !== memberId)
    setFamilyMembers(updatedMembers)
    localStorage.setItem("finance_family_members", JSON.stringify(updatedMembers))
  }

  const handleAddRecurringBill = (bill: Omit<RecurringBill, "id" | "nextDueDate">) => {
    const FREQUENCY_DAYS: Record<string, number> = {
      daily: 1,
      weekly: 7,
      biweekly: 14,
      month: 30,
      quarterly: 90,
      yearly: 365,
    }

    const startDate = new Date(bill.startDate)
    const daysToAdd = FREQUENCY_DAYS[bill.frequency] || 30
    startDate.setDate(startDate.getDate() + daysToAdd)
    const nextDueDate = startDate.toISOString().split("T")[0]

    const newBill: RecurringBill = {
      ...bill,
      id: "bill-" + Date.now(),
      nextDueDate,
      isActive: true,
    }

    const updatedBills = [...recurringBills, newBill]
    setRecurringBills(updatedBills)
    localStorage.setItem("finance_recurring_bills", JSON.stringify(updatedBills))
  }

  const handleRemoveRecurringBill = (billId: string) => {
    const updatedBills = recurringBills.filter((b) => b.id !== billId)
    setRecurringBills(updatedBills)
    localStorage.setItem("finance_recurring_bills", JSON.stringify(updatedBills))
  }

  const handleToggleRecurringBill = (billId: string) => {
    const updatedBills = recurringBills.map((b) => (b.id === billId ? { ...b, isActive: !b.isActive } : b))
    setRecurringBills(updatedBills)
    localStorage.setItem("finance_recurring_bills", JSON.stringify(updatedBills))
  }

  const handleAddSavingsGoal = (goal: Omit<SavingsGoal, "id" | "currentAmount" | "createdDate">) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: "goal-" + Date.now(),
      currentAmount: 0,
      createdDate: new Date().toISOString().split("T")[0],
    }

    const updatedGoals = [...savingsGoals, newGoal]
    setSavingsGoals(updatedGoals)
    localStorage.setItem("finance_savings_goals", JSON.stringify(updatedGoals))
  }

  const handleRemoveSavingsGoal = (goalId: string) => {
    const updatedGoals = savingsGoals.filter((g) => g.id !== goalId)
    setSavingsGoals(updatedGoals)
    localStorage.setItem("finance_savings_goals", JSON.stringify(updatedGoals))
  }

  const handleUpdateGoalAmount = (goalId: string, amount: number) => {
    const updatedGoals = savingsGoals.map((g) => (g.id === goalId ? { ...g, currentAmount: amount } : g))
    setSavingsGoals(updatedGoals)
    localStorage.setItem("finance_savings_goals", JSON.stringify(updatedGoals))
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <DailyExpenseAlert transactions={transactions} alertSettings={alertSettings} />

      <div className="sticky top-0 z-10 bg-slate-800/95 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Finance Tracker</h1>
              <p className="text-xs text-slate-400">Welcome, {userName}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            size="sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700 p-6 hover:border-teal-500/50 transition-colors">
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

          <Card className="bg-slate-800 border-slate-700 p-6 hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Income</p>
                <p className="text-3xl font-bold text-emerald-400">${stats.income.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-emerald-900 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6 hover:border-red-500/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Expenses</p>
                <p className="text-3xl font-bold text-red-400">${stats.expenses.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-red-900 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {(
            [
              "overview",
              "add",
              "transactions",
              "summary",
              "budget",
              "alerts",
              "family",
              "recurring",
              "savings",
            ] as const
          ).map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              variant={activeTab === tab ? "default" : "outline"}
              className={`capitalize ${
                activeTab === tab
                  ? "bg-teal-500 hover:bg-teal-600 border-teal-500"
                  : "border-slate-600 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {tab === "overview" && "Overview"}
              {tab === "add" && (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Transaction
                </>
              )}
              {tab === "transactions" && "Transactions"}
              {tab === "summary" && "Analytics"}
              {tab === "budget" && "Budget"}
              {tab === "alerts" && "Alerts"}
              {tab === "family" && "Family"}
              {tab === "recurring" && "Bills"}
              {tab === "savings" && "Savings"}
            </Button>
          ))}
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 shadow-xl">
          {activeTab === "overview" && <Dashboard transactions={transactions} />}
          {activeTab === "add" && <TransactionForm onSubmit={handleAddTransaction} />}
          {activeTab === "transactions" && (
            <TransactionList
              transactions={transactions}
              onDelete={handleDeleteTransaction}
              onReclassify={handleReclassify}
            />
          )}
          {activeTab === "summary" && <MonthlySummary transactions={transactions} onReclassify={handleReclassify} />}
          {activeTab === "budget" && (
            <BudgetManager budgets={budgets} onSaveBudgets={handleSaveBudgets} categories={categories} />
          )}
          {activeTab === "alerts" && (
            <AlertSettingsComponent settings={alertSettings} onSaveSettings={handleSaveAlertSettings} />
          )}
          {activeTab === "family" && (
            <FamilyMemberManager
              members={familyMembers}
              onAddMember={handleAddFamilyMember}
              onRemoveMember={handleRemoveFamilyMember}
            />
          )}
          {activeTab === "recurring" && (
            <RecurringBillManager
              bills={recurringBills}
              onAddBill={handleAddRecurringBill}
              onRemoveBill={handleRemoveRecurringBill}
              onToggleBill={handleToggleRecurringBill}
              categories={categories}
            />
          )}
          {activeTab === "savings" && (
            <SavingsGoals
              goals={savingsGoals}
              onAddGoal={handleAddSavingsGoal}
              onRemoveGoal={handleRemoveSavingsGoal}
              onUpdateGoalAmount={handleUpdateGoalAmount}
            />
          )}
        </div>
      </div>
    </main>
  )
}
