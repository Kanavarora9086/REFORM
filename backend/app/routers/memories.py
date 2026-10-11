from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..auth import get_current_user
from ..crud import get_db, create_memory, get_memories

router = APIRouter(prefix="/api/memories", tags=["memories"])


@router.post("")
def create(mem: dict, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return create_memory(db, current_user.id, mem)


@router.get("")
def list_memories(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return get_memories(db, current_user.id)
