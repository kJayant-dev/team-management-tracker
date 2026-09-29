import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, ChevronDown, Filter } from 'lucide-react';

export default function TrackingPeriodSelector() {
  const { trackingPeriod, setTrackingPeriod, customDateRange } = useApp();
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [startDate, setStartDate] = useState(customDateRange.start);
  const [endDate, setEndDate] = useState(customDateRange.end);

  const periods = [
    { value: '7', label: 'Last 7 Days' },
    { value: '15', label: 'Last 15 Days' },
    { value: '30', label: 'Last 30 Days' },
    { value: '60', label: 'Last 60 Days' },
    { value: '90', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom Range...' },
    { value: 'all', label: 'All Time' }
  ];

  const handleSelectChange = (e) => {
    const val = e.target.value;
    if (val === 'custom') {
      setShowCustomModal(true);
    } else {
      setTrackingPeriod(val);
    }
  };

  const handleApplyCustom = (e) => {
    e.preventDefault();
    setTrackingPeriod('custom', startDate, endDate);
    setShowCustomModal(false);
  };

  const getLabel = () => {
    if (trackingPeriod === 'custom') {
      return `Custom (${startDate} → ${endDate})`;
    }
    const found = periods.find(p => p.value === trackingPeriod);
    return found ? found.label : 'Last 30 Days';
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'rgba(30, 41, 59, 0.8)',
        border: '1px solid var(--border-accent)',
        borderRadius: 'var(--radius-md)',
        padding: '0.4rem 0.85rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <Calendar className="w-4 h-4 text-indigo-400" style={{ color: '#818cf8' }} />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Period:</span>
        
        <select
          value={trackingPeriod}
          onChange={handleSelectChange}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.88rem',
            fontWeight: '700',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {periods.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>

        {trackingPeriod === 'custom' && (
          <button 
            className="btn btn-sm btn-secondary" 
            onClick={() => setShowCustomModal(true)}
            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
          >
            <Filter className="w-3 h-3" /> Edit
          </button>
        )}
      </div>

      {showCustomModal && (
        <div className="modal-overlay" onClick={() => setShowCustomModal(false)}>
          <div className="modal-content" style={{ maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar className="w-5 h-5 text-indigo-400" /> Select Custom Date Range
              </h3>
              <button className="modal-close" onClick={() => setShowCustomModal(false)}>✕</button>
            </div>
            <form onSubmit={handleApplyCustom}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={startDate} 
                    onChange={e => setStartDate(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={endDate} 
                    onChange={e => setEndDate(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCustomModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Apply Date Range
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
