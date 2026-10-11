
from fastapi import FastAPI, Depends, APIRouter
from fastapi.middleware.cors import CORSMiddleware

from .db import engine, Base
from .core.config import settings
from .routers import auth, pulse, journal, ai
from .auth import get_current_user
from .crud import get_db
from .schemas import UserOut

app = FastAPI(title="RE:FORM")

# Local development + live Vercel frontend
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://reform-orcin.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    from .init_db import init_db
    init_db(demo=True)


# Existing API routers
app.include_router(auth.router)
app.include_router(pulse.router)
app.include_router(journal.router)
app.include_router(ai.router)

from .routers import (
    memories,
    goals,
    future_messages,
    notifications,
    unsent,
    progress,
    feedback,
)

app.include_router(memories.router)
app.include_router(goals.router)
app.include_router(future_messages.router)
app.include_router(notifications.router)
app.include_router(unsent.router)
app.include_router(progress.router)
app.include_router(feedback.router)


# Authenticated current-user endpoint
me_router = APIRouter()


@me_router.get("/api/auth/me", response_model=UserOut)
def me(current_user=Depends(get_current_user)):
    return current_user


app.include_router(me_router)
