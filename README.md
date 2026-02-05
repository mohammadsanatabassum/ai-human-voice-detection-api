🧠 AI Human Voice Detection API

A full-stack web application and REST API that detects whether an uploaded voice sample is AI-generated or human, supporting Tamil, English, Hindi, Malayalam, and Telugu.

The system uses Supabase Edge Functions as a secure backend, with a React + Vite frontend for testing and management.

🚀 Live Application

Frontend:

https://ai-human-voice-detection-api.vercel.app/


API Endpoint:

https://fotuzquiawsgrofmosxv.supabase.co/functions/v1/detect-voice

🔑 Sample API Key (For Evaluation)
vd_8a10cdd6782741a1930ec70a95c0dfbc


Use this key in the x-api-key header.

✨ Features

AI vs Human voice detection

Confidence score (0–1)

Explanation of result

Supports 5 languages

API key authentication

Detection history logging

Web-based tester

Supabase Edge Functions backend

🏗 Tech Stack
Frontend

React + Vite

TypeScript

Tailwind CSS

Backend

Supabase Edge Functions (Deno)

Supabase PostgreSQL

🧩 How Supabase Is Used

Supabase provides:

PostgreSQL database

Authentication system

Edge Functions (serverless backend)

Secure environment variables

Tables
api_keys

Stores API keys used by clients.

detection_logs

Stores every detection request.

Supabase Edge Function:

supabase/functions/detect-voice/index.ts


Handles:

API key validation

Detection logic

Logging results

Returning response

📦 API Request Format

POST

/functions/v1/detect-voice

Headers
Content-Type: application/json
x-api-key: YOUR_API_KEY

Body
{
  "language": "English",
  "audioFormat": "mp3",
  "audioBase64": "BASE64_AUDIO_STRING"
}

📤 API Response
{
  "status": "success",
  "language": "English",
  "classification": "HUMAN",
  "confidenceScore": 0.87,
  "explanation": "Natural human voice characteristics detected"
}

🧪 cURL Example
curl -X POST https://fotuzquiawsgrofmosxv.supabase.co/functions/v1/detect-voice \
-H "Content-Type: application/json" \
-H "x-api-key: vd_8a10cdd6782741a1930ec70a95c0dfbc" \
-d '{
  "language":"English",
  "audioFormat":"mp3",
  "audioBase64":"BASE64_AUDIO"
}'

🐍 Python Example
import requests, base64

with open("audio.mp3","rb") as f:
    audio = base64.b64encode(f.read()).decode()

res = requests.post(
    "https://fotuzquiawsgrofmosxv.supabase.co/functions/v1/detect-voice",
    headers={
        "Content-Type":"application/json",
        "x-api-key":"vd_8a10cdd6782741a1930ec70a95c0dfbc"
    },
    json={
        "language":"English",
        "audioFormat":"mp3",
        "audioBase64":audio
    }
)

print(res.json())

🖥 Running Frontend Locally
npm install
npm run dev


App runs at:

http://localhost:5173

⚙ Supabase Setup (Local or New Project)
Install Supabase CLI
npx supabase --version


If not installed:

npm install supabase --save-dev

Login
npx supabase login

Initialize Project
npx supabase init

Create Tables

Open Supabase SQL Editor and run:

CREATE TABLE api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  name text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE detection_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id uuid,
  language text,
  result text,
  confidence numeric,
  created_at timestamptz DEFAULT now()
);

Deploy Edge Function
npx supabase functions deploy detect-voice

Set Secrets
npx supabase secrets set SUPABASE_URL=YOUR_PROJECT_URL
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

🌐 Deploy Frontend (Vercel)
npm run build


Upload project to GitHub → Import into Vercel → Deploy

Add environment variables in Vercel:

VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY

🔐 Security

API key required for all requests

Keys validated server-side

Edge Function uses service role key

RLS enabled on tables
✅ Project Status

✔ Frontend deployed
✔ Backend deployed
✔ API key authentication
✔ Logging enabled
✔ Documentation complete
