import os
import pymupdf as fitz
from pathlib import Path
from fastapi import UploadFile
from app.core.config import settings

MAX_COMBINED_TEXT_LENGTH = 500_000  # ~500K chars cap


async def save_uploaded_file(file: UploadFile) -> str:
    """Save an uploaded PDF file to the stored_documents directory."""
    file_path = settings.STORED_DOCUMENTS_DIR / file.filename
    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)
    return file.filename


def list_documents() -> list[str]:
    """Return a list of all stored PDF document filenames."""
    if not settings.STORED_DOCUMENTS_DIR.exists():
        return []
    return [
        f.name
        for f in settings.STORED_DOCUMENTS_DIR.iterdir()
        if f.is_file() and f.suffix.lower() == ".pdf"
    ]


def delete_document(filename: str) -> bool:
    """Delete a document from stored_documents. Returns True if successful."""
    file_path = settings.STORED_DOCUMENTS_DIR / filename
    if file_path.exists() and file_path.is_file():
        os.remove(file_path)
        return True
    return False


def extract_text_from_all_pdfs(selected_documents: list[str] | None = None) -> tuple[str, list[str]]:
    """Extract text from stored BIS PDFs with document/page markers.

    If selected_documents is provided and is not empty / ALL, only those files
    are extracted. Otherwise every PDF in stored_documents is used.
    """
    available = list_documents()
    if not available:
        return "", []

    if selected_documents:
        normalized = [name for name in selected_documents if name and name.upper() != "ALL"]
        if normalized:
            documents = [name for name in available if name in normalized]
        else:
            documents = available
    else:
        documents = available

    if not documents:
        return "", []

    combined_parts: list[str] = []
    total_length = 0

    for doc_name in documents:
        doc_path = settings.STORED_DOCUMENTS_DIR / doc_name
        try:
            pdf = fitz.open(str(doc_path))
            for page_num in range(len(pdf)):
                page = pdf[page_num]
                text = page.get_text("text")
                if text.strip():
                    marker = f"\n--- Doc: {doc_name} | Page {page_num + 1} ---\n"
                    segment = marker + text
                    if total_length + len(segment) > MAX_COMBINED_TEXT_LENGTH:
                        combined_parts.append(
                            f"\n--- [TEXT TRUNCATED: Reached {MAX_COMBINED_TEXT_LENGTH} char limit] ---"
                        )
                        pdf.close()
                        return "".join(combined_parts), documents
                    combined_parts.append(segment)
                    total_length += len(segment)
            pdf.close()
        except Exception as e:
            combined_parts.append(f"\n--- Error reading {doc_name}: {str(e)} ---\n")

    return "".join(combined_parts), documents
