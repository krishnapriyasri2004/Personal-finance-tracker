"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface Transaction {
  id: string
  description: string
  amount: number
  type: "income" | "expense"
  category: string
  date: string
  autoTagged: boolean
}

interface AlertSettings {
  enabled: boolean
  dailyLimit: number
  warnPercentage: number
}

interface DailyExpenseAlertProps {
  transactions: Transaction[]
  alertSettings: AlertSettings
}

export default function DailyExpenseAlert({ transactions, alertSettings }: DailyExpenseAlertProps) {
  const { toast } = useToast()

  useEffect(() => {
    if (!alertSettings.enabled) return

    // Get today's expenses
    const today = new Date().toISOString().split("T")[0]
    const todayExpenses = transactions
      .filter((t) => t.type === "expense" && t.date === today)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const warnThreshold = alertSettings.dailyLimit * (alertSettings.warnPercentage / 100)

    // Check if exceeded
    if (todayExpenses > alertSettings.dailyLimit) {
      toast({
        title: "Daily Limit Exceeded!",
        description: `You've spent $${todayExpenses.toFixed(2)} today, exceeding your daily limit of $${alertSettings.dailyLimit.toFixed(2)}`,
        variant: "destructive",
      })
    }
    // Check if approaching limit
    else if (todayExpenses > warnThreshold) {
      const remaining = alertSettings.dailyLimit - todayExpenses
      toast({
        title: "Approaching Daily Limit",
        description: `You've spent $${todayExpenses.toFixed(2)}. Only $${remaining.toFixed(2)} remaining today.`,
      })
    }
  }, [transactions, alertSettings, toast])

  return null
}
