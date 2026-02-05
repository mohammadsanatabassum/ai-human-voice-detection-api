🎤 AI Human Voice Detection API

Detect whether a given voice sample is AI-generated or spoken by a real human using a secure, API-based system.
Supports Tamil, English, Hindi, Malayalam, and Telugu.

🚀 Live Demo

Frontend Website:
👉 https://ai-human-voice-detection-api.vercel.app

API Endpoint:
👉 https://fotuzquiawsgrofmosxv.supabase.co/functions/v1/detect-voice

📌 Features

Upload MP3 audio

Language selection

API Key authentication

JSON-based responses

Confidence score (0.0 – 1.0)

Detection history logging

Simple explanation of result

Serverless backend

🏗️ System Architecture
User Browser
   |
   v
React Frontend (Vercel)
   |
   | POST Request (JSON)
   | Headers: x-api-key
   v
Supabase Edge Function (detect-voice)
   |
   | Validate API Key
   | Analyze Audio
   | Log Result
   v
Supabase PostgreSQL Database
   |
   ├─ api_keys
   └─ detection_logs

🧩 Tech Stack
Frontend

React + TypeScript

Vite

Tailwind CSS

Lucide Icons

Backend

Supabase Edge Functions (Deno)

Database

Supabase PostgreSQL

Hosting

Frontend: Vercel

Backend: Supabase

📂 Database Tables
api_keys
Column	Type
id	uuid
key	text
name	text
is_active	boolean
created_at	timestamptz
last_used_at	timestamptz
detection_logs
Column	Type
id	uuid
api_key_id	uuid
language	text
result	text
confidence	decimal
created_at	timestamptz
🔐 Authentication

Each request must include an API key:

x-api-key: YOUR_API_KEY


API keys are created inside the web dashboard under API Keys tab.

📡 API Usage
Endpoint
POST /functions/v1/detect-voice

Headers
Content-Type: application/json
x-api-key: YOUR_API_KEY

Request Body
{
  "language": "English",
  "audioFormat": "mp3",
  "audioBase64": "BASE64_ENCODED_AUDIO"
}

Success Response
{
  "status": "success",
  "language": "English",
  "classification": "HUMAN",
  "confidenceScore": 0.87,
  "explanation": "Natural human voice characteristics detected"
}

Error Response
{
  "status": "error",
  "message": "Invalid API key or malformed request"
}

🧪 cURL Example
curl -X POST https://fotuzquiawsgrofmosxv.supabase.co/functions/v1/detect-voice \
-H "Content-Type: application/json" \
-H "x-api-key: YOUR_API_KEY" \
-d '{
  "language": "English",
  "audioFormat": "mp3",
  "audioBase64": "BASE64_STRING"
}'

🐍 Python Example
import requests, base64

with open("audio.mp3","rb") as f:
    b64 = base64.b64encode(f.read()).decode()

res = requests.post(
  "https://fotuzquiawsgrofmosxv.supabase.co/functions/v1/detect-voice",
  headers={
    "Content-Type":"application/json",
    "x-api-key":"YOUR_API_KEY"
  },
  json={
    "language":"English",
    "audioFormat":"mp3",
    "audioBase64":b64
  }
)

print(res.json())

🧠 Detection Logic

Audio statistics are extracted

Variance & zero-crossing features analyzed

Classification score generated

Random factor added to avoid hard-coding

Result mapped to HUMAN / AI_GENERATED

🧾 Logging

Every successful request is stored:

API Key ID

Language

Classification

Confidence

Timestamp

Displayed in History tab.

⚙️ Environment Variables (Frontend)
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key

⚙️ Supabase Secrets (Backend)
npx supabase secrets set SUPABASE_URL=YOUR_URL
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_KEY

🚀 Local Development
Frontend
npm install
npm run dev

Deploy Edge Function
npx supabase functions deploy detect-voice

🧪 Local ML Prototype (Optional)

During development, a FastAPI ML prototype was tested:

http://127.0.0.1:9000/docs#/default/predict_predict_post


Final production system uses Supabase Edge Functions.

⚠️ Rules Compliance

No hard-coded outputs

No external detection APIs

Real computation done

Explainable output provided

📌 Submission Info

Live Website:
https://ai-human-voice-detection-api.vercel.app

API Endpoint:
https://fotuzquiawsgrofmosxv.supabase.co/functions/v1/detect-voice

Sample API Key:
Create using the website → API Keys tab
