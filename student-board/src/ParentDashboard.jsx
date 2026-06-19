import React, { useState } from 'react';
import { Home, BookOpen, DollarSign, FileText, HelpCircle } from 'lucide-react';

import { useParentData } from './hooks/useParentData';
import { useProfilePhoto } from './hooks/useProfilePhoto';

// Shared Layout Elements
import Sidebar from './components/shared/Sidebar';
import TopBar from './components/shared/TopBar';
import LoadingScreen from './components/shared/LoadingScreen';
import ErrorBanner from './components/shared/ErrorBanner';

// Modals & Sub-components
import ProfilePhotoModal from './components/ProfilePhotoModal';
import PaymentModal from './components/PaymentModal';
import OnboardingGuide from './components/OnboardingGuide';

// Tab Views
import ParentDashboardView from './components/parent/ParentDashboardView';
import AcademicView from './components/parent/AcademicView';
import FeesView from './components/parent/FeesView';
import DocumentsView from './components/parent/DocumentsView';

/**
 * ParentDashboard Component
 * ─────────────────────────
 * The top-level container for the Parent dashboard application.
 * Replaces the old monolithic view. Acts as a thin orchestrator that:
 * 1. Coordinates custom hooks for parent state management (`useParentData`, `useProfilePhoto`).
 * 2. Manages UI presentation state (active view tab, mobile sidebar, and payment modal toggle).
 * 3. Renders shared layout wrapper elements (Sidebar, TopBar).
 * 4. Routes the current `activeTab` selection to render the correct view component purely.
 *
 * @param {Object} props
 * @param {Object} props.user - Information on the logged-in guardian/parent.
 * @param {Function} props.onLogout - Callback to terminate user session.
 */
const ParentDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Hook to fetch children list and selected child details
  const {
    children,
    selectedChild,
    setSelectedChild,
    academicData,
    feeData,
    documents,
    loading,
    error,
    refreshFeeData,
  } = useParentData(user?.guardianId);

  // Hook to handle local profile image management
  const {
    photo: profilePhoto,
    savePhoto,
    removePhoto
  } = useProfilePhoto(user?.username);

  // Set configuration for navigation menu items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'academic', label: 'Academic', icon: BookOpen },
    { id: 'fees', label: 'Payments', icon: DollarSign },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'onboarding', label: 'Help & Onboarding', icon: HelpCircle },
  ];

  // Helper to resolve the correct page view corresponding to the active navigation tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <ParentDashboardView
            user={user}
            selectedChild={selectedChild}
            children={children}
            academicData={academicData}
            feeData={feeData}
            documents={documents}
            profilePhoto={profilePhoto}
            onShowPhotoModal={() => setShowPhotoModal(true)}
            onNavigateToAcademic={() => setActiveTab('academic')}
          />
        );
      case 'academic':
        return <AcademicView academicData={academicData} />;
      case 'fees':
        return (
          <FeesView
            feeData={feeData}
            onMakePayment={() => setShowPaymentModal(true)}
          />
        );
      case 'documents':
        return <DocumentsView documents={documents} />;
      case 'onboarding':
        return <OnboardingGuide />;
      default:
        return (
          <ParentDashboardView
            user={user}
            selectedChild={selectedChild}
            children={children}
            academicData={academicData}
            feeData={feeData}
            documents={documents}
            profilePhoto={profilePhoto}
            onShowPhotoModal={() => setShowPhotoModal(true)}
            onNavigateToAcademic={() => setActiveTab('academic')}
          />
        );
    }
  };

  // Show fullscreen loading page if loading first child data
  if (loading && children.length === 0) {
    return <LoadingScreen message="Loading your dashboard…" />;
  }

  const userInitial = (user?.firstName?.[0] || 'P').toUpperCase();
  const currentTabTitle = navItems.find((n) => n.id === activeTab)?.label || 'Dashboard';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>
      
      {/* Slide-out Sidebar layout */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navItems={navItems}
        activeTab={activeTab}
        onNav={setActiveTab}
        childList={children}
        selectedChild={selectedChild}
        onSelectChild={setSelectedChild}
        onLogout={onLogout}
      />

      {/* Main viewport area */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minWidth: 0 }}>
        {/* Sticky Top Header bar */}
        <TopBar
          title={currentTabTitle}
          onMenuClick={() => setSidebarOpen(true)}
          profilePhoto={profilePhoto}
          onProfileClick={() => setShowPhotoModal(true)}
          userInitial={userInitial}
        />

        {/* Page Inner Content Container */}
        <div style={{ padding: '1rem', maxWidth: 640, margin: '0 auto' }}>
          {/* Show error banner if API details fetch encounters failure */}
          <ErrorBanner message={error} />
          {renderContent()}
        </div>
      </div>

      {/* Photo Uploader Modal overlay */}
      {showPhotoModal && (
        <ProfilePhotoModal
          currentPhoto={profilePhoto}
          userName={user?.firstName || user?.username}
          userId={user?.guardianId}
          onSave={savePhoto}
          onRemove={removePhoto}
          onClose={() => setShowPhotoModal(false)}
        />
      )}

      {/* Credit Card Payment Modal overlay */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            // Immutably refresh fee information after a successful transaction
            refreshFeeData();
          }}
          feeData={feeData}
          studentId={children[selectedChild]?.id || children[selectedChild]?.studentId}
          guardianId={user?.guardianId}
        />
      )}
    </div>
  );
};

export default ParentDashboard;
