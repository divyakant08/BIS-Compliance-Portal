import json
import re
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.core.config import settings
from app.services.vision_service import analyze_cml_image

router = APIRouter()

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}


def load_cml_database() -> list[dict]:
    """Load local CM/L verification database."""
    db_path = settings.CML_DATABASE_PATH
    if not db_path.exists():
        return []
    try:
        with open(db_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def verify_against_database(cml_number: str, extracted_standard: str = "", extracted_mfr: str = "") -> dict:
    """Check if extracted CM/L number or details exist in local database."""
    db = load_cml_database()
    if not db:
        return {
            "db_matched": False,
            "db_record": None,
            "status": "NOT_FOUND_IN_REGISTRY",
            "message": "Local CM/L Registry is empty or not found.",
        }

    # Clean license number for fuzzy match
    clean_target = re.sub(r'[^0-9]', '', cml_number or '')
    
    for record in db:
        rec_num = record.get("cml_number", "")
        clean_rec = re.sub(r'[^0-9]', '', rec_num)
        
        # Exact match or number substring match (if >= 5 digits)
        if (clean_target and len(clean_target) >= 5 and (clean_target == clean_rec or clean_target in clean_rec or clean_rec in clean_target)) or (cml_number.strip().upper() == rec_num.strip().upper()):
            return {
                "db_matched": True,
                "db_record": record,
                "status": record.get("status", "VALID"),
                "message": f"Verified against BIS National License Registry for {record.get('manufacturer', 'Manufacturer')}.",
            }

    # Check for manufacturer fuzzy match if license number had OCR imperfections
    if extracted_mfr and extracted_mfr != "Not Found" and len(extracted_mfr) > 4:
        for record in db:
            mfr = record.get("manufacturer", "").lower()
            if extracted_mfr.lower() in mfr or mfr in extracted_mfr.lower():
                return {
                    "db_matched": True,
                    "db_record": record,
                    "status": record.get("status", "VALID"),
                    "message": f"Fuzzy matched by manufacturer: {record.get('manufacturer')}.",
                }

    return {
        "db_matched": False,
        "db_record": None,
        "status": "UNREGISTERED",
        "message": "CM/L License number not found in current BIS registry database. Manual verification recommended.",
    }


@router.post("/cml/verify-enhanced")
async def verify_cml_enhanced(file: UploadFile = File(...)):
    """Analyze label image with Gemini Vision OCR and verify with local BIS CM/L registry."""
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file.content_type}'. Accepted formats: JPEG, PNG, WebP.",
        )

    try:
        image_bytes = await file.read()
        
        # Step 1: Vision OCR extraction
        ocr_result = await analyze_cml_image(image_bytes, file.content_type)
        
        cml_no = ocr_result.get("cml_number", "Not Found")
        mfr = ocr_result.get("manufacturer", "Not Found")
        std = ocr_result.get("standard", "Not Found")
        
        # Step 2: Database validation
        db_check = verify_against_database(cml_no, std, mfr)

        final_status = "VALID" if (ocr_result.get("is_valid") and (db_check["status"] == "VALID" or db_check["status"] == "UNREGISTERED")) else db_check["status"]
        if db_check["status"] == "EXPIRED":
            final_status = "EXPIRED"
        elif db_check["status"] == "SUSPENDED":
            final_status = "SUSPENDED"

        return {
            "ocr_findings": ocr_result,
            "registry_verification": db_check,
            "composite_status": final_status,
            "is_authentic": db_check["db_matched"] and db_check["status"] == "VALID",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CM/L verification failed: {str(e)}")


@router.get("/cml/registry")
async def list_cml_registry():
    """Retrieve all entries in the local BIS CM/L database."""
    db = load_cml_database()
    return {"records": db, "total": len(db)}
