// Data persistence utilities for Finance Tracker

export interface User {
  id: string
  name: string
  email: string
}

export interface Transaction {
  id: string
  description: string
  amount: number
  type: "income" | "expense"
  category: string
  date: string
  autoTagged: boolean
}

// User storage
export const userStorage = {
  get: (): User | null => {
    if (typeof window === "undefined") return null
    const stored = localStorage.getItem("finance_user")
    return stored ? JSON.parse(stored) : null
  },

  set: (user: User): void => {
    if (typeof window === "undefined") return
    localStorage.setItem("finance_user", JSON.stringify(user))
  },

  clear: (): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem("finance_user")
  },
}

// Transactions storage
export const transactionsStorage = {
  get: (): Transaction[] => {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem("finance_transactions")
    return stored ? JSON.parse(stored) : []
  },

  set: (transactions: Transaction[]): void => {
    if (typeof window === "undefined") return
    localStorage.setItem("finance_transactions", JSON.stringify(transactions))
  },

  add: (transaction: Transaction): Transaction[] => {
    const current = transactionsStorage.get()
    const updated = [transaction, ...current]
    transactionsStorage.set(updated)
    return updated
  },

  update: (id: string, updates: Partial<Transaction>): Transaction[] => {
    const current = transactionsStorage.get()
    const updated = current.map((t) => (t.id === id ? { ...t, ...updates } : t))
    transactionsStorage.set(updated)
    return updated
  },

  remove: (id: string): Transaction[] => {
    const current = transactionsStorage.get()
    const updated = current.filter((t) => t.id !== id)
    transactionsStorage.set(updated)
    return updated
  },

  clear: (): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem("finance_transactions")
  },
}

// Settings storage
export const settingsStorage = {
  get: () => {
    if (typeof window === "undefined") return { theme: "dark", currency: "USD" }
    const stored = localStorage.getItem("finance_settings")
    return stored ? JSON.parse(stored) : { theme: "dark", currency: "USD" }
  },

  set: (settings: Record<string, any>): void => {
    if (typeof window === "undefined") return
    localStorage.setItem("finance_settings", JSON.stringify(settings))
  },
}

// Export all data
export const exportData = (): {
  user: User | null
  transactions: Transaction[]
  exportedAt: string
} => {
  return {
    user: userStorage.get(),
    transactions: transactionsStorage.get(),
    exportedAt: new Date().toISOString(),
  }
}

// Import all data
export const importData = (data: {
  user?: User
  transactions?: Transaction[]
}): void => {
  if (data.user) userStorage.set(data.user)
  if (data.transactions) transactionsStorage.set(data.transactions)
}

// Clear all data
export const clearAllData = (): void => {
  userStorage.clear()
  transactionsStorage.clear()
  settingsStorage.set({ theme: "dark", currency: "USD" })
}
