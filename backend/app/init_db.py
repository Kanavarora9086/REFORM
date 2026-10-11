import argparse
from .db import engine, Base, SessionLocal
from . import models
from .crud import create_user
from .schemas import UserCreate


def init_db(demo: bool = True):
    Base.metadata.create_all(bind=engine)
    
    # Safe schema migration for SQLite without deleting data
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            conn.execute(text("PRAGMA journal_mode=WAL"))

            # --- goals table ---
            res = conn.execute(text("PRAGMA table_info(goals)"))
            existing_goals_cols = {row[1] for row in res.fetchall()}
            for col, col_type in [
                ("description", "TEXT"),
                ("target_duration", "VARCHAR"),
                ("streak", "INTEGER DEFAULT 0"),
                ("completed_at", "DATETIME"),
            ]:
                if col not in existing_goals_cols:
                    conn.execute(text(f"ALTER TABLE goals ADD COLUMN {col} {col_type}"))

            # --- unsent table ---
            res2 = conn.execute(text("PRAGMA table_info(unsent)"))
            existing_unsent_cols = {row[1] for row in res2.fetchall()}
            for col, col_type in [
                ("recipient", "VARCHAR"),
                ("archived", "BOOLEAN DEFAULT 0"),
            ]:
                if col not in existing_unsent_cols:
                    conn.execute(text(f"ALTER TABLE unsent ADD COLUMN {col} {col_type}"))

            conn.commit()
    except Exception as e:
        pass

    if demo:
        db = SessionLocal()
        existing = db.query(models.User).filter(models.User.email == "demo@reform.app").first()
        if not existing:
            u = UserCreate(email="demo@reform.app", password="demo123", name="Reform Demo")
            create_user(db, u)
        else:
            from .auth import get_password_hash
            existing.hashed_password = get_password_hash("demo123")
            db.commit()
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--demo", action="store_true", default=True)
    args = parser.parse_args()
    init_db(demo=args.demo)
