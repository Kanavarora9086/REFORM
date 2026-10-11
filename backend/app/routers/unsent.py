from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..auth import get_current_user
from ..crud import get_db, create_unsent, get_unsent, delete_unsent

router = APIRouter(prefix="/api/unsent", tags=["unsent"])


@router.post("")
def create(payload: dict, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return create_unsent(db, current_user.id, payload)


@router.get("")
def list_unsent(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return get_unsent(db, current_user.id)


@router.delete("/{unsent_id}")
def remove_unsent(unsent_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    deleted = delete_unsent(db, current_user.id, unsent_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Letter not found")
    return {"detail": "Deleted"}

