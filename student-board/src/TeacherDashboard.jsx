import React, { useState } from 'react';
import { Users, BarChart3, UserPlus, HelpCircle } from 'lucide-react';

import { useTeacherData } from './hooks/useTeacherData';
import { useProfilePhoto } from './hooks/useProfilePhoto';

// Shared Layout Elements
import Sidebar from './components/shared/Sidebar';
import TopBar from './components/shared/TopBar';
import LoadingScreen from './components/shared/LoadingScreen';

// Modals & Sub-components
import ProfilePhotoModal from './components/ProfilePhotoModal';
import OnboardingGuide from './components/OnboardingGuide';

// Tab Views
import ClassroomView from './components/teacher/ClassroomView';
import StudentDetailView from './components/teacher/StudentDetailView';
import AnalyticsView from './components/teacher/AnalyticsView';
import AdminControlsView from './components/teacher/AdminControlsView';

/**
 * TeacherDashboard Component
 * ──────────────────────────
 * The top-level container for the Teacher dashboard application.
 * Replaces the old monolithic view. Acts as a thin orchestrator that:
 * 1. Coordinates custom hooks for teacher state management (`useTeacherData`, `useProfilePhoto`).
 * 2. Manages UI presentation state (active view tab, mobile sidebar layout, and photo modal).
 * 3. Renders shared layout wrapper elements (Sidebar, TopBar).
 * 4. Routes the current `activeTab` selection to render the correct view component purely.
 *
 * @param {Object} props
 * @param {Object} props.user - Information on the logged-in teacher.
 * @param {Function} props.onLogout - Callback to terminate user session.
 */
const TeacherDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('classroom');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  // Hook to fetch and edit student records (attendance, behaviors, strands)
  const {
    students,
    selectedStudent,
    setSelectedStudent,
    academicData,
    loading,
    isEditing,
    setIsEditing,
    editedStrands,
    editedAttendance,
    editedBehavior,
    updateStrandIndicator,
    updateAttendanceField,
    updateBehaviorText,
    handleSave,
    handleCancel,
    reloadStudents,
  } = useTeacherData();

  // Hook to handle local profile image management
  const {
    photo: profilePhoto,
    savePhoto,
    removePhoto
  } = useProfilePhoto(user?.username);

  // Set configuration for navigation menu items
  const navItems = [
    { id: 'classroom', label: 'My Classroom', icon: Users },
    { id: 'analytics', label: 'Class Analytics', icon: BarChart3 },
    { id: 'admin', label: 'Admin Controls', icon: UserPlus },
    { id: 'onboarding', label: 'Help & Onboarding', icon: HelpCircle },
  ];

  // Helper to resolve the correct page view corresponding to the active navigation tab
  const renderContent = () => {
    switch (activeTab) {
      case 'classroom':
        return (
          <ClassroomView
            user={user}
            students={students}
            profilePhoto={profilePhoto}
            onShowPhotoModal={() => setShowPhotoModal(true)}
            onSelectStudent={(student) => {
              setSelectedStudent(student);
              setActiveTab('studentDetail');
            }}
          />
        );
      case 'studentDetail':
        return (
          <StudentDetailView
            selectedStudent={selectedStudent}
            academicData={academicData}
            isEditing={isEditing}
            onBack={() => setActiveTab('classroom')}
            onStartEdit={() => setIsEditing(true)}
            onSave={handleSave}
            onCancel={handleCancel}
            editedStrands={editedStrands}
            editedAttendance={editedAttendance}
            editedBehavior={editedBehavior}
            onStrandChange={updateStrandIndicator}
            onAttendanceChange={updateAttendanceField}
            onBehaviorChange={updateBehaviorText}
          />
        );
      case 'analytics':
        return <AnalyticsView students={students} />;
      case 'admin':
        return <AdminControlsView onStudentAdded={reloadStudents} />;
      case 'onboarding':
        return <OnboardingGuide />;
      default:
        return (
          <ClassroomView
            user={user}
            students={students}
            profilePhoto={profilePhoto}
            onShowPhotoModal={() => setShowPhotoModal(true)}
            onSelectStudent={(student) => {
              setSelectedStudent(student);
              setActiveTab('studentDetail');
            }}
          />
        );
    }
  };

  // Show fullscreen loading page if roster fetching is in progress
  if (loading) {
    return <LoadingScreen message="Loading classroom data…" />;
  }

  const userInitial = (user?.firstName?.[0] || 'T').toUpperCase();
  
  // Header title resolves to selected student name when viewing profile details
  const currentTabTitle = activeTab === 'studentDetail'
    ? (selectedStudent?.name?.split(' ')[0] || 'Student Profile')
    : (navItems.find((n) => n.id === activeTab)?.label || 'Classroom');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>
      
      {/* Slide-out Sidebar layout */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navItems={navItems}
        activeTab={activeTab}
        onNav={setActiveTab}
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
          {renderContent()}
        </div>
      </div>

      {/* Photo Uploader Modal overlay */}
      {showPhotoModal && (
        <ProfilePhotoModal
          currentPhoto={profilePhoto}
          userName={user?.firstName || user?.username}
          onSave={savePhoto}
          onRemove={removePhoto}
          onClose={() => setShowPhotoModal(false)}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;
