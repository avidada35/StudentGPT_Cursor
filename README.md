# StudentGPT Chat

A production-ready web application that wraps your fine-tuned StudentGPT model in a beautiful chat interface.

## Features

- 🤖 **Local LLM Integration**: Uses your fine-tuned Mistral-7B model with PEFT adapters
- 💬 **Real-time Chat**: Clean, modern chat interface with message bubbles
- ⚡ **Streaming Support**: Optional Server-Sent Events for token-by-token streaming
- 🌙 **Dark Mode**: Built-in dark mode support
- 📱 **Responsive**: Works on desktop and mobile devices
- 🚀 **Fast Development**: Hot reload with Vite + React

## Project Structure

```
studentgpt-chat/
├── backend/
│   ├── main.py              # FastAPI server
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── main.jsx        # React entry point
│   │   └── index.css       # Tailwind styles
│   ├── package.json        # Node.js dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind configuration
│   └── index.html          # HTML template
└── README.md
```

## Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (if not already done)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### POST `/api/chat`
Send a message and get a response.

**Request:**
```json
{
  "messages": [
    {"role": "student", "content": "Hello, can you help me with math?"}
  ]
}
```

**Response:**
```json
{
  "answer": "Of course! I'd be happy to help you with math..."
}
```

### POST `/api/stream`
Get streaming response with Server-Sent Events.

**Request:** Same as `/api/chat`

**Response:** Server-Sent Events stream with tokens

### GET `/api/health`
Check API health and model status.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "service": "StudentGPT API"
}
```

## Development

### Backend Development

- The FastAPI server automatically reloads when you make changes
- Model is loaded once on startup for better performance
- CORS is enabled for frontend development
- Error handling and logging included

### Frontend Development

- Vite provides fast hot reload
- Tailwind CSS for styling
- Proxy configuration routes `/api/*` to backend
- Streaming toggle in the UI
- Optimistic message insertion

## Production Deployment

### Backend
```bash
# Install production dependencies
pip install gunicorn

# Run with Gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend
```bash
# Build for production
npm run build

# Serve static files with nginx or similar
```

## Configuration

### Environment Variables
- Set `CORS_ORIGINS` in production to restrict frontend domains
- Configure model path if needed in `studentgpt` module

### Model Integration
The app expects your `studentgpt` module to provide:
```python
from studentgpt import generate_response

# generate_response(history: list[dict]) -> str
# history format: [{"role": "student", "content": "..."}, ...]
```

## Troubleshooting

### Model Not Loading
- Check that `studentgpt` module is installed and accessible
- Verify model files are in the correct location
- Check console logs for specific error messages

### CORS Issues
- Ensure backend is running on port 8000
- Check that CORS middleware is properly configured
- Verify frontend proxy settings in `vite.config.js`

### Streaming Not Working
- Check browser console for errors
- Verify SSE endpoint is responding correctly
- Ensure proper error handling in streaming function

## License

MIT License - feel free to use this for your projects! 