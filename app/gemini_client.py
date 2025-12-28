import os
import logging
from google import genai
from google.genai import types, errors

logger = logging.getLogger(__name__)


def run_twindex(user_input: str) -> str:
    # -------------------------------
    # DEMO / FALLBACK MODE (IMPORTANT)
    # -------------------------------
    if os.getenv("DISABLE_GEMINI") == "1":
        return (
            "[DEMO MODE]\n"
            "This is a simulated AI response.\n\n"
            f"Input received:\n{user_input}\n\n"
            "Risk trajectories and explanations would be generated here "
            "once Gemini credits are enabled."
        )

    # -------------------------------
    # REAL GEMINI MODE
    # -------------------------------
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY not found in environment variables")

    try:
        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[
                types.Content(
                    role="user",
                    parts=[types.Part.from_text(text=user_input)]
                )
            ],
            config=types.GenerateContentConfig(
                  temperature=0.2,
                  max_output_tokens=700,
                  system_instruction=(
                     "You are a preventive healthcare decision-support AI.\n"
                     "You do NOT provide medical diagnosis or treatment.\n\n"
                     "Your role is to simulate future health risk trajectories "
                     "based on lifestyle inputs.\n\n"
                     "Rules:\n"
                     "- Use clear headings\n"
                     "- Use bullet points\n"
                     "- Keep explanations concise\n"
                     "- Avoid unnecessary verbosity\n"
                     "- Output must be educational and non-diagnostic"
                     ),
            ),
        )

        if not response or not response.text:
            return "No response generated."

        return response.text

    except errors.ClientError as e:
        error_str = str(e)

        if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
            logger.warning(f"Gemini quota exceeded: {e}")
            raise ValueError(
                "Gemini API quota exceeded. "
                "Backend is healthy. Please enable credits to activate AI."
            )

        if "401" in error_str or "INVALID_ARGUMENT" in error_str:
            logger.error(f"Invalid API key or request: {e}")
            raise ValueError("Gemini authentication failed. Check API key.")

        logger.error("Unhandled Gemini API error", exc_info=True)
        raise ValueError("Gemini API error occurred.")

    except Exception as e:
        logger.error("Unexpected error calling Gemini", exc_info=True)
        raise ValueError("AI generation failed due to server error.")
