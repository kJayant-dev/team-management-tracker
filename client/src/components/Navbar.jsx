import React from 'react';
import { useApp } from '../context/AppContext';
import TrackingPeriodSelector from './TrackingPeriodSelector';
import { Search, Plus, UserPlus, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { 
    activeSection, 
    searchTerm, 
    setSearchTerm, 
    setMemberModal, 
    setActivityModal 
  } = useApp();

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard': return 'Team Management Dashboard';
      case 'members': return 'Team Members Directory';
      case 'activities': return 'Activities & Tasks Tracking';
      case 'points': return 'Points Ledger & Transactions';
      case 'reports': return 'Team Analytics & Performance Reports';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="top-header">
      <div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: '800', background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {getSectionTitle()}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Global Search Bar */}
        <div className="search-box">
          <Search className="search-icon w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search member, email, task, ID..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tracking Period Control */}
        <TrackingPeriodSelector />

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setMemberModal({ isOpen: true, member: null })}
            title="Add New Member"
          >
            <UserPlus className="w-4 h-4" /> + Add Member
          </button>
          <button 
            className="btn btn-success btn-sm"
            onClick={() => setActivityModal({ isOpen: true, activity: null, preselectedMemberId: null })}
            title="Add New Activity"
          >
            <Plus className="w-4 h-4" /> + Add Activity
          </button>
        </div>
      </div>
    </header>
  );
}
