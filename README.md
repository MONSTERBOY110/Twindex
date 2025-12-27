# Twindex - AI Health Trajectory Simulator

> **Personalized Health Risk Analysis Powered by AI**
>
> Simulate your future health trajectories based on lifestyle choices and receive data-backed insights about diabetes risk, cardiovascular health, and preventive strategies.

---

## Try Yourself

https://twindex.vercel.app/

---

## 🎯 What is Twindex?

Twindex is an intelligent health analytics platform that uses AI to predict how lifestyle changes impact your health over time. Enter your current health metrics and target lifestyle goals, and get a personalized simulation showing how your risk profile evolves.

**Perfect for:**
- Understanding the impact of lifestyle changes
- Making informed health decisions
- Preventive health planning
- Health coaching and patient education

---

## ✨ Key Features

- 🧬 **Personalized Health Simulation** - AI-powered trajectory analysis based on your inputs
- 🌍 **Global Health Context** - See where you stand compared to global disease prevalence
- 💬 **Ask Questions** - Follow-up chat to ask contextual questions about your report
- 📥 **Export to PDF** - Download your health report for sharing with healthcare providers
- 🌙 **Dark Mode** - Easy on the eyes, works day and night
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- ⚡ **Lightning Fast** - No build tools, no dependencies, pure vanilla web tech
- 🔒 **Privacy First** - All processing happens client-side, nothing stored

---

## 🚀 How It Works

### Step 1: Enter Your Health Profile
Fill out your current health metrics, lifestyle habits, and lab values in an intuitive bento-style form.

![Input Form](/assets/Main%20Input.jpg)

### Step 2: Set Your Goals
Define your target lifestyle changes over a specific timeframe (1-36 months).

### Step 3: Get AI Analysis
Receive a comprehensive health simulation showing risk trajectories for your current vs. improved lifestyle scenarios.

![Output Report](/assets/Output%20Result.jpg)

### Step 4: Ask Follow-up Questions
Chat with the AI to ask context-aware questions about your specific report and get personalized answers.

![Follow-up Chat](/assets/Follow%20Up%20Chat.jpg)

### Step 5: Understand Global Context
See how your risk patterns compare with globally prevalent health conditions.

![Disease Context](/assets/Disease%20Chance.jpg)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5 + CSS3 + Vanilla JavaScript |
| **Backend** | FastAPI + Google Gemini 3 Pro |
| **Parsing** | marked.js (Markdown to HTML) |
| **Export** | html2pdf.js (PDF generation) |
| **Styling** | CSS Variables + CSS Grid + Flexbox |
| **No Frameworks** | No React, Vue, or build tools needed |

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.8+
- Google Gemini API Key
- Modern web browser

### Backend Setup

```bash
# Clone repository
git clone <repo-url>
cd Twindex

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export GEMINI_API_KEY=your_api_key_here
export DISABLE_GEMINI=0  # Set to 1 for demo mode

# Run backend
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Start local server (optional, for development)
python -m http.server 8000

# Or simply open in browser
open index.html
```

Then visit: **http://localhost:8000**

---

## 🎨 Features in Detail

### 📊 Comprehensive Input Form
- Patient demographics (age, gender, height, weight)
- Lab values (fasting glucose, HbA1c)
- Current lifestyle (sleep, activity, diet, stress)
- Target goals (improved lifestyle metrics)
- Flexible simulation timeframe

### 🧠 AI-Powered Analysis
- Type 2 Diabetes risk trajectory
- Cardiovascular disease assessment
- Sleep quality impact analysis
- Stress and metabolic correlations
- Preventive lifestyle recommendations

### 💬 Context-Aware Chat
- Ask questions about your specific results
- AI remembers your health profile
- Get personalized follow-up insights
- Understand cause-effect relationships

### 🌐 Global Health Context
- See disease prevalence rates
- Understand key risk factors for conditions
- Get population-level insights
- Know which factors matter most for you

### 📱 Dark Mode & Export
- Toggle dark mode with one click (persists in localStorage)
- Export complete report as PDF
- Share results with healthcare providers
- Print-friendly formatting

---

## 📁 Project Structure

```
Twindex/
├── frontend/
│   ├── index.html           # Complete UI (1500+ lines)
│   ├── script.js            # All JavaScript logic (~750 lines)
│   ├── disease_context.json # Disease prevalence data
│   └── assets/
│       ├── input.png
│       ├── output.png
│       ├── followup_chat.png
│       └── disease_context.png
│
├── app/
│   ├── main.py              # FastAPI server
│   ├── gemini_client.py     # Gemini AI integration
│   └── schemas.py           # Data models
│
└── requirements.txt         # Python dependencies
```

---

## 🔄 API Contract

### Endpoint: POST /simulate

**Request:**
```json
{
  "prompt": "PATIENT_PROFILE:\nName: John Doe\n..."
}
```

**Response:**
```json
{
  "result": "Risk Comparison Table:\n...\nSimple Summary:\n..."
}
```

---

## 🎯 Use Cases

1. **Patient Education** - Help patients understand how lifestyle impacts health
2. **Preventive Medicine** - Identify high-risk individuals early
3. **Health Coaching** - Motivate behavior change with personalized projections
4. **Research** - Analyze population-level health trajectories
5. **Wellness Programs** - Corporate health initiative tool

---

## 🔒 Security & Privacy

- ✅ No data stored on server (everything client-side)
- ✅ CORS enabled for safe cross-origin requests
- ✅ HTML escaping prevents XSS attacks
- ✅ Form validation on both client and server
- ✅ Sensitive data never logged
- ✅ HTTPS ready for production deployment

---

## 📈 Performance

- **Frontend Load Time:** < 500ms
- **Simulation Processing:** 2-5 seconds (Gemini API)
- **Zero Dependencies:** No npm, no webpack, no build step
- **Bundle Size:** ~50KB (minified)
- **Responsive:** 60 FPS animations

---

## 🚢 Deployment

### Deploy Frontend
```bash
# Build (nothing to build - it's vanilla!)
# Just upload these files to any static host:
- index.html
- script.js
- disease_context.json
- assets/ folder
```

**Hosting Options:**
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Traditional web server

### Deploy Backend
```bash
# Using Gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app.main:app

# Using Docker
docker build -t twindex .
docker run -p 8000:8000 twindex
```

---

## 👥 Credits

**Built By Tantriks - Subhojyoti Maity & Chandan Saha**

Special thanks to:
- Google Gemini API for AI capabilities
- Global GenAI Hackathon hosted by Machine Learning Kolkata
