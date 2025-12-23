from pydantic import BaseModel

class SimulationRequest(BaseModel):
    prompt: str

class SimulationResponse(BaseModel):
    result: str
