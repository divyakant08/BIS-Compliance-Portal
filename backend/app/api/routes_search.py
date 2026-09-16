from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.ai_engine import generate_ai_response
from app.services.pdf_service import extract_text_from_all_pdfs

router = APIRouter()


class SearchRequest(BaseModel):
    query: str
    language: str = "English"


LANGUAGE_INSTRUCTIONS = {
    "English": "Respond entirely in English.",
    "Hindi": "Respond entirely in Hindi (हिन्दी).",
    "Marathi": "Respond entirely in Marathi (मराठी).",
    "Gujarati": "Respond entirely in Gujarati (ગુજરાતી).",
    "Bengali": "Respond entirely in Bengali (বাংলা).",
    "Tamil": "Respond entirely in Tamil (தமிழ்).",
}


@router.post("/search")
async def search_compliance(request: SearchRequest):
    """Search across all uploaded documents for compliance information."""
    combined_text, doc_names = extract_text_from_all_pdfs()

    if not combined_text:
        raise HTTPException(
            status_code=400,
            detail="No documents uploaded. Please upload BIS standard PDFs first.",
        )

    lang_instruction = LANGUAGE_INSTRUCTIONS.get(request.language, LANGUAGE_INSTRUCTIONS["English"])

    prompt = f"""You are a senior Bureau of Indian Standards (BIS) compliance expert and legal analyst.

{lang_instruction}

Based on the following BIS standard document(s), answer the user's compliance query thoroughly and accurately.

Provide your response in well-structured Markdown format with:
- Clear section headings
- Specific clause references (e.g., "As per Clause 5.2.1...")
- Bullet points for key requirements
- Bold text for critical obligations
- Any relevant penalties or consequences for non-compliance

Documents analyzed: {', '.join(doc_names)}

--- BEGIN DOCUMENT TEXT ---
{combined_text}
--- END DOCUMENT TEXT ---

User Query: {request.query}

Provide a comprehensive, well-formatted response:"""

    try:
        response = await generate_ai_response(prompt)
        return {"response": response, "documents_searched": doc_names}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
