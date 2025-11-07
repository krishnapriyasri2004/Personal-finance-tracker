"""
Personal Finance Tracker Python SDK
Simple wrapper around the FastAPI backend
"""

import requests
from typing import List, Optional, Dict, Any
from dataclasses import dataclass
from datetime import datetime

@dataclass
class Transaction:
    id: int
    description: str
    amount: float
    transaction_type: str
    category: str
    auto_tagged: bool
    timestamp: datetime

    @classmethod
    def from_dict(cls, data):
        return cls(
            id=data['id'],
            description=data['description'],
            amount=data['amount'],
            transaction_type=data['transaction_type'],
            category=data['category'],
            auto_tagged=data['auto_tagged'],
            timestamp=datetime.fromisoformat(data['timestamp'].replace('Z', '+00:00'))
        )

@dataclass
class CategorySummary:
    category: str
    total: float
    count: int

    @classmethod
    def from_dict(cls, data):
        return cls(
            category=data['category'],
            total=data['total'],
            count=data['count']
        )

@dataclass
class MonthlySummary:
    month: str
    income_total: float
    expense_total: float
    by_category: List[CategorySummary]

    @classmethod
    def from_dict(cls, data):
        return cls(
            month=data['month'],
            income_total=data['income_total'],
            expense_total=data['expense_total'],
            by_category=[CategorySummary.from_dict(cat) for cat in data['by_category']]
        )

class FinanceTrackerSDK:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()

    def add_transaction(
        self,
        description: str,
        amount: float,
        transaction_type: str,
        category: Optional[str] = None
    ) -> Transaction:
        """Add a new transaction"""
        payload = {
            "description": description,
            "amount": amount,
            "transaction_type": transaction_type
        }
        if category:
            payload["category"] = category

        response = self.session.post(
            f"{self.base_url}/transactions/",
            json=payload
        )
        response.raise_for_status()
        return Transaction.from_dict(response.json())

    def get_transactions(
        self,
        month: Optional[str] = None,
        transaction_type: Optional[str] = None,
        category: Optional[str] = None
    ) -> List[Transaction]:
        """Get transactions with optional filters"""
        params = {}
        if month:
            params['month'] = month
        if transaction_type:
            params['transaction_type'] = transaction_type
        if category:
            params['category'] = category

        response = self.session.get(
            f"{self.base_url}/transactions/",
            params=params
        )
        response.raise_for_status()
        return [Transaction.from_dict(tx) for tx in response.json()]

    def get_summary(self) -> List[MonthlySummary]:
        """Get monthly income/expense summary"""
        response = self.session.get(f"{self.base_url}/transactions/summary")
        response.raise_for_status()
        return [MonthlySummary.from_dict(m) for m in response.json()]

    def delete_transaction(self, transaction_id: int) -> bool:
        """Delete a transaction"""
        response = self.session.delete(f"{self.base_url}/transactions/{transaction_id}")
        response.raise_for_status()
        return True

    def reclassify_transaction(self, transaction_id: int, category: str) -> Transaction:
        """Reclassify a transaction"""
        response = self.session.patch(
            f"{self.base_url}/transactions/{transaction_id}/reclassify",
            json={"category": category}
        )
        response.raise_for_status()
        return Transaction.from_dict(response.json())

    def close(self):
        """Close the session"""
        self.session.close()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
