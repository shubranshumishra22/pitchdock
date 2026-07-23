# PitchDock — AI Recruiter Outreach & Cold Email Automator

PitchDock is an AI-powered job application outreach platform designed to assist job seekers in connecting directly with technical recruiters and hiring managers. PitchDock writes personalized cold email pitches matching candidate accomplishments against company requirements, attaches candidate résumé PDFs, and routes dispatches on a safe schedule.

## Key Features
- **AI-Powered Email Personalization**: Automatically tailors pitches per recruiter target.
- **Direct Résumé Attachment**: Attaches candidate PDF résumés to outreach emails.
- **Deliverability & Stagger Queue**: Spaces out email sends to protect domain reputation.
- **Telegram Mobile Agent**: Remote campaign control, status checks, and send execution via Telegram bot.
- **Google OAuth Integration**: Direct email routing via Google's official Gmail API (`gmail.send`).

## Tech Stack
- **Frontend**: Next.js 16 (App Router), TypeScript, Vanilla CSS.
- **Backend**: Python FastAPI, SQLite, Google Gmail API, Gemini AI SDK.

## Getting Started

### 1. Environment Setup
Create a `.env` file in the root directory:
```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=https://www.pitchdock.xyz/api/oauth/google/callback
FRONTEND_URL=https://www.pitchdock.xyz
GEMINI_API_KEY=your_gemini_api_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

### 2. Frontend Installation
```bash
cd web
npm install
npm run dev
```

### 3. Backend Setup
```bash
pip install -r requirements.txt
python main.py
```

## License
MIT License
