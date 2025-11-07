"use client"

import { useState } from "react"
import "./TransactionList.css"

function TransactionList({ transactions, onDelete, onReclassify }) {
  const [reclassifyId, setReclassifyId] = useState(null)
  const [newCategory, setNewCategory] = useState("")

  const handleReclassifySubmit = () => {
    if (newCategory) {
      onReclassify(reclassifyId, newCategory)
      setReclassifyId(null)
      setNewCategory("")
    }
  }

  const categories = [
    "Food",
    "Transport",
    "Entertainment",
    "Utilities",
    "Rent",
    "Salary",
    "Shopping",
    "Health",
    "Other",
  ]

  return (
    <div className="transaction-list">
      {transactions.length === 0 ? (
        <p className="empty-message">No transactions found</p>
      ) : (
        <div className="table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className={tx.transaction_type}>
                  <td>{new Date(tx.timestamp).toLocaleDateString()}</td>
                  <td className="description">{tx.description}</td>
                  <td>
                    {reclassifyId === tx.id ? (
                      <div className="reclassify-inline">
                        <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} autoFocus>
                          <option value="">Select...</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                        <button onClick={handleReclassifySubmit} className="save-btn">
                          Save
                        </button>
                        <button onClick={() => setReclassifyId(null)} className="cancel-btn">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className={`category-badge ${tx.auto_tagged ? "auto-tagged" : ""}`}>
                        {tx.category} {tx.auto_tagged ? "(auto)" : ""}
                      </span>
                    )}
                  </td>
                  <td className="type-badge">{tx.transaction_type}</td>
                  <td className={`amount ${tx.transaction_type}`}>
                    {tx.transaction_type === "income" ? "+" : "-"}${Math.abs(tx.amount).toFixed(2)}
                  </td>
                  <td className="actions">
                    <button
                      className="reclassify-btn"
                      onClick={() => {
                        setReclassifyId(tx.id)
                        setNewCategory(tx.category)
                      }}
                      title="Reclassify this transaction"
                    >
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => onDelete(tx.id)} title="Delete this transaction">
                      Delete
                    </button>
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

export default TransactionList
