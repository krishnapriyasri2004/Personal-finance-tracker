"use client"

import { useState } from "react"

interface Transaction {
  id: number
  description: string
  amount: number
  transaction_type: string
  category: string
  auto_tagged: boolean
  timestamp: string
}

interface TransactionListProps {
  transactions: Transaction[]
  onDelete: (id: number) => void
  onReclassify: (id: number, category: string) => void
  loading: boolean
}

export default function TransactionList({ transactions, onDelete, onReclassify, loading }: TransactionListProps) {
  const [reclassifyId, setReclassifyId] = useState<number | null>(null)
  const [newCategory, setNewCategory] = useState("")

  const categories = ["Food", "Transport", "Rent", "Utilities", "Entertainment", "Healthcare", "Shopping", "Other"]

  const handleReclassify = (id: number, currentCategory: string) => {
    setReclassifyId(id)
    setNewCategory(currentCategory)
  }

  const submitReclassify = (id: number) => {
    if (newCategory) {
      onReclassify(id, newCategory)
      setReclassifyId(null)
    }
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white">Transactions</h2>
      </div>

      {loading ? (
        <div className="p-6 text-center text-slate-400">Loading...</div>
      ) : transactions.length === 0 ? (
        <div className="p-6 text-center text-slate-400">No transactions found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700 text-slate-300 text-sm">
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-700 transition">
                  <td className="px-6 py-3 text-white">{txn.description}</td>
                  <td
                    className={`px-6 py-3 font-medium ${txn.transaction_type === "income" ? "text-green-400" : "text-red-400"}`}
                  >
                    {txn.transaction_type === "income" ? "+" : "-"}${Math.abs(txn.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-slate-400 capitalize">{txn.transaction_type}</td>
                  <td className="px-6 py-3">
                    {reclassifyId === txn.id ? (
                      <div className="flex gap-2">
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="px-2 py-1 bg-slate-700 border border-slate-600 text-white rounded text-sm"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => submitReclassify(txn.id)}
                          className="px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setReclassifyId(null)}
                          className="px-2 py-1 bg-slate-600 text-white rounded text-sm hover:bg-slate-500"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-300">{txn.category}</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-slate-400 text-sm">{new Date(txn.timestamp).toLocaleDateString()}</td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReclassify(txn.id, txn.category)}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(txn.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
