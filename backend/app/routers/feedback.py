from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..crud import get_db
from ..auth import get_current_user

router = APIRouter(prefix="/api/feedback", tags=["feedback"])


@router.post("")
def submit(payload: dict, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    # store feedback in Feedback model
    from ..models import Feedback
    f = Feedback(user_id=current_user.id if current_user else None, message=payload.get('message'))
    db.add(f)
    db.commit()
    db.refresh(f)
    return {"status":"ok"}
