import os
import logging
from google import genai
from google.genai import types
from google.genai import errors

logger = logging.getLogger(__name__)


def run_twindex(user_input: str) -> str:
    """
    Call Gemini AI to generate health risk trajectory simulations.
    
    Args:
        user_input: The user's prompt/query
        
    Returns:
        The AI-generated response text
        
    Raises:
        RuntimeError: If GEMINI_API_KEY is not found in environment variables
        ValueError: If API call fails
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY not found in environment variables")

    try:
        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model="gemini-3-pro-preview",
            contents=[
                types.Content(
                    role="user",
                    parts=[types.Part.from_text(text=user_input)]
                )
            ],
            config=types.GenerateContentConfig(
                temperature=0.2,
                system_instruction=(
                    "You are a preventive healthcare decision-support AI.\n"
                    "You do NOT provide medical diagnosis or treatment.\n"
                    "You simulate future health risk trajectories based on lifestyle inputs.\n\n"
                    "Rules:\n"
                    "- Compare multiple future scenarios over time\n"
                    "- Explain why risks increase or decrease\n"
                    "- Give only lifestyle-based, non-medical guidance\n"
                    "- Educational, non-diagnostic output only"
                ),
            ),
        )

        if not response or not response.text:
            return "No response generated."

        return response.text
        
    except errors.ClientError as e:
        # Handle specific API errors
        error_str = str(e)
        if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
            logger.warning(f"Gemini API quota exceeded: {e}")
            raise ValueError("API quota exceeded. Please try again later or upgrade your plan.")
        elif "401" in error_str or "INVALID_ARGUMENT" in error_str:
            logger.error(f"Invalid API key or request: {e}")
            raise ValueError("API authentication failed. Please check your API key.")
        else:
            logger.error(f"Gemini API error: {e}", exc_info=True)
            raise ValueError(f"API error: {str(e)[:200]}")
    except Exception as e:
        logger.error(f"Error calling Gemini API: {e}", exc_info=True)
        raise ValueError(f"Failed to generate content: {str(e)[:200]}")
