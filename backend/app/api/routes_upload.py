import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from app.core.config import settings
from app.services.pdf_service import save_uploaded_file, list_documents, delete_document

router = APIRouter()


@router.post("/upload")
async def upload_files(files: list[UploadFile] = File(...)):
    """Upload one or more PDF documents."""
    uploaded = []
    errors = []
    for file in files:
        if not file.filename.lower().endswith(".pdf"):
            errors.append(f"{file.filename}: Not a PDF file")
            continue
        try:
            name = await save_uploaded_file(file)
            uploaded.append(name)
        except Exception as e:
            errors.append(f"{file.filename}: {str(e)}")

    return {
        "uploaded": uploaded,
        "errors": errors,
        "message": f"Successfully uploaded {len(uploaded)} file(s)",
    }


@router.get("/documents")
async def get_documents():
    """Return list of all stored PDF documents."""
    docs = list_documents()
    return {"documents": docs, "count": len(docs)}


@router.get("/documents/{filename}/view")
async def view_document(filename: str):
    """Stream PDF document for interactive browser viewing."""
    file_path = settings.STORED_DOCUMENTS_DIR / filename
    if not file_path.exists() or not file_path.is_file():
        temp_path = settings.TEMP_UPLOADS_DIR / filename
        if temp_path.exists() and temp_path.is_file():
            return FileResponse(
                path=str(temp_path),
                media_type="application/pdf",
                filename=filename,
            )
        raise HTTPException(status_code=404, detail=f"Document '{filename}' not found.")

    return FileResponse(
        path=str(file_path),
        media_type="application/pdf",
        filename=filename,
    )


@router.delete("/documents/{filename}")
async def remove_document(filename: str):
    """Delete a stored PDF document."""
    success = delete_document(filename)
    if not success:
        raise HTTPException(status_code=404, detail=f"Document '{filename}' not found")
    return {"message": f"Document '{filename}' deleted successfully"}
