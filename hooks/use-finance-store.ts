// Custom hook for managing finance app state with localStorage persistence

"use client"

import { useEffect, useState, useCallback } from "react"
import { userStorage, transactionsStorage, type User, type Transaction } from "@/lib/storage"

export interface FinanceStore {
  user: User | null
  transactions: Transaction[]
  isLoading: boolean
  addTransaction: (data: Omit<Transaction, "id">) => void
  deleteTransaction: (id: string) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  logout: () => void
}

export const useFinanceStore = (): FinanceStore => {
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Initialize from localStorage
  useEffect(() => {
    const savedUser = userStorage.get()
    const savedTransactions = transactionsStorage.get()

    setUser(savedUser)
    setTransactions(savedTransactions)
    setIsLoading(false)
  }, [])

  const addTransaction = useCallback(
    (data: Omit<Transaction, "id">) => {
      const newTransaction: Transaction = {
        ...data,
        id: Date.now().toString(),
      }

      const updated = [newTransaction, ...transactions]
      setTransactions(updated)
      transactionsStorage.set(updated)
    },
    [transactions],
  )

  const deleteTransaction = useCallback(
    (id: string) => {
      const updated = transactions.filter((t) => t.id !== id)
      setTransactions(updated)
      transactionsStorage.set(updated)
    },
    [transactions],
  )

  const updateTransaction = useCallback(
    (id: string, updates: Partial<Transaction>) => {
      const updated = transactions.map((t) => (t.id === id ? { ...t, ...updates } : t))
      setTransactions(updated)
      transactionsStorage.set(updated)
    },
    [transactions],
  )

  const logout = useCallback(() => {
    userStorage.clear()
    transactionsStorage.clear()
    setUser(null)
    setTransactions([])
  }, [])

  return {
    user,
    transactions,
    isLoading,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    logout,
  }
}
