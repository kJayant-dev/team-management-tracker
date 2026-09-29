import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  UserPlus, 
  Search, 
  Award, 
  Eye, 
  Edit3, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar,
  CheckCircle2,
  Clock,
  Briefcase
} from 'lucide-react';

export default function TeamMembers() {
  const { 
    members, 
    searchTerm, 
    setMemberModal, 
    setProfileModal, 
    setAddPointsModal, 
    deleteMember, 
    openConfirmModal,
    trackingPeriod 
  } = useApp();

  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Filter members by search term and department
  const filteredMembers = members.filter(m => {
    const matchesSearch = searchTerm === '' || 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(m.member_id).includes(searchTerm);

    const matchesDept = departmentFilter === 'All' || m.department === departmentFilter;

    return matchesSearch && matchesDept;
  });

  const departments = ['All', 'Engineering', 'Design', 'Product', 'Quality Assurance', 'Marketing', 'Operations'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Team Directory</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Manage team members, view performance history, and award manual points.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Department Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Dept:</span>
            <select 
              className="form-control" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              value={departmentFilter}
              onChange={e => setDepartmentFilter(e.target.value)}
            >
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <button 
            className="btn btn-primary"
            onClick={() => setMemberModal({ isOpen: true, member: null })}
          >
            <UserPlus className="w-4 h-4" /> + Add Member
          </button>
        </div>
      </div>

      {/* TEAM MEMBERS GRID */}
      {filteredMembers.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No team members match the search or filter criteria.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.25rem'
        }}>
          {filteredMembers.map(m => (
            <div key={m.member_id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                
                {/* Member Top Info */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                  <img 
                    src={m.profile_photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(m.name)}`} 
                    alt={m.name} 
                    className="avatar-img"
                    style={{ width: '54px', height: '54px' }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {m.name}
                      </h3>
                      <span className={`badge ${m.status === 'Active' ? 'badge-completed' : 'badge-cancelled'}`}>
                        {m.status}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 600, marginTop: '0.1rem' }}>
                      {m.role}
                    </p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      ID: MEM-{m.member_id} • {m.department}
                    </p>
                  </div>
                </div>

                {/* Points & Stats Banner */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  border: '1px solid var(--border-color)'
                }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                      Lifetime Points
                    </span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#c084fc' }}>
                      {m.lifetime_points || 0} pts
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                      Period Points
                    </span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>
                      +{m.period_points || 0} pts
                    </div>
                  </div>
                </div>

                {/* Performance Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Period Activities ({m.total_activities || 0})</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {m.completed_activities || 0} Done / {m.pending_activities || 0} Pending
                    </span>
                  </div>

                  {/* Completion Rate Bar */}
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${m.completion_rate || 0}%`,
                      height: '100%',
                      background: 'var(--gradient-emerald-teal)',
                      borderRadius: '3px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Completion Rate</span>
                    <span style={{ fontWeight: 700, color: '#34d399' }}>{m.completion_rate || 0}%</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <button 
                  className="btn btn-sm btn-primary" 
                  style={{ flex: 1 }}
                  onClick={() => setProfileModal({ isOpen: true, memberId: m.member_id })}
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>

                <button 
                  className="btn btn-sm btn-success" 
                  onClick={() => setAddPointsModal({ isOpen: true, memberId: m.member_id, activityId: null })}
                  title="Award Points"
                >
                  <Award className="w-3.5 h-3.5" /> + Points
                </button>

                <button 
                  className="btn btn-sm btn-secondary" 
                  onClick={() => setMemberModal({ isOpen: true, member: m })}
                  title="Edit Member"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => openConfirmModal(
                    'Delete Team Member',
                    `Are you sure you want to delete ${m.name}? All historical data will remain associated or unassigned safely.`,
                    () => deleteMember(m.member_id)
                  )}
                  title="Delete Member"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
