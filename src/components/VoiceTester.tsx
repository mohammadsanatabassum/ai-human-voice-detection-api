import { useState } from 'react';
import { API_ENDPOINT } from '../lib/supabase';
import { Mic, Upload, Loader } from 'lucide-react';

const SUPPORTED_LANGUAGES = ['Tamil', 'English', 'Hindi', 'Malayalam', 'Telugu'];

interface DetectionResult {
  status: 'success' | 'error';
  language?: string;
  classification?: 'AI_GENERATED' | 'HUMAN';
  confidenceScore?: number;
  explanation?: string;
  message?: string;
}

export function VoiceTester() {
  const [apiKey, setApiKey] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.includes('audio')) {
        setError('Please select a valid audio file');
        return;
      }
      setAudioFile(file);
      setError(null);
      setResult(null);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const detectVoice = async () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    if (!audioFile) {
      setError('Please select an audio file');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const base64Audio = await convertToBase64(audioFile);

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`

        },
        body: JSON.stringify({
          language: selectedLanguage,
          audioFormat: 'mp3',
          audioBase64: base64Audio,
        }),
      });

      const data = await response.json();

      if (data.status === 'error') {
        throw new Error(data.message || 'Failed to detect voice');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Mic className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Test Voice Detection</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Audio File</label>
          <div className="relative">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
              id="audio-upload"
            />
            <label
              htmlFor="audio-upload"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Upload className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600">
                {audioFile ? audioFile.name : 'Click to upload audio file'}
              </span>
            </label>
          </div>
        </div>

        <button
          onClick={detectVoice}
          disabled={loading || !apiKey || !audioFile}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              Detect Voice
            </>
          )}
        </button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {result && result.status === 'success' && (
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">Detection Result</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Classification:</span>
                <span
                  className={`px-4 py-2 rounded-full font-semibold ${
                    result.classification === 'AI_GENERATED'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {result.classification === 'AI_GENERATED' ? 'AI Generated' : 'Human Voice'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Confidence Score:</span>
                <span className="text-gray-900 font-semibold">{(result.confidenceScore! * 100).toFixed(1)}%</span>
              </div>
              {result.language && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Language:</span>
                  <span className="text-gray-900 capitalize">{result.language}</span>
                </div>
              )}
              {result.explanation && (
                <div className="border-t border-blue-300 pt-3 mt-3">
                  <span className="text-gray-700 font-medium block mb-2">Explanation:</span>
                  <span className="text-gray-700 text-sm">{result.explanation}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
