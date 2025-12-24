# TWINDEX BACKEND ARCHITECTURE

## System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT / BROWSER                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP Requests
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   FASTAPI SERVER                            │
│              (app/main.py - Port 8000)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ROUTES                                              │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  GET  /docs              → Swagger UI               │  │
│  │  GET  /redoc             → ReDoc                     │  │
│  │  GET  /openapi.json      → OpenAPI Schema            │  │
│  │  GET  /health            → Health Check              │  │
│  │  POST /simulate          → Main Endpoint (ASYNC)    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MIDDLEWARE                                          │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  • Error Handling (HTTPException)                   │  │
│  │  • Logging (logger.info/error)                      │  │
│  │  • CORS (optional)                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  SCHEMA VALIDATION (Pydantic)                        │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  Request:  SimulationRequest                         │  │
│  │    - prompt: str (required)                          │  │
│  │  Response: SimulationResponse                        │  │
│  │    - result: str                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────┬────────────────────────────────────┘
                         │
                         │ Validated Request
                         ▼
┌─────────────────────────────────────────────────────────────┐
│             GEMINI CLIENT (app/gemini_client.py)            │
│              run_twindex(user_input: str)                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  CONFIGURATION                                       │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  • API Key from .env (GEMINI_API_KEY)              │  │
│  │  • Error Handling with try/catch                    │  │
│  │  • Logging for debugging                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  GEMINI PARAMETERS                                   │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  Model: "gemini-2.0-flash"  (FIXED)                │  │
│  │  Temperature: 0.2                                    │  │
│  │  System Instruction: Healthcare decision support    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────┬────────────────────────────────────┘
                         │
                         │ API Call
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           GOOGLE GENERATIVE AI (Gemini API)                 │
│            api.generativelanguage.googleapis.com            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  • Authentication with API Key                             │
│  • Generate Content Request                                │
│  • System Instruction applied                              │
│  • Temperature setting applied                              │
│                                                              │
└─────────────────────────┬────────────────────────────────────┘
                         │
                         │ Response
                         ▼
┌─────────────────────────────────────────────────────────────┐
│          AI-GENERATED HEALTH TRAJECTORY                     │
│           (Health risk scenarios over time)                 │
└─────────────────────────┬────────────────────────────────────┘
                         │
                         │ Return to Client
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   CLIENT / BROWSER                         │
│              Shows simulation results                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Request/Response Flow

### Valid Request Flow
```
1. Client sends POST /simulate
   ├─ Content: {"prompt": "user question"}
   │
2. FastAPI validates schema (Pydantic)
   ├─ ✓ Schema valid
   ├─ Creates SimulationRequest object
   │
3. Call simulate() endpoint (async)
   ├─ Logs: "Processing simulation request"
   │
4. Call run_twindex(prompt)
   ├─ Loads API key from .env
   ├─ Creates Gemini client
   ├─ Calls generate_content()
   │
5. Gemini API processes request
   ├─ Applies system instruction
   ├─ Generates health trajectory simulation
   ├─ Returns response text
   │
6. Pack response in SimulationResponse
   ├─ JSON: {"result": "AI response"}
   │
7. Return 200 OK with response
   │
8. Logs: "Simulation completed successfully"
```

### Invalid Request Flow
```
1. Client sends POST /simulate
   ├─ Content: {"invalid_field": "value"}  (missing "prompt")
   │
2. FastAPI validates schema (Pydantic)
   ├─ ✗ Schema invalid (missing required field)
   │
3. Return 422 Unprocessable Entity
   ├─ Error details about missing "prompt" field
   │
4. Client sees validation error
```

### Error Flow
```
1. Client sends POST /simulate
   ├─ Content: {"prompt": "question"}
   │
2. Schema validates ✓
   │
3. Call run_twindex(prompt)
   ├─ API key missing or invalid
   ├─ Raises ValueError
   │
4. Endpoint catches exception
   ├─ Logs error with traceback
   │
5. Return 500 Internal Server Error
   ├─ Message: "Error processing simulation request"
   │
6. Client sees error response
```

