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
                        "You are a preventive healthcare decision-support AI built exclusively for the Twindex platform.\n"
                        "You do NOT provide medical diagnosis, treatment, prescriptions, or personalized medical advice.\n\n"
                        "Your ONLY role is to simulate future health risk trajectories based strictly on lifestyle inputs.\n"
                        "You compare multiple lifestyle scenarios over time and explain risk changes using clear cause → effect logic.\n\n"
                        "STRICT SCOPE RULES:\n"
                        "- You must answer ONLY questions directly related to the provided health simulation or lifestyle-based what-if changes.\n"
                        "- You must NOT answer general knowledge questions, medical advice requests, casual conversation, or unrelated topics.\n"
                        "- If a question is outside this scope, respond exactly with:\n"
                        "  \"This question is outside the scope of this simulation.\"\n\n"
                        "OUTPUT RULES:\n"
                        "- Use clear section headings\n"
                        "- Use bullet points where appropriate\n"
                        "- Keep explanations concise and structured\n"
                        "- Avoid unnecessary verbosity\n"
                        "- Do NOT introduce new topics beyond the simulation\n"
                        "- Output must always remain educational and non-diagnostic\n\n"
                        "If sufficient input data is not provided, clearly state that the simulation cannot be performed instead of guessing."
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

def run_prescription_analysis(prompt: str, image_base64: str, content_type: str) -> str:
    """
    Analyze a prescription image using Gemini AI.
    
    Args:
        prompt: User question and health context
        image_base64: Base64 encoded image data
        content_type: MIME type of the image (e.g., 'image/jpeg', 'image/png')
        
    Returns:
        AI-generated explanation of the prescription
    """
    # -------------------------------
    # DEMO / FALLBACK MODE
    # -------------------------------
    if os.getenv("DISABLE_GEMINI") == "1":
        return (
            "[DEMO MODE - Prescription Analysis]\n"
            "Prescription image received and would be analyzed here.\n\n"
            f"User query: {prompt[:100]}...\n\n"
            "Analysis would show medicine names, purposes, and educational guidance "
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

        # Determine MIME type for Gemini API
        mime_type = content_type if content_type in ['image/jpeg', 'image/png'] else 'image/jpeg'

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text(text=prompt),
                        types.Part(
                            inline_data=types.Blob(
                                mime_type=mime_type,
                                data=image_base64
                            )
                        )
                    ]
                )
            ],
            config=types.GenerateContentConfig(
                temperature=0.3,
                max_output_tokens=1000,
                system_instruction=(
                    "You are a comprehensive healthcare explanation assistant.\n"
                    "Your role: Provide detailed, user-friendly explanations of prescriptions.\n"
                    "You do NOT provide medical diagnosis or treatment recommendations.\n\n"
                    "OUTPUT GUIDELINES:\n"
                    "- Use clear headings and structured sections\n"
                    "- Use bullet points and numbered lists for readability\n"
                    "- Explain medical concepts in simple, everyday language\n"
                    "- Connect prescription to patient's health context\n"
                    "- Provide educational and lifestyle insights\n"
                    "- Include practical supportive measures\n"
                    "- Be thorough but concise\n\n"
                    "STRICT BOUNDARIES:\n"
                    "- NO diagnosis statements\n"
                    "- NO dosage changes or recommendations\n"
                    "- NO new medicine suggestions\n"
                    "- NO medical advice\n"
                    "- Always remind to consult doctor for medical decisions\n\n"
                    "QUALITY FOCUS:\n"
                    "- Empower patients with understanding\n"
                    "- Connect to their overall health goals\n"
                    "- Highlight preventive lifestyle factors\n"
                    "- Be encouraging and supportive in tone"
                ),
            ),
        )

        if not response or not response.text:
            return "Could not analyze the prescription image."

        return response.text

    except errors.ClientError as e:
        error_str = str(e)

        if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
            logger.warning(f"Gemini quota exceeded: {e}")
            raise ValueError(
                "Gemini API quota exceeded. Please enable credits."
            )

        if "401" in error_str or "INVALID_ARGUMENT" in error_str:
            logger.error(f"Invalid API key or request: {e}")
            raise ValueError("Gemini authentication failed.")

        logger.error("Unhandled Gemini API error", exc_info=True)
        raise ValueError("Gemini API error occurred.")

    except Exception as e:
        logger.error(f"Unexpected error in prescription analysis: {e}", exc_info=True)
        raise ValueError("Prescription analysis failed due to server error.")