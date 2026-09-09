import React, { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { emailService } from '../../../services/emailService';

export default function TestEmailCard() {
  const [testEmail, setTestEmail] = useState('');
  const [planLink, setPlanLink] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const handleSendTest = async () => {
    if (!testEmail) return;

    setSending(true);
    setResult(null);

    const res = await emailService.sendTestEmail(testEmail, planLink);

    setResult(res);
    setSending(false);
  };

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <Mail size={22} className="text-accent" />
        <h2 className="text-xl font-bold text-t1">Email Delivery Test</h2>
      </div>
      <p className="text-t2 text-sm mb-4">
        Send a test email to verify your SMTP configuration is working correctly.
      </p>
      <div className="flex gap-2 items-center">
        <input
          type="email"
          value={testEmail}
          onChange={(e) => {
            setTestEmail(e.target.value);
            setResult(null);
          }}
          placeholder="recipient@example.com"
          className="input-field flex-1"
        />
        <button
          onClick={handleSendTest}
          disabled={sending || !testEmail || !planLink}
          className="btn-primary py-2.5 px-5 flex items-center gap-2 whitespace-nowrap"
        >
          <Send size={16} />
          {sending ? 'Sending...' : 'Send Test'}
        </button>
      </div>
      <input type="url" value={planLink} onChange={(e) => { setPlanLink(e.target.value); setResult(null); }}
        placeholder="Paste sample-plan link from Analytics → Copy"
        aria-label="Sample-plan link" className="input-field w-full mt-3" />
      <p className="text-t2 text-xs mt-2">Copy a fresh link from Analytics, then paste it here to test email and plan access.</p>
      {result && (
        <div className={`mt-3 flex items-start gap-2 p-3 rounded-lg text-sm ${
          result.success
            ? 'bg-success/10 text-success'
            : 'bg-danger/10 text-danger'
        }`}>
          {result.success ? <CheckCircle size={16} className="mt-0.5 shrink-0" /> : <AlertCircle size={16} className="mt-0.5 shrink-0" />}
          <span>{result.success ? `Test email sent to ${testEmail}` : result.error}</span>
        </div>
      )}
    </Card>
  );
}
