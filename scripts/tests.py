import unittest
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../backend'))

from main import auto_categorize, detect_duplicate
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import TransactionModel, Base
from datetime import datetime, timedelta

class TestCategorization(unittest.TestCase):
    def test_food_category(self):
        assert auto_categorize("McDonald's lunch") == "Food"
        assert auto_categorize("Pizza from restaurant") == "Food"
        assert auto_categorize("Grocery shopping at Walmart") == "Food"
    
    def test_transport_category(self):
        assert auto_categorize("Uber ride") == "Transport"
        assert auto_categorize("Gas station fill up") == "Transport"
        assert auto_categorize("Lyft to airport") == "Transport"
    
    def test_other_category(self):
        assert auto_categorize("Random description xyz") == "Other"
    
    def test_case_insensitive(self):
        assert auto_categorize("UBER RIDE") == "Transport"
        assert auto_categorize("mcdonald's") == "Food"

class TestDuplicateDetection(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite:///:memory:")
        Base.metadata.create_all(self.engine)
        self.SessionLocal = sessionmaker(bind=self.engine)
    
    def test_duplicate_detection(self):
        db = self.SessionLocal()
        
        # Insert a transaction
        txn = TransactionModel(
            description="Test",
            amount=-50.00,
            transaction_type="expense",
            category="Food",
            auto_tagged=True
        )
        db.add(txn)
        db.commit()
        
        # Check duplicate detection
        from main import detect_duplicate
        is_duplicate = detect_duplicate(db, -50.00, "Test", "expense")
        assert is_duplicate, "Should detect duplicate"
        
        db.close()
    
    def test_no_duplicate_different_amount(self):
        db = self.SessionLocal()
        
        txn = TransactionModel(
            description="Test",
            amount=-50.00,
            transaction_type="expense",
            category="Food",
            auto_tagged=True
        )
        db.add(txn)
        db.commit()
        
        from main import detect_duplicate
        is_duplicate = detect_duplicate(db, -75.00, "Test", "expense")
        assert not is_duplicate, "Should not detect duplicate for different amount"
        
        db.close()

if __name__ == "__main__":
    unittest.main()
