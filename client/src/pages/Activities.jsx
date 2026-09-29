import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  PlusCircle, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  Award,
  Filter,
  ArrowUpDown
} from 'lucide-react';

export default function Activities() {
  const { 
    activities, 
    members, 
    searchTerm, 
    setActivityModal, 
    setAddPointsModal, 
    markActivityCompleted, 
    deleteActivity, 
    openConfirmModal 
  } = useApp();

  const [memberFilter, setMemberFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('due_date');

  // Filter activities
  const filteredActivities = activities.filter(act => {
    const matchesSearch = searchTerm === '' ||
      act.activity_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (act.description && act.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (act.assigned_member_name && act.assigned_member_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      String(act.activity_id).includes(searchTerm);

    const matchesMember = memberFilter === 'All' || String(act.member_id) === memberFilter;
    const matchesStatus = statusFilter === 'All' || act.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'All' || act.priority.toLowerCase() === priorityFilter.toLowerCase();

    return matchesSearch && matchesMember && matchesStatus && matchesPriority;
  });

  // Sort activities
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    if (sortBy === 'due_date') {
      return new Date(a.due_date || '9999-12-31') - new Date(b.due_date || '9999-12-31');
    } else if (sortBy === 'priority') {
      const pOrder = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
      return (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
    } else if (sortBy === 'name') {
      return a.activity_name.localeCompare(b.activity_name);
    }
    return 0;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Activities & Tasks Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Assign, monitor, update status, and track progress for team deliverables.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setActivityModal({ isOpen: true, activity: null, preselectedMemberId: null })}
        >
          <PlusCircle className="w-4 h-4" /> + Add Activity
        </button>
      </div>

      {/* FILTER & SORT BAR */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          
          {/* Member Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Member:</span>
            <select 
              className="form-control" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
              value={memberFilter}
              onChange={e => setMemberFilter(e.target.value)}
            >
              <option value="All">All Members</option>
              {members.map(m => <option key={m.member_id} value={m.member_id}>{m.name}</option>)}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</span>
            <select 
              className="form-control" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Priority:</span>
            <select 
              className="form-control" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

        </div>

        {/* Sort option */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowUpDown className="w-4 h-4 text-indigo-400" style={{ color: '#818cf8' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sort By:</span>
          <select 
            className="form-control" 
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="due_date">Due Date</option>
            <option value="priority">Priority</option>
            <option value="name">Task Name</option>
          </select>
        </div>
      </div>

      {/* ACTIVITIES TABLE */}
      {sortedActivities.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No activities found matching the filters.
        </div>
      ) : (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Task ID</th>
                  <th>Activity / Task Name</th>
                  <th>Assigned Member</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned Date</th>
                  <th>Due Date</th>
                  <th>Completion Date</th>
                  <th>Points</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedActivities.map(act => (
                  <tr key={act.activity_id}>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      ACT-{act.activity_id}
                    </td>

                    <td>
                      <div style={{ fontWeight: 700 }}>{act.activity_name}</div>
                      {act.description && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                          {act.description}
                        </div>
                      )}
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img 
                          src={act.assigned_member_photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(act.assigned_member_name)}`} 
                          alt={act.assigned_member_name} 
                          className="avatar-img"
                          style={{ width: '28px', height: '28px' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{act.assigned_member_name}</div>
                        </div>
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
                      {act.assigned_date || 'N/A'}
                    </td>

                    <td style={{ fontSize: '0.82rem', color: '#fb7185', fontWeight: 700 }}>
                      {act.due_date || 'N/A'}
                    </td>

                    <td style={{ fontSize: '0.82rem', color: '#34d399' }}>
                      {act.completion_date || '-'}
                    </td>

                    <td style={{ fontWeight: 800, color: act.points_awarded > 0 ? '#34d399' : 'var(--text-muted)' }}>
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
                          className="btn btn-sm btn-primary" 
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                          onClick={() => setAddPointsModal({ isOpen: true, memberId: act.member_id, activityId: act.activity_id })}
                          title="Award Points"
                        >
                          <Award className="w-3 h-3" /> + Points
                        </button>

                        <button 
                          className="btn btn-sm btn-secondary" 
                          style={{ padding: '0.2rem 0.5rem' }}
                          onClick={() => setActivityModal({ isOpen: true, activity: act, preselectedMemberId: null })}
                          title="Edit Task"
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
                          title="Delete Task"
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
        </div>
      )}

    </div>
  );
}
