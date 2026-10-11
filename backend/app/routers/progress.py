from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from ..auth import get_current_user
from ..crud import get_db, get_pulse_history, get_goals, get_journals

router = APIRouter(prefix="/api/progress", tags=["progress"])


@router.get("")
def progress_overview(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """Comprehensive progress metrics calculated strictly from real database activity."""
    goals = get_goals(db, current_user.id)
    pulses = get_pulse_history(db, current_user.id)
    journals = get_journals(db, current_user.id)

    total_goals = len(goals)
    active_goals = [g for g in goals if not g.completed]
    completed_goals = [g for g in goals if g.completed]

    completion_percentage = 0
    if total_goals > 0:
        completion_percentage = round((len(completed_goals) / total_goals) * 100)

    # Real streak calculation:
    # Use max real streak recorded on active/completed goals
    real_streak = 0
    if goals:
        real_streak = max([g.streak or 0 for g in goals], default=0)

    # Emotional pulse analytics (ONLY if user actually logged pulses)
    has_pulses = len(pulses) > 0
    avg_intensity = None
    avg_overthinking = None
    avg_urge = None
    first_pulse_data = None
    latest_pulse_data = None

    if has_pulses:
        # pulses are ordered by created_at desc in crud.py
        latest_pulse = pulses[0]
        first_pulse = pulses[-1]

        avg_intensity = round(sum(p.intensity or 0 for p in pulses) / len(pulses), 1)
        avg_overthinking = round(sum(p.overthinking or 0 for p in pulses) / len(pulses), 1)
        avg_urge = round(sum(p.contact_urge or 0 for p in pulses) / len(pulses), 1)

        first_pulse_data = {
            "id": first_pulse.id,
            "emotion": first_pulse.emotion,
            "intensity": first_pulse.intensity or 0,
            "overthinking": first_pulse.overthinking or 0,
            "contact_urge": first_pulse.contact_urge or 0,
            "date": first_pulse.created_at.isoformat() if first_pulse.created_at else None,
        }

        latest_pulse_data = {
            "id": latest_pulse.id,
            "emotion": latest_pulse.emotion,
            "intensity": latest_pulse.intensity or 0,
            "overthinking": latest_pulse.overthinking or 0,
            "contact_urge": latest_pulse.contact_urge or 0,
            "date": latest_pulse.created_at.isoformat() if latest_pulse.created_at else None,
        }

    # Completed milestones list
    completed_milestones = [
        {
            "id": g.id,
            "title": g.title,
            "category": g.category,
            "description": g.description,
            "target_duration": g.target_duration,
            "streak": g.streak or 0,
            "completed_at": g.completed_at.isoformat() if g.completed_at else (g.created_at.isoformat() if g.created_at else None),
            "created_at": g.created_at.isoformat() if g.created_at else None,
        }
        for g in completed_goals
    ]

    active_milestones = [
        {
            "id": g.id,
            "title": g.title,
            "category": g.category,
            "description": g.description,
            "target_duration": g.target_duration,
            "progress": g.progress or 0,
            "streak": g.streak or 0,
            "created_at": g.created_at.isoformat() if g.created_at else None,
        }
        for g in active_goals
    ]

    recent_pulses = [
        {
            "id": p.id,
            "emotion": p.emotion or "",
            "intensity": p.intensity or 0,
            "energy": p.energy or 0,
            "loneliness": p.loneliness or 0,
            "overthinking": p.overthinking or 0,
            "contact_urge": p.contact_urge or 0,
            "trigger": p.trigger,
            "text": p.text,
            "created_at": p.created_at.isoformat() if p.created_at else None,
        }
        for p in pulses[:5]
    ]

    return {
        "has_goals": total_goals > 0,
        "has_pulses": has_pulses,
        "has_journals": len(journals) > 0,
        "total_goals": total_goals,
        "active_goals_count": len(active_goals),
        "completed_goals_count": len(completed_goals),
        "completion_percentage": completion_percentage,
        "current_streak": real_streak,
        "completed_milestones": completed_milestones,
        "active_goals": active_milestones,
        "pulse_count": len(pulses),
        "journal_count": len(journals),
        "avg_intensity": avg_intensity,
        "avg_overthinking": avg_overthinking,
        "avg_urge": avg_urge,
        "first_pulse": first_pulse_data,
        "latest_pulse": latest_pulse_data,
        "count": len(pulses),
        "recent": recent_pulses,
    }


@router.get("/trends")
def trends(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """Returns chronological trends strictly from actual pulse check-ins."""
    entries = get_pulse_history(db, current_user.id)
    if not entries:
        return []

    # Chronological order (oldest to newest)
    selected = list(reversed(entries[:90]))
    return [
        {
            "t": e.created_at.isoformat() if e.created_at else "",
            "day": e.created_at.strftime("%a") if e.created_at else "",
            "date": e.created_at.strftime("%b %d") if e.created_at else "",
            "intensity": e.intensity or 0,
            "overthinking": e.overthinking or 0,
            "contact_urge": e.contact_urge or 0,
            "urge": e.contact_urge or 0,
            "energy": e.energy or 0,
            "loneliness": e.loneliness or 0,
            "emotion": e.emotion or "",
        }
        for e in selected
    ]


@router.get("/summary")
def short(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return {"note": "Real-time summary derived from user database records."}
