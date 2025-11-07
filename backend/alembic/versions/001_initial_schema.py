"""Initial schema

Revision ID: 001
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

def upgrade() -> None:
    op.create_table(
        'transactions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('description', sa.String(), nullable=False),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('transaction_type', sa.String(), nullable=False),
        sa.Column('category', sa.String(), nullable=True),
        sa.Column('auto_tagged', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('timestamp', sa.DateTime(), nullable=False, server_default=sa.func.current_timestamp()),
        sa.PrimaryKeyConstraint('id'),
        sa.CheckConstraint("transaction_type IN ('income', 'expense')"),
    )
    op.create_index(op.f('ix_transactions_id'), 'transactions', ['id'], unique=False)

def downgrade() -> None:
    op.drop_table('transactions')
