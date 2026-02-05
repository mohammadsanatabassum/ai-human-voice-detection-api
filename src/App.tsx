import { useState } from 'react';
import { ApiKeyManager } from './components/ApiKeyManager';
import { VoiceTester } from './components/VoiceTester';
import { DetectionHistory } from './components/DetectionHistory';
import { ApiDocs } from './components/ApiDocs';
import { Waves } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'test' | 'keys' | 'history' | 'docs'>('test');

  const tabs = [
    { id: 'test' as const, label: 'Test API' },
    { id: 'keys' as const, label: 'API Keys' },
    { id: 'history' as const, label: 'History' },
    { id: 'docs' as const, label: 'Documentation' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                AI Voice Detection API
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Detect AI-generated voices in Tamil, English, Hindi, Malayalam, and Telugu
              </p>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'test' && <VoiceTester />}
        {activeTab === 'keys' && <ApiKeyManager />}
        {activeTab === 'history' && <DetectionHistory />}
        {activeTab === 'docs' && <ApiDocs />}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            AI Voice Detection API - Supporting Tamil, English, Hindi, Malayalam, and Telugu
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
