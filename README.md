# Whisper Transcription App

A full-stack application that provides real-time audio transcription using OpenAI's Whisper model. The application consists of a FastAPI backend for audio processing and a Next.js frontend for a modern, responsive user interface.

## Features

- Real-time audio transcription using OpenAI's Whisper model
- Modern, responsive UI built with Next.js and Tailwind CSS
- RESTful API backend using FastAPI
- Audio file upload and processing
- Instant transcription results display

## Tech Stack

### Backend
- Python 3.x
- FastAPI
- OpenAI Whisper
- uvicorn (ASGI server)
- SQLite database

### Frontend
- Next.js 15.1.0
- React 19
- TypeScript
- Tailwind CSS
- Radix UI components
- Various React hooks and utilities

## Prerequisites

Before running the application, make sure you have the following installed:
- Python 3.x
- Node.js (Latest LTS version)
- pnpm (for frontend package management)

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies using pnpm:
```bash
pnpm install
```

## Running the Application

### Start the Backend Server

1. From the backend directory:
```bash
python main.py
```
The backend server will start at `http://localhost:8000`

### Start the Frontend Development Server

1. From the client directory:
```bash
pnpm dev
```
The frontend development server will start at `http://localhost:3000`

## API Endpoints

- `GET /`: Health check endpoint
- `POST /audio/transcribe`: Endpoint for audio file transcription
    - Accepts audio files (MP3 format)
    - Returns transcribed text

## Project Structure

```
.
├── backend/
│   ├── app/
│   ├── tests/
│   ├── main.py
│   └── requirements.txt
└── client/
    ├── app/
    ├── components/
    ├── hooks/
    ├── lib/
    ├── public/
    ├── styles/
    └── types/
```

## Development

- The backend uses FastAPI for efficient API development with automatic OpenAPI documentation
- The frontend is built with Next.js and uses modern React patterns
- Styling is handled through Tailwind CSS with custom components
- Type safety is ensured through TypeScript

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License. 