import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Award, Plus, Trash2, Search, Calendar, User } from 'lucide-react';

export default function PointsLedger() {
  const { 
    points, 
    members, 
    searchTerm, 
    setAddPointsModal, 
    deletePoints, 
    openConfirmModal 
  } = useApp();

  const [memberFilter, setMemberFilter] = useState('All');

  // Filter points
  const filteredPoints = points.filter(pt => {
    const matchesSearch = searchTerm === '' ||
      pt.member_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pt.reason && pt.reason.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pt.activity_name && pt.activity_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesMember = memberFilter === 'All' || String(pt.member_id) === memberFilter;

    return matchesSearch && matchesMember;
  });

  const totalPointsRecorded = points.reduce((acc, curr) => acc + curr.points, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Points Ledger & Transaction Log</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Complete audit trail of all manual points awarded or corrected by admin.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setAddPointsModal({ isOpen: true, memberId: null, activityId: null })}
        >
          <Award className="w-4 h-4" /> + Manual Point Award
        </button>
      </div>

      {/* SUMMARY BANNER */}
      <div className="glass-card" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
        border: '1px solid rgba(168, 85, 247, 0.3)'
      }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: 700, textTransform: 'uppercase' }}>
            Lifetime Points Allocated
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.2rem', color: 'var(--text-primary)' }}>
            {totalPointsRecorded} Total Points
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Across {points.length} individual point transactions recorded.
          </p>
        </div>

        {/* Member filter dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User className="w-4 h-4 text-purple-400" style={{ color: '#c084fc' }} />
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter Member:</span>
          <select 
            className="form-control" 
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
            value={memberFilter}
            onChange={e => setMemberFilter(e.target.value)}
          >
            <option value="All">All Members</option>
            {members.map(m => <option key={m.member_id} value={m.member_id}>{m.name}</option>)}
          </select>
        </div>
      </div>

      {/* POINTS TRANSACTIONS TABLE */}
      {filteredPoints.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No point transactions found.
        </div>
      ) : (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Trans. ID</th>
                  <th>Date</th>
                  <th>Team Member</th>
                  <th>Reason / Description</th>
                  <th>Related Activity</th>
                  <th>Points</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPoints.map(pt => (
                  <tr key={pt.point_id}>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      PTS-{pt.point_id}
                    </td>

                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {pt.point_date}
                    </td>

                    <td style={{ fontWeight: 700 }}>
                      {pt.member_name}
                    </td>

                    <td style={{ fontSize: '0.9rem' }}>
                      {pt.reason}
                    </td>

                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {pt.activity_name || 'General Bonus'}
                    </td>

                    <td style={{ fontWeight: 800, fontSize: '1.05rem', color: pt.points >= 0 ? '#34d399' : '#fb7185' }}>
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
                        title="Remove / Correct Points"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
