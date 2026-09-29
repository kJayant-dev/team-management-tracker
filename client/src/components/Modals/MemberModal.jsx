import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserPlus, UserCheck, X } from 'lucide-react';

export default function MemberModal() {
  const { memberModal, setMemberModal, addMember, updateMember, loading } = useApp();
  const isEdit = Boolean(memberModal.member);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: 'Engineering',
    joining_date: new Date().toISOString().split('T')[0],
    status: 'Active',
    profile_photo: ''
  });

  useEffect(() => {
    if (memberModal.member) {
      setFormData({
        name: memberModal.member.name || '',
        email: memberModal.member.email || '',
        phone: memberModal.member.phone || '',
        role: memberModal.member.role || '',
        department: memberModal.member.department || 'Engineering',
        joining_date: memberModal.member.joining_date || new Date().toISOString().split('T')[0],
        status: memberModal.member.status || 'Active',
        profile_photo: memberModal.member.profile_photo || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'Frontend Developer',
        department: 'Engineering',
        joining_date: new Date().toISOString().split('T')[0],
        status: 'Active',
        profile_photo: ''
      });
    }
  }, [memberModal.member]);

  if (!memberModal.isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      updateMember(memberModal.member.member_id, formData);
    } else {
      addMember(formData);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setMemberModal({ isOpen: false, member: null })}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isEdit ? <UserCheck className="w-5 h-5 text-indigo-400" /> : <UserPlus className="w-5 h-5 text-indigo-400" />}
            {isEdit ? 'Edit Team Member' : 'Add New Team Member'}
          </h3>
          <button className="modal-close" onClick={() => setMemberModal({ isOpen: false, member: null })}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Rahul Sharma"
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                required 
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="name@company.com"
                  value={formData.email} 
                  onChange={e => setFormData({ ...formData, email: e.target.value })} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="+91 98765 43210"
                  value={formData.phone} 
                  onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Role / Job Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Senior Frontend Developer"
                  value={formData.role} 
                  onChange={e => setFormData({ ...formData, role: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select 
                  className="form-control" 
                  value={formData.department} 
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Product">Product</option>
                  <option value="Quality Assurance">Quality Assurance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Joining Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={formData.joining_date} 
                  onChange={e => setFormData({ ...formData, joining_date: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select 
                  className="form-control" 
                  value={formData.status} 
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Profile Photo URL (Optional)</label>
              <input 
                type="url" 
                className="form-control" 
                placeholder="https://images.unsplash.com/photo-..."
                value={formData.profile_photo} 
                onChange={e => setFormData({ ...formData, profile_photo: e.target.value })} 
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                Leave empty to generate avatar automatically.
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setMemberModal({ isOpen: false, member: null })}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {isEdit ? 'Save Changes' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
