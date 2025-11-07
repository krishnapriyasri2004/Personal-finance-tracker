from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List, Optional
import os

# Database Setup
DATABASE_URL = "sqlite:///./finance.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# FastAPI App
app = FastAPI(title="Personal Finance Tracker API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Models
class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    transaction_type = Column(String, nullable=False)  # 'income' or 'expense'
    category = Column(String, nullable=True)
    auto_tagged = Column(Boolean, default=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# Pydantic Models
class TransactionCreate(BaseModel):
    description: str
    amount: float
    transaction_type: str  # 'income' or 'expense'
    category: Optional[str] = None

class TransactionUpdate(BaseModel):
    category: str

class TransactionResponse(BaseModel):
    id: int
    description: str
    amount: float
    transaction_type: str
    category: str
    auto_tagged: bool
    timestamp: datetime

    class Config:
        from_attributes = True

class SummaryItem(BaseModel):
    category: str
    total: float
    count: int

class MonthlySummary(BaseModel):
    month: str
    income_total: float
    expense_total: float
    by_category: List[SummaryItem]

# Auto-categorization logic
CATEGORY_MAP = {
    "Food": ["mcdonald", "burger", "pizza", "starbucks", "coffee", "restaurant", "uber eats", "grubhub", "food"],
    "Transport": ["uber", "lyft", "gas", "parking", "transit", "metro", "taxi", "transit", "fuel"],
    "Entertainment": ["netflix", "spotify", "movie", "gaming", "steam", "playstation", "xbox", "cinema"],
    "Utilities": ["electric", "water", "internet", "phone", "gas bill", "electricity"],
    "Rent": ["rent", "mortgage", "landlord", "lease"],
    "Salary": ["salary", "paycheck", "wages", "income", "bonus"],
    "Shopping": ["amazon", "mall", "store", "shop", "retail", "clothing"],
    "Health": ["pharmacy", "doctor", "hospital", "medical", "gym", "health"],
}

def auto_categorize(description: str, transaction_type: str) -> str:
    """Auto-categorize transactions based on description"""
    desc_lower = description.lower()
    
    for category, keywords in CATEGORY_MAP.items():
        if any(keyword in desc_lower for keyword in keywords):
            return category
    
    # Default categorization by type
    return "Salary" if transaction_type == "income" else "Other"

def detect_duplicate(db: Session, description: str, amount: float, transaction_type: str) -> bool:
    """Detect duplicate transactions within 1 hour"""
    one_hour_ago = datetime.utcnow() - timedelta(hours=1)
    duplicate = db.query(Transaction).filter(
        Transaction.description == description,
        Transaction.amount == amount,
        Transaction.transaction_type == transaction_type,
        Transaction.timestamp >= one_hour_ago
    ).first()
    return duplicate is not None

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# API Endpoints
@app.post("/transactions/", response_model=TransactionResponse)
def create_transaction(transaction: TransactionCreate, db: Session = next(get_db())):
    """Add a new transaction with auto-categorization"""
    
    # Validate transaction type
    if transaction.transaction_type not in ["income", "expense"]:
        raise HTTPException(status_code=400, detail="transaction_type must be 'income' or 'expense'")
    
    # Check for duplicates
    if detect_duplicate(db, transaction.description, transaction.amount, transaction.transaction_type):
        raise HTTPException(status_code=400, detail="Duplicate transaction detected")
    
    # Auto-categorize if not provided
    if transaction.category:
        category = transaction.category
        auto_tagged = False
    else:
        category = auto_categorize(transaction.description, transaction.transaction_type)
        auto_tagged = True
    
    # Store negative values for expenses
    amount = abs(transaction.amount)
    if transaction.transaction_type == "expense":
        amount = -amount
    
    db_transaction = Transaction(
        description=transaction.description,
        amount=amount,
        transaction_type=transaction.transaction_type,
        category=category,
        auto_tagged=auto_tagged
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.get("/transactions/", response_model=List[TransactionResponse])
def get_transactions(
    month: Optional[str] = None,
    transaction_type: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = next(get_db())
):
    """Get all transactions with optional filters"""
    query = db.query(Transaction)
    
    if month:  # Format: 'YYYY-MM'
        query = query.filter(func.strftime("%Y-%m", Transaction.timestamp) == month)
    if transaction_type:
        query = query.filter(Transaction.transaction_type == transaction_type)
    if category:
        query = query.filter(Transaction.category == category)
    
    return query.order_by(Transaction.timestamp.desc()).all()

@app.get("/transactions/summary", response_model=List[MonthlySummary])
def get_summary(db: Session = next(get_db())):
    """Get monthly income/expense summary grouped by category"""
    transactions = db.query(Transaction).all()
    
    summary_dict = {}
    for tx in transactions:
        month_key = tx.timestamp.strftime("%Y-%m")
        if month_key not in summary_dict:
            summary_dict[month_key] = {
                "income_total": 0,
                "expense_total": 0,
                "by_category": {}
            }
        
        category = tx.category or "Other"
        amount = abs(tx.amount)
        
        if tx.transaction_type == "income":
            summary_dict[month_key]["income_total"] += amount
            if category not in summary_dict[month_key]["by_category"]:
                summary_dict[month_key]["by_category"][category] = {"total": 0, "count": 0}
            summary_dict[month_key]["by_category"][category]["total"] += amount
            summary_dict[month_key]["by_category"][category]["count"] += 1
        else:
            summary_dict[month_key]["expense_total"] += amount
            if category not in summary_dict[month_key]["by_category"]:
                summary_dict[month_key]["by_category"][category] = {"total": 0, "count": 0}
            summary_dict[month_key]["by_category"][category]["total"] += amount
            summary_dict[month_key]["by_category"][category]["count"] += 1
    
    result = []
    for month, data in sorted(summary_dict.items(), reverse=True):
        by_category = [
            SummaryItem(category=cat, total=info["total"], count=info["count"])
            for cat, info in data["by_category"].items()
        ]
        result.append(MonthlySummary(
            month=month,
            income_total=data["income_total"],
            expense_total=data["expense_total"],
            by_category=by_category
        ))
    
    return result

@app.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = next(get_db())):
    """Delete a transaction"""
    db_transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    db.delete(db_transaction)
    db.commit()
    return {"message": "Transaction deleted"}

@app.patch("/transactions/{transaction_id}/reclassify", response_model=TransactionResponse)
def reclassify_transaction(transaction_id: int, update: TransactionUpdate, db: Session = next(get_db())):
    """Manually reclassify a transaction"""
    db_transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    db_transaction.category = update.category
    db_transaction.auto_tagged = False
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.get("/")
def root():
    return {"message": "Personal Finance Tracker API", "docs": "/docs"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
