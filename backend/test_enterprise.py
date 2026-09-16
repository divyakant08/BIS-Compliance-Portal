import asyncio
from app.services.export_service import generate_compliance_pdf, generate_compliance_excel
from app.api.routes_cml_vision import verify_against_database
from app.api.routes_gap_analysis import GapAnalysisRequest
from app.api.routes_preload_search import PreloadSearchRequest, search_preloaded_standards
from app.api.routes_summary import SummaryRequest, generate_summary
from app.services.pdf_service import extract_text_from_all_pdfs
from app.main import app

def test_backend_features():
    print("1. Testing CM/L database lookup...")
    res = verify_against_database("CM/L-8400192408")
    assert res["db_matched"] == True
    assert res["status"] == "VALID"
    print("   [PASS] CM/L lookup passed:", res["message"])

    print("2. Testing PDF Generation (ReportLab)...")
    sample_md = """## Executive Summary
Standard IS 14543 mandates strict quality benchmarks for packaged drinking water.

## Key Obligations
- Regular batch microbiological testing is mandatory under Clause 4.2.
- Product packages must bear the Standard Mark [Doc: 04_IS_14543_Packaged_Water.pdf | Page 4].
"""
    pdf_bytes = generate_compliance_pdf("Test Report", sample_md, ["04_IS_14543_Packaged_Water.pdf"])
    assert len(pdf_bytes) > 1000
    print(f"   [PASS] PDF export generated successfully ({len(pdf_bytes)} bytes)")

    print("3. Testing Excel Generation (OpenPyXL)...")
    excel_bytes = generate_compliance_excel("Test Audit", sample_md, ["04_IS_14543_Packaged_Water.pdf"])
    assert len(excel_bytes) > 1000
    print(f"   [PASS] Excel export generated successfully ({len(excel_bytes)} bytes)")

    print("4. Testing Filtered PDF Extraction...")
    all_text, all_docs = extract_text_from_all_pdfs(["ALL"])
    assert len(all_docs) > 0
    filtered_text, filtered_docs = extract_text_from_all_pdfs(["04_IS_14543_Packaged_Water.pdf"])
    assert "04_IS_14543_Packaged_Water.pdf" in filtered_docs
    print(f"   [PASS] Filtered extraction verified ({len(filtered_docs)} doc(s)).")

    print("5. Testing FastAPI Route Registration...")
    routes = [r.path for r in app.routes]
    assert "/api/search/preloaded" in routes
    assert "/api/search/custom" in routes
    assert "/api/gap-analysis" in routes
    assert "/api/cml/verify-enhanced" in routes
    assert "/api/analytics/metrics" in routes
    assert "/api/export/pdf" in routes
    assert "/api/export/excel" in routes
    print(f"   [PASS] All {len(routes)} FastAPI routes verified.")

    print("[SUCCESS] All enterprise service tests PASSED!")

if __name__ == "__main__":
    test_backend_features()
