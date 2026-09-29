import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [trackingPeriod, setTrackingPeriodState] = useState('30');
  const [customDateRange, setCustomDateRange] = useState({
    start: '2026-09-01',
    end: '2026-09-29'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Data state
  const [dashboardData, setDashboardData] = useState(null);
  const [members, setMembers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [points, setPoints] = useState([]);

  // Modals state
  const [memberModal, setMemberModal] = useState({ isOpen: false, member: null });
  const [activityModal, setActivityModal] = useState({ isOpen: false, activity: null, preselectedMemberId: null });
  const [addPointsModal, setAddPointsModal] = useState({ isOpen: false, memberId: null, activityId: null });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [profileModal, setProfileModal] = useState({ isOpen: false, memberId: null });

  // Fetch Dashboard Stats
  const fetchDashboard = useCallback(async () => {
    try {
      let url = `/api/dashboard?period=${trackingPeriod}`;
      if (trackingPeriod === 'custom') {
        url += `&startDate=${customDateRange.start}&endDate=${customDateRange.end}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch dashboard stats');
      const data = await res.json();
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError(err.message);
    }
  }, [trackingPeriod, customDateRange]);

  // Fetch Members
  const fetchMembers = useCallback(async () => {
    try {
      let url = `/api/members?period=${trackingPeriod}`;
      if (trackingPeriod === 'custom') {
        url += `&startDate=${customDateRange.start}&endDate=${customDateRange.end}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch members');
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  }, [trackingPeriod, customDateRange]);

  // Fetch Activities
  const fetchActivities = useCallback(async () => {
    try {
      let url = `/api/activities?period=${trackingPeriod}`;
      if (trackingPeriod === 'custom') {
        url += `&startDate=${customDateRange.start}&endDate=${customDateRange.end}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch activities');
      const data = await res.json();
      setActivities(data);
    } catch (err) {
      console.error('Error fetching activities:', err);
    }
  }, [trackingPeriod, customDateRange]);

  // Fetch Points History
  const fetchPoints = useCallback(async () => {
    try {
      const res = await fetch('/api/points');
      if (!res.ok) throw new Error('Failed to fetch points');
      const data = await res.json();
      setPoints(data);
    } catch (err) {
      console.error('Error fetching points:', err);
    }
  }, []);

  // Refresh all data dynamically
  const refreshAll = useCallback(() => {
    fetchDashboard();
    fetchMembers();
    fetchActivities();
    fetchPoints();
  }, [fetchDashboard, fetchMembers, fetchActivities, fetchPoints]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Change tracking period handler
  const setTrackingPeriod = (period, start = null, end = null) => {
    setTrackingPeriodState(period);
    if (period === 'custom' && start && end) {
      setCustomDateRange({ start, end });
    }
  };

  // MEMBER CRUD MUTATIONS
  const addMember = async (memberData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });
      if (!res.ok) throw new Error('Failed to create member');
      refreshAll();
      setMemberModal({ isOpen: false, member: null });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateMember = async (id, memberData) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });
      if (!res.ok) throw new Error('Failed to update member');
      refreshAll();
      setMemberModal({ isOpen: false, member: null });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/members/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete member');
      refreshAll();
      if (profileModal.memberId === id) {
        setProfileModal({ isOpen: false, memberId: null });
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ACTIVITY CRUD MUTATIONS
  const addActivity = async (actData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actData)
      });
      if (!res.ok) throw new Error('Failed to add activity');
      refreshAll();
      setActivityModal({ isOpen: false, activity: null, preselectedMemberId: null });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateActivity = async (id, actData) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/activities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actData)
      });
      if (!res.ok) throw new Error('Failed to update activity');
      refreshAll();
      setActivityModal({ isOpen: false, activity: null, preselectedMemberId: null });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markActivityCompleted = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/activities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed', completion_date: new Date().toISOString().split('T')[0] })
      });
      if (!res.ok) throw new Error('Failed to mark completed');
      refreshAll();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/activities/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete activity');
      refreshAll();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // POINT MUTATIONS
  const addPoints = async (pointData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pointData)
      });
      if (!res.ok) throw new Error('Failed to award points');
      refreshAll();
      setAddPointsModal({ isOpen: false, memberId: null, activityId: null });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePoints = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/points/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete point transaction');
      refreshAll();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openConfirmModal = (title, message, onConfirm) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
      }
    });
  };

  return (
    <AppContext.Provider value={{
      activeSection,
      setActiveSection,
      trackingPeriod,
      setTrackingPeriod,
      customDateRange,
      setCustomDateRange,
      searchTerm,
      setSearchTerm,
      loading,
      error,
      dashboardData,
      members,
      activities,
      points,
      memberModal,
      setMemberModal,
      activityModal,
      setActivityModal,
      addPointsModal,
      setAddPointsModal,
      confirmModal,
      setConfirmModal,
      profileModal,
      setProfileModal,
      openConfirmModal,
      addMember,
      updateMember,
      deleteMember,
      addActivity,
      updateActivity,
      markActivityCompleted,
      deleteActivity,
      addPoints,
      deletePoints,
      refreshAll
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
