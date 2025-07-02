"""Enable RLS on posts

Revision ID: 233ab7505675
Revises: 04e88d00e32d
Create Date: 2025-07-02 17:26:16.316150

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '233ab7505675'
down_revision: Union[str, Sequence[str], None] = '04e88d00e32d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Enable RLS on posts
    op.execute("ALTER TABLE posts ENABLE ROW LEVEL SECURITY;")
    op.execute("ALTER TABLE posts FORCE ROW LEVEL SECURITY;")

    # Policy: allow anyone to SELECT all posts
    op.execute("""
        CREATE POLICY posts_select_all ON posts
        FOR SELECT
        USING (true);
    """)

    # Policy: only allow owners to SELECT/UPDATE/DELETE their rows
    op.execute("""
        CREATE POLICY posts_owner_policy ON posts
        FOR ALL
        USING (owner_id = current_setting('app.user_id', true)::integer)
        WITH CHECK (owner_id = current_setting('app.user_id', true)::integer);
    """)


def downgrade() -> None:
    op.execute("DROP POLICY IF EXISTS posts_owner_policy ON posts;")
    op.execute("DROP POLICY IF EXISTS posts_select_all ON posts;")
    op.execute("ALTER TABLE posts DISABLE ROW LEVEL SECURITY;")


