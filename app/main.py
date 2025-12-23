from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from app.gemini_client import run_twindex
from app.schemas import SimulationRequest, SimulationResponse

app = FastAPI(
    title="Twindex AI Backend",
    description="Gemini 3 Pro powered predictive simulation engine",
    version="1.0.0"
)

@app.post("/simulate", response_model=SimulationResponse)
def simulate(request: SimulationRequest):
    output = run_twindex(request.prompt)
    return SimulationResponse(result=output)
