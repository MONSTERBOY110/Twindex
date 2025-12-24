from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from app.gemini_client import run_twindex
from app.schemas import SimulationRequest, SimulationResponse
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Twindex AI Backend",
    description="Gemini AI powered predictive health simulation engine",
    version="1.0.0"
)

@app.post("/simulate", response_model=SimulationResponse)
async def simulate(request: SimulationRequest):
    """
    Generate a health risk trajectory simulation based on user input.
    
    Args:
        request: SimulationRequest containing a 'prompt' field
        
    Returns:
        SimulationResponse with the AI-generated 'result' field
        
    Raises:
        HTTPException: If there's an error processing the request
    """
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