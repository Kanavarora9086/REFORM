from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from .db import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    journal_entries = relationship("JournalEntry", back_populates="owner")
    pulses = relationship("PulseCheckIn", back_populates="owner")
    memories = relationship("Memory", back_populates="owner")
    goals = relationship("Goal", back_populates="owner")
    future_messages = relationship("FutureMessage", back_populates="owner")
    notifications = relationship("Notification", back_populates="owner")


class JournalEntry(Base):
    __tablename__ = "journal_entries"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    text = Column(Text, nullable=False)
    mood = Column(String, nullable=True)
    trigger = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="journal_entries")


class EmotionAnalysis(Base):
    __tablename__ = "emotion_analysis"
    id = Column(Integer, primary_key=True, index=True)
    journal_id = Column(Integer, ForeignKey("journal_entries.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    categories = Column(String)
    intensity = Column(Float, default=0.0)
    suggested = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class Reflection(Base):
    __tablename__ = "reflections"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class Goal(Base):
    __tablename__ = "goals"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=True)
    progress = Column(Integer, default=0)
    target_duration = Column(String, nullable=True)
    due_date = Column(DateTime, nullable=True)
    streak = Column(Integer, default=0)
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="goals")


class Memory(Base):
    __tablename__ = "memories"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String)
    description = Column(Text)
    date = Column(DateTime, default=datetime.utcnow)
    tags = Column(String)
    emotional_impact = Column(String)
    category = Column(String)
    status = Column(String, default="KEEP")

    owner = relationship("User", back_populates="memories")


class PulseCheckIn(Base):
    __tablename__ = "pulse"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    emotion = Column(String)
    intensity = Column(Integer, default=0)
    energy = Column(Integer, default=0)
    loneliness = Column(Integer, default=0)
    overthinking = Column(Integer, default=0)
    contact_urge = Column(Integer, default=0)
    trigger = Column(String, nullable=True)
    text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="pulses")


class FutureMessage(Base):
    __tablename__ = "future_messages"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text)
    unlock_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="future_messages")


class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(String)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="notifications")


class UnsentEntry(Base):
    __tablename__ = "unsent"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    text = Column(Text)
    category = Column(String)
    recipient = Column(String, nullable=True)
    archived = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class UserPattern(Base):
    __tablename__ = "user_patterns"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    pattern = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
