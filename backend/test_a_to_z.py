import sys
import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def run_tests():
    print("=" * 60)
    print("STARTING RE:FORM A-TO-Z COMPREHENSIVE TEST SUITE")
    print("=" * 60)

    # 1. AUTHENTICATION & DEMO USER (Bug #11)
    print("\n--- 1. Testing Auth & Demo User ---")
    demo_res = client.post("/api/auth/login", json={"email": "demo@reform.app", "password": "demo123"})
    assert demo_res.status_code == 200, f"Demo login failed: {demo_res.text}"
    demo_token = demo_res.json().get("access_token")
    assert demo_token, "No access token for demo user"
    print(" [PASS] Demo login successful with demo123 (Bug #11 verified)")

    # Test Registration
    unique_email = f"test_{uuid.uuid4().hex[:8]}@reform.app"
    test_password = "SecurePassword456!"
    reg_res = client.post("/api/auth/register", json={
        "email": unique_email,
        "password": test_password,
        "name": "AtoZ Tester"
    })
    assert reg_res.status_code == 200, f"Register failed: {reg_res.text}"
    user_data = reg_res.json()
    assert user_data["email"] == unique_email
    print(f" [PASS] User registration: {unique_email}")

    # Test Duplicate Registration
    dup_res = client.post("/api/auth/register", json={
        "email": unique_email,
        "password": test_password,
        "name": "AtoZ Tester"
    })
    assert dup_res.status_code == 400, "Duplicate email should return 400"
    print(" [PASS] Duplicate registration rejected with 400")

    # Test Login with new user
    login_res = client.post("/api/auth/login", json={"email": unique_email, "password": test_password})
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print(" [PASS] Login with newly created user")

    # Test Wrong Password
    bad_login = client.post("/api/auth/login", json={"email": unique_email, "password": "wrongpassword"})
    assert bad_login.status_code in [400, 401], f"Wrong password should fail: {bad_login.status_code}"
    print(" [PASS] Invalid password rejected")

    # Test /api/auth/me
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == unique_email
    print(" [PASS] /api/auth/me retrieved authenticated user profile")

    # Test Malformed Token (Bug #4: ValueError / TypeError / JWTError handling)
    bad_token_res = client.get("/api/auth/me", headers={"Authorization": "Bearer invalid.token.payload"})
    assert bad_token_res.status_code == 401, f"Expected 401 on bad token, got {bad_token_res.status_code}"
    print(" [PASS] Malformed token gracefully handled with 401 (Bug #4 verified)")

    # 2. PULSE SYSTEM & SCHEMAS (Bug #9)
    print("\n--- 2. Testing Pulse System & Schemas (Bug #9) ---")
    pulse_payload = {
        "emotion": "Anxiety",
        "intensity": 7,
        "energy": 4,
        "loneliness": 6,
        "overthinking": 8,
        "contact_urge": 5,
        "trigger": "Late night reflection",
        "text": "Feeling an urge to reach out but staying centered."
    }
    create_pulse_res = client.post("/api/pulse", json=pulse_payload, headers=headers)
    assert create_pulse_res.status_code == 200, f"Create pulse failed: {create_pulse_res.text}"
    p_data = create_pulse_res.json()
    assert p_data["emotion"] == "Anxiety"
    assert p_data["intensity"] == 7
    assert p_data["overthinking"] == 8
    assert p_data["contact_urge"] == 5
    assert p_data["trigger"] == "Late night reflection"
    print(" [PASS] Pulse check-in created with all fields (Bug #9 verified)")

    # Get pulse history
    hist_res = client.get("/api/pulse/history", headers=headers)
    assert hist_res.status_code == 200
    hist = hist_res.json()
    assert len(hist) >= 1
    assert hist[0]["trigger"] == "Late night reflection"
    assert hist[0]["overthinking"] == 8
    print(" [PASS] Pulse history contains full schema fields")

    # 3. JOURNAL & AI REFLECTION (Bug #6, #7, #8)
    print("\n--- 3. Testing Journal & AI Services (Bug #6, #7, #8) ---")
    journal_payload = {
        "text": "Today I spent time reading and went for a long walk. Focusing on my own progress.",
        "mood": "Calm",
        "trigger": "Quiet evening"
    }
    j_res = client.post("/api/journal", json=journal_payload, headers=headers)
    assert j_res.status_code == 200, f"Create journal failed: {j_res.text}"
    j_data = j_res.json()
    assert j_data["text"] == journal_payload["text"]
    print(" [PASS] Journal entry created")

    j_list_res = client.get("/api/journal", headers=headers)
    assert j_list_res.status_code == 200
    assert len(j_list_res.json()) >= 1
    print(" [PASS] Journal entries listed")

    # AI Reflect endpoint
    reflect_res = client.post("/api/ai/reflect", json={
        "text": "I feel an overwhelming wave of sadness when thinking about the past, but I took deep breaths."
    }, headers=headers)
    assert reflect_res.status_code == 200, f"AI reflect failed: {reflect_res.text}"
    ref_data = reflect_res.json()
    assert "insights" in ref_data or "analysis" in ref_data or "primary_emotion" in ref_data or "distortions" in ref_data
    print(" [PASS] /api/ai/reflect returned structured cognitive analysis")

    # AI Pause endpoint (Bug #6)
    pause_res = client.post("/api/ai/pause", json={
        "text": "I was about to send a text asking how they are doing."
    }, headers=headers)
    assert pause_res.status_code == 200, f"AI pause failed: {pause_res.text}"
    pause_data = pause_res.json()
    assert "guidance" in pause_data or "intervention" in pause_data or "reflection" in pause_data
    print(" [PASS] /api/ai/pause returned impulse intervention (Bug #6 verified)")

    # 4. UNSENT LETTERS & DELETE (Bug #1, #5)
    print("\n--- 4. Testing Unsent Letters & Delete (Bug #1, #5) ---")
    unsent_payload = {
        "text": "Words left unsaid that I am finally releasing into the void.",
        "recipient": "Past Partner",
        "intent": "Closure"
    }
    u_res = client.post("/api/unsent", json=unsent_payload, headers=headers)
    assert u_res.status_code == 200, f"Create unsent failed: {u_res.text}"
    u_data = u_res.json()
    unsent_id = u_data["id"]
    assert u_data["recipient"] == "Past Partner"
    print(f" [PASS] Unsent letter created with explicit mapping id={unsent_id} (Bug #1 verified)")

    # List unsent
    u_list = client.get("/api/unsent", headers=headers)
    assert u_list.status_code == 200
    assert any(x["id"] == unsent_id for x in u_list.json())
    print(" [PASS] Unsent letters listed")

    # Delete unsent (Bug #5)
    del_res = client.delete(f"/api/unsent/{unsent_id}", headers=headers)
    assert del_res.status_code == 200, f"Delete unsent failed: {del_res.text}"
    print(f" [PASS] Unsent letter id={unsent_id} deleted (Bug #5 verified)")

    # Verify deleted
    u_list_after = client.get("/api/unsent", headers=headers)
    assert not any(x["id"] == unsent_id for x in u_list_after.json())
    print(" [PASS] Deleted unsent letter verified removed from list")

    # 5. MEMORIES (Bug #1, #3)
    print("\n--- 5. Testing Memories (Bug #1, #3) ---")
    memory_payload = {
        "title": "Summer Concert Ticket",
        "description": "Found the old ticket stub in my winter coat pocket.",
        "emotion": "Bittersweet",
        "status": "RELEASE",
        "date": "2026-09-27"
    }
    mem_res = client.post("/api/memories", json=memory_payload, headers=headers)
    assert mem_res.status_code == 200, f"Create memory failed: {mem_res.text}"
    mem_data = mem_res.json()
    assert mem_data["title"] == "Summer Concert Ticket"
    assert mem_data["status"] == "RELEASE"
    print(" [PASS] Memory created with frontend mapping (Bug #1, #3 verified)")

    mem_list = client.get("/api/memories", headers=headers)
    assert mem_list.status_code == 200
    assert len(mem_list.json()) >= 1
    print(" [PASS] Memories listed from backend database")

    # 6. GOALS (Bug #1, #3)
    print("\n--- 6. Testing Goals (Bug #1, #3) ---")
    goal_payload = {
        "title": "Daily 30-minute Gym Workout",
        "category": "Body",
        "streak": 5,
        "nextAction": "Leg day tomorrow morning",
        "progress": 35
    }
    goal_res = client.post("/api/goals", json=goal_payload, headers=headers)
    assert goal_res.status_code == 200, f"Create goal failed: {goal_res.text}"
    g_data = goal_res.json()
    assert g_data["title"] == "Daily 30-minute Gym Workout"
    print(" [PASS] Goal created with frontend mapping (Bug #1, #3 verified)")

    goals_list = client.get("/api/goals", headers=headers)
    assert goals_list.status_code == 200
    assert len(goals_list.json()) >= 1
    print(" [PASS] Goals listed from backend database")

    # 7. FUTURE MESSAGES (Bug #1, #3)
    print("\n--- 7. Testing Future Messages (Bug #1, #3) ---")
    fm_payload = {
        "content": "Dear Future Me: Remember how far you have climbed since this day.",
        "days": 60,
        "unlock_date": "2026-11-26T14:00:00Z",
        "sealed": True
    }
    fm_res = client.post("/api/future-messages", json=fm_payload, headers=headers)
    assert fm_res.status_code == 200, f"Create future message failed: {fm_res.text}"
    fm_data = fm_res.json()
    assert fm_data["content"] == fm_payload["content"]
    assert fm_data["days"] == 60
    assert fm_data["sealed"] is True
    print(" [PASS] Future message created with frontend mapping (Bug #1, #3 verified)")

    fm_list = client.get("/api/future-messages", headers=headers)
    assert fm_list.status_code == 200
    assert len(fm_list.json()) >= 1
    print(" [PASS] Future messages listed from backend database")

    # 8. PROGRESS & TRENDS (Bug #12)
    print("\n--- 8. Testing Progress & Trends (Bug #12) ---")
    prog_res = client.get("/api/progress", headers=headers)
    assert prog_res.status_code == 200
    assert "count" in prog_res.json()
    print(" [PASS] Progress summary returned count and recent records")

    trends_res = client.get("/api/progress/trends", headers=headers)
    assert trends_res.status_code == 200, f"Progress trends failed: {trends_res.text}"
    trends_data = trends_res.json()
    assert isinstance(trends_data, list)
    assert len(trends_data) >= 1
    assert "intensity" in trends_data[0]
    assert "overthinking" in trends_data[0]
    assert "urge" in trends_data[0]
    print(" [PASS] /api/progress/trends returned chronological metrics (Bug #12 verified)")

    # 9. FEEDBACK & NOTIFICATIONS
    print("\n--- 9. Testing Feedback & Notifications ---")
    fb_res = client.post("/api/feedback", json={"rating": 5, "comment": "Excellent flow and design"}, headers=headers)
    assert fb_res.status_code == 200
    print(" [PASS] Feedback submitted successfully")

    notif_res = client.get("/api/notifications", headers=headers)
    assert notif_res.status_code == 200
    print(" [PASS] Notifications retrieved")

    print("\n" + "=" * 60)
    print("ALL A-TO-Z BACKEND TESTS PASSED SUCCESSFULLY! (100%)")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
