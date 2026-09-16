# BIS Standard Compliance & Analytics Portal
## Enterprise System Architecture, Design Decisions & Technical Manual (v2.3)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Monorepo Architecture & Clean Navigation](#2-monorepo-architecture--clean-navigation)
3. [Technology Stack & Technical Justifications](#3-technology-stack--technical-justifications)
4. [Sidebar Multi-Document Selector & Global State](#4-sidebar-multi-document-selector--global-state)
5. [Unified Standards Search: Mode Toggle & Embedded Voice](#5-unified-standards-search-mode-toggle--embedded-voice)
6. [Core Workflows & Data Flows](#6-core-workflows--data-flows)
   - [Workflow 1: Unified Standards Search (BIS Repository & Custom PDF Mode)](#workflow-1-unified-standards-search-bis-repository--custom-pdf-mode)
   - [Workflow 2: Predictive Gap Analysis Flow](#workflow-2-predictive-gap-analysis-flow)
   - [Workflow 3: Multi-Document Executive Summary Flow](#workflow-3-multi-document-executive-summary-flow)
   - [Workflow 4: Vision OCR CM/L Validation Flow](#workflow-4-vision-ocr-cml-validation-flow)
   - [Workflow 5: Statutory Penalties & Legal Risk Assessment](#workflow-5-statutory-penalties--legal-risk-assessment)
   - [Workflow 6: Audit Report Generation & Blob Export](#workflow-6-audit-report-generation--blob-export)
7. [Elevated Enterprise Navy & Gold Design System](#7-elevated-enterprise-navy--gold-design-system)
8. [Module & File Structure Breakdown](#8-module--file-structure-breakdown)
9. [API Endpoint Reference](#9-api-endpoint-reference)

---

## 1. Executive Summary

The **BIS Standard Compliance & Analytics Portal** is an authoritative enterprise regulatory intelligence platform. Built specifically for compliance officers, quality engineers, and statutory auditors operating under the **Bureau of Indian Standards (BIS)** framework, the portal eliminates manual friction in interpreting complex technical specifications and navigating legal obligations under the **BIS Act 2016**.

### Key Architectural Pillars:
1. **Clean 6-Tab Navigation:**
   - **1. Standards:** Unified Q&A with mode switch (BIS Knowledge Base vs. Upload & Query) and embedded interactive voice search.
   - **2. Gap Analysis:** Automated evaluation of manufacturer or lab test specifications against statutory BIS tolerance limits.
   - **3. Summary:** Multi-document executive compliance digest generator scoped to selected standards.
   - **4. Penalties:** Legal liability, fine structure, and offence extraction under the BIS Act 2016.
   - **5. CM/L Scanner:** Multimodal Vision OCR and local registry cross-validation to detect counterfeit ISI marks.
   - **6. Analytics:** Telemetry dashboard with KPI metrics, compliance health scoring, and Recharts visualizations.
2. **Sidebar Multi-Document Selector:** Dedicated interactive checkbox selector with "Select All Standards" / "Clear Selection" controlling query scope across all analysis tabs without cluttering sidebars with upload zones.
3. **Unified Mode Toggle in Search:** Seamlessly switch between querying indexed BIS standards and uploading an ad-hoc custom document directly inside the search card.
4. **Embedded Global Voice Search:** Interactive `<MicButton />` directly in search inputs with automatic speech recognition (`hi-IN` / `en-IN` / `mr-IN`) and **"🔊 Read Aloud"** female voice synthesis on all result cards.
5. **Corrosion-Free Binary Exports:** ReportLab PDF (`application/pdf`) and OpenPyXL Excel exports with blob URL download handling.

---

## 2. Monorepo Architecture & Clean Navigation

```
+==========================================================================================+
|                                CLIENT TIER (Browser / SPA)                               |
|                                                                                          |
|   +----------------------------------------------------------------------------------+   |
|   |                        React 19 + Vite SPA (Port 5173)                           |   |
|   |                                                                                  |   |
|   |   +--------------------------------------------------------------------------+   |   |
|   |   |        LanguageProvider (i18n State: English / Hindi / Marathi)          |   |   |
|   |   +--------------------------------------------------------------------------+   |   |
|   |                                                                                  |   |
|   |   +--------------------------------------------------------------------------+   |   |
|   |   |  Global Selected Documents State: selectedDocuments = ["ALL"] or [...]  |   |   |
|   |   +--------------------------------------------------------------------------+   |   |
|   |                                                                                  |   |
|   |   +--------------------+  +--------------------+  +--------------------------+   |   |
|   |   | 1. Standards       |  | 2. Gap Analysis    |  | 3. Summary               |   |   |
|   |   | (SearchTab: BIS/   |  | (GapAnalysisTab)   |  | (SummaryTab)             |   |   |
|   |   |  Upload Switch)    |  |                    |  |                          |   |   |
|   |   +--------------------+  +--------------------+  +--------------------------+   |   |
|   |   | 4. Penalties       |  | 5. CM/L Scanner    |  | 6. Analytics             |   |   |
|   |   | (PenaltiesTab)     |  | (CMLScannerTab)    |  | (AnalyticsDashboard)     |   |   |
|   |   +--------------------+  +--------------------+  +--------------------------+   |   |
|   |                                                                                  |   |
|   |   +--------------------------------------+  +--------------------------------+   |   |
|   |   | Sidebar Multi-Select Selector        |  | Embedded Voice + TTS Player    |   |   |
|   |   | (Checkboxes + Select All)            |  | (MicButton + ResultCard)       |   |   |
|   |   +--------------------------------------+  +--------------------------------+   |   |
|   +-----------------------------------------+----------------------------------------+   |
+=============================================|============================================+
                                              |
                          Axios REST API Client (JSON / FormData / Blob)
                          Web Speech API (SpeechRecognition / SpeechSynthesis)
                                              |
+=============================================v============================================+
|                               BACKEND TIER (FastAPI, Port 8000)                          |
|                                                                                          |
|   +----------------------------------------------------------------------------------+   |
|   |  FastAPI Application (app/main.py)                                               |   |
|   |  CORS Middleware: allow_origins=["*"]                                            |   |
|   +----+----------+----------+----------+----------+----------+----------+-----------+   |
|        |          |          |          |          |          |          |               |
|   +----v--+  +----v--+  +----v---+ +----v---+ +----v---+ +----v---+ +----v---+           |
|   |Search |  |Preload|  |Custom  | | Gap    | |Summary | |Penalty | |Vision  |           |
|   |Routes |  |Search |  |Search  | |Analysis| |Routes  | |Routes  | |CML DB  |           |
|   +-------+  +-------+  +----+---+ +----+---+ +--------+ +--------+ +----+---+           |
|                              |          |                                |               |
|   +--------------------------v----------v--------------------------------v------------+   |
|   |                              Service Layer                                        |   |
|   |  - pdf_service.py: Filtered PyMuPDF extraction (selected_documents support)       |   |
|   |  - vision_service.py: Gemini Vision label parsing & JSON extraction               |   |
|   |  - export_service.py: ReportLab NumberedCanvas PDF & OpenPyXL Excel generation   |   |
|   |  - ai_engine.py: Google GenAI client abstraction with resilient fallback          |   |
|   +------------------------------------------+----------------------------------------+   |
+==============================================|===========================================+
                                               |
                                 HTTPS REST API Requests
                                               |
                               +---------------v---------------+
                               |     Google Gemini 2.5 Flash   |
                               |  - Multi-Document Text Gen    |
                               |  - Vision Multimodal OCR      |
                               |  - Multilingual Translation   |
                               +-------------------------------+

                    +------------------------------------------+
                    |           LOCAL PERSISTENCE              |
                    |                                          |
                    |  backend/stored_documents/ (Official)    |
                    |  backend/temp_uploads/     (Custom PDFs) |
                    |  backend/cml_database.json (Licenses)    |
                    |  backend/.env              (API Keys)    |
                    +------------------------------------------+
```

---

## 3. Technology Stack & Technical Justifications

| Tier / Component | Technology | Technical Justification |
|---|---|---|
| **Backend Framework** | **FastAPI (Python 3.10+)** | Async request handling via Starlette ASGI; automatic OpenAPI documentation (`/docs`); high throughput for I/O-bound AI requests. |
| **Generative AI Engine** | **Google Gemini 2.5 Flash (`google-genai` SDK)** | 1-million-token context window allows feeding entire standard documents in a single prompt; resilient fallback chain handling 503/429 spikes. |
| **Document Processing** | **PyMuPDF (`fitz`)** | Ultra-fast C-backed PDF parsing with selective file filtering and per-page boundary markers (`[Doc: ... \| Page N]`). |
| **Reporting & Export** | **ReportLab & OpenPyXL** | Programmatic PDF generation with custom `NumberedCanvas` footers; clean multi-sheet Excel compliance workbook generation. |
| **Frontend Framework** | **React 19 + Vite 6** | Fast virtual DOM reconciliation, component modularity, and instant Hot Module Replacement (HMR). |
| **Speech Engine** | **Web Speech API (`SpeechRecognition` & `speechSynthesis`)** | Native in-browser speech recognition and natural female voice synthesis embedded directly in search bars and result cards. |
| **Internationalization** | **React Context (`LanguageContext.jsx`)** | Comprehensive UI dictionaries across English, Hindi, and Marathi with synchronized AI prompt instructions. |
| **Data Visualization** | **Recharts** | Composable, responsive SVG charts matching the enterprise navy & gold design tokens. |
| **Styling** | **Tailwind CSS v4** | Elevated enterprise design system with deep navy surfaces (`#0B2545`), gold borders (`#D4AF37`), and crisp contrast typography. |

---

## 4. Sidebar Multi-Document Selector & Global State

The left sidebar (`Sidebar.jsx`) has been refactored into a dedicated **Multi-Document Selector**:
- **Removal of Upload Clutter:** The upload dropzone has been removed from the sidebar to give full vertical space to document filtering.
- **Interactive Checkboxes:** Each standard PDF in the repository is rendered with an interactive checkbox.
- **Select All Toggle:** A single button flips between **"Select All Standards"** and **"Clear Selection"**.
- **Global Selection Propagation:** The selected document list (`selectedDocuments`) resides in `App.jsx` and is passed directly to `SearchTab`, `SummaryTab`, and `PenaltiesTab`.
- **Selected Count Pill:** Shows real-time selection telemetry (e.g. `1/1 selected`).

---

## 5. Unified Standards Search: Mode Toggle & Embedded Voice

`SearchTab.jsx` merges central repository search and custom PDF analysis into a single unified page:

### A. Segmented Mode Switch
- **BIS Knowledge Base (Default):** Evaluates queries against documents currently selected in the sidebar selector.
- **Upload & Query:** Renders an inline drag-and-drop PDF upload zone directly inside the search card for ad-hoc custom document Q&A.

### B. Embedded Voice Search (`MicButton.jsx`)
- Interactive microphone button embedded directly inside the search input.
- Captures live audio in the active language (`hi-IN`, `en-IN`, `mr-IN`).
- Automatically transcribes speech and triggers analysis upon completion.

### C. Female Voice Synthesis Player
- Every `ResultCard.jsx` features a dedicated **"🔊 Read Aloud"** button.
- Uses acoustic filtering in `speech.js` to select a natural female TTS voice matching the language.

---

## 6. Core Workflows & Data Flows

### Workflow 1: Unified Standards Search (BIS Repository & Custom PDF Mode)
```
User selects Search Mode in SearchTab.jsx:
  Option A (BIS Knowledge Base):
    - Uses selectedDocuments from sidebar
    - POST /api/search/preloaded -> PyMuPDF filtered extraction -> Gemini analysis
  Option B (Upload & Query):
    - User drops custom PDF
    - POST /api/search/custom (multipart/form-data) -> temp_uploads extraction -> Gemini analysis
                      |
                      v
ResultCard renders findings + "🔊 Read Aloud" TTS player + PDF jump buttons
```

### Workflow 2: Predictive Gap Analysis Flow
```
User enters product technical specifications
                      |
                      v
POST /api/gap-analysis
                      |
                      v
Gemini evaluates parameters against BIS standard limits
                      |
                      v
Renders Compliance Heatmap (PASS/WARNING/FAIL) with clause citations & remedies
```

### Workflow 3: Multi-Document Executive Summary Flow
```
User checks desired standards in sidebar -> clicks "Generate Executive Digest"
                      |
                      v
POST /api/summary { language, selected_documents }
                      |
                      v
Synthesizes mandatory obligations, testing protocols, and risk areas for selected scope
```

### Workflow 4: Vision OCR CM/L Validation Flow
```
User uploads product label photograph
                      |
                      v
POST /api/cml/verify-enhanced -> Gemini Vision OCR -> cml_database.json cross-check
                      |
                      v
Displays composite verification status (VALID / EXPIRED / SUSPENDED / UNREGISTERED)
```

### Workflow 5: Statutory Penalties & Legal Risk Assessment
```
User checks desired standards in sidebar -> clicks "Extract Legal Penalties"
                      |
                      v
POST /api/penalties { language, selected_documents }
                      |
                      v
Extracts penal clauses, fine ranges, imprisonment terms, and mitigation matrices
```

### Workflow 6: Audit Report Generation & Blob Export
```
User clicks "PDF Report" on any ResultCard
                      |
                      v
POST /api/export/pdf -> ReportLab builds PDF buffer
                      |
                      v
FastAPI returns Response(media_type="application/pdf", filename="BIS_Compliance_Report.pdf")
                      |
                      v
Axios receives responseType: 'blob' -> window.URL.createObjectURL(blob) -> file downloaded
```

---

## 7. Elevated Enterprise Navy & Gold Design System

| Design Token | Value | Applied Surface | Rationale |
|---|---|---|---|
| **Deep Midnight Navy** | `#071527` | Base background, scrollbar track, modal backdrop | Conveys high-grade security, depth, and executive gravitas |
| **Enterprise Navy** | `#0B2545` | Card surfaces, sidebar, navbar, table headers | Institutional foundation, government document aesthetic |
| **Surface Navy** | `#13315C` | Elevated gradient card backgrounds, active pills | Depth separation without heavy shadows |
| **Imperial BIS Gold** | `#D4AF37` | Active borders, key badges, citation buttons, icons | Evokes official gold certification seals and standards authority |
| **Bright Gold Highlight**| `#FFC107` | Subheadings, button hover gradients, active tabs | High visibility accent for interactive actions |
| **Soft Gold Text** | `#FFD54F` | Code blocks, KPI numbers, highlighted clauses | Optimal readability and contrast against deep navy |
| **Indian Tricolor Bar** | `#FF9933` / `#FFFFFF` / `#128807` | 3px Navbar Top Stripe | National identity honoring the Saffron, White, and Green |

---

## 8. Module & File Structure Breakdown

```
Testing 2/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes_preload_search.py  # BIS Knowledge Base search (multi-doc filter)
│   │   │   ├── routes_custom_search.py   # Ad-hoc custom PDF search
│   │   │   ├── routes_gap_analysis.py    # Predictive tech specs reviewer
│   │   │   ├── routes_summary.py         # Multi-doc executive compliance digests
│   │   │   ├── routes_penalties.py       # Multi-doc penalties & legal liabilities
│   │   │   ├── routes_cml_vision.py      # Vision OCR + local registry lookup
│   │   │   ├── routes_analytics.py       # Portal metrics & KPI aggregator
│   │   │   ├── routes_export.py          # ReportLab PDF & OpenPyXL Excel export
│   │   │   └── routes_upload.py          # Standard PDF repository management
│   │   ├── core/
│   │   │   ├── ai_engine.py              # Gemini client abstraction with fallbacks
│   │   │   └── config.py                 # Central settings & paths
│   │   ├── services/
│   │   │   ├── pdf_service.py            # PyMuPDF extractor with document filtering
│   │   │   ├── vision_service.py         # Gemini Vision label OCR
│   │   │   └── export_service.py         # NumberedCanvas PDF & Excel builders
│   │   └── main.py                       # FastAPI entry point & CORS configuration
│   ├── cml_database.json                 # Curated BIS license database
│   ├── stored_documents/                 # Official preloaded BIS PDFs
│   ├── temp_uploads/                     # Ad-hoc custom workspace PDFs
│   ├── test_enterprise.py                # Backend unit & integration test suite
│   ├── requirements.txt                  # Python dependencies
│   └── .env                              # API keys & configuration
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx                # Enterprise Navy top bar with language dropdown
│   │   │   ├── Sidebar.jsx               # Multi-document selector with Select All toggle
│   │   │   ├── ResultCard.jsx            # Markdown viewer with TTS & export controls
│   │   │   ├── InteractivePdfViewer.jsx  # Embedded PDF modal with page jump
│   │   │   ├── ProgressBar.jsx           # Corporate progress indicator
│   │   │   └── MicButton.jsx             # Embedded interactive microphone button
│   │   ├── context/
│   │   │   └── LanguageContext.jsx       # Global i18n dictionary (EN / HI / MR)
│   │   ├── pages/
│   │   │   ├── SearchTab.jsx             # Unified Standards Search (BIS + Upload Mode)
│   │   │   ├── GapAnalysisTab.jsx        # Predictive Tech Specs Gap Analysis
│   │   │   ├── SummaryTab.jsx            # Multi-document Executive Summary generator
│   │   │   ├── PenaltiesTab.jsx          # Multi-document Penalties & Risks extractor
│   │   │   ├── CMLScannerTab.jsx         # Vision OCR license authenticator
│   │   │   └── AnalyticsDashboard.jsx    # Regulatory KPIs & Recharts telemetry
│   │   ├── services/
│   │   │   └── api.js                    # Central Axios client with blob handling
│   │   ├── utils/
│   │   │   └── speech.js                 # Web Speech API helpers (Recognition & TTS)
│   │   ├── App.jsx                       # 6-tab navigation & global selection state
│   │   ├── main.jsx                      # React 19 entry point
│   │   └── index.css                     # Elevated Navy & Gold design tokens & styles
│   ├── package.json                      # Frontend dependencies
│   └── vite.config.js                    # Vite bundler configuration
│
└── PROJECT_ARCHITECTURE.md               # Master system architecture document
```

---

## 9. API Endpoint Reference

| HTTP Method | Endpoint | Description | Request Payload | Response Type |
|---|---|---|---|---|
| `POST` | `/api/search/preloaded` | Search indexed standards with optional document filtering | `{ query, language, selected_documents, voice_mode }` | JSON (`response`, `documents_searched`) |
| `POST` | `/api/search/custom` | Analyze an uploaded custom PDF in isolated workspace | `multipart/form-data` (`file`, `query`, `language`) | JSON (`response`, `filename`, `temp_file`) |
| `POST` | `/api/gap-analysis` | Predictive gap analysis of technical specifications | `{ specs, standard_hint, language }` | JSON (`overall_status`, `score`, `parameters[]`) |
| `POST` | `/api/summary` | Executive regulatory compliance digest with filter scope | `{ language, selected_documents }` | JSON (`response`, `documents_analyzed`) |
| `POST` | `/api/penalties` | Extract offences and fine structures with filter scope | `{ language, selected_documents }` | JSON (`response`, `documents_analyzed`) |
| `POST` | `/api/cml/verify-enhanced` | Multimodal Vision OCR + registry cross-check | `multipart/form-data` (`file`) | JSON (`ocr_findings`, `registry_verification`) |
| `GET` | `/api/cml/registry` | Retrieve all entries in the BIS CM/L license registry | None | JSON (`records[]`, `total`) |
| `GET` | `/api/analytics/metrics` | Calculate real-time portal telemetry and KPIs | None | JSON (`overview`, `standards`, `charts`) |
| `POST` | `/api/export/pdf` | Generate ReportLab compliance audit PDF report | `{ title, content, doc_names }` | Binary stream (`application/pdf`) |
| `POST` | `/api/export/excel` | Generate OpenPyXL compliance audit Excel workbook | `{ title, content, doc_names }` | Binary stream (`.xlsx`) |
| `GET` | `/api/documents` | List all active stored BIS standards | None | JSON (`documents[]`, `count`) |
| `GET` | `/api/documents/{file}/view`| Stream standard or temp PDF file for in-browser viewer | None | Binary stream (`application/pdf`) |
| `POST` | `/api/upload` | Add new official standard PDF to repository | `multipart/form-data` (`files`) | JSON (`uploaded[]`, `errors[]`) |
| `DELETE` | `/api/documents/{file}` | Remove a standard PDF from the repository | None | JSON (`message`) |

---

*Document Version 2.3.0 — Bureau of Indian Standards Compliance & Analytics Portal.*  
*Maintained by the Enterprise Architecture Team.*
