import React from 'react';
import { useApp } from '../context/AppContext';
import { exportToCSV, triggerPrintReport } from '../utils/exportUtils';
import { FileText, Download, Printer, Users, CheckSquare, Award, Sparkles } from 'lucide-react';

export default function Reports() {
  const { members, activities, points, dashboardData, trackingPeriod } = useApp();

  if (!dashboardData) return null;

  const { summary } = dashboardData;

  const handleExportMembersCSV = () => {
    const data = members.map(m => ({
      ID: m.member_id,
      Name: m.name,
      Email: m.email,
      Phone: m.phone,
      Role: m.role,
      Department: m.department,
      Status: m.status,
      LifetimePoints: m.lifetime_points,
      PeriodPoints: m.period_points,
      TotalActivities: m.total_activities,
      Completed: m.completed_activities,
      Pending: m.pending_activities,
      InProgress: m.in_progress_activities,
      CompletionRate: `${m.completion_rate}%`
    }));
    exportToCSV(data, `Team_Performance_Report_${trackingPeriod}Days.csv`);
  };

  const handleExportActivitiesCSV = () => {
    const data = activities.map(a => ({
      ActivityID: a.activity_id,
      TaskName: a.activity_name,
      AssignedMember: a.assigned_member_name,
      Priority: a.priority,
      Status: a.status,
      AssignedDate: a.assigned_date,
      DueDate: a.due_date,
      CompletionDate: a.completion_date || '',
      PointsAwarded: a.points_awarded
    }));
    exportToCSV(data, `Activities_Report_${trackingPeriod}Days.csv`);
  };

  const handleExportPointsCSV = () => {
    const data = points.map(p => ({
      PointID: p.point_id,
      Date: p.point_date,
      MemberName: p.member_name,
      Points: p.points,
      Reason: p.reason,
      ActivityRef: p.activity_name || 'General'
    }));
    exportToCSV(data, `Points_Ledger_Report.csv`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header & Export Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Team Performance Analytics & Reports</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Comprehensive performance summaries and exportable data files.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={triggerPrintReport}>
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
          <button className="btn btn-success" onClick={handleExportMembersCSV}>
            <Download className="w-4 h-4" /> Export CSV Report
          </button>
        </div>
      </div>

      {/* SUMMARY BANNER CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1.25rem'
      }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Total Team Members
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.3rem', color: '#818cf8' }}>
            {summary.total_members}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {summary.active_members} Active
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Activities Completed
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.3rem', color: '#34d399' }}>
            {summary.completed_activities} / {summary.total_activities}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {summary.total_activities > 0 ? Math.round((summary.completed_activities / summary.total_activities) * 100) : 0}% success rate
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Pending & In-Progress
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.3rem', color: '#fbbf24' }}>
            {summary.pending_activities + summary.in_progress_activities}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {summary.in_progress_activities} Active, {summary.pending_activities} Pending
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Period Points Earned
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.3rem', color: '#c084fc' }}>
            +{summary.points_earned_period} pts
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Lifetime Total: {summary.total_lifetime_points} pts
          </div>
        </div>
      </div>

      {/* MEMBER-WISE ACTIVITY SUMMARY TABLE */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users className="w-4 h-4 text-indigo-400" /> Member-wise Performance Summary
          </h3>

          <button className="btn btn-sm btn-secondary" onClick={handleExportMembersCSV}>
            <Download className="w-3.5 h-3.5" /> Export Summary CSV
          </button>
        </div>

        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Role & Department</th>
                <th>Lifetime Points</th>
                <th>Period Points</th>
                <th>Total Tasks</th>
                <th>Completed</th>
                <th>Pending / In Progress</th>
                <th>Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m.member_id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img 
                        src={m.profile_photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(m.name)}`} 
                        alt={m.name} 
                        className="avatar-img"
                        style={{ width: '30px', height: '30px' }}
                      />
                      <span style={{ fontWeight: 700 }}>{m.name}</span>
                    </div>
                  </td>

                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {m.role} ({m.department})
                  </td>

                  <td style={{ fontWeight: 700, color: '#c084fc' }}>
                    {m.lifetime_points || 0} pts
                  </td>

                  <td style={{ fontWeight: 800, color: '#34d399' }}>
                    +{m.period_points || 0} pts
                  </td>

                  <td style={{ fontWeight: 600 }}>
                    {m.total_activities || 0}
                  </td>

                  <td style={{ color: '#34d399', fontWeight: 700 }}>
                    {m.completed_activities || 0}
                  </td>

                  <td style={{ color: '#fbbf24' }}>
                    {m.pending_activities + m.in_progress_activities}
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '60px', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${m.completion_rate || 0}%`, height: '100%', background: '#10b981' }}></div>
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399' }}>{m.completion_rate || 0}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADDITIONAL EXPORT ACTIONS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
        
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Activities Dataset</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Download complete raw activity records, dates, assigned members, and status.
            </p>
          </div>
          <button className="btn btn-sm btn-primary" onClick={handleExportActivitiesCSV}>
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Points Ledger Audit</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Download complete point transactions log with reasons and timestamps.
            </p>
          </div>
          <button className="btn btn-sm btn-primary" onClick={handleExportPointsCSV}>
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
        </div>

      </div>

    </div>
  );
}
