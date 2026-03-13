import React, { useState, useEffect } from 'react';
import { X, Mail, MessageSquare, Send } from 'lucide-react';
import { cn } from '../../../utils/cn';

export default function SendPlanModal({ isOpen, onClose, planLink, patientPhone, patientEmail, onSend }) {
  const [method, setMethod] = useState('sms');
  const [recipient, setRecipient] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const defaultMethod = patientEmail ? 'email' : 'sms';
      setMethod(defaultMethod);
      setRecipient(defaultMethod === 'sms' ? (patientPhone || '') : (patientEmail || ''));
      setSending(false);
    }
  }, [isOpen, patientPhone, patientEmail]);

  if (!isOpen) return null;

  const handleMethodChange = (newMethod) => {
    setMethod(newMethod);
    setRecipient(newMethod === 'sms' ? (patientPhone || '') : (patientEmail || ''));
  };

  const smsPreview = `ChairIQ: Your dental treatment plan is ready. View it here: ${planLink}`;

  const emailSubject = 'Your ChairIQ Treatment Plan';
  const emailBody = `Your dental treatment plan is ready for review. Click the link below to view your personalized care plan.\n\n${planLink}`;

  const handleSend = async () => {
    if (!recipient.trim()) return;
    setSending(true);
    try {
      await onSend({ method, recipient, planLink });
      onClose();
    } catch {
      // error toast handled by parent
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-bg1 border border-bd rounded-2xl shadow-2xl w-full max-w-lg z-10">
        <div className="flex items-center justify-between p-6 border-b border-bd">
          <h2 className="text-xl font-bold text-t1">Send Treatment Plan</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg3 transition-colors text-t3 hover:text-t1">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-t2 mb-3">Delivery Method</label>
            <div className="flex gap-2">
              <button
                onClick={() => handleMethodChange('sms')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all border',
                  method === 'sms'
                    ? 'bg-accent text-white border-accent shadow-md'
                    : 'bg-bg2 text-t2 border-bd hover:bg-bg3'
                )}
              >
                <MessageSquare size={18} />
                SMS
              </button>
              <button
                onClick={() => handleMethodChange('email')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all border',
                  method === 'email'
                    ? 'bg-accent text-white border-accent shadow-md'
                    : 'bg-bg2 text-t2 border-bd hover:bg-bg3'
                )}
              >
                <Mail size={18} />
                Email
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-t2 mb-2">
              {method === 'sms' ? 'Phone Number' : 'Email Address'}
            </label>
            <input
              type={method === 'sms' ? 'tel' : 'email'}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder={method === 'sms' ? '+1 (210) 555-1234' : 'patient@email.com'}
              className="input-field w-full focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-t2 mb-2">Message Preview</label>
            <div className="bg-bg2 border border-bd rounded-xl p-4">
              {method === 'sms' ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare size={14} className="text-accent" />
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">SMS Message</span>
                  </div>
                  <p className="text-sm text-t1 leading-relaxed">{smsPreview}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail size={14} className="text-accent" />
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">Email</span>
                  </div>
                  <div>
                    <span className="text-xs text-t3 font-medium">Subject:</span>
                    <p className="text-sm text-t1 font-semibold">{emailSubject}</p>
                  </div>
                  <div>
                    <span className="text-xs text-t3 font-medium">Body:</span>
                    <p className="text-sm text-t1 leading-relaxed whitespace-pre-line">{emailBody}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-bd">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm bg-bg3 text-t2 hover:bg-bg2 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending || !recipient.trim()}
            className={cn(
              'flex-1 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all',
              'bg-accent text-white hover:bg-accent-hover',
              (sending || !recipient.trim()) && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Send size={18} />
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
