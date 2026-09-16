from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel
from typing import Optional
from app.services.export_service import generate_compliance_pdf, generate_compliance_excel

router = APIRouter()


class ExportPayload(BaseModel):
    title: str
    content: str
    doc_names: Optional[list[str]] = None


@router.post("/export/pdf")
async def export_pdf_report(payload: ExportPayload):
    """Export compliance analysis as high-quality PDF."""
    try:
        pdf_bytes = generate_compliance_pdf(
            title=payload.title,
            content=payload.content,
            doc_names=payload.doc_names,
        )
        safe_title = "".join(c for c in payload.title if c.isalnum() or c in (' ', '_')).rstrip() or "Compliance_Report"
        filename = "BIS_Compliance_Report.pdf"
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Content-Type": "application/pdf",
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")


@router.post("/export/excel")
async def export_excel_report(payload: ExportPayload):
    """Export compliance analysis as structured Excel workbook."""
    try:
        excel_bytes = generate_compliance_excel(
            title=payload.title,
            content=payload.content,
            doc_names=payload.doc_names,
        )
        safe_title = "".join(c for c in payload.title if c.isalnum() or c in (' ', '_')).rstrip()
        filename = f"BIS_Audit_{safe_title.replace(' ', '_')}.xlsx"

        return Response(
            content=excel_bytes,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Excel generation failed: {str(e)}")
