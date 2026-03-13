import React, { useState, useEffect, useCallback } from 'react';
import { Mail, MessageSquare, RefreshCw, Clock } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export default function DeliveryHistory({ planId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    if (!planId) return;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      const res = await fetch(`/api/message-logs/${planId}`, { headers });
      const data = await res.json();
      if (data?.ok) {
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Error fetching delivery history:', err);
    } finally {
      setLoading(false);
    }
  }, [planId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const formatTimestamp = (ts) => {
    if (!ts) return 'N/A';
    return new Date(ts).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!planId) return null;
  if (logs.length === 0 && !loading) return null;

  return (
    <div className="card mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Clock size={20} className="text-accent" />
          <h3 className="text-lg font-bold text-t1">Delivery History</h3>
        </div>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="btn-ghost text-accent hover:text-accent-hover flex items-center gap-1.5 text-sm"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="flex items-center gap-4 p-3 bg-bg2 rounded-xl border border-bd">
            <div className="flex-shrink-0">
              {log.method === 'sms' ? (
                <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                  <MessageSquare size={16} className="text-accent" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                  <Mail size={16} className="text-accent" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-t1 uppercase">{log.method}</span>
                <span className="text-sm text-t2 truncate">{log.destination}</span>
              </div>
              <span className="text-xs text-t3">{formatTimestamp(log.created_at)}</span>
            </div>

            <div className="flex-shrink-0">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  log.status === 'sent'
                    ? 'bg-success/10 text-success'
                    : 'bg-danger/10 text-danger'
                }`}
              >
                {log.status === 'sent' ? 'Sent' : 'Failed'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
