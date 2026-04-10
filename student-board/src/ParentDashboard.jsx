import React, { useState, useEffect } from 'react';
import {
  User, BookOpen, DollarSign, FileText, Download, Bell, LogOut,
  AlertCircle, Loader2, CreditCard, CheckCircle, Home, BarChart3,
  Menu, X, ChevronRight, TrendingUp, Calendar, Award, Clock,
  MessageSquare
} from 'lucide-react';

import { guardianService } from './services/guardianService';
import { feeService } from './services/feeService';
import { documentService } from './services/documentService';

const ParentDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedChild, setSelectedChild] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [children, setChildren] = useState([]);
  const [academicData, setAcademicData] = useState(null);
  const [feeData, setFeeData] = useState(null);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchChildren = async () => {
      const { getStudentsByGuardian } = await import('./services/mockDataService');
      const mockStudents = getStudentsByGuardian(user?.guardianId || 'parent@test.com');

      setChildren(mockStudents);
      setLoading(false);

      if (!user?.guardianId) return;

      try {
        const studentsData = await guardianService.getStudents(user.guardianId);
        if (studentsData && studentsData.length > 0) {
          setChildren(studentsData);
        }
        setError(null);
      } catch (err) {
        console.log('API unavailable, continuing with mock data:', err);
      }
    };

    fetchChildren();

    const interval = setInterval(fetchChildren, 5000);
    return () => clearInterval(interval);
  }, [user?.guardianId]);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!children[selectedChild]) return;

      const studentId = children[selectedChild].id || children[selectedChild].studentId;

      const { getStudentAcademic, getStudentFees, getStudentDocs } = await import('./services/mockDataService');

      setAcademicData(getStudentAcademic(studentId));
      setFeeData(getStudentFees(studentId));
      setDocuments(getStudentDocs(studentId));
      setLoading(false);

      try {
        const [performance, feeAccount, transactions, docs] = await Promise.all([
          guardianService.getStudentPerformance(user.guardianId, studentId),
          feeService.getAccount(studentId),
          feeService.getTransactions(studentId),
          documentService.getDocuments(studentId),
        ]);

        if (performance) setAcademicData(performance);
        if (feeAccount) setFeeData({ ...feeAccount, paymentHistory: transactions || [] });
        if (docs) setDocuments(docs);
        setError(null);
      } catch (err) {
        console.log('API unavailable, continuing with mock data:', err);
      }
    };

    if (children.length > 0) {
      fetchStudentData();

      const interval = setInterval(fetchStudentData, 3000);
      return () => clearInterval(interval);
    }
  }, [children, selectedChild, user?.guardianId]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'academic', label: 'Academic', icon: BookOpen },
    { id: 'fees', label: 'Payments', icon: DollarSign },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const getAttendanceRate = (att) => {
    if (!att || !att.totalDays) return 0;
    return Math.round((att.present / att.totalDays) * 100);
  };

  const DashboardView = () => {
    const att = academicData?.attendance || { totalDays: 0, present: 0, absent: 0, late: 0 };
    const attRate = getAttendanceRate(att);

    return (
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 p-8 text-white">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName}! 👋</h1>
            <p className="text-blue-100">Here's what's happening with {children[selectedChild]?.name}'s education</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mb-24"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Award className="text-blue-600" size={24} />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{academicData?.currentGPA >= 3.0 ? 'Great' : 'Avg'}</span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Current GPA</h3>
            <p className="text-3xl font-bold text-gray-900">{academicData?.currentGPA || 0}</p>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <TrendingUp size={14} className="mr-1" />
              <span>Overall Performance</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <Calendar className="text-green-600" size={24} />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{attRate >= 90 ? 'Excellent' : 'Needs attention'}</span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Attendance</h3>
            <p className="text-3xl font-bold text-gray-900">{attRate}%</p>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <Clock size={14} className="mr-1" />
              <span>Rate this semester</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <DollarSign className="text-orange-600" size={24} />
              </div>
              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Due Soon</span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Balance Due</h3>
            <p className="text-3xl font-bold text-gray-900">${feeData?.currentBalance?.toFixed(2) || '0.00'}</p>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <Calendar size={14} className="mr-1" />
              <span>Due: {feeData?.dueDate || 'N/A'}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="text-blue-600" size={24} />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Documents</h3>
            <p className="text-3xl font-bold text-gray-900">{documents?.length || 0}</p>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <Download size={14} className="mr-1" />
              <span>Available to download</span>
            </div>
          </div>
        </div>

        {/* Behavioral Assessment and Attendance Detail Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                  <MessageSquare size={20} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Behavior & Conduct</h2>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 italic">
                "{academicData?.behavioralAssessment || "No notes to display."}"
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm grid grid-cols-4 gap-4 text-center items-center">
            <div className="col-span-4 flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-gray-900">Attendance Details</h2>
              <span className="font-bold text-green-600">{attRate}% Rate</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg"><div className="font-bold text-gray-900 text-xl">{att.totalDays}</div><div className="text-gray-500 text-xs mt-1">Total Days</div></div>
            <div className="p-3 bg-green-50 rounded-lg"><div className="font-bold text-green-700 text-xl">{att.present}</div><div className="text-green-600 text-xs mt-1">Present</div></div>
            <div className="p-3 bg-red-50 rounded-lg"><div className="font-bold text-red-700 text-xl">{att.absent}</div><div className="text-red-600 text-xs mt-1">Absent</div></div>
            <div className="p-3 bg-yellow-50 rounded-lg"><div className="font-bold text-yellow-700 text-xl">{att.late}</div><div className="text-yellow-600 text-xs mt-1">Late</div></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Subject Performance</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium" onClick={() => setActiveTab('academic')}>View All</button>
            </div>
            <div className="space-y-4">
              {academicData?.subjects?.slice(0, 4).map((subject, index) => {
                const ratio = subject.maxScore ? (subject.score / subject.maxScore) * 100 : 0;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{subject.name}</span>
                        <span className="text-sm font-bold text-gray-900">
                          {subject.score} <span className="text-gray-400 font-normal">/ {subject.maxScore}</span>
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${ratio}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Recent Assignments</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {academicData?.recentAssignments?.map((assignment, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="text-blue-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{assignment.assignment}</h3>
                    <p className="text-xs text-gray-500">{assignment.subject}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-green-600">{assignment.score}</span>
                    <p className="text-xs text-gray-500">{assignment.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AcademicView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Academic Overview & Grades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {academicData?.subjects?.map((subject, index) => {
            const ratio = subject.maxScore ? (subject.score / subject.maxScore) * 100 : 0;
            return (
              <div key={index} className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">{subject.name}</h3>
                  <span className="text-2xl font-bold text-blue-600">{subject.grade}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">Teacher: {subject.teacher}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                    style={{ width: `${ratio}%` }}
                  ></div>
                </div>
                <p className="text-sm font-bold text-gray-900 mt-2">{subject.score} <span className="text-gray-500 font-medium text-xs">/ {subject.maxScore}</span></p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );

  const FeesView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Current Balance</h2>
        <p className="text-5xl font-bold mb-4">${feeData?.currentBalance?.toFixed(2) || '0.00'}</p>
        <p className="text-orange-100 mb-6">Due: {feeData?.dueDate || 'N/A'}</p>
        {feeData?.currentBalance > 0 && (
          <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
            <CreditCard size={20} />
            Make Payment
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Fee Breakdown</h2>
        <div className="space-y-3">
          {feeData?.breakdown?.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-900 font-medium">{item.category}</span>
              <span className="text-gray-900 font-bold">${item.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Payment History</h2>
        <div className="space-y-3">
          {feeData?.paymentHistory?.map((payment, index) => (
            <div key={index} className="flex items-center justify-between p-4 border-l-4 border-green-500 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{payment.description}</p>
                <p className="text-sm text-gray-600">{payment.date} • {payment.method}</p>
              </div>
              <span className="text-green-600 font-bold">-${payment.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const DocumentsView = () => (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Available Documents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents?.map((doc, index) => (
          <div key={index} className="p-6 border-2 border-gray-100 rounded-xl hover:border-blue-500 transition-colors cursor-pointer">
            <FileText className="text-blue-600 mb-4" size={32} />
            <h3 className="font-bold text-gray-900 mb-2">{doc.name}</h3>
            <p className="text-sm text-gray-600 mb-4">Updated: {doc.updated}</p>
            <button className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
              <Download size={16} />
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'academic': return <AcademicView />;
      case 'fees': return <FeesView />;
      case 'documents': return <DocumentsView />;
      default: return <DashboardView />;
    }
  };

  if (loading && children.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r flex flex-col transition-all duration-300`}>
        <div className="p-4 flex justify-between items-center border-b">
          {sidebarOpen && <span className="font-bold">Menu</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          {children.map((child, index) => (
            <button
              key={index}
              onClick={() => setSelectedChild(index)}
              className={`w-full p-3 rounded-lg mb-2 transition-all ${selectedChild === index
                  ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{child.photo}</span>
                {sidebarOpen && (
                  <div className="text-left">
                    <p className="font-medium text-sm">{child.name.split(' ')[0]}</p>
                    <p className="text-xs opacity-75">{child.grade}</p>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <nav className="flex-1 p-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-all ${activeTab === item.id
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
              {sidebarOpen && activeTab === item.id && (
                <ChevronRight size={16} className="ml-auto" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="text-yellow-600" size={20} />
              <span className="text-sm text-yellow-800">
                {error} - Using demo data
              </span>
            </div>
          )}
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;
