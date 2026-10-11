from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..crud import get_db
from ..auth import get_current_user
from ..services.ai_service import ai_service

router = APIRouter(prefix="/api/pulse", tags=["pulse"])


@router.post("", response_model=schemas.PulseOut)
def record_pulse(payload: schemas.PulseCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    data = payload.dict()
    p = crud.create_pulse(db, current_user.id, data)
    if payload.text and payload.text.strip():
        try:
            ai_service.analyze_emotion(payload.text)
        except Exception as e:
            # Auxiliary analysis outage should never block pulse check-in recording
            pass
    return p


@router.get("/history", response_model=list[schemas.PulseOut])
def history(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return crud.get_pulse_history(db, current_user.id)
