from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..auth import get_current_user
from ..crud import get_db, get_notifications, mark_notification_read

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("")
def list_notifications(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return get_notifications(db, current_user.id)


@router.put("/{id}/read")
def mark_read(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return mark_notification_read(db, current_user.id, id)
