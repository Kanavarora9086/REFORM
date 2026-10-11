from sqlalchemy.orm import Session
from . import models, schemas
from typing import Optional


def get_db():
    from .db import SessionLocal
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    from .auth import get_password_hash
    hashed = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed, name=user.name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_journal(db: Session, user_id: int, entry: schemas.JournalCreate):
    entry_text = entry.text or entry.content or ""
    db_entry = models.JournalEntry(user_id=user_id, text=entry_text, mood=entry.mood, trigger=entry.trigger)
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry


def get_journals(db: Session, user_id: int):
    return db.query(models.JournalEntry).filter(models.JournalEntry.user_id == user_id).order_by(models.JournalEntry.created_at.desc()).all()


def get_journal(db: Session, user_id: int, journal_id: int):
    return db.query(models.JournalEntry).filter(models.JournalEntry.user_id == user_id, models.JournalEntry.id == journal_id).first()


def delete_journal(db: Session, user_id: int, journal_id: int):
    j = get_journal(db, user_id, journal_id)
    if j:
        db.delete(j)
        db.commit()
    return j


def create_pulse(db: Session, user_id: int, data):
    valid_cols = {"emotion", "intensity", "energy", "loneliness", "overthinking", "contact_urge", "trigger", "text"}
    filtered = {k: v for k, v in data.items() if k in valid_cols}
    if "secondary" in data and data["secondary"]:
        sec_text = ", ".join(data["secondary"]) if isinstance(data["secondary"], list) else str(data["secondary"])
        if filtered.get("text"):
            filtered["text"] = f"{filtered['text']} [Secondary: {sec_text}]"
        else:
            filtered["text"] = f"Secondary feelings: {sec_text}"
    p = models.PulseCheckIn(user_id=user_id, **filtered)
    db.add(p)
    db.commit()
    db.refresh(p)
    return p


def get_pulse_history(db: Session, user_id: int):
    return db.query(models.PulseCheckIn).filter(models.PulseCheckIn.user_id == user_id).order_by(models.PulseCheckIn.created_at.desc()).all()


