// Provider for real-time data synchronization across the app

"use client"

import { type ReactNode, createContext, useContext, useEffect, useState } from "react"
import { transactionsStorage, type Transaction } from "@/lib/storage"

interface SyncContextType {
  transactions: Transaction[]
  syncTransactions: () => void
  lastSync: Date | null
}

const SyncContext = createContext<SyncContextType | undefined>(undefined)

export function SyncProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [lastSync, setLastSync] = useState<Date | null>(null)

  const syncTransactions = () => {
    const fresh = transactionsStorage.get()
    setTransactions(fresh)
    setLastSync(new Date())
  }

  useEffect(() => {
    syncTransactions()

    // Sync every 5 seconds to keep data fresh
    const interval = setInterval(syncTransactions, 5000)

    return () => clearInterval(interval)
  }, [])

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = () => {
      syncTransactions()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return <SyncContext.Provider value={{ transactions, syncTransactions, lastSync }}>{children}</SyncContext.Provider>
}

export const useSyncContext = () => {
  const context = useContext(SyncContext)
  if (!context) {
    throw new Error("useSyncContext must be used within SyncProvider")
  }
  return context
}
