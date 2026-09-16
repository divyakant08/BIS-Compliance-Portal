import os
import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import pymupdf as fitz
from app.core.config import settings
from app.core.ai_engine import generate_ai_response

router = APIRouter()

LANGUAGE_INSTRUCTIONS = {
    "English": "Respond entirely in English.",
    "Hindi": "Respond entirely in Hindi (हिन्दी).",
    "Marathi": "Respond entirely in Marathi (मराठी).",
    "Gujarati": "Respond entirely in Gujarati (ગુજરાતી).",
    "Bengali": "Respond entirely in Bengali (বাংলা).",
    "Tamil": "Respond entirely in Tamil (தமிழ்).",
}

@router.post("/search/custom")
async def custom_document_search(
    file: UploadFile = File(...),
    query: str = Form(...),
    language: str = Form("English"),
):
    """Analyze a custom ad-hoc PDF upload and answer compliance queries against it."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported for custom analysis.")

    temp_filename = f"{uuid.uuid4().hex[:8]}_{file.filename}"
    temp_path = settings.TEMP_UPLOADS_DIR / temp_filename

    try:
        contents = await file.read()
        with open(temp_path, "wb") as f:
            f.write(contents)

        doc_parts = []
        doc = fitz.open(str(temp_path))
        page_count = len(doc)

        for page_num in range(page_count):
            page = doc[page_num]
            text = page.get_text("text")
            if text.strip():
                doc_parts.append(f"\n--- Doc: {file.filename} | Page {page_num + 1} ---\n{text}")
        doc.close()

        extracted_text = "".join(doc_parts)
        if not extracted_text.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract readable text from the uploaded PDF. It might be scanned without OCR or protected.",
            )

        lang_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["English"])

        prompt = f"""You are a Bureau of Indian Standards (BIS) and International Technical Standards Compliance Specialist.

{lang_instruction}

The user has uploaded a custom technical/regulatory document: `{file.filename}` ({page_count} pages).
Analyze this document thoroughly and answer the user's specific query.

CRITICAL INSTRUCTIONS:
- Reference specific pages using syntax `[Doc: {file.filename} | Page X]` so the reader can jump directly to the relevant clause.
- Highlight key regulatory compliance requirements, testing parameters, and obligations.
- If the document references BIS standards (IS numbers) or international equivalents (ISO/IEC/ASTM), identify them clearly.

--- BEGIN CUSTOM DOCUMENT TEXT ({file.filename}) ---
{extracted_text[:450000]}
--- END CUSTOM DOCUMENT TEXT ---

User Query: {query}

Provide a comprehensive, well-structured compliance answer:"""

        response = await generate_ai_response(prompt)

        return {
            "response": response,
            "filename": file.filename,
            "temp_file": temp_filename,
            "pages": page_count,
            "status": "success",
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Custom search failed: {str(e)}")
    finally:
        # Temp file is kept for viewing
        pass
