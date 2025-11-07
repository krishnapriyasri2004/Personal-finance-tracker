"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import "./App.css"
import TransactionForm from "./components/TransactionForm"
import TransactionList from "./components/TransactionList"
import MonthlySummary from "./components/MonthlySummary"

const API_BASE_URL = "http://localhost:8000"

function App() {
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState([])
  const [activeTab, setActiveTab] = useState("add")
  const [filters, setFilters] = useState({
    month: "",
    type: "",
    category: "",
  })
  const [loading, setLoading] = useState(false)

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.month) params.append("month", filters.month)
      if (filters.type) params.append("transaction_type", filters.type)
      if (filters.category) params.append("category", filters.category)

      const response = await axios.get(`${API_BASE_URL}/transactions/?${params}`)
      setTransactions(response.data)
    } catch (error) {
      console.error("Error fetching transactions:", error)
      alert("Failed to fetch transactions")
    } finally {
      setLoading(false)
    }
  }

  const fetchSummary = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/transactions/summary`)
      setSummary(response.data)
    } catch (error) {
      console.error("Error fetching summary:", error)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [filters])

  useEffect(() => {
    fetchSummary()
  }, [])

  const handleAddTransaction = () => {
    fetchTransactions()
    fetchSummary()
    setActiveTab("list")
  }

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return
    try {
      await axios.delete(`${API_BASE_URL}/transactions/${id}`)
      fetchTransactions()
      fetchSummary()
    } catch (error) {
      console.error("Error deleting transaction:", error)
      alert("Failed to delete transaction")
    }
  }

  const handleReclassify = async (id, newCategory) => {
    try {
      await axios.patch(`${API_BASE_URL}/transactions/${id}/reclassify`, {
        category: newCategory,
      })
      fetchTransactions()
      fetchSummary()
    } catch (error) {
      console.error("Error reclassifying transaction:", error)
      alert("Failed to reclassify transaction")
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Personal Finance Tracker</h1>
        <p>Track your income and expenses intelligently</p>
      </header>

      <nav className="app-nav">
        <button className={`nav-btn ${activeTab === "add" ? "active" : ""}`} onClick={() => setActiveTab("add")}>
          Add Transaction
        </button>
        <button className={`nav-btn ${activeTab === "list" ? "active" : ""}`} onClick={() => setActiveTab("list")}>
          View Transactions
        </button>
        <button
          className={`nav-btn ${activeTab === "summary" ? "active" : ""}`}
          onClick={() => setActiveTab("summary")}
        >
          Monthly Summary
        </button>
      </nav>

      <main className="app-main">
        {activeTab === "add" && (
          <section className="tab-content">
            <TransactionForm onSuccess={handleAddTransaction} apiUrl={API_BASE_URL} />
          </section>
        )}

        {activeTab === "list" && (
          <section className="tab-content">
            <div className="filters">
              <h2>Transactions</h2>
              <div className="filter-group">
                <input
                  type="month"
                  value={filters.month}
                  onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                  placeholder="Filter by month"
                />
                <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
                  <option value="">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
                  <option value="">All Categories</option>
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Rent">Rent</option>
                  <option value="Salary">Salary</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Health">Health</option>
                </select>
              </div>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <TransactionList
                transactions={transactions}
                onDelete={handleDeleteTransaction}
                onReclassify={handleReclassify}
              />
            )}
          </section>
        )}

        {activeTab === "summary" && (
          <section className="tab-content">
            <MonthlySummary summary={summary} />
          </section>
        )}
      </main>
    </div>
  )
}

export default App
