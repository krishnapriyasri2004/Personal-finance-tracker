"""
Sample usage of the Personal Finance Tracker SDK
"""

from finance_sdk import FinanceTrackerSDK

def main():
    # Initialize SDK
    sdk = FinanceTrackerSDK(base_url="http://localhost:8000")

    print("=== Personal Finance Tracker SDK Demo ===\n")

    # Add some transactions
    print("1. Adding transactions...")
    try:
        tx1 = sdk.add_transaction(
            description="Grocery Shopping",
            amount=65.50,
            transaction_type="expense",
            category="Food"
        )
        print(f"   Added: {tx1.description} - ${tx1.amount} ({tx1.category})")

        tx2 = sdk.add_transaction(
            description="Monthly Salary",
            amount=5000.00,
            transaction_type="income",
            category="Salary"
        )
        print(f"   Added: {tx2.description} - ${tx2.amount} ({tx2.category})\n")
    except Exception as e:
        print(f"   Error adding transaction: {e}\n")

    # Get all transactions
    print("2. Fetching all transactions...")
    try:
        transactions = sdk.get_transactions()
        print(f"   Total transactions: {len(transactions)}")
        for tx in transactions[:5]:  # Show first 5
            print(f"   - {tx.description}: ${abs(tx.amount)} ({tx.category})")
        if len(transactions) > 5:
            print(f"   ... and {len(transactions) - 5} more\n")
    except Exception as e:
        print(f"   Error fetching transactions: {e}\n")

    # Get monthly summary
    print("3. Fetching monthly summary...")
    try:
        summaries = sdk.get_summary()
        for summary in summaries[:2]:  # Show first 2 months
            print(f"\n   Month: {summary.month}")
            print(f"   Income: ${summary.income_total:.2f}")
            print(f"   Expenses: ${summary.expense_total:.2f}")
            print(f"   Net: ${summary.income_total - summary.expense_total:.2f}")
            print(f"   By Category:")
            for cat in summary.by_category:
                print(f"     - {cat.category}: ${cat.total:.2f} ({cat.count} transactions)")
    except Exception as e:
        print(f"   Error fetching summary: {e}")

    # Reclassify a transaction
    print("\n4. Reclassifying a transaction...")
    try:
        transactions = sdk.get_transactions()
        if transactions:
            first_tx = transactions[0]
            reclassified = sdk.reclassify_transaction(first_tx.id, "Travel")
            print(f"   Reclassified '{first_tx.description}' from {first_tx.category} to {reclassified.category}")
    except Exception as e:
        print(f"   Error reclassifying: {e}")

    sdk.close()
    print("\n=== Demo Complete ===")

if __name__ == "__main__":
    main()
