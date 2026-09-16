import json
import re
from app.core.ai_engine import generate_ai_vision_response


CML_VERIFICATION_PROMPT = """You are a Bureau of Indian Standards (BIS) compliance expert specializing in CM/L (Certificate of Mark / License) verification.

Analyze this product label / certificate image and extract the following information:

1. **CM/L License Number**: Look for patterns like "CM/L-XXXXXXX" or "CML XXXXXXX" or any license number format.
2. **Manufacturer Name**: The company or manufacturer name visible on the label.
3. **Standard Code**: Any Indian Standard reference (e.g., "IS 13252", "IS 1077", etc.).
4. **Validity**: Determine if the mark/license appears valid based on visible information.
5. **Additional Details**: Any other relevant compliance information visible.

Respond ONLY with valid JSON in this exact format (no markdown, no code fences):
{
    "cml_number": "CM/L-XXXXXXX or 'Not Found'",
    "is_valid": true or false,
    "manufacturer": "Manufacturer name or 'Not Found'",
    "standard": "IS XXXXX or 'Not Found'",
    "details": "Brief description of findings"
}"""


async def analyze_cml_image(image_bytes: bytes, mime_type: str) -> dict:
    """Analyze a product label image for CM/L compliance verification."""
    raw_response = await generate_ai_vision_response(
        prompt=CML_VERIFICATION_PROMPT,
        image_bytes=image_bytes,
        mime_type=mime_type,
    )

    # Try to parse JSON from the response
    try:
        # Strip any markdown code fences if present
        cleaned = raw_response.strip()
        cleaned = re.sub(r'^```(?:json)?\s*', '', cleaned)
        cleaned = re.sub(r'\s*```$', '', cleaned)
        result = json.loads(cleaned)
        return {
            "cml_number": result.get("cml_number", "Not Found"),
            "is_valid": result.get("is_valid", False),
            "manufacturer": result.get("manufacturer", "Not Found"),
            "standard": result.get("standard", "Not Found"),
            "details": result.get("details", "No details available"),
        }
    except (json.JSONDecodeError, AttributeError):
        return {
            "cml_number": "Not Found",
            "is_valid": False,
            "manufacturer": "Not Found",
            "standard": "Not Found",
            "details": f"Could not parse structured response. Raw output: {raw_response[:500]}",
        }
