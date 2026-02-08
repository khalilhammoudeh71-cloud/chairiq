import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Card from '../../../components/ui/Card';


export default function DeletePatientModal({ patient, onClose, onConfirm }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') return;

    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  const isConfirmValid = confirmText === 'DELETE';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full bg-bg-1 border-danger/30">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-t1">Delete Patient Profile</h2>
              <p className="text-t3 text-sm">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-t3 hover:text-t1 transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Warning Content */}
        <div className="mb-6 space-y-4">
          <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-200 text-sm font-medium mb-2">
              ⚠️ You are about to permanently delete:
            </p>
            <p className="text-t1 font-semibold">
              {patient?.firstName} {patient?.lastName}
            </p>
            <p className="text-t2 text-sm">{patient?.phone}</p>
          </div>

          <div className="space-y-2">
            <p className="text-t2 text-sm font-medium">This will permanently delete:</p>
            <ul className="text-t3 text-sm space-y-1 ml-4">
              <li>• Patient profile and contact information</li>
              <li>• All treatment plans</li>
              <li>• All procedures and completion tracking</li>
              <li>• All engagement and analytics data</li>
              <li>• All SMS messages and click history</li>
              <li>• All session data and preferences</li>
            </ul>
          </div>

          {/* Confirmation Input */}
          <div className="mt-6">
            <label className="block text-t2 text-sm font-medium mb-2">
              Type <span className="text-red-400 font-bold">DELETE</span> to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e?.target?.value)}
              disabled={isDeleting}
              placeholder="Type DELETE here"
              className="w-full px-4 py-3 bg-bg-3 border border-border-1 rounded-lg text-t1 placeholder-t3 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 bg-bg-3 hover:bg-bg-2 text-t1 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!isConfirmValid || isDeleting}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Deleting...
              </>
            ) : (
              'Delete Forever'
            )}
          </button>
        </div>
      </Card>
    </div>
  );
}