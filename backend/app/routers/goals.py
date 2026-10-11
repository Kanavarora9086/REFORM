from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..auth import get_current_user
from ..crud import get_db, create_goal, get_goals, get_goal, update_goal, delete_goal
from ..schemas import GoalCreate, GoalUpdate, GoalOut

router = APIRouter(prefix="/api/goals", tags=["goals"])


@router.post("", response_model=GoalOut)
def create(goal: GoalCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return create_goal(db, current_user.id, goal.model_dump())


@router.get("", response_model=List[GoalOut])
def list_goals(
    completed: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_goals(db, current_user.id, completed=completed)


@router.get("/{goal_id}", response_model=GoalOut)
def get_single_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    goal = get_goal(db, current_user.id, goal_id)
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found",
        )
    return goal


@router.put("/{goal_id}", response_model=GoalOut)
def update_full_goal(
    goal_id: int,
    goal_data: GoalUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    updated = update_goal(db, current_user.id, goal_id, goal_data.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found",
        )
    return updated


@router.patch("/{goal_id}", response_model=GoalOut)
def update_partial_goal(
    goal_id: int,
    goal_data: GoalUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    updated = update_goal(db, current_user.id, goal_id, goal_data.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found",
        )
    return updated


@router.patch("/{goal_id}/complete", response_model=GoalOut)
@router.put("/{goal_id}/complete", response_model=GoalOut)
def complete_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    from datetime import datetime
    updated = update_goal(
        db,
        current_user.id,
        goal_id,
        {"completed": True, "progress": 100, "completed_at": datetime.utcnow()},
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found",
        )
    return updated


@router.delete("/{goal_id}")
def remove_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    deleted = delete_goal(db, current_user.id, goal_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found",
        )
    return {"ok": True, "id": goal_id}