def create_memory(db: Session, user_id: int, data: dict):
    m = models.Memory(
        user_id=user_id,
        title=data.get("title"),
        description=data.get("description"),
        emotional_impact=data.get("emotional_impact") or data.get("emotion"),
        category=data.get("category"),
        status=data.get("status", "KEEP"),
        tags=data.get("tags"),
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return m


def get_memories(db: Session, user_id: int):
    return db.query(models.Memory).filter(models.Memory.user_id == user_id).order_by(models.Memory.date.desc()).all()


def create_goal(db: Session, user_id: int, data: dict):
    from datetime import datetime
    title = (data.get("title") or "").strip()
    category = data.get("category") or "Routine"
    description = data.get("description") or data.get("nextAction") or data.get("next_action")
    target_duration = data.get("target_duration") or data.get("duration") or data.get("days")
    progress = int(data.get("progress", 0))
    streak = int(data.get("streak", 0))
    completed = bool(data.get("completed", False)) or progress >= 100
    completed_at = data.get("completed_at")
    if completed and not completed_at:
        completed_at = datetime.utcnow()

    g = models.Goal(
        user_id=user_id,
        title=title,
        description=description,
        category=category,
        progress=progress,
        target_duration=str(target_duration) if target_duration else None,
        due_date=data.get("due_date"),
        streak=streak,
        completed=completed,
        completed_at=completed_at,
        created_at=datetime.utcnow(),
    )
    db.add(g)
    db.commit()
    db.refresh(g)
    return g


def get_goals(db: Session, user_id: int, completed: Optional[bool] = None):
    query = db.query(models.Goal).filter(models.Goal.user_id == user_id)
    if completed is not None:
        query = query.filter(models.Goal.completed == completed)
    return query.order_by(models.Goal.created_at.desc()).all()


def get_goal(db: Session, user_id: int, goal_id: int):
    return db.query(models.Goal).filter(models.Goal.user_id == user_id, models.Goal.id == goal_id).first()


def update_goal(db: Session, user_id: int, goal_id: int, data: dict):
    from datetime import datetime
    g = get_goal(db, user_id, goal_id)
    if not g:
        return None

    if "title" in data and data["title"] is not None:
        g.title = data["title"].strip()
    if "category" in data and data["category"] is not None:
        g.category = data["category"]
    if "description" in data:
        g.description = data["description"]
    elif "nextAction" in data:
        g.description = data["nextAction"]
    if "target_duration" in data and data["target_duration"] is not None:
        g.target_duration = str(data["target_duration"])
    if "due_date" in data:
        g.due_date = data["due_date"]
    if "streak" in data and data["streak"] is not None:
        g.streak = int(data["streak"])
    if "progress" in data and data["progress"] is not None:
        g.progress = min(100, max(0, int(data["progress"])))
        if g.progress >= 100 and not g.completed:
            g.completed = True
            g.completed_at = datetime.utcnow()

    if "completed" in data and data["completed"] is not None:
        was_completed = g.completed
        g.completed = bool(data["completed"])
        if g.completed and not was_completed:
            g.progress = 100
            g.completed_at = data.get("completed_at") or datetime.utcnow()
        elif not g.completed and was_completed:
            g.completed_at = None
            if g.progress == 100:
                g.progress = 90

    db.commit()
    db.refresh(g)
    return g


def delete_goal(db: Session, user_id: int, goal_id: int):
    g = get_goal(db, user_id, goal_id)
    if g:
        db.delete(g)
        db.commit()
    return g


def create_future_message(db: Session, user_id: int, data: dict):
    from datetime import datetime, timedelta

    def _parse_dt(val):
        """Parse a string or datetime into a Python datetime object."""
        if val is None:
            return None
        if isinstance(val, datetime):
            return val
        # Handle Z-suffix ISO strings (Python < 3.11 doesn't support it natively)
        s = str(val).strip().replace("Z", "+00:00")
        try:
            return datetime.fromisoformat(s).replace(tzinfo=None)
        except Exception:
            return None

    unlock_at = None
    if data.get("unlock_at"):
        unlock_at = _parse_dt(data["unlock_at"])
    elif data.get("unlock_date"):
        unlock_at = _parse_dt(data["unlock_date"])
    elif data.get("days"):
        unlock_at = datetime.utcnow() + timedelta(days=int(data["days"]))

    fm = models.FutureMessage(
        user_id=user_id,
        content=data.get("content"),
        unlock_at=unlock_at,
    )
    db.add(fm)
    db.commit()
    db.refresh(fm)
    return fm


def get_future_messages(db: Session, user_id: int):
    return db.query(models.FutureMessage).filter(models.FutureMessage.user_id == user_id).order_by(models.FutureMessage.unlock_at.asc()).all()


def create_notification(db: Session, user_id: int, message: str):
    n = models.Notification(user_id=user_id, message=message)
    db.add(n)
    db.commit()
    db.refresh(n)
    return n


def get_notifications(db: Session, user_id: int):
    return db.query(models.Notification).filter(models.Notification.user_id == user_id).order_by(models.Notification.created_at.desc()).all()


def mark_notification_read(db: Session, user_id: int, notification_id: int):
    n = db.query(models.Notification).filter(models.Notification.user_id == user_id, models.Notification.id == notification_id).first()
    if n:
        n.read = True
        db.commit()
    return n


def create_unsent(db: Session, user_id: int, data: dict):
    u = models.UnsentEntry(
        user_id=user_id,
        text=data.get("text"),
        category=data.get("category") or data.get("intent"),
        recipient=data.get("recipient"),
        archived=bool(data.get("archived", False)),
    )
    db.add(u)
    db.commit()
    db.refresh(u)
    return u


def get_unsent(db: Session, user_id: int):
    return db.query(models.UnsentEntry).filter(models.UnsentEntry.user_id == user_id).order_by(models.UnsentEntry.created_at.desc()).all()


def delete_unsent(db: Session, user_id: int, unsent_id: int):
    u = db.query(models.UnsentEntry).filter(
        models.UnsentEntry.user_id == user_id,
        models.UnsentEntry.id == unsent_id
    ).first()
    if u:
        db.delete(u)
        db.commit()
    return u

