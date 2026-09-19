# ManakSetu

**Enterprise BIS Compliance, Predictive Gap Analysis & CML Verification Platform**

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-0B2545?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-ASGI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=0B2545)](https://react.dev/)
[![Vite 6](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Gemini Flash](https://img.shields.io/badge/Google-Gemini%20Flash-D4AF37?logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/license-Proprietary-13315C)](#)

ManakSetu is an AI-powered Bureau of Indian Standards (BIS) compliance portal. Inspectors, manufacturers, and auditors can search official IS PDFs with page-indexed citations, run predictive gap analysis, scan CM/L labels with multimodal OCR, and export tamper-evident audit reports — even when government portals are offline.

---

## Core Features

- **AI Search & Page-Indexed Clause Citations** — Query official IS PDFs and receive answers with `[Doc | Page N]` citations mapped from PyMuPDF page text (zero-hallucination source pointers).
- **Predictive Gap Analysis with Heatmap Evaluation** — Compare product technical specs against mandatory BIS limits and get PASS / WARNING / FAIL scoring with an overall compliance heatmap.
- **CM/L Label Vision Scanner (Gemini Multimodal OCR)** — Upload a product label image; Gemini Vision extracts license, manufacturer, and standard, then fuzzy-matches `cml_database.json`.
- **Multilingual Voice AI (Hindi, English, Marathi)** — Web Speech API mic input and TTS playback, with voice-mode answers tuned for factory-floor inspections.
- **Tamper-Evident Report Generation (PDF & Excel)** — ReportLab certificates and OpenPyXL checklists with numbered pages, audit metadata, and structured findings.
- **0% Downtime with Local PDF & CML Registry Fallback** — Local `stored_documents/` cache and offline license registry keep search, analytics, and CM/L verification available during official portal outages.

---

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Client | React 19, Vite 6, Tailwind CSS, Axios, Recharts, Web Speech API |
| API | Python 3.11, FastAPI, Uvicorn, Pydantic |
| AI | Google Gemini Flash (`google-genai`) — reasoning, vision OCR, multilingual output |
| Documents | PyMuPDF (`fitz`) page-indexed PDF extraction |
| Reports | ReportLab (PDF), OpenPyXL + pandas (Excel) |

**Design tokens:** Navy `#0B2545` · Gold `#D4AF37`

---

## Team & Responsibilities

Built by **Team Techno Sync**.

| Member | Role | Key deliverables |
| --- | --- | --- |
| **Divyakant** | Team Lead & Full-Stack / AI Lead | System architecture, Gemini Flash engine, FastAPI backend, deployment |
| **Nishi Sharma** | Frontend & Voice UI Lead | React 19 SPA, Web Speech API (Hindi / English / Marathi Voice AI) |
| **Diya Tomar** | Vision OCR & Parsing Lead | PyMuPDF page-indexed parsing, Gemini Vision OCR for product labels |
| **Keshav Kumar Sharma** | Backend & DB Engineer | FastAPI endpoints, Pydantic schemas, local fallback persistence |
| **Himanshu** | Report Automation Lead | ReportLab PDF audit generator, OpenPyXL automated checklist export |
| **Avni Sharma** | QA & BIS Compliance Lead | BIS IS code validation, predictive gap analysis accuracy testing |

---

## Step-by-Step Setup Guide (From Scratch)

### Prerequisites

Install the following before cloning:

- **Node.js v18+** (includes npm)
- **Python 3.11+**
- **Git**
- A **Google Gemini API key** ([Google AI Studio](https://aistudio.google.com/apikey))

Verify versions:

```bash
node -v
npm -v
python --version
git --version
```

### 1. Clone the repository

```bash
git clone https://github.com/your-org/ManakSetu.git
cd ManakSetu
```

### 2. Backend setup

From the repo root:

**Windows (PowerShell)**

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
copy .env.example .env
```

**macOS / Linux**

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
cp .env.example .env
```

Edit `backend/.env` and set your Gemini key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash
HOST=0.0.0.0
PORT=8000
```

Start the API (from `backend/` with the venv active):

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Interactive docs: [http://localhost:8000/docs](http://localhost:8000/docs)

ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

Place official IS PDFs in `backend/stored_documents/` (a sample `04_IS_14543_Packaged_Water.pdf` is included).

### 3. Frontend setup

Open a **second** terminal from the repo root:

```bash
cd frontend
npm install
copy .env.example .env
```

On macOS / Linux use `cp .env.example .env`.

`frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Start the Vite dev server:

```bash
npm run dev
```

Portal UI: [http://localhost:5173](http://localhost:5173)

Keep the FastAPI process running on port **8000** while using the UI.

---

## Environment Variables Guide

Copy each `.env.example` to `.env`. Never commit real keys. `backend/.env` is gitignored.

### Backend — `backend/.env.example`

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `GEMINI_API_KEY` | Yes | — | Google Gemini API key for search, gap analysis, and vision OCR |
| `GEMINI_MODEL` | No | `gemini-3.5-flash` | Primary Gemini Flash model (automatic fallbacks on 404/429/503) |
| `HOST` | No | `0.0.0.0` | Uvicorn bind address |
| `PORT` | No | `8000` | API port |

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash
HOST=0.0.0.0
PORT=8000
```

### Frontend — `frontend/.env.example`

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | No | `http://localhost:8000/api` | FastAPI base URL used by the SPA |

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Restart `npm run dev` after changing any `VITE_*` variable.

---

## Folder & Directory Structure

```text
ManakSetu/
├── README.md
├── PROJECT_ARCHITECTURE.md
├── .gitignore
├── backend/
│   ├── .env.example              # Gemini key, host, port template
│   ├── requirements.txt          # Python 3.11+ dependencies
│   ├── cml_database.json         # Offline CM/L license registry
│   ├── stored_documents/         # Local IS PDF cache
│   ├── temp_uploads/             # Transient custom-search uploads
│   ├── test_enterprise.py
│   └── app/
│       ├── main.py               # FastAPI app, CORS, router mount
│       ├── api/                  # REST endpoints
│       │   ├── routes_search.py
│       │   ├── routes_preload_search.py
│       │   ├── routes_custom_search.py
│       │   ├── routes_gap_analysis.py
│       │   ├── routes_summary.py
│       │   ├── routes_penalties.py
│       │   ├── routes_cml.py
│       │   ├── routes_cml_vision.py
│       │   ├── routes_analytics.py
│       │   ├── routes_export.py
│       │   └── routes_upload.py
│       ├── core/
│       │   ├── config.py         # Settings from .env
│       │   └── ai_engine.py      # Gemini Flash + vision fallbacks
│       └── services/
│           ├── pdf_service.py    # PyMuPDF page-indexed extraction
│           ├── vision_service.py # CM/L OCR prompt + parse
│           └── export_service.py # ReportLab PDF + OpenPyXL Excel
└── frontend/
    ├── .env.example
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css             # Navy / Gold Tailwind tokens
        ├── services/api.js
        ├── context/LanguageContext.jsx
        ├── utils/speech.js       # Web Speech API (STT / TTS)
        ├── components/
        └── pages/
            ├── SearchTab.jsx
            ├── GapAnalysisTab.jsx
            ├── SummaryTab.jsx
            ├── PenaltiesTab.jsx
            ├── CMLScannerTab.jsx
            └── AnalyticsDashboard.jsx
```

---

## API Documentation Overview

FastAPI serves OpenAPI automatically when the backend is running.

| Resource | URL |
| --- | --- |
| Swagger UI | [http://localhost:8000/docs](http://localhost:8000/docs) |
| ReDoc | [http://localhost:8000/redoc](http://localhost:8000/redoc) |
| OpenAPI JSON | [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json) |
| Health / info | [http://localhost:8000/](http://localhost:8000/) |

All application routes are mounted under `/api`.

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/search` | Compliance search over stored PDFs |
| `POST` | `/api/search/preloaded` | Scoped BIS search with `[Doc \| Page N]` citations |
| `POST` | `/api/search/custom` | Upload a PDF and query it in one request |
| `POST` | `/api/gap-analysis` | Predictive PASS/WARNING/FAIL heatmap |
| `POST` | `/api/summary` | Executive digest of selected standards |
| `POST` | `/api/penalties` | BIS Act 2016 liability analysis |
| `POST` | `/api/cml-verify` | Basic Gemini vision CM/L extract |
| `POST` | `/api/cml/verify-enhanced` | Vision OCR + local registry fuzzy match |
| `GET` | `/api/cml/registry` | Offline CM/L database listing |
| `GET` | `/api/analytics/metrics` | Indexed-document KPIs |
| `POST` | `/api/export/pdf` | Tamper-evident PDF certificate |
| `POST` | `/api/export/excel` | Excel compliance checklist |
| `POST` | `/api/upload` | Persist PDFs into `stored_documents/` |
| `GET` | `/api/documents` | List indexed standards |
| `DELETE` | `/api/documents/{filename}` | Remove a stored PDF |

For system diagrams, data pipelines, and resilience design, see [PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md).
