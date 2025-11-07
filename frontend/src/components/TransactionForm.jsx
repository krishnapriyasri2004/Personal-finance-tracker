"use client"

import { useState } from "react"
import axios from "axios"
import "./TransactionForm.css"

function TransactionForm({ onSuccess, apiUrl }) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    transaction_type: "expense",
    category: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.description || !formData.amount) {
      alert("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)
      await axios.post(`${apiUrl}/transactions/`, {
        description: formData.description,
        amount: Number.parseFloat(formData.amount),
        transaction_type: formData.transaction_type,
        category: formData.category || undefined,
      })
      setFormData({
        description: "",
        amount: "",
        transaction_type: "expense",
        category: "",
      })
      alert("Transaction added successfully!")
      onSuccess()
    } catch (error) {
      console.error("Error adding transaction:", error)
      alert(error.response?.data?.detail || "Failed to add transaction")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h2>Add New Transaction</h2>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="e.g., McDonald's breakfast"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="amount">Amount *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">Type *</label>
          <select id="type" name="transaction_type" value={formData.transaction_type} onChange={handleChange} required>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="category">Category (optional - will auto-categorize)</label>
        <select id="category" name="category" value={formData.category} onChange={handleChange}>
          <option value="">Auto-categorize</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Utilities">Utilities</option>
          <option value="Rent">Rent</option>
          <option value="Salary">Salary</option>
          <option value="Shopping">Shopping</option>
          <option value="Health">Health</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? "Adding..." : "Add Transaction"}
      </button>
    </form>
  )
}

export default TransactionForm
