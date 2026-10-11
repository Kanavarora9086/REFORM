from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from ..auth import get_current_user
from ..crud import get_db, create_future_message, get_future_messages

router = APIRouter(prefix="/api/future-messages", tags=["future-messages"])


def _serialize_fm(fm, payload: dict | None = None):
    """Serialize a FutureMessage ORM object to a dict with virtual fields."""
    days_remaining = None
    if fm.unlock_at:
        delta = fm.unlock_at - datetime.utcnow()
        days_remaining = max(0, delta.days)

    # If original payload had explicit 'days', return that; else compute from unlock_at
    days_val = None
    if payload and payload.get("days"):
        days_val = int(payload["days"])
    elif days_remaining is not None:
        days_val = days_remaining

    return {
        "id": fm.id,
        "content": fm.content,
        "unlock_at": fm.unlock_at.isoformat() if fm.unlock_at else None,
        "created_at": fm.created_at.isoformat() if fm.created_at else None,
        "days": days_val,
        "days_remaining": days_remaining,
        "sealed": True,  # once saved, it is always sealed
        "unlocked": days_remaining is not None and days_remaining <= 0,
    }


@router.post("")
def create(payload: dict, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    fm = create_future_message(db, current_user.id, payload)
    return _serialize_fm(fm, payload)


@router.get("")
def list_msgs(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    fms = get_future_messages(db, current_user.id)
    return [_serialize_fm(fm) for fm in fms]
