import pytest
from fastapi.testclient import TestClient
from main import app, SessionLocal, Transaction, Base, engine
from sqlalchemy import text

# Create test database
@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db):
    return TestClient(app)

class TestTransactionCreation:
    def test_add_expense_transaction(self, client):
        """Test adding an expense transaction"""
        response = client.post("/transactions/", json={
            "description": "McDonald's",
            "amount": 12.50,
            "transaction_type": "expense"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["description"] == "McDonald's"
        assert data["amount"] == -12.50  # Should be negative for expenses
        assert data["category"] == "Food"  # Should be auto-categorized
        assert data["auto_tagged"] == True

    def test_add_income_transaction(self, client):
        """Test adding an income transaction"""
        response = client.post("/transactions/", json={
            "description": "Monthly Salary",
            "amount": 5000.00,
            "transaction_type": "income"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["amount"] == 5000.00  # Should be positive for income
        assert data["category"] == "Salary"
        assert data["transaction_type"] == "income"

    def test_invalid_transaction_type(self, client):
        """Test adding transaction with invalid type"""
        response = client.post("/transactions/", json={
            "description": "Test",
            "amount": 10.00,
            "transaction_type": "invalid"
        })
        assert response.status_code == 400
        assert "transaction_type must be" in response.json()["detail"]

    def test_manual_categorization(self, client):
        """Test manually categorizing a transaction"""
        response = client.post("/transactions/", json={
            "description": "Some description",
            "amount": 25.00,
            "transaction_type": "expense",
            "category": "Transport"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["category"] == "Transport"
        assert data["auto_tagged"] == False

class TestAutoCategorization:
    def test_food_categorization(self, client):
        """Test auto-categorization for food"""
        test_cases = [
            "McDonald's burger",
            "Starbucks coffee",
            "Pizza restaurant",
            "Uber Eats order"
        ]
        for description in test_cases:
            response = client.post("/transactions/", json={
                "description": description,
                "amount": 10.00,
                "transaction_type": "expense"
            })
            assert response.status_code == 200
            assert response.json()["category"] == "Food"

    def test_transport_categorization(self, client):
        """Test auto-categorization for transport"""
        test_cases = ["Uber ride", "Gas station", "Metro pass", "Taxi"]
        for description in test_cases:
            response = client.post("/transactions/", json={
                "description": description,
                "amount": 15.00,
                "transaction_type": "expense"
            })
            assert response.status_code == 200
            assert response.json()["category"] == "Transport"

class TestDuplicateDetection:
    def test_duplicate_detection(self, client):
        """Test duplicate transaction detection"""
        # Add first transaction
        response1 = client.post("/transactions/", json={
            "description": "Test duplicate",
            "amount": 25.00,
            "transaction_type": "expense"
        })
        assert response1.status_code == 200

        # Try to add duplicate within 1 hour
        response2 = client.post("/transactions/", json={
            "description": "Test duplicate",
            "amount": 25.00,
            "transaction_type": "expense"
        })
        assert response2.status_code == 400
        assert "Duplicate transaction detected" in response2.json()["detail"]

    def test_different_amount_not_duplicate(self, client):
        """Test that different amounts are not flagged as duplicate"""
        client.post("/transactions/", json={
            "description": "Test",
            "amount": 25.00,
            "transaction_type": "expense"
        })

        response = client.post("/transactions/", json={
            "description": "Test",
            "amount": 26.00,
            "transaction_type": "expense"
        })
        assert response.status_code == 200

class TestTransactionRetrieval:
    def test_get_all_transactions(self, client):
        """Test retrieving all transactions"""
        # Add some transactions
        client.post("/transactions/", json={
            "description": "Expense 1",
            "amount": 10.00,
            "transaction_type": "expense"
        })
        client.post("/transactions/", json={
            "description": "Income 1",
            "amount": 100.00,
            "transaction_type": "income"
        })

        response = client.get("/transactions/")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2

    def test_filter_by_type(self, client):
        """Test filtering transactions by type"""
        client.post("/transactions/", json={
            "description": "Expense",
            "amount": 10.00,
            "transaction_type": "expense"
        })
        client.post("/transactions/", json={
            "description": "Income",
            "amount": 100.00,
            "transaction_type": "income"
        })

        response = client.get("/transactions/?transaction_type=expense")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["transaction_type"] == "expense"

    def test_filter_by_category(self, client):
        """Test filtering transactions by category"""
        client.post("/transactions/", json={
            "description": "McDonald's",
            "amount": 12.00,
            "transaction_type": "expense"
        })
        client.post("/transactions/", json={
            "description": "Rent payment",
            "amount": 1000.00,
            "transaction_type": "expense"
        })

        response = client.get("/transactions/?category=Food")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["category"] == "Food"

class TestTransactionDeletion:
    def test_delete_transaction(self, client):
        """Test deleting a transaction"""
        # Add a transaction
        response = client.post("/transactions/", json={
            "description": "Delete me",
            "amount": 10.00,
            "transaction_type": "expense"
        })
        tx_id = response.json()["id"]

        # Delete it
        response = client.delete(f"/transactions/{tx_id}")
        assert response.status_code == 200

        # Verify it's gone
        response = client.get("/transactions/")
        assert len(response.json()) == 0

    def test_delete_nonexistent_transaction(self, client):
        """Test deleting a nonexistent transaction"""
        response = client.delete("/transactions/999")
        assert response.status_code == 404

class TestReclassification:
    def test_reclassify_transaction(self, client):
        """Test reclassifying a transaction"""
        # Add auto-tagged transaction
        response = client.post("/transactions/", json={
            "description": "McDonald's",
            "amount": 12.00,
            "transaction_type": "expense"
        })
        tx_id = response.json()["id"]
        assert response.json()["category"] == "Food"

        # Reclassify it
        response = client.patch(f"/transactions/{tx_id}/reclassify", json={
            "category": "Entertainment"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["category"] == "Entertainment"
        assert data["auto_tagged"] == False

class TestMonthlySummary:
    def test_monthly_summary(self, client):
        """Test getting monthly summary"""
        # Add transactions
        client.post("/transactions/", json={
            "description": "McDonald's",
            "amount": 12.00,
            "transaction_type": "expense"
        })
        client.post("/transactions/", json={
            "description": "Salary",
            "amount": 3000.00,
            "transaction_type": "income"
        })

        response = client.get("/transactions/summary")
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1

        summary = data[0]
        assert summary["income_total"] == 3000.00
        assert summary["expense_total"] == 12.00

    def test_summary_by_category(self, client):
        """Test summary breakdown by category"""
        client.post("/transactions/", json={
            "description": "McDonald's",
            "amount": 12.00,
            "transaction_type": "expense"
        })
        client.post("/transactions/", json={
            "description": "Burger King",
            "amount": 15.00,
            "transaction_type": "expense"
        })

        response = client.get("/transactions/summary")
        data = response.json()
        
        food_items = [cat for cat in data[0]["by_category"] if cat["category"] == "Food"]
        assert len(food_items) > 0
        assert food_items[0]["total"] == 27.00
        assert food_items[0]["count"] == 2
