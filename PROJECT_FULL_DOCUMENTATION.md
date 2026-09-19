# BIS Standard Compliance & Analytics Portal
## Master Project Documentation, Synopsis & PPT Preparation Manual

**Document Type:** Single Source of Truth (Project Report + Architecture Manual + Slide Deck Outline)  
**Project Title:** BIS Standard Compliance & Analytics Portal  
**System Version:** 2.0.0 (Architecture Manual 2.3)  
**Document Version:** 1.0.0  
**Date:** September 2026  
**Audience:** Project evaluators, faculty reviewers, industry jury, and presentation teams  

---

# TABLE OF CONTENTS

1. [Section 1 — Executive Project Overview & Synopsis](#section-1--executive-project-overview--synopsis)
2. [Section 2 — Architecture, Tech Stack & System Justifications](#section-2--architecture-tech-stack--system-justifications)
3. [Section 3 — File-by-File Codebase Map & Directory Tree](#section-3--file-by-file-codebase-map--directory-tree)
4. [Section 4 — Deep Dive into Core Modules & Workflows](#section-4--deep-dive-into-core-modules--workflows)
5. [Section 5 — Slide-by-Slide PPT Presentation Outline](#section-5--slide-by-slide-ppt-presentation-outline)
6. [Appendix A — Complete API Endpoint Reference](#appendix-a--complete-api-endpoint-reference)
7. [Appendix B — Data Models & JSON Schemas](#appendix-b--data-models--json-schemas)
8. [Appendix C — Design System Tokens](#appendix-c--design-system-tokens)
9. [Appendix D — How to Run the Project](#appendix-d--how-to-run-the-project)

---

# SECTION 1 — EXECUTIVE PROJECT OVERVIEW & SYNOPSIS

## 1.1 Project Title

**BIS Standard Compliance & Analytics Portal**

An AI-powered, multilingual, monorepo SaaS platform that helps Indian manufacturers, factory inspectors, quality engineers, and compliance officers interpret Bureau of Indian Standards (BIS) documents, verify CM/L licenses, predict technical non-compliance, and generate audit-ready reports.

**Tagline / Motto:**  
`मानक: पथप्रदर्शक:` — *Standards are the pathfinders*  
Bureau of Indian Standards Compliance Intelligence Platform

---

## 1.2 Problem Statement

India’s product-quality ecosystem is governed by the **Bureau of Indian Standards (BIS)** and the **BIS Act, 2016**. In practice, compliance work remains slow, paper-heavy, and error-prone. Four structural problems define the industry reality.

### 1.2.1 Dense Indian Standard (IS) Gazette Notifications

Indian Standards (IS) documents are long, clause-dense PDFs. A single specification such as **IS 14543 (Packaged Drinking Water)** or **IS 13252 (IT Equipment Safety)** may contain:

- Hundreds of pages of technical clauses, tables, annexures, and sampling schemes.
- Mandatory microbiological, chemical, mechanical, or electrical limits.
- Cross-references to other IS numbers, test methods, and marking rules.
- Legal language that is difficult for shop-floor staff to interpret quickly.

Factory inspectors and QA engineers currently open these PDFs manually, search by keyword, and copy clause numbers into Excel. This process is slow, inconsistent, and unsuited to multilingual shop floors.

### 1.2.2 Manual CM/L License Verification Bottlenecks

Every product carrying the **ISI Standard Mark** must display a **CM/L (Certificate of Conformity / License)** number in the form `CM/L-XXXXXXXXXX`. Verification today typically requires:

- Visual inspection of a printed label or packaging photograph.
- Manual transcription of the license number.
- Cross-checking against government portals or paper registers.
- Separate checks for expiry, suspension, manufacturer name, and applicable IS number.

This workflow is bottlenecked by handwriting, poor print quality, fake marks, and the absence of a reliable, always-available local registry for field teams.

### 1.2.3 Lack of Public REST APIs

Official BIS and related government portals:

- Do not expose a stable, documented public REST API for standard-text search.
- Frequently use CAPTCHA, session cookies, and rate limits that block automation.
- Are not designed for factory-floor latency or offline/low-connectivity use.
- Cannot be depended upon for 24×7 SaaS uptime.

Any system that “scrapes live government sites” would be fragile, legally grey, and operationally unavailable during portal outages.

### 1.2.4 Supply-Chain Non-Compliance Risks

The commercial and legal consequences of non-compliance are severe:

- **Section 29 / 30 of the BIS Act, 2016** provide for fines (including ranges up to ₹5 lakh and more in aggravated cases) and imprisonment (up to 2 years for certain offences).
- Counterfeit or expired ISI marks expose importers, distributors, and retailers to seizure, compounding, and recall.
- A single out-of-limit parameter (for example TDS of 620 mg/L against IS 14543’s 500 mg/L maximum) can fail an entire batch.
- There is no unified “pre-submission” tool that matches a Bill of Materials (BOM) or lab sheet against statutory limits **before** a product is certified or shipped.

**Result:** Compliance remains reactive. Teams discover violations after audits, not before production.

---

## 1.3 Proposed Solution

The portal is a **modern, AI-powered Monorepo SaaS** that brings four intelligence layers into one enterprise UI:

| Intelligence Layer | What It Does |
|---|---|
| **Semantic Search** | Natural-language Q&A over official IS PDFs with clause citations and click-to-page PDF jump. |
| **Computer Vision OCR** | Gemini multimodal vision extracts `CM/L-XXXXXXXXXX`, manufacturer, and IS number from a product-label photograph. |
| **Predictive Engineering Gap Analysis** | Matches free-form technical specs / BOM values against BIS limits and returns a PASS / WARNING / FAIL heatmap. |
| **Multilingual Voice Access** | In-browser Hindi / English / Marathi speech recognition and female-voice text-to-speech on every result card. |

### 1.3.1 Six Core Product Modules

1. **Standards Search & Multi-Document Selector** — Query the central BIS repository or upload an ad-hoc PDF.
2. **Predictive Gap Analysis (Tech Specs Reviewer)** — Score product specifications against statutory limits.
3. **Executive Summary & Single-Click Export** — Generate a digest and download PDF / Excel audit packs.
4. **Penalties & Legal Risk Inspector** — Extract fines, imprisonment risk, and offence categories under the BIS Act 2016.
5. **CM/L Vision OCR License Scanner** — Photograph → OCR → local `cml_database.json` match.
6. **Analytics Dashboard & KPIs** — Query volumes, risk distribution, document coverage, and license telemetry.

### 1.3.2 Unique Value Proposition (UVP)

- **Zero dependence on government portals.** Official PDFs are pre-loaded in `backend/stored_documents/`. License records live in `backend/cml_database.json`. The system has **0% downtime** caused by CAPTCHA, session expiry, or portal outages.
- **Citation-first answers.** Every search response can include `[Doc: <filename.pdf> | Page N]` markers that open an in-browser PDF viewer on the exact page.
- **Shop-floor voice UX.** Inspectors can speak a query in Hindi or English and hear the answer read back in a female TTS voice.
- **Audit artefacts, not chat logs.** One click produces a ReportLab PDF certificate-style report or a Pandas/OpenPyXL Excel workbook.
- **Enterprise visual identity.** Deep Navy `#0B2545` + Imperial Gold `#D4AF37` with an Indian Tricolor accent bar.

---

## 1.4 Target Audience

| Persona | Primary Need | Portal Module Used |
|---|---|---|
| **Factory Inspectors** | Fast clause lookup on the shop floor; voice Q&A; label authenticity check. | Standards Search, Voice, CM/L Scanner |
| **Compliance Officers** | Executive digests, penalty exposure, multi-standard scope control. | Summary, Penalties, Sidebar Selector |
| **Quality Assurance Engineers** | Pre-submission matching of lab results / BOM against IS limits. | Gap Analysis Heatmap |
| **Manufacturers / Plant Managers** | Audit-ready PDF/Excel packs, KPI dashboards, license registry health. | Export, Analytics Dashboard |

Secondary users include importers, certification consultants, academic evaluators, and statutory auditors.

---

## 1.5 Project Objectives

1. Reduce time-to-answer for a BIS clause query from tens of minutes of PDF hunting to seconds of natural-language search.
2. Detect counterfeit, expired, or unregistered CM/L marks from a smartphone photograph.
3. Predict PASS / FAIL of technical parameters **before** statutory submission.
4. Produce printable, numbered PDF audit reports and structured Excel checklists.
5. Serve Hindi, English, and Marathi users with both UI translation and spoken I/O.
6. Remain fully operational without live access to government websites.

---

## 1.6 Scope of the Current System (v2.0)

**In scope**

- FastAPI backend + React Vite frontend monorepo.
- Preloaded IS PDF repository with multi-document checkbox filtering.
- Custom PDF upload Q&A in an isolated temp workspace.
- Gemini-powered text generation, vision OCR, and multilingual answers.
- Local CM/L JSON registry with VALID / EXPIRED / SUSPENDED / UNREGISTERED outcomes.
- PDF and Excel binary exports.
- Recharts analytics dashboard.
- Web Speech API (recognition + female TTS).

**Out of scope (roadmap)**

- Production vector database / RAG embeddings.
- Live BIS portal integration.
- Multi-tenant cloud identity (SSO, RBAC).
- Mobile native apps.
- Digital signature / e-stamping of certificates.

---

## 1.7 One-Paragraph Synopsis (for reports)

The BIS Standard Compliance & Analytics Portal is an AI-powered SaaS monorepo that converts dense Indian Standard PDFs and product-label photographs into actionable compliance intelligence. Built with FastAPI, React (Vite), Tailwind CSS, and Google Gemini, it provides semantic search with page-level citations, predictive PASS/WARNING/FAIL gap analysis of technical specifications, executive summaries, BIS Act 2016 penalty extraction, Vision-OCR CM/L license verification against a local JSON registry, and a Recharts analytics dashboard. Persistence is fully local (`stored_documents/` and `cml_database.json`), eliminating downtime from captcha-blocked government portals. Hindi, English, and Marathi voice input/output make the system usable on the factory floor. The platform targets inspectors, compliance officers, QA engineers, and manufacturers who must interpret IS Gazettes, verify ISI marks, and produce audit-ready PDF/Excel reports in minutes rather than days.

---

# SECTION 2 — ARCHITECTURE, TECH STACK & SYSTEM JUSTIFICATIONS

## 2.1 Architecture Pattern: Monorepo (`backend/` FastAPI + `frontend/` React Vite)

```
bis_compliance_portal/
├── backend/     → FastAPI ASGI service on port 8000
└── frontend/    → React 19 + Vite 6 SPA on port 5173
```

**Why a monorepo was chosen**

| Reason | Justification |
|---|---|
| Single source of product truth | API contracts, design tokens, and domain language (CM/L, IS numbers, BIS Act) stay aligned. |
| Academic / demo deployability | One repository clones, documents, and presents as one system. |
| Independent runtimes | Python AI/PDF stack and JavaScript UI stack can evolve without a shared language runtime. |
| Clear ownership | `backend/app/api` owns HTTP; `frontend/src/pages` owns UX; `services` own side effects. |

**Why not a microservices mesh at this stage**

The workload is I/O-bound (PDF extraction + Gemini calls), not compute-sharded. Splitting search, vision, and export into separate services would add operational cost without improving the demo or the current user scale.

**Runtime topology**

```
Browser SPA (React, port 5173)
        │  Axios JSON / FormData / Blob
        │  Web Speech API (local, no server)
        ▼
FastAPI (Uvicorn, port 8000)
        │
        ├── pdf_service.py      → PyMuPDF over stored_documents/
        ├── vision_service.py   → Gemini Vision over label bytes
        ├── export_service.py   → ReportLab + OpenPyXL buffers
        └── ai_engine.py        → google-genai Client
                │
                ▼
        Google Gemini Flash (HTTPS)
```

CORS is enabled with `allow_origins=["*"]` so the Vite dev server can call the API during local development.

---

## 2.2 Backend Framework: FastAPI

**Chosen technology:** FastAPI (Python 3.10+) on Uvicorn / Starlette ASGI.

**Why this technology was chosen**

1. **Async execution.** Gemini calls, file reads, and PDF parsing are I/O-bound. FastAPI’s `async def` route handlers keep the event loop free while waiting on the model or disk.
2. **Auto-Pydantic validation.** Request bodies such as `PreloadSearchRequest`, `GapAnalysisRequest`, and `ExportPayload` are declared as Pydantic `BaseModel` classes. Invalid JSON is rejected before business logic runs.
3. **OpenAPI Swagger for free.** Visiting `http://localhost:8000/docs` produces an interactive contract. This is essential for demos, faculty evaluation, and frontend-backend alignment.
4. **Python ecosystem fit.** The heaviest libraries in this product — PyMuPDF, ReportLab, Pandas, OpenPyXL, Pillow, `google-genai` — are first-class Python packages. FastAPI sits naturally on top of them.
5. **Typed HTTP responses.** Binary PDF/Excel exports use FastAPI `Response` with correct `media_type` and `Content-Disposition` headers, which Axios then consumes as blobs.

**Why not Flask or Django**

- Flask would require manual OpenAPI, weaker async story, and extra validation code.
- Django’s ORM/admin orientation is unused here; persistence is JSON + filesystem, not a relational schema.

---

## 2.3 AI Engine: Google Gemini (Flash family) via `google-genai` SDK

**Chosen technology:** Google Generative AI official SDK (`google-genai`), with a resilient model fallback chain in `backend/app/core/ai_engine.py`.

The UI presents the engine as **Gemini 2.5 Flash**. The backend default model name is read from `GEMINI_MODEL` in `backend/.env` (fallback `gemini-3.5-flash`) and then walks a fallback list (`gemini-3.6-flash`, `gemini-flash-latest`, lite variants, etc.) on 404 / 429 / 503 / 500 errors.

**Why Gemini Flash was chosen**

| Capability | Why it matters for BIS work |
|---|---|
| **Multimodal vision** | A single model family can both read IS text and OCR a CM/L label photograph. No second OCR vendor. |
| **Rapid token throughput** | Flash-class models return clause-level answers fast enough for an inspector standing at a production line. |
| **Large context window** | Entire standard PDFs (capped at ~500,000 extracted characters in `pdf_service.py`) can be placed in one prompt. This is “whole-document RAG without a vector DB” for the current corpus. |
| **JSON-mode discipline** | Gap analysis and CM/L extraction instruct the model to emit parseable JSON. The backend strips markdown fences and `json.loads` the payload. |
| **Multilingual generation** | The same prompt can demand English, Hindi, Marathi, Gujarati, Bengali, or Tamil output. |

**Resilience design**

`should_try_next_model()` retries on capacity spikes (`503`, `unavailable`, `high demand`), missing model IDs (`404`), quota (`429`), and transient `500` / timeout. This is mandatory for a live demo: a single overloaded model must not fail the entire portal.

**Why not a local LLM**

Local models of comparable vision + long-context quality would require GPU hardware that factory laptops and student demo machines do not have.

---

## 2.4 Data & OCR Processing

### 2.4.1 PyMuPDF (`fitz`) — Fast page-indexed text extraction

**Why PyMuPDF was chosen**

- C-backed parser; far faster than pure-Python PDF libraries for multi-page IS Gazettes.
- Per-page `page.get_text("text")` lets the service inject markers:

```
--- Doc: 04_IS_14543_Packaged_Water.pdf | Page 4 ---
```

Those markers become clickable citations in `ResultCard.jsx`.

- Selective extraction: `extract_text_from_all_pdfs(selected_documents)` honours the sidebar multi-select so Gemini only sees in-scope files.
- Hard cap of 500,000 characters prevents prompt overflow.

### 2.4.2 ReportLab — Programmatic PDF certificates

**Why ReportLab was chosen**

- Full control over letter-size layout, navy/gold heading colours (`#0B2545`, `#D4AF37`), metadata tables, and markdown-to-flowable conversion.
- Custom `NumberedCanvas` draws “BIS Standard Compliance Portal — Page X of Y” footers.
- Output is a real `application/pdf` byte buffer, not HTML-print-to-PDF, so downloads never “corrode” into blank files.

### 2.4.3 Pandas / OpenPyXL — Excel log exports

**Why Pandas + OpenPyXL were chosen**

- Markdown findings are parsed into rows (`Section`, `Compliance Item / Finding`, `Applicable Standards`, `Review Status`).
- Two sheets are written: **Audit Summary** and **Compliance Checklist**.
- OpenPyXL is the native `.xlsx` engine; Excel opens the file without a conversion warning.

### 2.4.4 Pillow

Used as a supporting image dependency for the vision pipeline and future image normalisation.

---

## 2.5 Frontend Stack

### 2.5.1 React 19 + Vite 6

**Why React**

- Component model maps 1:1 onto the six tabs (`SearchTab`, `GapAnalysisTab`, `SummaryTab`, `PenaltiesTab`, `CMLScannerTab`, `AnalyticsDashboard`).
- Global selection state (`selectedDocuments`) lives in `App.jsx` and is passed down — simple, explicit, and easy to explain in a viva.

**Why Vite**

- Instant HMR for UI iteration.
- Native ES modules; `frontend/package.json` scripts are `dev` / `build` / `preview`.
- Tailwind v4 is loaded as a Vite plugin (`@tailwindcss/vite`).

### 2.5.2 Tailwind CSS — Enterprise Navy & Gold palette with Indian Tricolor accents

Design tokens are declared in `frontend/src/index.css` `@theme`:

| Token | Hex | Role |
|---|---|---|
| Deep Midnight Navy | `#071527` | Base background, scrollbar track |
| Enterprise Navy | `#0B2545` | Cards, sidebar, navbar |
| Surface Navy | `#13315C` | Elevated gradients |
| Imperial BIS Gold | `#D4AF37` | Active borders, badges, icons |
| Bright Gold | `#FFC107` | Hover / heading accent |
| Soft Gold | `#FFD54F` | KPI numbers, code highlights |
| Saffron / White / Green | `#FF9933` / `#FFFFFF` / `#128807` | 3px navbar tricolor strip |

**Why Tailwind**

- Utility classes keep the six tabs visually consistent without a heavy component library.
- The navy/gold system can be encoded once in `@theme` and reused as `bg-navy-900`, `text-gold-400`, `border-gold-500/30`.

### 2.5.3 Lucide React Icons

**Why Lucide**

- Consistent 24px stroke icons (`Database`, `ShieldAlert`, `ScanLine`, `BarChart3`, `Mic`, `Volume2`).
- Tree-shakeable; each page imports only what it needs.
- Reads as “enterprise SaaS” rather than emoji-only UI (emojis remain only as secondary chips).

### 2.5.4 Recharts — Data visualization

**Why Recharts**

- Composable SVG charts (`AreaChart`, `PieChart`, `BarChart`) that accept the navy/gold colour array `['#D4AF37', '#38BDF8', '#10B981', ...]`.
- `ResponsiveContainer` makes the analytics tab usable on a projector during a PPT demo.
- No D3 boilerplate; chart specs stay readable in `AnalyticsDashboard.jsx`.

### 2.5.5 Supporting frontend libraries

| Library | Role |
|---|---|
| Axios | REST client, 120 s timeout, `responseType: 'blob'` for exports |
| react-markdown + remark-gfm | Render Gemini Markdown with GFM tables |
| clsx | Conditional class names |

---

## 2.6 Accessibility & Voice: Native Web Speech API

**Chosen technology:** Browser-native `SpeechRecognition` / `webkitSpeechRecognition` and `speechSynthesis`. Implemented in `frontend/src/utils/speech.js`, triggered by `MicButton.jsx` and `ResultCard.jsx`.

**Why native Web Speech API was chosen**

- **Zero extra vendor cost.** No paid STT/TTS cloud for the demo path.
- **On-device / browser-bound audio.** Microphone audio is not posted to the FastAPI server.
- **Language switching.** `getSpeechLang()` maps:
  - English → `en-IN`
  - Hindi → `hi-IN`
  - Marathi → `mr-IN`
- **Female TTS selection.** `getFemaleVoice()` prefers names such as Swara, Heera, Zira, Jenny, Neerja, Priya, Aditi. Marathi falls back to a Hindi female voice when `mr-IN` is missing.
- **Spoken-friendly AI mode.** When `voice_mode=true`, the backend prompt forbids markdown tables so TTS reads smoothly.

**UX contract**

- Mic button sits **inside** the search input, not in a separate page.
- After recognition `onend`, the transcribed query auto-submits.
- Result cards expose **Read Aloud / Stop Audio**.
- `cleanSpeechText()` strips `[Doc: …]` citations, markdown, and URLs before speaking.

---

## 2.7 Data Persistence Strategy: Local JSON + Pre-loaded Directory

**Chosen technology:**

- `backend/stored_documents/` — official IS PDFs (currently includes `04_IS_14543_Packaged_Water.pdf`).
- `backend/temp_uploads/` — ad-hoc custom PDFs (UUID-prefixed; kept so the PDF viewer can reopen them).
- `backend/cml_database.json` — curated CM/L registry (VALID / EXPIRED / SUSPENDED records).
- `backend/.env` — `GEMINI_API_KEY` and `GEMINI_MODEL` (gitignored).

**Why this persistence strategy was chosen**

| Requirement | How local persistence satisfies it |
|---|---|
| **0% downtime** | Search, summary, penalties, gap analysis, and CM/L match never call a government website. |
| **Zero CAPTCHA / unrated portals** | No scraping. Inspectors work against a controlled corpus. |
| **Demo reproducibility** | A cloned repo with the sample PDF and JSON registry works offline except for Gemini. |
| **Legal clarity** | The team ships copies of standards they are licensed/authorised to store, rather than live-scraping. |
| **Simple operations** | No PostgreSQL, Redis, or S3 required for v2.0. |

`Settings` in `config.py` auto-creates `stored_documents/` and `temp_uploads/` on boot.

---

## 2.8 Internationalization Strategy

There is **no `ThemeContext.jsx`**. Theme is CSS-token based. Language is a React Context:

- File: `frontend/src/context/LanguageContext.jsx`
- Languages: English, Hindi, Marathi
- Persistence: `localStorage` key `bis_portal_lang`
- Backend prompts receive the same language string and inject `LANGUAGE_INSTRUCTIONS` so Gemini answers in the selected language.

This split (CSS for theme, Context for i18n) keeps visual identity stable while copy and speech locale change together.

---

## 2.9 End-to-End Architecture Diagram (ASCII)

```
+==========================================================================================+
|                         CLIENT TIER — React 19 + Vite SPA (Port 5173)                    |
|                                                                                          |
|  Navbar (Tricolor + language dropdown + Gemini badge)                                    |
|  Sidebar Multi-Select  ── selectedDocuments: ["ALL"] or [filenames]                      |
|                                                                                          |
|  [Standards] [Gap Analysis] [Summary] [Penalties] [CM/L Scanner] [Analytics]             |
|       │             │            │          │            │              │                |
|       │             │            │          │            │              │                |
|  MicButton + ResultCard TTS + InteractivePdfViewer + Recharts                            |
+=============================================|============================================+
                                              | Axios (JSON / multipart / blob)
                                              v
+==========================================================================================+
|                         BACKEND TIER — FastAPI + Uvicorn (Port 8000)                     |
|  /api/search/preloaded   /api/search/custom   /api/gap-analysis                          |
|  /api/summary            /api/penalties       /api/cml/verify-enhanced                   |
|  /api/analytics/metrics  /api/export/pdf      /api/export/excel                          |
|  /api/documents          /api/upload          /api/cml/registry                          |
|                                                                                          |
|  Services: pdf_service | vision_service | export_service | ai_engine                     |
+=============================================|============================================+
                                              |
                    +-------------------------+--------------------------+
                    |                                                    |
                    v                                                    v
         Google Gemini Flash                                 LOCAL PERSISTENCE
         • Text generation                                   stored_documents/*.pdf
         • Vision OCR                                        temp_uploads/*.pdf
         • Multilingual out                                  cml_database.json
                                                             .env (API key)
```

---

# SECTION 3 — FILE-BY-FILE CODEBASE MAP & DIRECTORY TREE

## 3.1 Complete Directory Tree

```
bis_compliance_portal/
│
├── PROJECT_FULL_DOCUMENTATION.md      # THIS FILE — master report + PPT manual
├── PROJECT_ARCHITECTURE.md            # Condensed architecture manual (v2.3)
├── .gitignore                         # Ignores node_modules, venv, .env, temp_uploads, dist
│
├── backend/
│   ├── .env                           # GEMINI_API_KEY, GEMINI_MODEL (not committed)
│   ├── requirements.txt               # Python dependencies
│   ├── test_enterprise.py             # Service-level tests (CM/L, PDF, Excel, routes)
│   ├── cml_database.json              # Local BIS CM/L license registry
│   ├── stored_documents/              # Official preloaded IS PDFs
│   │   └── 04_IS_14543_Packaged_Water.pdf
│   ├── temp_uploads/                  # Ad-hoc custom PDFs (runtime)
│   └── app/
│       ├── __init__.py
│       ├── main.py                    # FastAPI app, CORS, router mount, root health
│       ├── core/
│       │   ├── __init__.py
│       │   ├── config.py              # Settings: keys, host/port, directory paths
│       │   └── ai_engine.py           # Gemini client + fallback + vision helper
│       ├── api/
│       │   ├── __init__.py
│       │   ├── routes_preload_search.py
│       │   ├── routes_custom_search.py
│       │   ├── routes_search.py
│       │   ├── routes_gap_analysis.py
│       │   ├── routes_summary.py
│       │   ├── routes_penalties.py
│       │   ├── routes_cml_vision.py
│       │   ├── routes_cml.py
│       │   ├── routes_analytics.py
│       │   ├── routes_export.py
│       │   └── routes_upload.py
│       └── services/
│           ├── __init__.py
│           ├── pdf_service.py
│           ├── vision_service.py
│           └── export_service.py
│
└── frontend/
    ├── index.html                     # SPA shell, Inter + Plus Jakarta Sans fonts
    ├── package.json                   # React 19, Vite 6, Tailwind 4, Recharts, Lucide
    ├── vite.config.js                 # @vitejs/plugin-react + @tailwindcss/vite
    └── src/
        ├── main.jsx                   # React 19 createRoot entry
        ├── App.jsx                    # 6-tab shell + selectedDocuments state
        ├── index.css                  # Navy/Gold tokens, cards, markdown, tricolor
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Sidebar.jsx
        │   ├── ResultCard.jsx
        │   ├── ProgressBar.jsx
        │   ├── MicButton.jsx
        │   └── InteractivePdfViewer.jsx
        ├── pages/
        │   ├── SearchTab.jsx
        │   ├── GapAnalysisTab.jsx
        │   ├── SummaryTab.jsx
        │   ├── PenaltiesTab.jsx
        │   ├── CMLScannerTab.jsx
        │   └── AnalyticsDashboard.jsx
        ├── context/
        │   └── LanguageContext.jsx    # EN / HI / MR dictionaries (no ThemeContext)
        ├── services/
        │   └── api.js                 # Axios client wrapping every backend route
        └── utils/
            └── speech.js              # SpeechRecognition + female TTS helpers
```

---

## 3.2 Backend Core Files

### 3.2.1 `backend/app/main.py`

**Responsibility:** Application entry point.

- Instantiates `FastAPI(title="BIS Standard Compliance Portal", version="2.0.0")`.
- Attaches `CORSMiddleware` with `allow_origins=["*"]`.
- Mounts every router under prefix `/api` with OpenAPI tags (`Documents`, `Search`, `Gap Analysis`, `Summary`, `Penalties`, `CM/L Verification`, `Enhanced CM/L Vision & Registry`, `Analytics`, `Export`).
- Registers a global `Exception` handler that returns HTTP 500 JSON `{ "detail": "Internal server error: ..." }`.
- Exposes `GET /` health payload with version and `/docs` pointer.
- `__main__` launches Uvicorn on `settings.HOST` / `settings.PORT` with `reload=True`.

### 3.2.2 `backend/app/core/config.py`

**Responsibility:** Central configuration object.

- Loads `backend/.env` via `python-dotenv` from a path relative to the file (backend root), not the process CWD. This prevents “key not found” when Uvicorn is started from `backend/app`.
- Properties:
  - `GEMINI_API_KEY` — reloads dotenv on each access so a key paste during a running session is picked up.
  - `GEMINI_MODEL` — default `gemini-3.5-flash`.
  - `HOST` default `0.0.0.0`, `PORT` default `8000`.
  - `STORED_DOCUMENTS_DIR`, `TEMP_UPLOADS_DIR` — created if missing.
  - `CML_DATABASE_PATH` — `backend/cml_database.json`.
- Exports a singleton `settings = Settings()`.

### 3.2.3 `backend/app/core/ai_engine.py`

**Responsibility:** All Gemini I/O.

- `FALLBACK_MODELS` list for capacity / 404 resilience.
- `get_client()` — raises a clear `RuntimeError` if the key is empty or still `YOUR_KEY_HERE`.
- `should_try_next_model(error_str)` — true for 503 / 429 / 404 / 500 / timeout / overloaded.
- `generate_ai_response(prompt)` — text generation used by search, gap analysis, summary, penalties.
- `generate_ai_vision_response(prompt, image_bytes, mime_type)` — builds `types.Part.from_bytes` and sends `[prompt, part]`. Used by CM/L OCR.

---

## 3.3 Backend API Route Files (`backend/app/api/`)

### 3.3.1 `routes_preload_search.py`

**Endpoint:** `POST /api/search/preloaded`  
**Role:** Official BIS Knowledge Base search.

- Pydantic model: `{ query, language, filter_standard, selected_documents, voice_mode }`.
- Resolves sidebar selection (`selected_documents` or legacy `filter_standard`).
- Calls `extract_text_from_all_pdfs(selected)`.
- If `voice_mode` is true, the prompt demands 2–4 spoken sentences and forbids markdown tables.
- Otherwise it demands `[Doc: <file> | Page N]` citation syntax.
- Returns `{ response, documents_searched, type: "preloaded_db_search" }`.

### 3.3.2 `routes_gap_analysis.py`

**Endpoint:** `POST /api/gap-analysis`  
**Role:** Predictive tech-specs reviewer.

- Input: `{ specs, standard_hint, language }`.
- Feeds **all** stored PDFs plus the user’s spec block to Gemini.
- Demands a strict JSON schema: `overall_status`, `compliance_score`, `parameters[]` with PASS/WARNING/FAIL.
- Strips ```json fences and `json.loads`. On parse failure, returns a `NEEDS_REVIEW` fallback object rather than crashing the UI.

### 3.3.3 `routes_summary.py`

**Endpoint:** `POST /api/summary`  
**Role:** Multi-document executive digest.

- Input: `{ language, selected_documents }`.
- Prompt enforces Markdown sections: Executive Summary, Key Metrics, Key Obligations, High Risk Areas, Testing & Certification, Applicability.
- Returns `{ response, documents_analyzed }`.

### 3.3.4 `routes_penalties.py`

**Endpoint:** `POST /api/penalties`  
**Role:** Legal risk inspector.

- Input: `{ language, selected_documents }`.
- Prompt extracts BIS Act 2016 penal clauses, fine ranges, imprisonment, severity, risk score, checklist, and recommendations.
- Returns `{ response, documents_analyzed }`.

### 3.3.5 `routes_cml_vision.py`

**Endpoints:**

- `POST /api/cml/verify-enhanced` — Vision OCR + registry match.
- `GET /api/cml/registry` — dump of `cml_database.json`.

**Role:** Enhanced CM/L pipeline.

- Accepts JPEG / PNG / WebP.
- `analyze_cml_image()` extracts `cml_number`, `manufacturer`, `standard`, `is_valid`, `details`.
- `verify_against_database()` does digit-stripped fuzzy match, then manufacturer fallback.
- Composite status: `VALID` / `EXPIRED` / `SUSPENDED` / `UNREGISTERED`.
- Returns `{ ocr_findings, registry_verification, composite_status, is_authentic }`.

### 3.3.6 `routes_analytics.py`

**Endpoint:** `GET /api/analytics/metrics`  
**Role:** KPI aggregator.

- Opens each stored PDF with PyMuPDF to count pages and characters.
- Categorizes files by IS number tokens (14543/13428 → Water & Food, 13252 → IT, 1786 → Steel, 694/1554 → Cables).
- Reads CM/L registry counts (valid / expired / suspended).
- Returns `overview`, `standards[]`, `sector_distribution`, `risk_matrix`, `audit_trends`.

### 3.3.7 Additional route files (supporting the six modules)

| File | Endpoint(s) | Responsibility |
|---|---|---|
| `routes_custom_search.py` | `POST /api/search/custom` | Isolated ad-hoc PDF Q&A; saves to `temp_uploads/` with UUID prefix. |
| `routes_search.py` | `POST /api/search` | Legacy unfiltered search across all stored PDFs. |
| `routes_cml.py` | `POST /api/cml-verify` | Vision-only CM/L extract without registry cross-check. |
| `routes_export.py` | `POST /api/export/pdf`, `POST /api/export/excel` | Binary ReportLab / OpenPyXL downloads. |
| `routes_upload.py` | `POST /api/upload`, `GET /api/documents`, `GET /api/documents/{file}/view`, `DELETE /api/documents/{file}` | Repository CRUD and PDF streaming for the in-browser viewer. |

---

## 3.4 Backend Service Files (`backend/app/services/`)

### 3.4.1 `pdf_service.py`

- `save_uploaded_file` — writes a PDF into `stored_documents/`.
- `list_documents` — `*.pdf` names only.
- `delete_document` — filesystem remove with existence check.
- `extract_text_from_all_pdfs(selected_documents)` — the heart of search/summary/penalties/gap analysis. Interprets `ALL` as “every file”. Injects page markers. Truncates at 500,000 characters.

### 3.4.2 `vision_service.py`

- Holds `CML_VERIFICATION_PROMPT` instructing Gemini to return **only JSON**.
- `analyze_cml_image(image_bytes, mime_type)` — vision call + fence strip + schema normalisation (`cml_number`, `is_valid`, `manufacturer`, `standard`, `details`).
- On JSON failure, still returns a structured dict with `details` containing a truncated raw dump so the UI never receives a free-form crash.

### 3.4.3 `export_service.py`

- `NumberedCanvas` — page X of Y footer in Helvetica 8, slate colour, gold-adjacent bottom rule.
- `generate_compliance_pdf` — letter page, navy title, gold subtitle “BUREAU OF INDIAN STANDARDS (BIS)”, metadata table (target standards, audit engine, classification), markdown heading/bullet conversion.
- `generate_compliance_excel` — Pandas DataFrames → OpenPyXL writer, two sheets, timestamped summary.

---

## 3.5 Frontend Components (`frontend/src/components/`)

### 3.5.1 `Navbar.jsx`

- 3px Indian tricolor strip (`.tricolor-strip`).
- Sidebar collapse toggle (`PanelLeftClose` / `PanelLeftOpen`).
- Brand: gold “BIS” + “Compliance Portal” + Enterprise badge.
- Live Gemini engine pill, active-standards counter, language dropdown (flag + native name).
- Click-outside handler closes the language menu.

### 3.5.2 `Sidebar.jsx`

- Dedicated **multi-document selector** (upload dropzone was deliberately removed from here).
- Interactive checkboxes per PDF.
- “Select All Standards” / “Clear Selection” toggle.
- Count pill `{effectiveCount}/{documents.length} selected`.
- `ALL` keyword means every document is in scope.
- Footer: “Multi-Document Filter / N Active”.

### 3.5.3 `ResultCard.jsx`

- Markdown renderer (`react-markdown` + `remark-gfm`).
- Citation interceptor: inline code matching `Doc: file.pdf | Page N` becomes a gold jump button.
- Actions: **Read Aloud** (female TTS), **PDF Report**, **Excel Sheet**, **Copy**.
- Export calls `exportAuditPdf` / `exportAuditExcel` with blob download.
- Stops speech on unmount.

### 3.5.4 `ProgressBar.jsx`

- Phased dummy progress while Gemini runs: Extracting Document Text (15%) → Analyzing Standard Clauses (45%) → Evaluating Compliance Verdict (75%) → Finalizing Citation References (90%) → Complete (100%).
- Hidden when idle.

### 3.5.5 Additional components (used by the six modules)

| File | Responsibility |
|---|---|
| `MicButton.jsx` | Gold microphone control; pulses red while listening. |
| `InteractivePdfViewer.jsx` | Full-screen modal iframe of `GET /api/documents/{file}/view#page=N` with page-jump input. |

---

## 3.6 Frontend Pages (`frontend/src/pages/`)

### 3.6.1 `SearchTab.jsx`

Unified Standards page.

- Segmented mode switch: **BIS Knowledge Base** vs **Upload & Query**.
- BIS mode: uses `selectedDocuments`, `POST /api/search/preloaded`, quick-prompt chips (microbiological limits, CM/L labeling, shelf life, lab frequency, penalties) in EN/HI/MR.
- Upload mode: inline drag-and-drop PDF zone, `POST /api/search/custom`.
- Embedded `MicButton`; recognition auto-fires search on `onend`.
- Renders `ResultCard` + `InteractivePdfViewer`.

### 3.6.2 `GapAnalysisTab.jsx`

- Preset templates: IS 14543 packaged water, IS 13252 IT adapter, IS 1786 Fe 500D TMT.
- Free-form textarea for specs.
- Calls `POST /api/gap-analysis`.
- Verdict card: COMPLIANT / NON_COMPLIANT / NEEDS_REVIEW plus score and pass/warn/fail counts.
- Parameter heatmap table with colour-coded rows and remedy text.
- Local PDF/Excel export of the heatmap.

### 3.6.3 `SummaryTab.jsx`

- Banner + “Generate Executive Digest”.
- Three feature cards: Mandatory Clauses, Lab Testing Protocols, Cross-Standard Matrix.
- Passes `selectedDocuments` to `POST /api/summary`.
- Result in `ResultCard` with citation jumps.

### 3.6.4 `PenaltiesTab.jsx`

- Red-accent legal risk banner (BIS Act 2016 Statutory Risk Engine).
- Feature cards: Imprisonment & Fines, Compounding & Seizures, Risk Mitigation.
- `POST /api/penalties` scoped to sidebar selection.
- Result in `ResultCard`.

### 3.6.5 `CMLScannerTab.jsx`

- Left: image dropzone + preview (JPEG/PNG/WebP).
- Right: composite status, extracted CM/L number, manufacturer, standard, registry match, official record, vision notes.
- Toggleable full registry table from `GET /api/cml/registry`.
- Status badges: VALID, EXPIRED, SUSPENDED, UNREGISTERED.

### 3.6.6 `AnalyticsDashboard.jsx`

- Fetches `GET /api/analytics/metrics` on mount.
- Four KPI cards: standards count, clauses indexed, compliance readiness %, CM/L licenses tracked.
- Area chart: monthly queries vs CM/L scans.
- Donut pie: sector coverage.
- Horizontal bar: risk-tier percentages.
- Catalog table of every stored PDF (pages, characters, estimated clauses, readiness).

---

## 3.7 Frontend Context (`frontend/src/context/`)

### 3.7.1 `LanguageContext.jsx`

- `LANGUAGES` metadata including `speechLang` (`en-IN`, `hi-IN`, `mr-IN`).
- Full UI dictionary for English, Hindi, and Marathi covering every tab string, button, KPI label, and status badge.
- `LanguageProvider` wraps `AppContent` in `App.jsx`.
- `useLanguage()` hook consumed by Navbar, Sidebar, all pages, and ResultCard.

### 3.7.2 Theme

**There is no `ThemeContext.jsx`.** Dark navy enterprise theme is global CSS (`index.css` `@theme` + `.enterprise-card` utilities). This is intentional: the product has a single official visual identity (Navy + Gold + Tricolor), not a user-toggled light/dark pair.

---

## 3.8 Other Frontend Files of Record

| File | Responsibility |
|---|---|
| `frontend/src/App.jsx` | Tab registry, `selectedDocuments` state machine (`ALL` vs explicit list), document fetch on boot. |
| `frontend/src/main.jsx` | `StrictMode` + `createRoot`. |
| `frontend/src/index.css` | Design system, markdown contrast, scrollbars, gold pulse animations. |
| `frontend/src/services/api.js` | Single Axios instance, `baseURL http://localhost:8000/api`, blob download helpers. |
| `frontend/src/utils/speech.js` | `getSpeechLang`, `getFemaleVoice`, `cleanSpeechText`, `speakText`, `stopSpeaking`, `createSpeechRecognition`. |
| `frontend/index.html` | Document title “BIS Standard Compliance Portal \| Bureau of Indian Standards”. |
| `frontend/vite.config.js` | React + Tailwind Vite plugins. |
| `frontend/package.json` | Scripts and dependency versions. |

---

## 3.9 Data & Test Files

| File | Responsibility |
|---|---|
| `backend/cml_database.json` | Six sample licenses (AquaPure VALID, Himalayan VALID, Apex EXPIRED, Bharat Steel VALID, Delta Cables SUSPENDED, Standard Test VALID). Fields: `cml_number`, `manufacturer`, `standard`, `product_name`, `brand_name`, `valid_from`, `valid_to`, `status`, `factory_address`, `marking_fee_status`. |
| `backend/stored_documents/04_IS_14543_Packaged_Water.pdf` | Seed official standard for demos. |
| `backend/test_enterprise.py` | Asserts CM/L lookup, PDF byte size, Excel byte size, filtered extraction, and route registration. |
| `backend/requirements.txt` | fastapi, uvicorn, google-genai, pymupdf, python-dotenv, python-multipart, pydantic, pandas, openpyxl, reportlab, pillow. |

---

# SECTION 4 — DEEP DIVE INTO CORE MODULES & WORKFLOWS

This section explains **end-to-end technical flow, data models, inputs, and outputs** for all six product modules plus the global voice feature.

---

## 4.1 Module 1 — Standards Search & Multi-Document Selector

### Purpose

Give inspectors a single search surface that can either interrogate the **central BIS repository** or an **inline ad-hoc upload**, always constrained by the sidebar’s multi-select state.

### Sidebar state management

```
App.jsx
  documents: string[]                  ← GET /api/documents
  selectedDocuments: ["ALL"] | string[]

  handleToggleDocument(doc)
    if prev includes ALL → expand to full list, then drop/add doc
    if next.length === documents.length → collapse back to ["ALL"]

  handleSelectAll → ["ALL"]
  handleClearAll  → []
```

`Sidebar.jsx` treats `ALL` as “every checkbox checked”. The selected count pill always shows a numeric `effectiveCount`.

`SearchTab`, `SummaryTab`, and `PenaltiesTab` receive `selectedDocuments` as props. Gap Analysis currently evaluates the full repository (by backend design) but still requires `hasDocuments` to enable the run button.

### Mode A — Central repository Q&A (default)

```
User types / speaks query
        │
        ▼
SearchTab.handleSearch (searchMode === 'bis')
        │  guards: query non-empty, selectedDocuments.length > 0
        ▼
POST /api/search/preloaded
  {
    query,
    language,                 // "English" | "Hindi" | "Marathi" | ...
    selected_documents,       // ["ALL"] or ["04_IS_14543_....pdf"]
    voice_mode: false
  }
        │
        ▼
pdf_service.extract_text_from_all_pdfs(selected)
  → combined_text with [Doc: name | Page n] markers
        │
        ▼
ai_engine.generate_ai_response(prompt as BIS Principal Regulatory Officer)
        │
        ▼
JSON { response, documents_searched, type: "preloaded_db_search" }
        │
        ▼
ResultCard Markdown + citation buttons
        │ click [Doc: file | Page 4]
        ▼
InteractivePdfViewer iframe
  http://localhost:8000/api/documents/{file}/view#page=4
```

**Inputs**

- Natural-language query (typed or voice).
- Language from `LanguageContext`.
- Document scope from sidebar.

**Outputs**

- Markdown answer with clause numbers and gold citation chips.
- Optional TTS playback.
- Optional PDF/Excel export of that answer.

### Mode B — Inline ad-hoc upload Q&A

```
User switches to "Upload & Query"
        │
        ▼
Drag-drop PDF → customFile in component state
        │
        ▼
POST /api/search/custom  (multipart)
  file, query, language
        │
        ▼
UUID prefix saved under temp_uploads/
PyMuPDF extract with page markers (cap 450,000 chars in prompt)
        │
        ▼
Gemini answers as BIS + International Standards specialist
        │
        ▼
JSON { response, filename, temp_file, pages, status }
        │
        ▼
ResultCard title "Custom Analysis: {filename}"
Citation click uses result.temp_file so the viewer streams the temp PDF
```

The custom file is **not** mixed into the official repository. Isolation prevents a vendor manual from polluting statutory search.

---

## 4.2 Module 2 — Predictive Gap Analysis / Tech Specs Reviewer

### Purpose

Match a manufacturer’s technical specifications or BOM against BIS numerical / qualitative limits **before** certification filing. Produce a compliance heatmap.

### End-to-end flow

```
User pastes specs OR clicks a preset (IS 14543 / IS 13252 / IS 1786)
        │
        ▼
POST /api/gap-analysis
  { specs: "<free text>", standard_hint: null, language }
        │
        ▼
extract_text_from_all_pdfs()          # full repository
        │
        ▼
Gemini as "Senior Technical Auditor & Product Certification Engineer"
  1. Parse every parameter (TDS, pH, voltage, yield strength, ...)
  2. Locate BIS limit + clause
  3. Status PASS | WARNING | FAIL
  4. Score 0–100, overall COMPLIANT | NON_COMPLIANT | NEEDS_REVIEW
        │
        ▼
JSON schema (see Appendix B)
        │
        ▼
UI heatmap table
  FAIL rows   → red background
  WARNING     → amber
  PASS        → default navy
        │
        ▼
Optional export: PDF report / Excel checklist of parameter verdicts
```

### Example (IS 14543 packaged water preset)

| Parameter | User value | BIS limit | Status |
|---|---|---|---|
| TDS | 620 mg/L | Max 500 mg/L (Clause 4.2 Table 1) | FAIL |
| pH | 7.2 | 6.5 – 8.5 | PASS |
| Total Coliform | Absent in 250 ml | Absent | PASS |

Each FAIL/WARNING row also carries an **observation** and a **remedy** (for example “Adjust RO membrane filtration…”).

### Data model (response)

See Appendix B.1. The frontend reads `overall_status`, `compliance_score`, `passed_count`, `warnings_count`, `critical_failures_count`, `applicable_standard`, `summary`, and `parameters[]`.

---

## 4.3 Module 3 — Executive Summary & Single-Click Export

### Purpose

Turn one or many selected IS PDFs into a board-level briefing, then download a numbered PDF or Excel workbook.

### Summary generation flow

```
Sidebar checkboxes define scope
User clicks "Generate Executive Digest"
        │
        ▼
POST /api/summary { language, selected_documents }
        │
        ▼
Filtered PyMuPDF extraction
        │
        ▼
Gemini returns Markdown with FIXED headings:
  ## Executive Summary
  ## Key Metrics
  ## Key Obligations
  ## High Risk Areas
  ## Testing & Certification Requirements
  ## Applicability
        │
        ▼
ResultCard (copy / speak / export)
```

### Single-click export flow (from any ResultCard, including Summary)

```
User clicks "PDF Report" or "Excel Sheet"
        │
        ▼
api.js exportAuditPdf / exportAuditExcel
  Axios POST /api/export/pdf or /api/export/excel
  body: { title, content, doc_names }
  responseType: 'blob'
        │
        ▼
Backend:
  generate_compliance_pdf  → ReportLab buffer, NumberedCanvas footer
  generate_compliance_excel → two-sheet OpenPyXL workbook
        │
        ▼
FastAPI Response
  Content-Type: application/pdf
    or application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
  Content-Disposition: attachment; filename="BIS_Compliance_Report.pdf"
        │
        ▼
Frontend:
  new Blob(...) → URL.createObjectURL → <a download> click → revokeObjectURL
```

This blob path is what the architecture manual calls **“corrosion-free binary exports”**: the file is a real PDF/XLSX, not a mislabelled JSON error.

---

## 4.4 Module 4 — Penalties & Legal Risk Inspector

### Purpose

Extract legal fine ranges, imprisonment risk, and offence categorisation under the **BIS Act, 2016** (especially Sections 29 and 30) from the selected standards.

### Flow

```
User selects standards → "Extract Legal Penalties"
        │
        ▼
POST /api/penalties { language, selected_documents }
        │
        ▼
Gemini as senior legal analyst
        │
        ▼
Markdown sections:
  Legal Framework
  Penal Clauses (clause, offence, fine range, imprisonment, severity HIGH/MEDIUM/LOW)
  Mandatory Compliance Obligations
  Compliance Risk Score (level + X/100 + top 3 critical areas)
  Compliance Checklist
  Recommendations
        │
        ▼
ResultCard + PDF/Excel + TTS + citation jumps
```

### What the UI emphasises (feature cards)

1. **Imprisonment & Fines** — offences carrying up to 2 years prison or ₹5 lakh+ fine.
2. **Compounding & Seizures** — search, seizure, recall powers.
3. **Risk Mitigation** — practical steps to insulate manufacturing operations.

The module does not invent statute; it asks the model to ground every penalty in the supplied document text plus the well-known BIS Act frame.

---

## 4.5 Module 5 — CM/L Vision OCR License Scanner

### Purpose

Photograph a product label, extract `CM/L-XXXXXXXXXX` (and related fields) with Gemini Vision, and match against `cml_database.json`.

### Flow

```
User drops JPEG/PNG/WebP of packaging / ISI mark
FileReader → local preview (no upload yet)
        │
        ▼
POST /api/cml/verify-enhanced  (multipart file)
        │
        ▼
vision_service.analyze_cml_image(bytes, mime)
  Gemini Vision JSON:
    cml_number, is_valid, manufacturer, standard, details
        │
        ▼
verify_against_database(cml_number, standard, manufacturer)
  1. Strip non-digits; match if ≥ 5 digits and equal/substring
  2. Else exact case-insensitive string match
  3. Else manufacturer fuzzy contains
        │
        ▼
composite_status:
  EXPIRED / SUSPENDED take priority from DB
  else VALID if OCR is_valid and DB VALID or UNREGISTERED
  is_authentic = db_matched AND status == VALID
        │
        ▼
UI cards:
  Extracted CM/L (gold mono)
  Manufacturer
  Standard
  Registry Confirmation
  Official record (product, brand, validity, marking fee, factory)
  Vision OCR notes
```

### Registry browse

`GET /api/cml/registry` powers the in-tab table of all licenses so a compliance officer can audit the local source of truth (`cml_database.json`) without scanning an image.

### Why a local JSON registry

Government CM/L lookup pages are captcha-gated. A curated JSON file gives deterministic demo outcomes (VALID AquaPure `CM/L-8400192408`, EXPIRED Apex `CM/L-6100143890`, SUSPENDED Delta `CM/L-5500119874`) and 0% lookup downtime.

---

## 4.6 Module 6 — Analytics Dashboard & KPIs

### Purpose

Show regulatory telemetry: how large the corpus is, how risk is distributed, and how query/verification volume is trending.

### Flow

```
AnalyticsDashboard mount
        │
        ▼
GET /api/analytics/metrics
        │
        ▼
For each PDF in stored_documents:
  pages, characters, category, estimated_clauses ≈ pages * 4
Read cml_database.json:
  total, valid, expired, suspended
Assemble:
  overview KPIs
  sector_distribution (pie)
  risk_matrix (horizontal bars)
  audit_trends (area chart Jan–Jun)
        │
        ▼
Recharts ResponsiveContainer
  AreaChart  — queries (gold) vs verifications (emerald)
  PieChart   — Water & Food / IT / Steel / Electrical
  BarChart   — Critical penalties / Lab testing / Labeling / Advisory
Table        — per-document catalog
```

### KPI cards (exact fields)

| KPI | Source field |
|---|---|
| Active Standards | `overview.total_standards` (+ pages) |
| Clauses Indexed | `overview.estimated_clauses` |
| Compliance Readiness | `overview.average_compliance_health` (95.8%) |
| Tracked CM/L Licenses | `overview.cml_licenses_tracked` (+ valid/expired) |

Refresh button re-fetches metrics after new PDFs are added to the repository.

---

## 4.7 Global Feature — Multilingual Voice Search

This is not a seventh tab. It is **embedded** in the Standards search bar and in every `ResultCard`.

### Microphone (Speech-to-Text)

```
User clicks MicButton
        │
        ▼
createSpeechRecognition(language)
  window.SpeechRecognition || webkitSpeechRecognition
  lang = en-IN | hi-IN | mr-IN
  continuous = false, interimResults = true
        │
        ▼
onresult → setQuery(transcript)
onend    → auto handleSearch(input.value)
onerror  → ignore 'no-speech'; otherwise show error
```

Unsupported browsers (non-Chromium) receive `t.micNotSupported`.

### Female voice playback (Text-to-Speech)

```
User clicks "Read Aloud" on ResultCard
        │
        ▼
speakText(content, language, onStart, onEnd)
  speechSynthesis.cancel()
  cleanSpeechText() strips citations, markdown, URLs
  getFemaleVoice() picks Swara / Zira / Jenny / Neerja / ...
  rate 1.0, pitch 1.05
        │
        ▼
Button switches to "Stop Audio" (red pulse) until onend
```

### Language switching

Navbar language change updates:

1. Entire UI dictionary (`t.*`).
2. Gemini `LANGUAGE_INSTRUCTIONS` on the next API call.
3. Recognition locale and TTS voice on the next mic/speak action.

Quick-prompt chips in SearchTab also swap to Hindi / Marathi question text.

---

## 4.8 Cross-Cutting Data Flow Summary

```
                    selectedDocuments (App.jsx)
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
     Search (BIS)          Summary            Penalties
          │                   │                   │
          └────────────┬──────┴───────────────────┘
                       ▼
            pdf_service (filtered PDFs)
                       ▼
                 ai_engine (Gemini)
                       ▼
                  ResultCard
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
        TTS         PDF blob     Excel blob
```

Gap Analysis and Analytics read the **full** repository (not the sidebar filter) because they are corpus-level evaluators. CM/L Scanner does not use PDFs at all; it uses images + `cml_database.json`.

---

# SECTION 5 — SLIDE-BY-SLIDE PPT PRESENTATION OUTLINE

Use this section as a ready-to-type 12-slide deck. Each slide lists **title, exact bullets, visual suggestion, and speaker notes**. Target duration: 10–12 minutes plus Q&A.

---

## Slide 1 — Title, Team, Project Identity

**Title:** BIS Standard Compliance & Analytics Portal

**Exact bullets**

- AI-Powered Regulatory Intelligence for Indian Manufacturing
- Bureau of Indian Standards (BIS) • BIS Act 2016
- Motto: मानक: पथप्रदर्शक: — *Standards are the pathfinders*
- Monorepo SaaS: FastAPI backend + React Vite frontend
- Version 2.0 • Enterprise Navy & Gold identity
- Team: [Insert names, roll numbers, department, college]
- Guide / Mentor: [Insert name]

**Visual diagram suggestion**

- Full-bleed deep navy (`#0B2545`) background.
- Gold shield icon top-centre.
- 3-pixel tricolor bar (Saffron / White / Green) under the title.
- Small ISI-mark inspired gold seal in the corner (do not copy a trademarked logo; use a generic shield).

**Speaker notes**

“Good morning. We present the BIS Standard Compliance and Analytics Portal — an AI platform that helps Indian factories interpret Indian Standards, verify ISI licence marks, and produce audit reports in minutes. The product is a single monorepo: a FastAPI intelligence backend and a React enterprise frontend, designed for inspectors and quality engineers on the shop floor.”

---

## Slide 2 — Problem Statement & Industry Reality

**Title:** The Compliance Gap on India’s Shop Floor

**Exact bullets**

- IS Gazette PDFs are hundreds of pages of dense clauses and tables.
- CM/L / ISI mark checks are still manual: photograph → type number → portal lookup.
- Official portals lack public REST APIs and are blocked by CAPTCHA and downtime.
- Non-compliance under BIS Act 2016 can mean seizure, fines (₹5 lakh+), and imprisonment (up to 2 years).
- QA teams discover limit violations **after** production, not before filing.
- No unified Hindi / English voice tool exists for factory inspectors.

**Visual diagram suggestion**

Four-quadrant problem grid:

```
[ Dense IS PDFs ]     [ Manual CM/L checks ]
[ No public APIs ]    [ Legal & batch risk ]
```

Red warning icons on each quadrant. Optional photo of a packaged-water label with a blurred CM/L number.

**Speaker notes**

“An inspector who needs Clause 4.2 of IS 14543 today opens a 100-page PDF, searches by hand, and copies the TDS limit into Excel. To check a licence, they retype CM/L numbers into a government site that may show a captcha. If TDS is 620 against a 500 milligram limit, the whole batch fails — and the Act allows serious penalties. That is the industry reality we set out to fix.”

---

## Slide 3 — Proposed Solution & Unique Value Proposition

**Title:** One Portal. Four Intelligence Layers.

**Exact bullets**

- **Semantic Search** — natural-language Q&A over official IS PDFs with page citations.
- **Computer Vision OCR** — Gemini Vision reads `CM/L-XXXXXXXXXX` from a label photo.
- **Predictive Gap Analysis** — BOM / lab specs scored PASS / WARNING / FAIL.
- **Multilingual Voice** — Hindi, English, Marathi mic input + female TTS playback.
- **Zero government-portal dependency** — local `stored_documents/` + `cml_database.json`.
- **Audit artefacts** — one-click ReportLab PDF and Excel checklist.
- Target users: Factory Inspectors, Compliance Officers, QA Engineers, Manufacturers.

**Visual diagram suggestion**

A hub-and-spoke: central gold “BIS Portal” circle, four spokes to Search / Vision / Gap / Voice. Outer ring labelled “Local persistence = 0% portal downtime”.

**Speaker notes**

“Our solution is not another chatbot. It is a compliance workstation. Search cites the exact PDF page. Vision authenticates the mark against a local registry so we never wait on a captcha. Gap analysis tells a plant manager what will fail before they file. And an inspector can ask in Hindi and hear the answer spoken back.”

---

## Slide 4 — System Architecture Diagram (ASCII / Flow)

**Title:** Monorepo Architecture — Client, API, AI, Local Store

**Exact bullets**

- **Client tier:** React 19 + Vite SPA (port 5173), six tabs, sidebar multi-select, Web Speech API.
- **API tier:** FastAPI + Uvicorn (port 8000), CORS, OpenAPI `/docs`.
- **Service layer:** `pdf_service` (PyMuPDF), `vision_service`, `export_service`, `ai_engine`.
- **AI tier:** Google Gemini Flash — text + multimodal vision + multilingual output.
- **Persistence:** `stored_documents/`, `temp_uploads/`, `cml_database.json`, `.env`.
- **Contract:** Axios JSON / multipart / blob. No scraping of government sites.

**Visual diagram suggestion**

Redraw this ASCII on the slide (or convert to boxes in PowerPoint):

```
Browser SPA (6 tabs + Sidebar + Mic/TTS)
        │ Axios
        ▼
FastAPI routers (/search /gap-analysis /summary /penalties /cml /analytics /export)
        │
   ┌────┴────┐
   ▼         ▼
Gemini    Local FS + JSON
Flash     PDFs + CM/L registry
```

**Speaker notes**

“Walk the arrow with me. The inspector’s browser never talks to BIS.gov.in. It talks to our FastAPI. FastAPI either extracts the selected PDFs with PyMuPDF and asks Gemini a grounded question, or it sends a label image to Gemini Vision and matches the licence number in a local JSON file. Exports are generated in-process with ReportLab and OpenPyXL. That is why the demo still works if the government portal is down.”

---

## Slide 5 — Technology Stack & Technical Choices

**Title:** Why Each Technology Was Chosen

**Exact bullets**

- **FastAPI** — async I/O, Pydantic validation, free Swagger (`/docs`).
- **Gemini Flash SDK** — multimodal vision, large context, fast tokens, JSON answers.
- **PyMuPDF** — page-indexed extraction → `[Doc: file | Page N]` citations.
- **ReportLab + Pandas/OpenPyXL** — real PDF certificates and Excel workbooks.
- **React 19 + Vite 6** — six modular tabs, instant HMR.
- **Tailwind CSS** — Enterprise Navy `#0B2545` & Gold `#D4AF37` + Tricolor bar.
- **Lucide + Recharts** — enterprise icons and KPI charts.
- **Web Speech API** — `hi-IN` / `en-IN` / `mr-IN` recognition + female TTS.
- **Local JSON + PDF directory** — 0% downtime, zero captcha.

**Visual diagram suggestion**

Two-column table: *Technology* | *One-line “Why”*. Use gold header row on navy.

**Speaker notes**

“Every library earns its place. FastAPI because Gemini calls are I/O-bound. PyMuPDF because we need page numbers, not a blob of text. ReportLab because evaluators must download a real PDF, not HTML. Tailwind because the product must look like a government-grade console, not a startup toy. Local JSON because we refuse to be blocked by a captcha during a viva.”

---

## Slide 6 — Core Feature 1: Standards Search & Document Filtering

**Title:** Standards Search — Repository Q&A + Ad-Hoc Upload

**Exact bullets**

- Sidebar **multi-document selector** with Select All / Clear Selection.
- Global state `selectedDocuments = ["ALL"]` or explicit filenames in `App.jsx`.
- Segmented mode switch inside Search:
  - **BIS Knowledge Base** → `POST /api/search/preloaded`
  - **Upload & Query** → `POST /api/search/custom` (isolated `temp_uploads/`)
- Quick prompts: microbiological limits, CM/L labelling, shelf life, lab frequency, penalties.
- Answers include clickable citations `[Doc: 04_IS_14543_Packaged_Water.pdf | Page 4]`.
- Interactive PDF viewer jumps to that page in-browser.

**Visual diagram suggestion**

Screenshot mock of SearchTab: gold segmented control, search bar with mic, citation chip, PDF modal. Left rail showing checked PDFs.

**Speaker notes**

“This is Module 1. The left sidebar is not decoration — it is the query scope. If I uncheck a standard, Gemini never sees it. If I switch to Upload & Query, I can interrogate a vendor’s private test report without polluting the official corpus. When the model cites Page 4, I click and the official PDF opens on Page 4. That is how we replace Ctrl+F across 100 pages.”

---

## Slide 7 — Core Feature 2: Predictive Engineering Gap Analysis

**Title:** Predictive Gap Analysis — PASS / WARNING / FAIL Heatmap

*(Deck numbering in the brief said “Core Feature 7”; this is Module 2 / Slide 7.)*

**Exact bullets**

- Engineer pastes technical specs or loads an industry preset (IS 14543 water, IS 13252 adapter, IS 1786 TMT).
- `POST /api/gap-analysis` sends specs + full IS corpus to Gemini.
- Model returns strict JSON: overall `COMPLIANT` / `NON_COMPLIANT` / `NEEDS_REVIEW`, score 0–100.
- Per-parameter heatmap: user value vs BIS limit vs clause vs remedy.
- Example: TDS 620 mg/L vs max 500 mg/L → **FAIL** + RO-membrane remedy.
- One-click PDF/Excel of the heatmap for the quality file.

**Visual diagram suggestion**

Table screenshot: green PASS / amber WARNING / red FAIL rows. Large gold score badge (e.g. 72%) on the right.

**Speaker notes**

“Module 2 is where we stop being a search engine and become a pre-audit. A plant can paste yesterday’s lab sheet. If aerobic count or TDS is over the statutory cap, the row turns red **before** the truck leaves. The remedy is written in the same cell, so the production team knows what to fix, not just that they failed.”

---

## Slide 8 — Core Feature 3: Vision OCR CM/L Verification

**Title:** CM/L Scanner — Photograph, Extract, Authenticate

**Exact bullets**

- Upload JPEG / PNG / WebP of packaging or ISI mark.
- Gemini Vision extracts `CM/L-XXXXXXXXXX`, manufacturer, IS number.
- Fuzzy match against local `cml_database.json` (digit-stripped + manufacturer fallback).
- Composite outcomes: **VALID • EXPIRED • SUSPENDED • UNREGISTERED**.
- `is_authentic` is true only when the registry match is VALID.
- In-app registry browser for officers who need the raw licence table.
- Independent of live BIS websites.

**Visual diagram suggestion**

Horizontal pipeline:

```
Label photo → Gemini Vision JSON → cml_database.json → Status badge
```

Show sample record `CM/L-8400192408` AquaPure / IS 14543 / VALID.

**Speaker notes**

“Counterfeit ISI marks are a supply-chain risk. The inspector photographs the jar. Vision OCR reads the licence. We then match it locally — AquaPure 8400192408 is VALID; Apex adapter licence is EXPIRED; Delta cables are SUSPENDED. We never wait for a government captcha, and we can demo every outcome deterministically.”

---

## Slide 9 — Core Feature 4: Analytics Dashboard & Automated Reporting

**Title:** Analytics KPIs + Automated Audit Reporting

**Exact bullets**

- Live metrics from `GET /api/analytics/metrics`:
  - Active standards, pages indexed, estimated clauses, readiness %.
  - CM/L licences tracked (valid / expired / suspended).
- Recharts visuals:
  - Area chart — monthly queries vs CM/L scans.
  - Pie — sector coverage (Water, IT, Steel, Electrical).
  - Bar — risk tiers (imprisonment, lab testing, labelling, advisory).
- Catalog table of every stored PDF.
- Automated reporting (from any analysis card):
  - ReportLab PDF with numbered canvas footer.
  - OpenPyXL Excel: Audit Summary + Compliance Checklist sheets.

**Visual diagram suggestion**

Dashboard screenshot (four KPI tiles on top, area chart left, pie right). Beside it, a small PDF page-1 mock with gold rule and “Page 1 of N”.

**Speaker notes**

“Leadership does not want chat logs. They want a dashboard and a file they can email to an auditor. Module 6 shows corpus coverage and risk mix. Module 3’s export path — also available from Search, Summary, Penalties, and Gap Analysis — produces a navy-and-gold PDF with page numbers and a two-sheet Excel checklist. That is the artefact that closes an audit meeting.”

---

## Slide 10 — Multilingual Voice Accessibility & Embedded Search Bot

**Title:** Voice on the Factory Floor — Hindi, English, Marathi

**Exact bullets**

- Mic button **embedded in the search bar** (`MicButton.jsx`), not a separate page.
- `SpeechRecognition` locales: `hi-IN`, `en-IN`, `mr-IN`.
- Auto-submit on recognition end — hands-free query.
- **Read Aloud** on every ResultCard uses `speechSynthesis`.
- Female voice picker: Swara, Heera, Zira, Jenny, Neerja, Priya, Aditi; Marathi falls back to Hindi female.
- `voice_mode` prompt path: 2–4 spoken sentences, no markdown tables.
- UI dictionaries fully translated in `LanguageContext.jsx`.
- Audio never leaves the browser (no STT server).

**Visual diagram suggestion**

Search bar mock with gold mic; waveform; speech bubble in Hindi: “IS 14543 में TDS की सीमा क्या है?” → gold answer chip.

**Speaker notes**

“Most factory supervisors are more comfortable speaking Hindi than typing Clause 4.2. They tap the mic, ask the question, and the answer is spoken back in a female voice after we strip citations and markdown so the speech sounds natural. Language chosen in the navbar drives the UI, the Gemini prompt, the recogniser, and the TTS voice together.”

---

## Slide 11 — Future Roadmap & Industrial Scalability

**Title:** Roadmap — From Local Corpus to Industrial RAG Cloud

**Exact bullets**

- **Vector DB / RAG:** embeddings over all IS PDFs (pgvector / Qdrant) for 10,000+ standards without stuffing 500k characters into one prompt.
- **Hybrid retrieval:** keyword + vector + clause-number filters.
- **Cloud scale:** containerise FastAPI + SPA; object storage for PDFs; managed Gemini.
- **Identity:** SSO / RBAC for plant vs corporate vs auditor roles.
- **Live registry sync:** optional licensed feed from BIS when an official API exists — keep local JSON as cache.
- **On-device / edge OCR** for plants with restricted outbound networks.
- **Mobile PWA** for one-hand label capture on the line.
- **E-sign / QR** on generated PDF certificates.

**Visual diagram suggestion**

Three-horizon timeline:

```
Now: Local PDF + JSON + Gemini Flash
Next: Vector RAG + object storage
Later: Multi-tenant cloud, SSO, licensed registry sync
```

**Speaker notes**

“We deliberately did not start with a vector database. For a curated plant corpus, whole-document prompting is simpler and fully citable. When the corpus grows to thousands of Gazettes, we will chunk by clause, embed, and retrieve — the citation marker design already assumes that future. Cloud, SSO, and a licensed registry feed are how this becomes a national SaaS rather than a plant appliance.”

---

## Slide 12 — Conclusion & Q&A

**Title:** Conclusion — Compliance Intelligence, Ready for the Line

**Exact bullets**

- We replaced PDF hunting, captcha portals, and after-the-fact failures with **one AI workstation**.
- Six modules: Search, Gap Analysis, Summary, Penalties, CM/L Scanner, Analytics — plus global voice.
- Architecture: FastAPI + React monorepo, Gemini Flash, PyMuPDF, ReportLab, local persistence.
- Outcome: clause-cited answers, PASS/FAIL heatmaps, authentic/expired licence calls, audit PDF/Excel.
- 0% dependence on unrated government UIs for day-to-day lookup.
- Built for inspectors, compliance officers, QA engineers, and manufacturers.
- **Thank you. Questions welcome.**

**Visual diagram suggestion**

Navy closing slide, gold shield, tricolor bar, team names repeated small at the bottom. Optional QR to `/docs` Swagger or a recorded demo.

**Speaker notes**

“To close: the BIS Portal is a practical answer to a national quality problem. It reads the standard, sees the mark, scores the spec, speaks the language of the shop floor, and prints the audit pack. We are happy to demo any module live — search with a citation jump, a failing TDS heatmap, or a VALID versus EXPIRED licence scan. Thank you.”

---

# APPENDIX A — COMPLETE API ENDPOINT REFERENCE

| Method | Endpoint | Module | Request | Response |
|---|---|---|---|---|
| GET | `/` | Health | — | `{ message, version, docs }` |
| POST | `/api/search/preloaded` | M1 | `{ query, language, selected_documents, voice_mode }` | `{ response, documents_searched, type }` |
| POST | `/api/search/custom` | M1 | multipart `file, query, language` | `{ response, filename, temp_file, pages }` |
| POST | `/api/search` | M1 legacy | `{ query, language }` | `{ response, documents_searched }` |
| POST | `/api/gap-analysis` | M2 | `{ specs, standard_hint, language }` | Gap JSON (Appendix B.1) |
| POST | `/api/summary` | M3 | `{ language, selected_documents }` | `{ response, documents_analyzed }` |
| POST | `/api/penalties` | M4 | `{ language, selected_documents }` | `{ response, documents_analyzed }` |
| POST | `/api/cml/verify-enhanced` | M5 | multipart `file` | `{ ocr_findings, registry_verification, composite_status, is_authentic }` |
| POST | `/api/cml-verify` | M5 legacy | multipart `file` | OCR JSON only |
| GET | `/api/cml/registry` | M5 | — | `{ records[], total }` |
| GET | `/api/analytics/metrics` | M6 | — | `{ overview, standards, sector_distribution, risk_matrix, audit_trends }` |
| POST | `/api/export/pdf` | M3 | `{ title, content, doc_names }` | `application/pdf` blob |
| POST | `/api/export/excel` | M3 | `{ title, content, doc_names }` | `.xlsx` blob |
| POST | `/api/upload` | Repo | multipart `files[]` | `{ uploaded[], errors[], message }` |
| GET | `/api/documents` | Repo | — | `{ documents[], count }` |
| GET | `/api/documents/{file}/view` | Repo | — | PDF stream (stored or temp) |
| DELETE | `/api/documents/{file}` | Repo | — | `{ message }` |

Interactive contract: `http://localhost:8000/docs`.

---

# APPENDIX B — DATA MODELS & JSON SCHEMAS

## B.1 Gap Analysis Response

```json
{
  "overall_status": "COMPLIANT | NON_COMPLIANT | NEEDS_REVIEW",
  "compliance_score": 85,
  "summary": "Executive summary...",
  "critical_failures_count": 1,
  "warnings_count": 1,
  "passed_count": 3,
  "applicable_standard": "IS 14543:2004",
  "parameters": [
    {
      "parameter": "Total Dissolved Solids (TDS)",
      "user_value": "600 mg/L",
      "bis_limit": "Max 500 mg/L (Clause 4.2 Table 1)",
      "status": "PASS | WARNING | FAIL",
      "clause": "IS 14543:2004 Table 1 Clause 4.2",
      "observation": "...",
      "remedy": "..."
    }
  ],
  "documents_evaluated": ["04_IS_14543_Packaged_Water.pdf"]
}
```

## B.2 CM/L Enhanced Verification Response

```json
{
  "ocr_findings": {
    "cml_number": "CM/L-8400192408",
    "is_valid": true,
    "manufacturer": "AquaPure Beverages Pvt Ltd",
    "standard": "IS 14543",
    "details": "ISI mark clearly visible..."
  },
  "registry_verification": {
    "db_matched": true,
    "db_record": { "cml_number": "CM/L-8400192408", "status": "VALID", "...": "..." },
    "status": "VALID",
    "message": "Verified against BIS National License Registry..."
  },
  "composite_status": "VALID",
  "is_authentic": true
}
```

## B.3 CM/L Registry Record

```json
{
  "cml_number": "CM/L-8400192408",
  "manufacturer": "AquaPure Beverages Pvt Ltd",
  "standard": "IS 14543",
  "product_name": "Packaged Drinking Water (Other than Packaged Natural Mineral Water)",
  "brand_name": "AquaPure",
  "valid_from": "2023-01-15",
  "valid_to": "2027-01-14",
  "status": "VALID",
  "factory_address": "Plot No. 42, Industrial Area Phase II, Mohali, Punjab - 160055",
  "marking_fee_status": "PAID"
}
```

---

# APPENDIX C — DESIGN SYSTEM TOKENS

| Token | Value | Usage |
|---|---|---|
| Deep Midnight Navy | `#071527` | App canvas, scrollbar track, PDF-viewer contrast cousin |
| Enterprise Navy | `#0B2545` | Cards, sidebar, navbar, PDF heading |
| Surface Navy | `#13315C` | Elevated gradients |
| Navy 700 / 600 | `#1B4576` / `#245A9B` | Scrollbar thumb / links |
| Imperial Gold | `#D4AF37` | Borders, icons, PDF gold rule |
| Bright Gold | `#FFC107` | Headings, hover |
| Soft Gold | `#FFD54F` | KPI numerals, markdown `code` |
| Saffron | `#FF9933` | Tricolor left third |
| White | `#FFFFFF` | Tricolor middle |
| India Green | `#128807` | Tricolor right third |
| Fonts | Inter, Plus Jakarta Sans | `index.html` Google Fonts |

CSS utilities: `.enterprise-card`, `.enterprise-card-elevated`, `.tricolor-strip`, `.markdown-content`, `.animate-fade-in`.

---

# APPENDIX D — HOW TO RUN THE PROJECT

## Backend

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
pip install -r requirements.txt
# Create .env with GEMINI_API_KEY=... and optional GEMINI_MODEL=...
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Open `http://localhost:8000/docs` to confirm routes.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Axios is hard-coded to `http://localhost:8000/api`.

## Tests

```bash
cd backend
python test_enterprise.py
```

Covers CM/L lookup, PDF/Excel byte generation, filtered extraction, and route registration.

## Demo script (5 minutes)

1. Select IS 14543 in the sidebar → ask “What is the TDS limit?” → click the Page citation.
2. Switch language to Hindi → tap mic (or type) → Read Aloud.
3. Gap Analysis → load packaged-water preset → show FAIL on TDS 620.
4. CM/L Scanner → upload a label (or describe AquaPure `CM/L-8400192408`) → VALID badge.
5. Summary → Generate Executive Digest → download PDF Report.

---

# DOCUMENT CONTROL

| Field | Value |
|---|---|
| Product | BIS Standard Compliance & Analytics Portal |
| Code version | Backend FastAPI 2.0.0 / Frontend 2.0.0 |
| Architecture companion | `PROJECT_ARCHITECTURE.md` v2.3 |
| This document | `PROJECT_FULL_DOCUMENTATION.md` v1.0.0 |
| Intended use | Project synopsis, viva, formal report chapters, 12-slide PPT |
| Persistence model | Local PDFs + `cml_database.json` (no live government API) |
| AI | Google Gemini Flash family via `google-genai`, resilient fallback |

---

*End of master documentation. This file is the single source of truth for reports and slide preparation. Do not truncate when copying into a synopsis: each of the five sections is complete and presentation-ready.*
