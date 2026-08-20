import os
import sys
import base64
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from api.routes import router

app = FastAPI(
    title="Nexora AI — Product Intelligence Platform",
    description="Evidence-Driven Product Data Enrichment & Entity Resolution System",
    version="1.0.0"
)

# Allow all origins for CORS
origins = [
    "*",
    "https://nexora-otuu.vercel.app",
    "https://nexora-d7u7.onrender.com",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def get_root():
    return {
        "status": "NEXORA API is running",
        "docs": "/docs",
        "openapi": "/openapi.json",
        "frontend": "https://nexora-otuu.vercel.app",
        "message": "NEXORA REST API backend server. For the production React UI dashboard, please visit https://nexora-otuu.vercel.app"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
