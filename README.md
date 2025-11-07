# Personal Finance Tracker

A comprehensive personal finance management system with intelligent transaction categorization, monthly summaries, and a complete API ecosystem.

## Features

- **Intelligent Auto-Categorization**: Automatically categorizes transactions based on description keywords
- **Manual Reclassification**: Correct auto-categorized transactions with one click
- **Duplicate Detection**: Identifies duplicate transactions within 1-hour windows
- **Monthly Summaries**: View income/expense breakdown grouped by category
- **Web Dashboard**: Beautiful, responsive React frontend for transaction management
- **RESTful API**: Well-designed FastAPI backend with comprehensive endpoints
- **Python SDK**: Simple, Pythonic SDK for programmatic access
- **Database Migrations**: Alembic-managed SQLite database with version control

## Project Structure

\`\`\`
personal-finance-tracker/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt         # Python dependencies
│   ├── seed_data.sql           # Sample data
│   ├── test_main.py            # Unit tests
│   ├── alembic/                # Database migrations
│   │   ├── env.py
│   │   ├── script.py.mako
│   │   ├── alembic.ini
│   │   └── versions/
│   │       └── 001_initial_schema.py
│   └── finance.db              # SQLite database (generated)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Main app component
│   │   ├── App.css             # Global styles
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── components/
│   │       ├── TransactionForm.jsx
│   │       ├── TransactionForm.css
│   │       ├── TransactionList.jsx
│   │       ├── TransactionList.css
│   │       ├── MonthlySummary.jsx
│   │       └── MonthlySummary.css
│   ├── package.json
│   ├── index.html
│   └── vite.config.js
│
├── sdk/
│   ├── finance_sdk.py          # Python SDK
│   └── sample_usage.py         # SDK usage example
│
├── setupdev.bat                # Windows setup script
├── setupdev.sh                 # Linux/Mac setup script
├── runapplication.bat          # Windows run script
├── runapplication.sh           # Linux/Mac run script
└── README.md                   # This file
\`\`\`

## Installation

### Option 1: Automated Setup (Windows)
\`\`\`bash
setupdev.bat
\`\`\`

### Option 2: Automated Setup (Linux/Mac)
\`\`\`bash
chmod +x setupdev.sh
./setupdev.sh
\`\`\`

### Option 3: Manual Setup

**Backend:**
\`\`\`bash
cd backend
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
python -c "import sqlite3; conn = sqlite3.connect('finance.db'); cursor = conn.cursor(); cursor.executescript(open('seed_data.sql').read()); conn.commit(); conn.close()"
\`\`\`

**Frontend:**
\`\`\`bash
cd frontend
npm install
\`\`\`

## Running the Application

### Option 1: Automated Run (Windows)
\`\`\`bash
runapplication.bat
\`\`\`

### Option 2: Automated Run (Linux/Mac)
\`\`\`bash
chmod +x runapplication.sh
./runapplication.sh
\`\`\`

### Option 3: Manual Run

**Backend:**
\`\`\`bash
cd backend
source env/bin/activate  # On Windows: env\Scripts\activate
uvicorn main:app --reload
\`\`\`

**Frontend (new terminal):**
\`\`\`bash
cd frontend
npm run dev
\`\`\`

## Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

## API Endpoints

### Transactions
- `POST /transactions/` - Add a new transaction
- `GET /transactions/` - Get all transactions (with filters)
- `GET /transactions/summary` - Get monthly income/expense summary
- `DELETE /transactions/{transaction_id}` - Delete a transaction
- `PATCH /transactions/{transaction_id}/reclassify` - Reclassify a transaction

### Query Parameters
- `month`: Filter by month (YYYY-MM)
- `transaction_type`: Filter by type (income/expense)
- `category`: Filter by category

## Auto-Categorization Rules

The system automatically categorizes transactions based on keywords:

| Category | Keywords |
|----------|----------|
| Food | mcdonald, burger, pizza, starbucks, coffee, restaurant, uber eats, grubhub |
| Transport | uber, lyft, gas, parking, transit, metro, taxi, fuel |
| Entertainment | netflix, spotify, movie, gaming, steam, playstation, xbox, cinema |
| Utilities | electric, water, internet, phone, gas bill, electricity |
| Rent | rent, mortgage, landlord, lease |
| Salary | salary, paycheck, wages, income, bonus |
| Shopping | amazon, mall, store, shop, retail, clothing |
| Health | pharmacy, doctor, hospital, medical, gym, health |

## Python SDK Usage

\`\`\`python
from finance_sdk import FinanceTrackerSDK

# Initialize
sdk = FinanceTrackerSDK(base_url="http://localhost:8000")

# Add transaction
transaction = sdk.add_transaction(
    description="McDonald's",
    amount=12.50,
    transaction_type="expense",
    category="Food"  # Optional - will auto-categorize if not provided
)

# Get transactions
transactions = sdk.get_transactions(month="2024-01", category="Food")

# Get summary
summary = sdk.get_summary()
for month in summary:
    print(f"{month.month}: Income: ${month.income_total}, Expenses: ${month.expense_total}")

# Reclassify transaction
sdk.reclassify_transaction(transaction.id, "Travel")

# Delete transaction
sdk.delete_transaction(transaction.id)
\`\`\`

## Running Tests

\`\`\`bash
cd backend
pytest test_main.py -v
\`\`\`

Test Coverage:
- Transaction creation with auto-categorization
- Type validation (income/expense)
- Duplicate detection
- Transaction filtering and retrieval
- Categorization override
- Transaction deletion
- Transaction reclassification
- Monthly summary calculations

## Smart Logic Implemented

1. **Auto-Categorization**: Keywords-based intelligent classification with fallback to type-based defaults
2. **Duplicate Detection**: Identifies transactions with same amount, description, and type within 1-hour window
3. **Value Storage**: Negative values for expenses, positive for income (displayed as absolute values in summaries)
4. **Monthly Aggregation**: Groups transactions by month and category, summing totals and counting occurrences
5. **Type Validation**: Ensures only 'income' or 'expense' types are accepted
6. **Manual Override**: Allows users to correct auto-categorization at any time

## Technologies Used

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: ORM and database toolkit
- **SQLite**: Lightweight relational database
- **Alembic**: Database migration tool
- **Pydantic**: Data validation

### Frontend
- **React 18**: UI library
- **Axios**: HTTP client
- **Vite**: Build tool
- **CSS3**: Styling with dark theme

### Testing
- **Pytest**: Testing framework
- **TestClient**: FastAPI testing utilities

## Bonus Features Implemented

- Monthly expense breakdown visualization with bar charts
- Auto-tagged vs manually categorized indicator
- Transaction filtering by multiple criteria
- Transaction count per category
- Net income/expense calculation
- Responsive dark-themed UI

## Database Schema

\`\`\`sql
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    transaction_type TEXT CHECK (transaction_type IN ('income', 'expense')) NOT NULL,
    category TEXT,
    auto_tagged BOOLEAN NOT NULL DEFAULT 1,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## Error Handling

- Invalid transaction type: Returns 400 with descriptive message
- Duplicate transactions: Returns 400 with duplicate detected warning
- Non-existent resources: Returns 404 with not found message
- Server errors: Returns 500 with error details

## Future Enhancements

- User authentication and multi-user support
- Budget tracking and alerts
- CSV export functionality
- Advanced analytics and forecasting
- Mobile app
- Recurring transaction support
- Bill reminders
- Multi-currency support

## Contributing

Contributions are welcome! Please ensure:
1. All tests pass: `pytest test_main.py -v`
2. Code follows PEP 8 style guide
3. New features include tests
4. API changes are documented

## License

MIT License - Feel free to use this project for personal and commercial purposes.

## Support

For issues or questions:
1. Check the API documentation at http://localhost:8000/docs
2. Review the test cases for usage examples
3. Check the sample SDK usage in `sdk/sample_usage.py`

---

Built with by v0 - Personal Finance Tracker v1.0.0
