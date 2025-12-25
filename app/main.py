from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.gemini_client import run_twindex
from app.schemas import SimulationRequest, SimulationResponse
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Twindex AI Backend",
    description="Gemini AI powered predictive health simulation engine",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/simulate", response_model=SimulationResponse)
async def simulate(request: SimulationRequest):
    try:
        logger.info(f"Processing simulation request: {request.prompt[:50]}...")
        output = run_twindex(request.prompt)
        logger.info("Simulation completed successfully")
        return SimulationResponse(result=output)
    except ValueError as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error processing simulation: {e}")
        raise HTTPException(status_code=500, detail="Error processing simulation request")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}