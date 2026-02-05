import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Key, Plus, Trash2, Copy, Check } from 'lucide-react';

interface ApiKey {
  id: string;
  key: string;
  name: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
}

export function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) return;

    try {
      const newKey = `vd_${crypto.randomUUID().replace(/-/g, '')}`;
      const { error } = await supabase
        .from('api_keys')
        .insert({ key: newKey, name: newKeyName, is_active: true });

      if (error) throw error;
      setNewKeyName('');
      fetchApiKeys();
    } catch (error) {
      console.error('Error creating API key:', error);
    }
  };

  const deleteApiKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;

    try {
      const { error } = await supabase.from('api_keys').delete().eq('id', id);
      if (error) throw error;
      fetchApiKeys();
    } catch (error) {
      console.error('Error deleting API key:', error);
    }
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading) {
    return <div className="text-center py-8">Loading API keys...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Key className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">API Keys</h2>
      </div>

      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Enter key name..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && createApiKey()}
          />
          <button
            onClick={createApiKey}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Key
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {apiKeys.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No API keys yet. Create one to get started.</p>
        ) : (
          apiKeys.map((apiKey) => (
            <div
              key={apiKey.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{apiKey.name}</span>
                  {apiKey.is_active ? (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                      Inactive
                    </span>
                  )}
                </div>
                <code className="text-sm text-gray-600 font-mono">{apiKey.key}</code>
                {apiKey.last_used_at && (
                  <p className="text-xs text-gray-500 mt-1">
                    Last used: {new Date(apiKey.last_used_at).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(apiKey.key)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedKey === apiKey.key ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => deleteApiKey(apiKey.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
