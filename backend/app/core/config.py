import os
from dotenv import load_dotenv
from pathlib import Path

# Load .env from the backend root directory
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)


class Settings:
    @property
    def GEMINI_API_KEY(self) -> str:
        load_dotenv(dotenv_path=env_path, override=True)
        return os.getenv("GEMINI_API_KEY", "")

    @property
    def GEMINI_MODEL(self) -> str:
        load_dotenv(dotenv_path=env_path, override=True)
        return os.getenv("GEMINI_MODEL", "gemini-3.5-flash")

    @property
    def HOST(self) -> str:
        return os.getenv("HOST", "0.0.0.0")

    @property
    def PORT(self) -> int:
        return int(os.getenv("PORT", "8000"))

    @property
    def STORED_DOCUMENTS_DIR(self) -> Path:
        p = Path(__file__).resolve().parent.parent.parent / "stored_documents"
        p.mkdir(parents=True, exist_ok=True)
        return p

    @property
    def TEMP_UPLOADS_DIR(self) -> Path:
        p = Path(__file__).resolve().parent.parent.parent / "temp_uploads"
        p.mkdir(parents=True, exist_ok=True)
        return p

    @property
    def CML_DATABASE_PATH(self) -> Path:
        return Path(__file__).resolve().parent.parent.parent / "cml_database.json"

    def __init__(self):
        # Ensure directories exist
        _ = self.STORED_DOCUMENTS_DIR
        _ = self.TEMP_UPLOADS_DIR


settings = Settings()