---

## Data Flow Diagram

```
Input Data Structure:
┌────────────────────┐
│ SimulationRequest  │
├────────────────────┤
│ prompt: str        │
└────────────┬───────┘
             │
             ▼
┌────────────────────────────────────┐
│ Validation (Pydantic)             │
│ • Type check: str                  │
│ • Required: yes                    │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│ Gemini Client Processing           │
│ • API Key verification             │
│ • Model selection                  │
│ • Temperature setting              │
│ • System instruction injection     │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│ Google Generative AI API           │
│ • Generate content                 │
│ • Apply system instruction         │
│ • Return text response             │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│ Response Formatting                │
│ • Extract text from response       │
│ • Handle null/empty cases          │
│ • Create SimulationResponse        │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│ SimulationResponse                 │
│ • result: str (AI response)        │
│ • Status 200 OK                    │
│ • Content-Type: application/json   │
└────────────────────────────────────┘
```

---

## Component Interaction Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    FastAPI Application                  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  app.main.py                                       │ │
│  │  • FastAPI() instance                              │ │
│  │  • Routes (/simulate, /health, /docs)             │ │
│  │  • Error handling                                  │ │
│  │  • Logging configuration                           │ │
│  └────────┬──────────────────────────────┬───────────┘ │
│           │                              │              │
│           ▼                              ▼              │
│  ┌──────────────────────┐  ┌──────────────────────────┐│
│  │  app.schemas.py     │  │  app.gemini_client.py   ││
│  │  • SimulationRequest │  │  • run_twindex()        ││
│  │  • SimulationResponse│  │  • Error handling       ││
│  │  (Pydantic models)  │  │  • Logging              ││
│  └──────────────────────┘  └──────┬───────────────────┘│
│                                   │                   │
│                                   ▼                   │
│                          ┌─────────────────┐         │
│                          │  Environment    │         │
│                          │  • .env loader  │         │
│                          │  • API Key mgmt │         │
│                          └─────────────────┘         │
│                                                       │
└──────────────────────────────────────────────────────┘
           │
           │ HTTP
           ▼
┌──────────────────────────────────────────────────────────┐
│          Google Generative AI API                       │
│                                                         │
│  • models.generate_content()                            │
│  • System instruction processing                        │
│  • Temperature-based response generation                │
└──────────────────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
Request arrives
     │
     ▼
Validate Schema (Pydantic)
     │
     ├─ Invalid ────────► Return 422
     │                    (validation error)
     │
     ▼
Process request (async)
     │
     ├─ ValueError ─────► Return 400
     │  (API call failed)  (bad request)
     │
     ├─ Exception ──────► Return 500
     │  (unexpected)      (server error)
     │
     ▼
Success ─────────────► Return 200
                      (with response)

All errors are:
✓ Logged with logger.error()
✓ Include traceback for debugging
✓ Return appropriate HTTP status
✓ Include error message for client
```

---

## Deployment Architecture

```
Development:
Client → localhost:8000 → FastAPI → Gemini API → Google

Production:
┌──────────────┐
│ Load Balancer│
└──────┬───────┘
       │
       ├─────────────────┬─────────────────┐
       ▼                 ▼                 ▼
   ┌────────┐       ┌────────┐       ┌────────┐
   │Server 1│       │Server 2│       │Server 3│
   │ :8000  │       │ :8001  │       │ :8002  │
   └────────┘       └────────┘       └────────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
                         ▼
                   ┌─────────────┐
                   │Gemini API   │
                   └─────────────┘

All servers:
✓ Share .env configuration
✓ Use async endpoints
✓ Have health checks (/health)
✓ Report logs to centralized logging
```

---

## Summary

**Architecture**: REST API with async request handling
**Backend**: FastAPI (Python 3.11+)
**Validation**: Pydantic schemas
**AI Service**: Google Gemini 2.0 Flash
**Error Handling**: Comprehensive with HTTP exceptions
**Logging**: Built-in Python logging
**Deployment**: Scalable with load balancing support

**Status**: ✓ Production Ready
