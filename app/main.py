from fastapi import FastAPI
from app.gemini_client import run_living_twin
from app.schemas import SimulationRequest, SimulationResponse
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Living Twin AI Backend",
    description="Gemini 3 Pro powered predictive simulation engine",
    version="1.0.0"
)

@app.post("/simulate", response_model=SimulationResponse)
def simulate(request: SimulationRequest):
    output = run_living_twin(request.prompt)
    return SimulationResponse(result=output)
