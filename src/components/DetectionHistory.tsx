import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { History, TrendingUp } from 'lucide-react';

interface DetectionLog {
  id: string;
  language: string | null;
  result: string;
  confidence: number;
  audio_duration: number | null;
  created_at: string;
}

export function DetectionHistory() {
  const [logs, setLogs] = useState<DetectionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    aiGenerated: 0,
    human: 0,
    avgConfidence: 0,
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('detection_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const logs = data || [];
      setLogs(logs);

      const aiCount = logs.filter((log) => log.result === 'AI_GENERATED').length;
      const humanCount = logs.filter((log) => log.result === 'HUMAN').length;
      const avgConf =
        logs.length > 0
          ? logs.reduce((sum, log) => sum + Number(log.confidence), 0) / logs.length
          : 0;

      setStats({
        total: logs.length,
        aiGenerated: aiCount,
        human: humanCount,
        avgConfidence: avgConf,
      });
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading detection history...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <History className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Detection History</h2>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-700 font-medium mb-1">Total Detections</div>
          <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="text-sm text-orange-700 font-medium mb-1">AI Generated</div>
          <div className="text-2xl font-bold text-orange-900">{stats.aiGenerated}</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-sm text-green-700 font-medium mb-1">Human Voice</div>
          <div className="text-2xl font-bold text-green-900">{stats.human}</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-sm text-purple-700 font-medium mb-1 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Avg Confidence
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {(stats.avgConfidence * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Time</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Language</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Result</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Confidence</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Duration</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No detection history yet. Test the API to see results here.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 capitalize">
                    {log.language || 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        log.result === 'AI_GENERATED'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {log.result === 'AI_GENERATED' ? 'AI Generated' : 'Human'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {(Number(log.confidence) * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">-</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
