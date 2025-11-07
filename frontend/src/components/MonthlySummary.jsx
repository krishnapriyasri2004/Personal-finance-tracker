import "./MonthlySummary.css"

function MonthlySummary({ summary }) {
  if (summary.length === 0) {
    return <p className="empty-message">No summary data available</p>
  }

  return (
    <div className="monthly-summary">
      <h2>Monthly Summary</h2>
      {summary.map((month) => (
        <div key={month.month} className="month-card">
          <div className="month-header">
            <h3>{new Date(month.month + "-01").toLocaleDateString("en-US", { year: "numeric", month: "long" })}</h3>
            <div className="month-totals">
              <div className="total income-total">
                <span>Income</span>
                <strong className="income">${month.income_total.toFixed(2)}</strong>
              </div>
              <div className="total expense-total">
                <span>Expenses</span>
                <strong className="expense">${month.expense_total.toFixed(2)}</strong>
              </div>
              <div className="total net-total">
                <span>Net</span>
                <strong className={month.income_total - month.expense_total >= 0 ? "income" : "expense"}>
                  ${(month.income_total - month.expense_total).toFixed(2)}
                </strong>
              </div>
            </div>
          </div>

          <div className="categories-breakdown">
            <h4>By Category</h4>
            {month.by_category.length === 0 ? (
              <p className="no-categories">No transactions</p>
            ) : (
              <div className="category-list">
                {month.by_category.map((cat) => (
                  <div key={cat.category} className="category-item">
                    <div className="category-info">
                      <span className="category-name">{cat.category}</span>
                      <span className="category-count">({cat.count} transactions)</span>
                    </div>
                    <div className="category-amount">${cat.total.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="month-chart">
            <div className="chart-bars">
              {month.by_category.map((cat) => (
                <div key={cat.category} className="chart-bar-container">
                  <div
                    className="chart-bar"
                    style={{
                      height: `${(cat.total / Math.max(...month.by_category.map((c) => c.total), 1)) * 100}%`,
                    }}
                  />
                  <label className="chart-label">{cat.category.substring(0, 3)}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MonthlySummary
