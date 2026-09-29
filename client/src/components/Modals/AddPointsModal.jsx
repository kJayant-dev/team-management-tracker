import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, X } from 'lucide-react';

export default function AddPointsModal() {
  const { 
    addPointsModal, 
    setAddPointsModal, 
    members, 
    activities, 
    addPoints, 
    loading 
  } = useApp();

  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    member_id: '',
    activity_id: '',
    points: 10,
    reason: '',
    point_date: today
  });

  useEffect(() => {
    if (addPointsModal.isOpen) {
      setFormData({
        member_id: addPointsModal.memberId || (members.length > 0 ? members[0].member_id : ''),
        activity_id: addPointsModal.activityId || '',
        points: 20,
        reason: 'Task completion bonus',
        point_date: today
      });
    }
  }, [addPointsModal, members, today]);

  if (!addPointsModal.isOpen) return null;

  const selectedMember = members.find(m => m.member_id === Number(formData.member_id));
  const memberActivities = activities.filter(a => a.member_id === Number(formData.member_id));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.member_id) {
      alert('Please select a member');
      return;
    }

    addPoints({
      member_id: formData.member_id,
      activity_id: formData.activity_id || null,
      points: Number(formData.points),
      reason: formData.reason || 'Manual Adjustment',
      point_date: formData.point_date || today
    });
  };

  return (
    <div className="modal-overlay" onClick={() => setAddPointsModal({ isOpen: false, memberId: null, activityId: null })}>
      <div className="modal-content" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award className="w-5 h-5 text-amber-400" style={{ color: '#f59e0b' }} />
            Award Manual Points
          </h3>
          <button className="modal-close" onClick={() => setAddPointsModal({ isOpen: false, memberId: null, activityId: null })}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Team Member *</label>
              <select 
                className="form-control" 
                value={formData.member_id} 
                onChange={e => setFormData({ ...formData, member_id: e.target.value, activity_id: '' })}
                required
              >
                <option value="" disabled>Select Team Member</option>
                {members.map(m => (
                  <option key={m.member_id} value={m.member_id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            {selectedMember && (
              <div style={{
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Current Lifetime Points:</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#818cf8' }}>
                  {selectedMember.lifetime_points || 0} pts
                </span>
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Points Amount *</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="e.g. 20 (or -10 to correct)"
                  value={formData.points} 
                  onChange={e => setFormData({ ...formData, points: e.target.value })} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Transaction Date *</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={formData.point_date} 
                  onChange={e => setFormData({ ...formData, point_date: e.target.value })} 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Related Activity (Optional)</label>
              <select 
                className="form-control" 
                value={formData.activity_id} 
                onChange={e => {
                  const selectedActId = e.target.value;
                  const act = activities.find(a => a.activity_id === Number(selectedActId));
                  setFormData({ 
                    ...formData, 
                    activity_id: selectedActId,
                    reason: act ? `Completed ${act.activity_name}` : formData.reason
                  });
                }}
              >
                <option value="">None / General Bonus</option>
                {memberActivities.map(a => (
                  <option key={a.activity_id} value={a.activity_id}>
                    {a.activity_name} ({a.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Reason / Description *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Completed work successfully / Great effort"
                value={formData.reason} 
                onChange={e => setFormData({ ...formData, reason: e.target.value })} 
                required 
              />
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setAddPointsModal({ isOpen: false, memberId: null, activityId: null })}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              Award Points
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
