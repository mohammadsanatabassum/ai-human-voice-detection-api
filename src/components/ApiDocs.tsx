import { API_ENDPOINT } from '../lib/supabase';
import { BookOpen, Code } from 'lucide-react';

export function ApiDocs() {
  const requestExample = `POST ${API_ENDPOINT}
Headers:
  Content-Type: application/json
  x-api-key: your_api_key_here

Body:
{
  "language": "English",
  "audioFormat": "mp3",
  "audioBase64": "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU2LjM2LjEwMAAAAAAA..."
}`;

  const responseExample = `{
  "status": "success",
  "language": "English",
  "classification": "AI_GENERATED",
  "confidenceScore": 0.91,
  "explanation": "Unnatural pitch consistency and robotic speech patterns detected"
}`;

  const curlExample = `curl -X POST ${API_ENDPOINT} \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: your_api_key_here" \\
  -d '{
    "language": "English",
    "audioFormat": "mp3",
    "audioBase64": "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU2LjM2LjEwMAAAAAAA..."
  }'`;

  const pythonExample = `import requests
import base64

with open('audio.mp3', 'rb') as f:
    audio_base64 = base64.b64encode(f.read()).decode('utf-8')

response = requests.post(
    '${API_ENDPOINT}',
    headers={
        'Content-Type': 'application/json',
        'x-api-key': 'your_api_key_here'
    },
    json={
        'language': 'English',
        'audioFormat': 'mp3',
        'audioBase64': audio_base64
    }
)

result = response.json()
if result['status'] == 'success':
    print(f"Classification: {result['classification']}")
    print(f"Confidence: {result['confidenceScore']}")
    print(f"Explanation: {result['explanation']}")`;

  const javascriptExample = `const fs = require('fs');

const audioBuffer = fs.readFileSync('audio.mp3');
const audioBase64 = audioBuffer.toString('base64');

const response = await fetch('${API_ENDPOINT}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your_api_key_here'
  },
  body: JSON.stringify({
    language: 'English',
    audioFormat: 'mp3',
    audioBase64: audioBase64
  })
});

const result = await response.json();
if (result.status === 'success') {
  console.log('Classification:', result.classification);
  console.log('Confidence:', result.confidenceScore);
  console.log('Explanation:', result.explanation);
}`;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">API Documentation</h2>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Endpoint</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <code className="text-sm text-gray-800 font-mono break-all">{API_ENDPOINT}</code>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Authentication</h3>
          <p className="text-gray-700 mb-2">
            Include your API key in the <code className="px-2 py-1 bg-gray-100 rounded">X-API-Key</code> header.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Supported Languages</h3>
          <div className="flex flex-wrap gap-2">
            {['Tamil', 'English', 'Hindi', 'Malayalam', 'Telugu'].map((lang) => (
              <span
                key={lang}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {lang}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Request Format</h3>
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
            <code className="text-sm font-mono">{requestExample}</code>
          </pre>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Response Format</h3>
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
            <code className="text-sm font-mono">{responseExample}</code>
          </pre>
          <div className="mt-3 space-y-2">
            <div className="flex gap-2">
              <span className="font-medium text-gray-700 min-w-32">status:</span>
              <span className="text-gray-600">
                Either <code className="px-2 py-0.5 bg-gray-100 rounded">success</code> or{' '}
                <code className="px-2 py-0.5 bg-gray-100 rounded">error</code>
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-gray-700 min-w-32">classification:</span>
              <span className="text-gray-600">
                Either <code className="px-2 py-0.5 bg-gray-100 rounded">AI_GENERATED</code> or{' '}
                <code className="px-2 py-0.5 bg-gray-100 rounded">HUMAN</code>
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-gray-700 min-w-32">confidenceScore:</span>
              <span className="text-gray-600">Float between 0.0 and 1.0</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-gray-700 min-w-32">language:</span>
              <span className="text-gray-600">The language of the audio</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-gray-700 min-w-32">explanation:</span>
              <span className="text-gray-600">Short reason for the decision</span>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Code className="w-5 h-5" />
            Code Examples
          </h3>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">cURL</h4>
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm font-mono">{curlExample}</code>
              </pre>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-2">Python</h4>
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm font-mono">{pythonExample}</code>
              </pre>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-2">JavaScript / Node.js</h4>
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm font-mono">{javascriptExample}</code>
              </pre>
            </div>
          </div>
        </section>

        <section className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Important Notes</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Audio must be base64-encoded MP3 format</li>
            <li>Maximum file size recommended: 10MB</li>
            <li>Confidence score indicates certainty of classification</li>
            <li>All API calls are logged for analytics</li>
            <li>Hard-coding detection results is strictly prohibited</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
