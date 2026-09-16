import base64
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.vision_service import analyze_cml_image

router = APIRouter()

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}


@router.post("/cml-verify")
async def verify_cml(file: UploadFile = File(...)):
    """Verify CM/L mark from an uploaded product label image."""
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file.content_type}'. Accepted: JPEG, PNG, WebP.",
        )

    try:
        image_bytes = await file.read()
        result = await analyze_cml_image(image_bytes, file.content_type)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CM/L verification failed: {str(e)}")
