const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static frontend files if built
const path = require('path');
const distPath = path.join(__dirname, '../client/dist');
if (require('fs').existsSync(distPath)) {
  app.use(express.static(distPath));
}


// Helper function to calculate date bounds
function getPeriodBounds(period, customStart, customEnd) {
  const now = new Date('2026-09-29T23:59:59.999Z'); // Reference current date
  let startDate = null;
  let endDate = new Date(now);

  if (period === '7') {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 7);
  } else if (period === '15') {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 15);
  } else if (period === '30') {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 30);
  } else if (period === '60') {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 60);
  } else if (period === '90') {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 90);
  } else if (period === 'custom' && customStart && customEnd) {
    startDate = new Date(customStart + 'T00:00:00.000Z');
    endDate = new Date(customEnd + 'T23:59:59.999Z');
  } else if (period === 'all') {
    return { startDate: null, endDate: null };
  } else {
    // Default to 30 days
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 30);
  }

  return { startDate, endDate };
}

function isDateInBounds(dateStr, startDate, endDate) {
  if (!dateStr) return false;
  if (!startDate || !endDate) return true; // All time
  const d = new Date(dateStr);
  return d >= startDate && d <= endDate;
}

// ----------------------------------------------------
// MEMBER ENDPOINTS
// ----------------------------------------------------
app.get('/api/members', (req, res) => {
  try {
    const members = db.getMembers();
    const activities = db.getActivities();
    const points = db.getPointTransactions();

    const { period, startDate: qStart, endDate: qEnd } = req.query;
    const { startDate, endDate } = getPeriodBounds(period, qStart, qEnd);

    // Compute stats for each member (Lifetime & Period-specific)
    const membersWithStats = members.map(m => {
      const memberActivities = activities.filter(a => a.member_id === m.member_id);
      const periodActivities = memberActivities.filter(a => 
        isDateInBounds(a.assigned_date || a.created_at, startDate, endDate)
      );

      const memberPoints = points.filter(p => p.member_id === m.member_id);
      const periodPoints = memberPoints.filter(p => isDateInBounds(p.point_date, startDate, endDate));

      const lifetimePointsSum = memberPoints.reduce((acc, curr) => acc + curr.points, 0);
      const periodPointsSum = periodPoints.reduce((acc, curr) => acc + curr.points, 0);

      const periodCompleted = periodActivities.filter(a => a.status === 'Completed').length;
      const periodPending = periodActivities.filter(a => a.status === 'Pending').length;
      const periodInProgress = periodActivities.filter(a => a.status === 'In Progress').length;
      const periodCancelled = periodActivities.filter(a => a.status === 'Cancelled').length;

      const completionRate = periodActivities.length > 0 
        ? Math.round((periodCompleted / periodActivities.length) * 100) 
        : 0;

      return {
        ...m,
        lifetime_points: lifetimePointsSum,
        period_points: periodPointsSum,
        total_activities: periodActivities.length,
        completed_activities: periodCompleted,
        pending_activities: periodPending,
        in_progress_activities: periodInProgress,
        cancelled_activities: periodCancelled,
        completion_rate: completionRate
      };
    });

    res.json(membersWithStats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/members/:id', (req, res) => {
  try {
    const member = db.getMemberById(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });

    const activities = db.getActivities().filter(a => a.member_id === member.member_id);
    const points = db.getPointTransactions().filter(p => p.member_id === member.member_id);

    const lifetimePoints = points.reduce((acc, curr) => acc + curr.points, 0);

    res.json({
      ...member,
      lifetime_points: lifetimePoints,
      activities,
      point_history: points
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/members', (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const newMember = db.addMember(req.body);
    res.status(201).json(newMember);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/members/:id', (req, res) => {
  try {
    const updated = db.updateMember(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Member not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/members/:id', (req, res) => {
  try {
    const success = db.deleteMember(req.params.id);
    if (!success) return res.status(404).json({ error: 'Member not found' });
    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// ACTIVITY ENDPOINTS
// ----------------------------------------------------
app.get('/api/activities', (req, res) => {
  try {
    const activities = db.getActivities();
    const members = db.getMembers();
    const points = db.getPointTransactions();

    const { period, startDate: qStart, endDate: qEnd, memberId, status, priority } = req.query;
    const { startDate, endDate } = getPeriodBounds(period, qStart, qEnd);

    let filtered = activities.map(act => {
      const assignedMember = members.find(m => m.member_id === act.member_id);
      const actPoints = points
        .filter(p => p.activity_id === act.activity_id)
        .reduce((sum, p) => sum + p.points, 0);

      return {
        ...act,
        assigned_member_name: assignedMember ? assignedMember.name : 'Unassigned',
        assigned_member_photo: assignedMember ? assignedMember.profile_photo : null,
        assigned_member_role: assignedMember ? assignedMember.role : '',
        points_awarded: actPoints
      };
    });

    if (period && period !== 'all') {
      filtered = filtered.filter(a => isDateInBounds(a.assigned_date || a.created_at, startDate, endDate));
    }

    if (memberId) {
      filtered = filtered.filter(a => a.member_id === Number(memberId));
    }

    if (status) {
      filtered = filtered.filter(a => a.status.toLowerCase() === status.toLowerCase());
    }

    if (priority) {
      filtered = filtered.filter(a => a.priority.toLowerCase() === priority.toLowerCase());
    }

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/activities', (req, res) => {
  try {
    const { activity_name, member_id } = req.body;
    if (!activity_name || !member_id) {
      return res.status(400).json({ error: 'Activity name and assigned member are required' });
    }
    const newAct = db.addActivity(req.body);
    res.status(201).json(newAct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/activities/:id', (req, res) => {
  try {
    const updated = db.updateActivity(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Activity not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/activities/:id', (req, res) => {
  try {
    const success = db.deleteActivity(req.params.id);
    if (!success) return res.status(404).json({ error: 'Activity not found' });
    res.json({ message: 'Activity deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// POINT TRANSACTIONS ENDPOINTS
// ----------------------------------------------------
app.get('/api/points', (req, res) => {
  try {
    const points = db.getPointTransactions();
    const members = db.getMembers();
    const activities = db.getActivities();

    const result = points.map(pt => {
      const member = members.find(m => m.member_id === pt.member_id);
      const activity = activities.find(a => a.activity_id === pt.activity_id);

      return {
        ...pt,
        member_name: member ? member.name : 'Unknown Member',
        activity_name: activity ? activity.activity_name : (pt.reason || 'General Bonus')
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/points', (req, res) => {
  try {
    const { member_id, points, reason } = req.body;
    if (!member_id || points === undefined) {
      return res.status(400).json({ error: 'Member and points amount are required' });
    }
    const newPt = db.addPointTransaction(req.body);
    res.status(201).json(newPt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/points/:id', (req, res) => {
  try {
    const success = db.deletePointTransaction(req.params.id);
    if (!success) return res.status(404).json({ error: 'Point record not found' });
    res.json({ message: 'Point transaction removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// DASHBOARD STATS OVERVIEW ENDPOINT
// ----------------------------------------------------
app.get('/api/dashboard', (req, res) => {
  try {
    const members = db.getMembers();
    const activities = db.getActivities();
    const points = db.getPointTransactions();

    const { period = '30', startDate: qStart, endDate: qEnd } = req.query;
    const { startDate, endDate } = getPeriodBounds(period, qStart, qEnd);

    // Lifetime metrics
    const totalLifetimeMembers = members.length;
    const totalLifetimeActivities = activities.length;
    const totalLifetimePoints = points.reduce((acc, curr) => acc + curr.points, 0);

    // Period metrics
    const periodActivities = period === 'all' 
      ? activities 
      : activities.filter(a => isDateInBounds(a.assigned_date || a.created_at, startDate, endDate));

    const periodPoints = period === 'all'
      ? points
      : points.filter(p => isDateInBounds(p.point_date, startDate, endDate));

    const activeMembersCount = members.filter(m => m.status === 'Active').length;
    const totalActivitiesPeriod = periodActivities.length;
    const completedActivitiesPeriod = periodActivities.filter(a => a.status === 'Completed').length;
    const pendingActivitiesPeriod = periodActivities.filter(a => a.status === 'Pending').length;
    const inProgressActivitiesPeriod = periodActivities.filter(a => a.status === 'In Progress').length;
    const cancelledActivitiesPeriod = periodActivities.filter(a => a.status === 'Cancelled').length;

    const pointsEarnedPeriod = periodPoints.reduce((acc, curr) => acc + curr.points, 0);

    // Leaderboard top earners in this period
    const memberPointsMap = {};
    periodPoints.forEach(pt => {
      memberPointsMap[pt.member_id] = (memberPointsMap[pt.member_id] || 0) + pt.points;
    });

    const topEarners = members.map(m => {
      const pts = memberPointsMap[m.member_id] || 0;
      const memberActs = periodActivities.filter(a => a.member_id === m.member_id);
      const completed = memberActs.filter(a => a.status === 'Completed').length;
      return {
        member_id: m.member_id,
        name: m.name,
        role: m.role,
        department: m.department,
        profile_photo: m.profile_photo,
        points: pts,
        completed_tasks: completed
      };
    }).sort((a, b) => b.points - a.points);

    // Recent activities (sorted descending by creation / assigned date)
    const recentActivities = [...periodActivities]
      .sort((a, b) => new Date(b.created_at || b.assigned_date) - new Date(a.created_at || a.assigned_date))
      .slice(0, 5)
      .map(act => {
        const member = members.find(m => m.member_id === act.member_id);
        return {
          ...act,
          assigned_member_name: member ? member.name : 'Unassigned',
          assigned_member_photo: member ? member.profile_photo : null
        };
      });

    // Upcoming deadlines (Pending or In Progress sorted by due date)
    const upcomingDeadlines = [...periodActivities]
      .filter(a => a.status !== 'Completed' && a.status !== 'Cancelled' && a.due_date)
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
      .slice(0, 5)
      .map(act => {
        const member = members.find(m => m.member_id === act.member_id);
        return {
          ...act,
          assigned_member_name: member ? member.name : 'Unassigned',
          assigned_member_photo: member ? member.profile_photo : null
        };
      });

    // Recently completed
    const recentlyCompleted = [...periodActivities]
      .filter(a => a.status === 'Completed')
      .sort((a, b) => new Date(b.completion_date || b.updated_at) - new Date(a.completion_date || a.updated_at))
      .slice(0, 5)
      .map(act => {
        const member = members.find(m => m.member_id === act.member_id);
        return {
          ...act,
          assigned_member_name: member ? member.name : 'Unassigned',
          assigned_member_photo: member ? member.profile_photo : null
        };
      });

    res.json({
      period_selected: period,
      date_range: {
        start: startDate ? startDate.toISOString().split('T')[0] : null,
        end: endDate ? endDate.toISOString().split('T')[0] : null
      },
      summary: {
        total_members: totalLifetimeMembers,
        active_members: activeMembersCount,
        total_activities: totalActivitiesPeriod,
        completed_activities: completedActivitiesPeriod,
        pending_activities: pendingActivitiesPeriod,
        in_progress_activities: inProgressActivitiesPeriod,
        cancelled_activities: cancelledActivitiesPeriod,
        points_earned_period: pointsEarnedPeriod,
        total_lifetime_points: totalLifetimePoints
      },
      top_earners: topEarners,
      recent_activities: recentActivities,
      upcoming_deadlines: upcomingDeadlines,
      recently_completed: recentlyCompleted
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Team Activity Tracker Server running on http://localhost:${PORT}`);
});
