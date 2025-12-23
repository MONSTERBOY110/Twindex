import os
from google import genai
from google.genai import types


def run_twindex(user_input: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY not found in environment variables")

    client = genai.Client(api_key=api_key)

    model = "gemini-3-pro-preview"

    contents = [
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=user_input)],
        )
    ]

    config = types.GenerateContentConfig(
        temperature=0.2,
        thinking_config=types.ThinkingConfig(
            thinking_level="HIGH"
        ),
        system_instruction=[
            types.Part.from_text(
                text=(
                    "You are a preventive healthcare decision-support AI.\n"
                    "You do NOT provide medical diagnosis or treatment.\n\n"
                    "Your role is to simulate future health risk trajectories "
                    "based on lifestyle and clinical indicators.\n\n"
                    "You must:\n"
                    "- Compare multiple future scenarios over time\n"
                    "- Estimate relative risk changes conservatively\n"
                    "- Clearly explain why risks increase or decrease\n"
                    "- Provide non-medical, lifestyle-based recommendations\n\n"
                    "All outputs must be educational, non-diagnostic, and explainable."
                )
            )
        ],
    )

    response = client.models.generate_content(
        model=model,
        contents=contents,
        config=config,
    )

    return response.text
