from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..crud import get_db
from ..auth import get_current_user
from ..services.ai_service import ai_service

router = APIRouter(prefix="/api/journal", tags=["journal"])


@router.post("", response_model=schemas.JournalOut)
def create_journal(entry: schemas.JournalCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    j = crud.create_journal(db, current_user.id, entry)
    entry_text = entry.text or entry.content or ""
    if entry_text.strip():
        try:
            analysis = ai_service.analyze_entry(entry_text)
        except Exception as e:
            # Auxiliary tagging failure should not prevent journal persistence
            pass
    return j


@router.get("", response_model=list[schemas.JournalOut])
def list_journal(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return crud.get_journals(db, current_user.id)


@router.get("/{journal_id}", response_model=schemas.JournalOut)
def get_journal(journal_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    j = crud.get_journal(db, current_user.id, journal_id)
    if not j:
        raise HTTPException(status_code=404, detail="Not found")
    return j


@router.delete("/{journal_id}")
def delete_journal(journal_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    j = crud.delete_journal(db, current_user.id, journal_id)
    if not j:
        raise HTTPException(status_code=404, detail="Not found")
    return {"status": "deleted"}
