import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckSquare, X } from 'lucide-react';

export default function ActivityModal() {
  const { 
    activityModal, 
    setActivityModal, 
    members, 
    addActivity, 
    updateActivity, 
    loading 
  } = useApp();

  const isEdit = Boolean(activityModal.activity);
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    activity_name: '',
    description: '',
    member_id: '',
    assigned_date: today,
    start_date: today,
    due_date: today,
    completion_date: '',
    priority: 'Medium',
    status: 'Pending',
    notes: ''
  });

  useEffect(() => {
    if (activityModal.activity) {
      setFormData({
        activity_name: activityModal.activity.activity_name || '',
        description: activityModal.activity.description || '',
        member_id: activityModal.activity.member_id || (members.length > 0 ? members[0].member_id : ''),
        assigned_date: activityModal.activity.assigned_date || today,
        start_date: activityModal.activity.start_date || today,
        due_date: activityModal.activity.due_date || today,
        completion_date: activityModal.activity.completion_date || '',
        priority: activityModal.activity.priority || 'Medium',
        status: activityModal.activity.status || 'Pending',
        notes: activityModal.activity.notes || ''
      });
    } else {
      setFormData({
        activity_name: '',
        description: '',
        member_id: activityModal.preselectedMemberId || (members.length > 0 ? members[0].member_id : ''),
        assigned_date: today,
        start_date: today,
        due_date: today,
        completion_date: '',
        priority: 'Medium',
        status: 'Pending',
        notes: ''
      });
    }
  }, [activityModal, members, today]);

  if (!activityModal.isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.member_id) {
      alert('Please select a team member');
      return;
    }

    if (isEdit) {
      updateActivity(activityModal.activity.activity_id, formData);
    } else {
      addActivity(formData);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setActivityModal({ isOpen: false, activity: null, preselectedMemberId: null })}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckSquare className="w-5 h-5 text-indigo-400" />
            {isEdit ? 'Edit Activity / Task' : 'Add New Activity / Task'}
          </h3>
          <button className="modal-close" onClick={() => setActivityModal({ isOpen: false, activity: null, preselectedMemberId: null })}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Activity / Task Name *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Website Redesign UI Implementation"
                value={formData.activity_name} 
                onChange={e => setFormData({ ...formData, activity_name: e.target.value })} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Team Member *</label>
              <select 
                className="form-control" 
                value={formData.member_id} 
                onChange={e => setFormData({ ...formData, member_id: e.target.value })}
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

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                className="form-control" 
                rows="3" 
                placeholder="Details about requirements, scope, and target outcomes..."
                value={formData.description} 
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select 
                  className="form-control" 
                  value={formData.priority} 
                  onChange={e => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select 
                  className="form-control" 
                  value={formData.status} 
                  onChange={e => {
                    const newStatus = e.target.value;
                    setFormData({
                      ...formData,
                      status: newStatus,
                      completion_date: newStatus === 'Completed' ? today : ''
                    });
                  }}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Assigned Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={formData.assigned_date} 
                  onChange={e => setFormData({ ...formData, assigned_date: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={formData.due_date} 
                  onChange={e => setFormData({ ...formData, due_date: e.target.value })} 
                />
              </div>
            </div>

            {formData.status === 'Completed' && (
              <div className="form-group">
                <label className="form-label">Completion Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={formData.completion_date || today} 
                  onChange={e => setFormData({ ...formData, completion_date: e.target.value })} 
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Notes & Remarks</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Delivered 2 days early. High test coverage."
                value={formData.notes} 
                onChange={e => setFormData({ ...formData, notes: e.target.value })} 
              />
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setActivityModal({ isOpen: false, activity: null, preselectedMemberId: null })}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {isEdit ? 'Save Changes' : 'Create Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
