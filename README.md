# RE:FORM

> **Understand. Rebuild. Become.**  
> *A premium, cinematic, intelligent, and private emotional self-reflection product.*

---

## 🌟 Overview

**RE:FORM** is a private space designed for emotional processing, impulse control, and personal reconstruction. Unlike generic mental-health apps or standard AI chatbots, RE:FORM presents a dark, editorial, and quiet sanctuary for deep introspection without judgement or distraction.

---

## ⚡ Feature Highlights

### 🏠 **Dashboard (Home)**
- **Personalized Time-Based Greetings** ("Good evening, Traveler")
- **"How are you, really?"** daily reflection banner
- **Emotional State & Intensity Gauge** with 7-day sparkline trend
- **Core Practice Quick Actions** (Pulse, Unload, Reflect, Pause)
- **Active Rebuild Goals, Then vs Now Comparisons, & Future You Countdown Preview**

### 💓 **Pulse Check-in**
- **5-Step Multi-Stage Check-in**: Emotion → Intensity (0-10) → Secondary Feelings → Root Trigger → AI Reflection.
- **Instant AI Clarity Synthesis**: Receive non-judgmental editorial perspectives on your recorded pulse.

### ✍️ **Unload Journal**
- **Distraction-Free Editorial Writing Area**: Zen focus mode toggle, mood/trigger selectors, and real-time word counter.
- **AI Reflection Engine**: Generates thoughtful insight after saving journal entries.
- **Private Journal Vault**: Search, view, edit, or delete past journal logs.

### 🔮 **Reflect AI Companion**
- **Editorial AI Conversation Space**: Socratic, quiet dialogue designed to bring emotional clarity (not a generic chatbot).
- **Deep Prompts & Contextual Sidebar**: Built-in prompts for grief, regret, self-forgiveness, and impulse control.

### 🛑 **Pause (Impulse Intervention)**
- *"Before you do it, pause."*
- **Urge Intention Selector**: Identify underlying motives behind sudden impulses (e.g. seeking closure, loneliness, habit).
- **Working Interactive Timer & Grounding Exercise**: 30-second countdown with breathing focus and alternative actions (write unsent letter, record pulse).

### ✉️ **Unsent Letters**
- *"Say everything. Send nothing."*
- **Private Letter Vault**: Write unsent messages to an Ex-Partner, Past Self, Someone Lost, or Unspoken Friend.
- **AI Emotional-Intent Analysis**: Detects underlying emotional drivers (closure seeking, grief release, hope for connection).
- **Symbolic Release Ritual**: Permanent burn feature to symbolically let go of emotional weight.

### 🖼️ **Memories Library**
- **Categorized Emotional Artifacts**: Organize memories into `KEEP` (Treasured), `ARCHIVE` (Past Chapter), or `RELEASE` (Ritual).
- **Detail Inspection Drawer**: Track memory date, emotion tag, and personal impact notes.

### 🛠️ **Rebuild Goals**
- *"Build something that is yours."*
- **Categorized Growth Pillars**: Body, Mind, Study/Work, Social, Hobbies, Routine, Self.
- **Progress Ring Counters, Streak Indicators, & Immediate Next Actions**.

### 📊 **Progress & Analytics**
- **Recharts Emotional Intensity Line Chart**: Interactive 7D / 30D / 90D timeline metrics.
- **Key Metrics Tracking**: Overthinking Index, Contact Urge frequency, and Self-Focus growth score.
- **Milestone Achievements & Then vs Now Comparison Timeline**.

### ⌛ **Future You Time Capsules**
- *"Leave something for the person you're becoming."*
- **Time-Locked Messages**: Write letters to your future self locked for 30, 60, or 90 days.
- **Countdown Reveal Modal**: Sealed until the precise unlock date.

### 🔒 **Privacy, Settings & Notifications**
- **Zero AI Model Training**: Data is processed transiently and never ingested into public models.
- **Full Data Export**: Export all journals, pulses, goals, and unsent drafts as a JSON archive.
- **Grouped Settings & System Notifications**.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS + Vanilla CSS Design Tokens
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Routing**: React Router v6

### **Backend**
- **Framework**: FastAPI (Python 3.10+)
- **Database**: SQLite (default) / PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Web Server**: Uvicorn

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+
- **Python**: 3.10+

---

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python -m app.init_db

# Run FastAPI dev server
uvicorn app.main:app --reload --port 8000
```

*The backend server will run at `http://localhost:8000`.*

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

*The frontend application will run at `http://localhost:5173`.*

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` in the root directory:

```env
# API Server Configuration
VITE_API_URL=http://localhost:8000

# Optional AI Provider Configuration (Default: Mock AI Provider)
AI_PROVIDER=mock
OPENAI_API_KEY=your_openai_api_key_here
```

---

## 📁 Repository Structure

```
reform/
├── backend/
│   ├── app/
│   │   ├── core/           # App configuration & security
│   │   ├── routers/        # FastAPI endpoint routers (pulse, journal, ai, unsent, etc.)
│   │   ├── services/       # AI service integrations
│   │   ├── crud.py         # Database query logic
│   │   ├── models.py       # SQLAlchemy database models
│   │   └── main.py         # FastAPI main app entrypoint
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/     # AppLayout, Sidebar, MobileNav
│   │   │   └── ui/         # Button, Card, Modal, Drawer, Tabs, Slider, AIMessage, etc.
│   │   ├── pages/          # Home, Pulse, Unload, Reflect, Pause, Unsent, Memories, etc.
│   │   ├── services/       # AuthProvider & API Client with localStorage sync
│   │   ├── styles.css      # CSS variables, glassmorphism, scrollbars
│   │   ├── App.tsx         # Route definitions & protected layout
│   │   └── main.tsx        # React entrypoint
│   ├── tailwind.config.cjs # Theme colors & typography extensions
│   ├── index.html          # Google Fonts & document head
│   └── package.json
└── README.md
```

---

## 🛡️ License & Privacy Commitment

RE:FORM is built with privacy at its core. User reflections, journals, and unsent drafts are encrypted and strictly belong to the user.
