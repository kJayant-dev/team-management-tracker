import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase, 
  Award, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  X,
  Sparkles
} from 'lucide-react';

export default function MemberProfileModal() {
  const { 
    profileModal, 
    setProfileModal, 
    members, 
    activities, 
    points, 
    trackingPeriod,
    customDateRange,
    setAddPointsModal,
    setActivityModal,
    markActivityCompleted,
    deleteActivity,
    deletePoints,
    openConfirmModal
  } = useApp();

  if (!profileModal.isOpen || !profileModal.memberId) return null;

  const member = members.find(m => m.member_id === Number(profileModal.memberId));
  if (!member) return null;

  // Member specific activities & points
  const memberActivities = activities.filter(a => a.member_id === member.member_id);
  const memberPoints = points.filter(p => p.member_id === member.member_id);

  const lifetimePoints = memberPoints.reduce((acc, curr) => acc + curr.points, 0);

  const getTrackingLabel = () => {
    if (trackingPeriod === '7') return 'Last 7 Days';
    if (trackingPeriod === '15') return 'Last 15 Days';
    if (trackingPeriod === '30') return 'Last 30 Days';
    if (trackingPeriod === '60') return 'Last 60 Days';
    if (trackingPeriod === '90') return 'Last 90 Days';
    if (trackingPeriod === 'custom') return `Custom (${customDateRange.start} to ${customDateRange.end})`;
    return 'All Time';
  };

  return (
    <div className="modal-overlay" onClick={() => setProfileModal({ isOpen: false, memberId: null })}>
      <div className="modal-content" style={{ maxWidth: '820px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img 
              src={member.profile_photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(member.name)}`} 
              alt={member.name} 
              className="avatar-lg"
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{member.name}</h2>
                <span className={`badge ${member.status === 'Active' ? 'badge-completed' : 'badge-cancelled'}`}>
                  {member.status}
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                {member.role} • <span style={{ color: '#818cf8' }}>{member.department}</span>
              </p>
              <div style={{ display: 'flex', gap: '1.2rem', marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Mail className="w-3.5 h-3.5" /> {member.email}</span>
                {member.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Phone className="w-3.5 h-3.5" /> {member.phone}</span>}
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar className="w-3.5 h-3.5" /> Joined {member.joining_date}</span>
              </div>
            </div>
          </div>

          <button className="modal-close" onClick={() => setProfileModal({ isOpen: false, memberId: null })}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Points & Stats Banner */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Lifetime Points
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#c084fc', marginTop: '0.2rem' }}>
                {member.lifetime_points || lifetimePoints} pts
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                {getTrackingLabel()} Points
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#818cf8', marginTop: '0.2rem' }}>
                +{member.period_points || 0} pts
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Period Activities
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.2rem' }}>
                {member.total_activities || 0}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Completion Rate
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399', marginTop: '0.2rem' }}>
                {member.completion_rate || 0}%
              </div>
            </div>
          </div>

          {/* Quick Action Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles className="w-4 h-4 text-amber-400" style={{ color: '#f59e0b' }} /> Activity & Points Record
            </h3>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => setAddPointsModal({ isOpen: true, memberId: member.member_id, activityId: null })}
              >
                <Award className="w-3.5 h-3.5" /> + Add Points
              </button>
              <button 
                className="btn btn-sm btn-secondary"
                onClick={() => setActivityModal({ isOpen: true, activity: null, preselectedMemberId: member.member_id })}
              >
                <Plus className="w-3.5 h-3.5" /> + Assign Task
              </button>
            </div>
          </div>

          {/* ACTIVITY HISTORY TABLE */}
          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '0.75rem' }}>
              ACTIVITY HISTORY ({memberActivities.length})
            </h4>

            {memberActivities.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(15, 23, 42, 0.4)', borderRadius: 'var(--radius-md)' }}>
                No activities assigned to this member yet.
              </div>
            ) : (
              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Activity Name</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Due Date</th>
                      <th>Points</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memberActivities.map(act => (
                      <tr key={act.activity_id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{act.activity_name}</div>
                          {act.description && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                              {act.description}
                            </div>
                          )}
                        </td>
                        <td>
                          <span className={`badge badge-priority-${act.priority ? act.priority.toLowerCase() : 'medium'}`}>
                            {act.priority}
                          </span>
                        </td>
                        <td>
                          <span className={`badge badge-${act.status ? act.status.toLowerCase().replace(' ', '-') : 'pending'}`}>
                            {act.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          {act.due_date || 'N/A'}
                        </td>
                        <td style={{ fontWeight: 700, color: act.points_awarded > 0 ? '#34d399' : 'var(--text-muted)' }}>
                          {act.points_awarded > 0 ? `+${act.points_awarded}` : '0'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            {act.status !== 'Completed' && (
                              <button 
                                className="btn btn-sm btn-success" 
                                style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                                onClick={() => markActivityCompleted(act.activity_id)}
                                title="Mark Completed"
                              >
                                <CheckCircle2 className="w-3 h-3" /> Complete
                              </button>
                            )}
                            <button 
                              className="btn btn-sm btn-secondary" 
                              style={{ padding: '0.2rem 0.5rem' }}
                              onClick={() => setActivityModal({ isOpen: true, activity: act, preselectedMemberId: null })}
                              title="Edit Activity"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button 
                              className="btn btn-sm btn-danger" 
                              style={{ padding: '0.2rem 0.5rem' }}
                              onClick={() => openConfirmModal(
                                'Delete Activity',
                                `Are you sure you want to delete "${act.activity_name}"?`,
                                () => deleteActivity(act.activity_id)
                              )}
                              title="Delete Activity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* POINT HISTORY TABLE */}
          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '0.75rem' }}>
              POINT HISTORY ({memberPoints.length})
            </h4>

            {memberPoints.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(15, 23, 42, 0.4)', borderRadius: 'var(--radius-md)' }}>
                No points recorded for this member yet.
              </div>
            ) : (
              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Reason / Activity</th>
                      <th>Points</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memberPoints.map(pt => (
                      <tr key={pt.point_id}>
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          {pt.point_date}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{pt.reason}</div>
                          {pt.activity_name && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              Ref: {pt.activity_name}
                            </div>
                          )}
                        </td>
                        <td style={{ fontWeight: 800, fontSize: '1rem', color: pt.points >= 0 ? '#34d399' : '#fb7185' }}>
                          {pt.points >= 0 ? `+${pt.points}` : pt.points}
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-danger" 
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={() => openConfirmModal(
                              'Remove Point Transaction',
                              `Are you sure you want to remove ${pt.points} pts for "${pt.reason}"?`,
                              () => deletePoints(pt.point_id)
                            )}
                            title="Remove Point Transaction"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => setProfileModal({ isOpen: false, memberId: null })}
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
