import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), '../backend/finance.db')

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create transactions table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        transaction_type TEXT CHECK (transaction_type IN ('income', 'expense')) NOT NULL,
        category TEXT,
        auto_tagged BOOLEAN NOT NULL DEFAULT 1,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
''')

# Insert seed data
seed_data = [
    ("McDonald's Breakfast", -15.50, 'expense', 'Food', 1),
    ("Monthly Salary", 5000.00, 'income', 'Salary', 1),
    ("Uber to Office", -12.75, 'expense', 'Transport', 1),
    ("Walmart Groceries", -85.30, 'expense', 'Food', 1),
    ("Rent Payment", -1500.00, 'expense', 'Rent', 1),
    ("Netflix Subscription", -15.99, 'expense', 'Entertainment', 1),
    ("Gas Station", -50.00, 'expense', 'Transport', 1),
    ("Coffee Shop", -5.50, 'expense', 'Food', 1),
    ("Freelance Work", 500.00, 'income', 'Salary', 1),
    ("Electric Bill", -120.00, 'expense', 'Utilities', 1),
]

for desc, amount, txn_type, category, auto_tagged in seed_data:
    cursor.execute(
        'INSERT INTO transactions (description, amount, transaction_type, category, auto_tagged) VALUES (?, ?, ?, ?, ?)',
        (desc, amount, txn_type, category, auto_tagged)
    )

conn.commit()
conn.close()
print("Database initialized successfully!")
