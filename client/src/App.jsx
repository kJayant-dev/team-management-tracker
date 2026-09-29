import React from 'react';
import { useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import TeamMembers from './pages/TeamMembers';
import Activities from './pages/Activities';
import PointsLedger from './pages/PointsLedger';
import Reports from './pages/Reports';

import MemberModal from './components/Modals/MemberModal';
import ActivityModal from './components/Modals/ActivityModal';
import AddPointsModal from './components/Modals/AddPointsModal';
import ConfirmModal from './components/Modals/ConfirmModal';
import MemberProfileModal from './components/Modals/MemberProfileModal';

export default function App() {
  const { activeSection } = useApp();

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'members':
        return <TeamMembers />;
      case 'activities':
        return <Activities />;
      case 'points':
        return <PointsLedger />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar />
        <main className="main-content">
          {renderActiveSection()}
        </main>
      </div>

      {/* Global Modals */}
      <MemberModal />
      <ActivityModal />
      <AddPointsModal />
      <ConfirmModal />
      <MemberProfileModal />
    </div>
  );
}
