from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..auth import get_current_user
from ..crud import get_db
from ..services.ai_service import ai_service

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.post("/analyze")
def analyze(payload: dict, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    text = payload.get("text", "")
    return ai_service.analyze_entry(text)


@router.post("/reflect")
def reflect(payload: dict, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    prompt = payload.get("prompt") or payload.get("text") or ""
    return ai_service.generate_reflection(prompt)


@router.post("/pause")
def pause(payload: dict, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    statement = payload.get("statement") or payload.get("text") or payload.get("prompt") or ""
    return ai_service.analyze_pause(statement)

