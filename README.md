# 🎓 StudentGPT — AI Mentor for Indian Students

**StudentGPT** is a production-ready web application that wraps your custom fine-tuned LLM into a therapeutic, introspective AI mentor — built specifically for Indian students navigating career confusion, emotional overwhelm, and mental distractions.

This project combines:
- 🧠 A fine-tuned local LLM (e.g., Mistral-7B with QLoRA) trained on real, domain-specific conversations
- 💬 A clean, modern web chat interface
- ⚙️ A backend powered by FastAPI to serve your model
- ⚡ Real-time message streaming with Server-Sent Events (SSE)

---

## ✨ Key Features

- 🤖 **Local LLM Integration**: Runs your custom fine-tuned StudentGPT model with PEFT adapters
- 💬 **Reflective Chat UI**: Question + re-question style designed to uncover inner clarity
- ⚡ **Streaming Support**: Optional token-level streaming via SSE
- 🌙 **Dark Mode**: Responsive, mobile-friendly design with Tailwind CSS
- 🚀 **Fast Dev Stack**: Vite + React for frontend, FastAPI for backend

---

## 🗂️ Project Structure

studentgpt-chat/
├── backend/ # FastAPI backend
│ ├── main.py
│ └── requirements.txt
├── frontend/ # React + Tailwind frontend
│ ├── src/
│ ├── index.html
│ ├── package.json
│ └── tailwind.config.js
└── README.md


---

## ⚡ Quick Start

### 1. 🔧 Backend Setup

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
The backend will be running at: http://localhost:8000

2. 💻 Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm run dev
The frontend will be running at: http://localhost:5173

🧪 API Overview
POST /api/chat
Send a full message history and get the next mentor response.

Request:

json
Copy
Edit
{
  "messages": [
    { "role": "student", "content": "I'm feeling lost about my future." }
  ]
}
Response:

json
Copy
Edit
{
  "answer": "Let’s try to unpack that. When did you first start feeling this way about your future?"
}
POST /api/stream
Token-by-token Server-Sent Events (SSE) streaming response.

GET /api/health
Returns current server status and model readiness.

🧠 Model Integration
The backend expects your studentgpt module to expose:

python
Copy
Edit
from studentgpt import generate_response

# Input format:
# generate_response(history: list[dict]) -> str
# where history = [{"role": "student", "content": "..."}, ...]
🛠 Development Notes
🔁 Backend
FastAPI with autoreload

CORS enabled

Loads model once at startup for performance

Logging and exception handling included

⚛️ Frontend
React + Vite = super fast dev experience

Tailwind CSS for design

Built-in dark mode and mobile responsiveness

Proxy routes API calls to FastAPI backend

Supports token streaming via SSE

🚀 Production Deployment
Backend (Gunicorn + Uvicorn)
bash
Copy
Edit
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
Frontend
bash
Copy
Edit
npm run build
# Then serve with nginx or a static file host
⚙️ Configuration
Environment Variables
CORS_ORIGINS — restrict domains in production

MODEL_PATH or module import — configure your fine-tuned model location

🧩 Troubleshooting
Issue	Solution
Model not loading	Verify studentgpt module path and model checkpoint location
CORS errors	Ensure frontend is on 5173, backend on 8000, check CORS config
SSE issues	Check browser console + server logs for stream errors

📜 License
MIT License — you’re free to use, adapt, and build on this project.
Let’s bring real guidance to India’s student generation.

Built for clarity, not just answers.
StudentGPT is here to challenge thoughts, not solve problems.
A modern-day mentor for Gen-Z minds.

python
Copy
Edit

Let me know if you'd like to also generate:
- A `studentgpt-logo.svg` or favicon
- A landing page `index.html` with branding and mission
- A GitHub project description and tags for discovery

You're building something real. Let’s ship it like a product that **deserves to be used**.