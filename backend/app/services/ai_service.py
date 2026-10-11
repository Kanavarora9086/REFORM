from typing import Dict, Any
import json
import re
import logging

from openai import OpenAI
from fastapi import HTTPException

from ..core.config import settings

logger = logging.getLogger(__name__)


def _extract_json(text: str) -> dict:
    """Extract JSON from LLM output, handling markdown fences and surrounding text."""
    text = text.strip()
    # Try to find JSON inside markdown code fences first
    fence_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    if fence_match:
        return json.loads(fence_match.group(1))
    # Try to find a raw JSON object anywhere in the text
    obj_match = re.search(r"\{.*\}", text, re.DOTALL)
    if obj_match:
        return json.loads(obj_match.group(0))
    # Last resort: try parsing the entire text
    return json.loads(text)


class AIService:
    def __init__(self, provider: str = "openai"):
        self.provider = (provider or "openai").lower()
        self.client = None

        # Gemini API through Google Generative Language OpenAI-compatible endpoint
        if settings.OPENAI_API_KEY:
            self.client = OpenAI(
                api_key=settings.OPENAI_API_KEY,
                base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
                timeout=25.0,
            )

    def _call_openai(self, system_prompt: str, user_text: str) -> str:
        if not self.client:
            raise HTTPException(
                status_code=503,
                detail="Gemini AI is not configured. Missing API key.",
            )

        try:
            response = self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt,
                    },
                    {
                        "role": "user",
                        "content": user_text,
                    },
                ],
            )
            return response.choices[0].message.content.strip()
        except HTTPException:
            raise
        except Exception as e:
            logger.error("Gemini API call failed: %s", e, exc_info=True)
            raise HTTPException(
                status_code=502,
                detail=f"Gemini AI processing error: {str(e)}",
            )

    def analyze_emotion(self, text: str) -> Dict[str, Any]:
        system_prompt = """
You are the emotional reflection engine for RE:FORM.

RE:FORM is a private emotional self-reflection and personal rebuilding product. You are NOT a therapist and must NOT diagnose mental illnesses.

Analyze the user's text carefully and return ONLY valid JSON.

Use exactly this structure:
{
  "categories": ["emotion1", "emotion2"],
  "intensity": 0.5,
  "possible_trigger": "short description",
  "suggested_reflection": "short, thoughtful reflection"
}

Rules:
- categories: 1 to 4 emotional states.
- intensity: number between 0.1 and 1.0.
- possible_trigger: concise root cause inferred from the text.
- suggested_reflection: empathetic, specific, and useful.
- Do not say generic things like "everything will be okay".
- Do not diagnose.
- Return ONLY the JSON object.
"""
        result = self._call_openai(system_prompt, text)
        try:
            parsed = _extract_json(result)
            return {
                "categories": parsed.get("categories", ["reflection"]),
                "intensity": float(parsed.get("intensity", 0.5)),
                "possible_trigger": parsed.get("possible_trigger"),
                "suggested_reflection": parsed.get("suggested_reflection", ""),
            }
        except Exception as e:
            logger.error("Failed to parse emotion JSON: %s (Raw: %s)", e, result)
            raise HTTPException(
                status_code=502,
                detail=f"Failed to parse AI emotion response: {str(e)}",
            )

    def analyze_entry(self, text: str, user_context: Dict | None = None) -> Dict[str, Any]:
        result = self.analyze_emotion(text)
        result["analysis_note"] = (
            "This reflection is designed to help you notice patterns in what you're feeling."
        )
        return result

    def generate_reflection(self, prompt: str, context: Dict | None = None) -> Dict[str, Any]:
        system_prompt = """
You are RE:FORM's reflection companion.

Your role is to help the user understand themselves, not to act like a generic chatbot.

Respond with:
- emotional clarity
- one useful observation
- one thoughtful question

Be warm but grounded.
Do not diagnose.
Do not use generic motivational clichés.
Keep the response concise and poignant.
"""
        reply = self._call_openai(system_prompt, prompt)
        return {
            "reply": reply,
            "analysis": reply,
            "insights": [reply],
        }

    def analyze_pause(self, statement: str) -> Dict[str, Any]:
        system_prompt = """
You are RE:FORM's Pause impulse intervention engine.

The user is experiencing an impulse to act emotionally (e.g. contact someone or make a hasty decision).
Do not shame them.
Return ONLY valid JSON in this exact format:
{
  "prompt": "one short grounding question",
  "options": [
    "I hope they reply or notice",
    "I want them back in my life",
    "I need final closure",
    "I feel lonely and vulnerable",
    "It is a reflexive habit",
    "I honestly don't know"
  ]
}
"""
        result = self._call_openai(system_prompt, statement or "Impulsive urge to reach out")
        try:
            parsed = _extract_json(result)
            grounding_prompt = parsed.get("prompt", "Take a moment to pause.")
            parsed["guidance"] = grounding_prompt
            parsed["intervention"] = grounding_prompt
            parsed["reflection"] = grounding_prompt
            return parsed
        except Exception as e:
            logger.error("Failed to parse pause JSON: %s", e)
            raise HTTPException(
                status_code=502,
                detail=f"Failed to parse AI pause intervention: {str(e)}",
            )


ai_service = AIService(provider=settings.AI_PROVIDER)