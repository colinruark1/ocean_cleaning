"""
Run the FastAPI server
Usage: python run.py
"""
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    reload = os.getenv("ENV", "development") == "development"

    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=port,
        reload=reload,
        log_level="info"
    )
