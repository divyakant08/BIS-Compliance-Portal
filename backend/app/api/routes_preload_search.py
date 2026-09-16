from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.core.ai_engine import generate_ai_response
from app.services.pdf_service import extract_text_from_all_pdfs

router = APIRouter()


class PreloadSearchRequest(BaseModel):
    query: str
    language: str = "English"
    filter_standard: Optional[str] = None
    selected_documents: Optional[list[str]] = None
    voice_mode: bool = False


LANGUAGE_INSTRUCTIONS = {
    "English": "Respond entirely in English.",
    "Hindi": "Respond entirely in Hindi (हिन्दी).",
    "Marathi": "Respond entirely in Marathi (मराठी).",
    "Gujarati": "Respond entirely in Gujarati (ગુજરાતી).",
    "Bengali": "Respond entirely in Bengali (বাংলা).",
    "Tamil": "Respond entirely in Tamil (தமிழ்).",
}


def resolve_selected_documents(request: PreloadSearchRequest) -> list[str] | None:
    if request.selected_documents:
        return request.selected_documents
    if request.filter_standard and request.filter_standard.upper() != "ALL":
        return [request.filter_standard]
    return None


@router.post("/search/preloaded")
async def search_preloaded_standards(request: PreloadSearchRequest):
    """Search specifically across pre-loaded repository BIS standard documents."""
    selected = resolve_selected_documents(request)
    combined_text, doc_names = extract_text_from_all_pdfs(selected)

    if not combined_text or not doc_names:
        raise HTTPException(
            status_code=400,
            detail="No matching official BIS standards found for the selected document scope.",
        )

    lang_instruction = LANGUAGE_INSTRUCTIONS.get(request.language, LANGUAGE_INSTRUCTIONS["English"])

    if request.voice_mode:
        voice_instruction = """
CRITICAL INSTRUCTIONS FOR VOICE / SPOKEN RESPONSE:
- The user is speaking via voice on the factory inspection floor.
- Provide a direct, crystal-clear, spoken-friendly answer in 2 to 4 sentences maximum (approx 40-70 words).
- State the exact standard name, clause number, and required compliance threshold/action directly.
- Avoid markdown tables, complex symbols, or raw URLs. Keep punctuation natural so Text-To-Speech reads it smoothly.
- Example tone: "Under IS 14543 Clause 4.2, the total dissolved solids limit for packaged drinking water is maximum 500 milligrams per liter. Immediate re-testing is mandatory if this threshold is exceeded."
"""
    else:
        voice_instruction = """
CRITICAL INSTRUCTIONS FOR CITATIONS:
- Whenever you cite a standard and page, use this exact syntax so the UI can link directly to the document: `[Doc: <Document_Name.pdf> | Page <Page_Number>]`
- Provide specific clause numbers (e.g. Clause 4.2.1, Table 2, Annexure B).
- Format the response in clear, professional Markdown with bullet points, warning callouts, and tabular data if applicable.
"""

    prompt = f"""You are a Bureau of Indian Standards (BIS) Principal Regulatory Compliance Officer.

{lang_instruction}

Analyze ONLY the official repository standards listed below and provide an authoritative compliance analysis.

{voice_instruction}

Standards in current search scope: {', '.join(doc_names)}

--- BEGIN REPOSITORY STANDARDS ---
{combined_text}
--- END REPOSITORY STANDARDS ---

User Query: {request.query}

Provide the regulatory response:"""

    try:
        response = await generate_ai_response(prompt)
        return {
            "response": response,
            "documents_searched": doc_names,
            "type": "preloaded_db_search",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
