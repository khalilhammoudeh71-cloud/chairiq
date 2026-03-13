import React, { useState, useCallback } from 'react';
import { MessageSquare, Send, CheckCircle, AlertCircle, X } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { supabase } from '../../../lib/supabase';

export default function TestSmsCard() {
  const [phone, setPhone] = useState('');
  const [link, setLink] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, type === 'error' ? 7000 : 5000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleSendTest = async () => {
    if (!phone) return;

    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      setResult({ success: false, error: 'Invalid phone number. Enter 10-15 digits.' });
      showToast('Invalid phone number', 'error');
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const headers = { 'Content-Type': 'application/json' };
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch('/api/test-sms', {
        method: 'POST',
        headers,
        body: JSON.stringify({ phone, link: link || undefined }),
      });

      const data = await res.json();

      if (data?.ok) {
        setResult({ success: true });
        showToast('Test SMS sent!', 'success');
      } else {
        const errMsg = data?.error || 'Failed to send test SMS';
        setResult({ success: false, error: errMsg });
        showToast(errMsg, 'error');
      }
    } catch (err) {
      const msg = err?.message || 'Network error — could not reach the server.';
      setResult({ success: false, error: msg });
      showToast(msg, 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare size={22} className="text-accent" />
          <h2 className="text-xl font-bold text-t1">SMS Delivery Test</h2>
        </div>
        <p className="text-t2 text-sm mb-4">
          Send a test SMS to verify your Telnyx configuration is working correctly.
        </p>
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setResult(null);
              }}
              placeholder="+1 (210) 555-1234"
              className="input-field flex-1"
            />
            <button
              onClick={handleSendTest}
              disabled={sending || !phone}
              className="btn-primary py-2.5 px-5 flex items-center gap-2 whitespace-nowrap"
            >
              <Send size={16} />
              {sending ? 'Sending...' : 'Send Test SMS'}
            </button>
          </div>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Secure link (optional — defaults to test URL)"
            className="input-field w-full"
          />
        </div>
        {result && (
          <div className={`mt-3 flex items-start gap-2 p-3 rounded-lg text-sm ${
            result.success
              ? 'bg-success/10 text-success'
              : 'bg-danger/10 text-danger'
          }`}>
            {result.success ? <CheckCircle size={16} className="mt-0.5 shrink-0" /> : <AlertCircle size={16} className="mt-0.5 shrink-0" />}
            <span>{result.success ? `Test SMS sent to ${phone}` : result.error}</span>
          </div>
        )}
      </Card>

      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
          {toasts.map(toast => (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-in slide-in-from-right transition-all ${
                toast.type === 'success'
                  ? 'bg-success text-white'
                  : toast.type === 'error'
                  ? 'bg-danger text-white'
                  : 'bg-bg2 text-t1 border border-bd'
              }`}
            >
              {toast.type === 'success' && <CheckCircle size={16} className="shrink-0" />}
              {toast.type === 'error' && <AlertCircle size={16} className="shrink-0" />}
              <span>{toast.message}</span>
              <button onClick={() => dismissToast(toast.id)} className="ml-2 shrink-0 opacity-70 hover:opacity-100">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
