import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal() {
  const { confirmModal, setConfirmModal } = useApp();

  if (!confirmModal.isOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })}>
      <div className="modal-content" style={{ maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fb7185' }}>
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            {confirmModal.title || 'Confirm Action'}
          </h3>
          <button className="modal-close" onClick={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.5' }}>
            {confirmModal.message || 'Are you sure you want to proceed? This action cannot be undone.'}
          </p>
        </div>

        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-danger" 
            onClick={() => {
              if (confirmModal.onConfirm) confirmModal.onConfirm();
            }}
          >
            Confirm & Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
