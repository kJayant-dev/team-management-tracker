import React from 'react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import StatusPieChart from '../components/Charts/StatusPieChart';
import MemberPointsChart from '../components/Charts/MemberPointsChart';
import { 
  Users, 
  CheckSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Award, 
  ArrowUpRight, 
  Calendar, 
  Trophy, 
  PlusCircle, 
  UserPlus,
  Sparkles
} from 'lucide-react';

export default function Dashboard() {
  const { 
    dashboardData, 
    members, 
    trackingPeriod, 
    setMemberModal, 
    setActivityModal, 
    setAddPointsModal,
    setProfileModal,
    markActivityCompleted 
  } = useApp();

  if (!dashboardData) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading dashboard statistics...</div>
      </div>
    );
  }

  const { summary, top_earners, recent_activities, upcoming_deadlines, recently_completed } = dashboardData;

  const getPeriodLabel = () => {
    if (trackingPeriod === '7') return 'Last 7 Days';
    if (trackingPeriod === '15') return 'Last 15 Days';
    if (trackingPeriod === '30') return 'Last 30 Days';
    if (trackingPeriod === '60') return 'Last 60 Days';
    if (trackingPeriod === '90') return 'Last 90 Days';
    if (trackingPeriod === 'custom') return 'Custom Date Range';
    return 'All Time';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Overview Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
        border: '1px solid var(--border-accent)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem 2rem'
      }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Tracking Period Active: {getPeriodLabel()}
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.25rem' }}>
            Team Activity & Performance
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Calculations and metrics filtered for {getPeriodLabel().toLowerCase()}. Lifetime data remains preserved.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => setMemberModal({ isOpen: true, member: null })}
          >
            <UserPlus className="w-4 h-4" /> + Add Member
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setActivityModal({ isOpen: true, activity: null, preselectedMemberId: null })}
          >
            <PlusCircle className="w-4 h-4" /> + Add Activity
          </button>
        </div>
      </div>

      {/* SUMMARY STAT CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem'
      }}>
        <StatCard 
          title="Total Members" 
          value={summary.total_members} 
          subtext={`${summary.active_members} Active`} 
          icon={Users} 
          color="indigo" 
        />
        <StatCard 
          title="Total Activities" 
          value={summary.total_activities} 
          subtext={`In ${getPeriodLabel()}`} 
          icon={CheckSquare} 
          color="cyan" 
        />
        <StatCard 
          title="Completed" 
          value={summary.completed_activities} 
          subtext={`${summary.total_activities > 0 ? Math.round((summary.completed_activities / summary.total_activities) * 100) : 0}% completion rate`} 
          icon={CheckCircle2} 
          color="emerald" 
        />
        <StatCard 
          title="In Progress" 
          value={summary.in_progress_activities} 
          subtext="Active ongoing tasks" 
          icon={Clock} 
          color="amber" 
        />
        <StatCard 
          title="Pending Tasks" 
          value={summary.pending_activities} 
          subtext="Awaiting start" 
          icon={AlertCircle} 
          color="rose" 
        />
        <StatCard 
          title="Points Earned" 
          value={`+${summary.points_earned_period}`} 
          subtext={`Lifetime Total: ${summary.total_lifetime_points} pts`} 
          icon={Award} 
          color="purple" 
        />
      </div>

      {/* VISUAL CHARTS SECTION */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '1.5rem'
      }}>
        {/* Activity Status Overview Chart */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Activity Status Overview</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{getPeriodLabel()}</span>
          </div>
          <StatusPieChart summary={summary} />
        </div>

        {/* Team Member Points Leaderboard Bar Chart */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Team Points Distribution</h3>
            <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600 }}>Period vs Lifetime</span>
          </div>
          <MemberPointsChart members={members} />
        </div>
      </div>

      {/* BOTTOM DASHBOARD SECTIONS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1.5rem'
      }}>
        
        {/* Recent Activities & Upcoming Deadlines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* RECENT ACTIVITIES */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock className="w-4 h-4 text-cyan-400" /> Recent Activities
              </h3>
              <button 
                className="btn btn-sm btn-secondary" 
                onClick={() => setActivityModal({ isOpen: true, activity: null, preselectedMemberId: null })}
              >
                + New Task
              </button>
            </div>

            {recent_activities.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No recent activities found for the selected tracking period.
              </div>
            ) : (
              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Activity Name</th>
                      <th>Assigned Member</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Due Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent_activities.map(act => (
                      <tr key={act.activity_id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{act.activity_name}</div>
                          {act.notes && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{act.notes}</div>}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img 
                              src={act.assigned_member_photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(act.assigned_member_name)}`} 
                              alt={act.assigned_member_name} 
                              className="avatar-img"
                              style={{ width: '28px', height: '28px' }}
                            />
                            <span style={{ fontSize: '0.85rem' }}>{act.assigned_member_name}</span>
                          </div>
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
                        <td>
                          {act.status !== 'Completed' ? (
                            <button 
                              className="btn btn-sm btn-success" 
                              style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                              onClick={() => markActivityCompleted(act.activity_id)}
                            >
                              <CheckCircle2 className="w-3 h-3" /> Complete
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>Done</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* UPCOMING DEADLINES */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar className="w-4 h-4 text-amber-400" /> Upcoming Deadlines
              </h3>
            </div>

            {upcoming_deadlines.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No pending deadlines for this period.
              </div>
            ) : (
              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Assigned To</th>
                      <th>Due Date</th>
                      <th>Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcoming_deadlines.map(act => (
                      <tr key={act.activity_id}>
                        <td style={{ fontWeight: 600 }}>{act.activity_name}</td>
                        <td>{act.assigned_member_name}</td>
                        <td style={{ color: '#fb7185', fontWeight: 700 }}>{act.due_date}</td>
                        <td>
                          <span className={`badge badge-priority-${act.priority ? act.priority.toLowerCase() : 'medium'}`}>
                            {act.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* LEADERBOARD TOP POINTS EARNERS */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy className="w-4 h-4 text-amber-400" style={{ color: '#f59e0b' }} /> Top Earners
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{getPeriodLabel()}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {top_earners.map((earner, idx) => (
              <div 
                key={earner.member_id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: idx === 0 ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                  border: idx === 0 ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => setProfileModal({ isOpen: true, memberId: earner.member_id })}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: idx === 0 ? '#f59e0b' : idx === 1 ? '#cbd5e1' : idx === 2 ? '#d97706' : 'rgba(255,255,255,0.1)',
                    color: idx < 3 ? '#0f172a' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 800
                  }}>
                    {idx + 1}
                  </div>

                  <img 
                    src={earner.profile_photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(earner.name)}`} 
                    alt={earner.name} 
                    className="avatar-img"
                    style={{ width: '36px', height: '36px' }}
                  />

                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{earner.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{earner.role}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#34d399' }}>
                    +{earner.points} pts
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {earner.completed_tasks} completed
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            className="btn btn-sm btn-secondary"
            style={{ marginTop: '1.25rem', width: '100%' }}
            onClick={() => setAddPointsModal({ isOpen: true, memberId: null, activityId: null })}
          >
            <Award className="w-4 h-4" /> + Manual Point Award
          </button>
        </div>

      </div>

    </div>
  );
}
