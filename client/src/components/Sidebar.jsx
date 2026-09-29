import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Award, 
  BarChart3, 
  PlusCircle, 
  UserPlus,
  Sparkles
} from 'lucide-react';

export default function Sidebar() {
  const { activeSection, setActiveSection, setMemberModal, setActivityModal } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'members', label: 'Team Members', icon: Users },
    { id: 'activities', label: 'Activities & Tasks', icon: CheckSquare },
    { id: 'points', label: 'Points Ledger', icon: Award },
    { id: 'reports', label: 'Analytics & Reports', icon: BarChart3 }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <div className="brand-title">TeamPulse</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Activity & Points Tracker
          </span>
        </div>
      </div>

      <div style={{ marginTop: '1rem', padding: '0 0.5rem' }}>
        <button 
          className="btn btn-primary" 
          style={{ width: '100%', marginBottom: '0.5rem', fontSize: '0.85rem' }}
          onClick={() => setActivityModal({ isOpen: true, activity: null, preselectedMemberId: null })}
        >
          <PlusCircle className="w-4 h-4" /> + Add Activity
        </button>
        <button 
          className="btn btn-secondary" 
          style={{ width: '100%', fontSize: '0.85rem' }}
          onClick={() => setMemberModal({ isOpen: true, member: null })}
        >
          <UserPlus className="w-4 h-4" /> + Add Member
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', padding: '1rem 0.5rem 0 0.5rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>System Status</span>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem', fontWeight: 600 }}>
          Local DB Active
        </div>
      </div>
    </aside>
  );
}
