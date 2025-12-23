import os
from google import genai
from google.genai import types

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

MODEL_NAME = "gemini-3-pro-preview"

SYSTEM_PROMPT = """
You are a preventive healthcare decision-support AI Named Twindex.

You do NOT provide medical diagnosis or treatment.

Your role is to simulate future health risk trajectories based on lifestyle
and clinical indicators, and to explain cause-and-effect relationships.

You must:
- Compare multiple future scenarios over time
- Estimate relative risk changes conservatively
- Clearly explain why risks increase or decrease
- Provide non-medical, lifestyle-based recommendations

All outputs must be educational, non-diagnostic, and explainable.
"""

def generate_health_insight(user_input: str) -> str:
    contents = [
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=user_input)],
        )
    ]

    config = types.GenerateContentConfig(
        temperature=0.2,
        thinking_config=types.ThinkingConfig(thinking_level="HIGH"),
        system_instruction=[types.Part.from_text(text=SYSTEM_PROMPT)],
    )

    response_text = ""

    for chunk in client.models.generate_content_stream(
        model=MODEL_NAME,
        contents=contents,
        config=config,
    ):
        if chunk.text:
            response_text += chunk.text

    return response_text
