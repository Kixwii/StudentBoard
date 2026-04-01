import React, { useState, useEffect } from 'react';
import { 
  User, BookOpen, DollarSign, FileText, Download, Bell, LogOut, 
  AlertCircle, Loader2, CreditCard, CheckCircle, Home, BarChart3,
  Menu, X, ChevronRight, TrendingUp, Calendar, Award, Clock
} from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://localhost:4000/api';

// API Service Layer (same as before)
const api = {
  request: async (endpoint, options = {}) => {
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }
    return await response.json();
  },
  get: (endpoint) => api.request(endpoint, { method: 'GET' }),
  post: (endpoint, data) => api.request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data) => api.request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint) => api.request(endpoint, { method: 'DELETE' }),
};

// Service modules
const guardianService = {
  getStudents: async (guardianId) => {
    const response = await api.get(`/guardians/${encodePathParam(guardianId)}/students`);
    return response.data;
  },
  getStudentPerformance: async (guardianId, studentId) => {
    const response = await api.get(
      `/guardians/${encodePathParam(guardianId)}/students/${encodePathParam(studentId)}/performance`
    );
    return response.data;
  },
  makePayment: async (guardianId, paymentData) => {
    const response = await api.post(`/guardians/${encodePathParam(guardianId)}/payments`, paymentData);
    return response.data;
  },
};

const feeService = {
  getAccount: async (studentId) => {
    const response = await api.get(`/fees/accounts/${encodePathParam(studentId)}`);
    return response.data;
  },
  getTransactions: async (studentId) => {
    const response = await api.get(`/fees/accounts/${encodePathParam(studentId)}/transactions`);
    return response.data;
  },
};

const documentService = {
  getDocuments: async (studentId) => {
    const response = await api.get(`/students/${encodePathParam(studentId)}/documents`);
    return response.data;
  },
};

// Modern Parent Dashboard
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

  // Fetch data
  useEffect(() => {
    const fetchChildren = async () => {
      // Start with demo data immediately
      const demoChildren = [
        { name: "Gladys King'ang'i", grade: "Grade 8", class: "8A", photo: "👧🏿", studentId: "STU2024001" },
        { name: "Onesmus Oliech", grade: "Grade 5", class: "5B", photo: "👦🏿", studentId: "STU2024002" }
      ];
      
      setChildren(demoChildren);
      setLoading(false);
      
      // Try to fetch real data in background
      if (!user?.guardianId) return;
      
      try {
        const studentsData = await guardianService.getStudents(user.guardianId);
        setChildren(studentsData);
        setError(null);
      } catch (err) {
        console.log('Using demo data:', err);
        // Keep demo data, already set above
      }
    };
    fetchChildren();
  }, [user?.guardianId]);

  // Fetch data when selected child changes
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!children[selectedChild]) return;
      
      // Set demo data immediately
      const demoAcademic = {
        currentGPA: 3.7,
        attendance: 94,
        subjects: [
          { name: "Mathematics", grade: "A-", percentage: 87, teacher: "Ms. Rodriguez" },
          { name: "English Literature", grade: "B+", percentage: 85, teacher: "Mr. Thompson" },
          { name: "Science", grade: "A", percentage: 92, teacher: "Dr. Chen" },
          { name: "History", grade: "B", percentage: 82, teacher: "Ms. Williams" },
        ],
        recentAssignments: [
          { subject: "Mathematics", assignment: "Algebra Quiz 3", score: "18/20", date: "2024-08-15" },
          { subject: "Science", assignment: "Chemistry Lab Report", score: "A", date: "2024-08-12" },
        ]
      };
      
      const demoFees = {
        currentBalance: 1250.00,
        dueDate: "2024-09-15",
        breakdown: [
          { category: "Tuition Fee", amount: 800.00 },
          { category: "Activity Fee", amount: 150.00 },
          { category: "Library Fee", amount: 50.00 },
        ],
        paymentHistory: [
          { date: "2024-07-15", amount: 1200.00, description: "Q1 Tuition Payment", method: "Bank Transfer" },
          { date: "2024-06-01", amount: 200.00, description: "Registration Fee", method: "Cash" },
        ]
      };
      
      const demoDocs = [
        { name: "Academic Transcript", status: "Available", updated: "2024-08-01" },
        { name: "Conduct Certificate", status: "Available", updated: "2024-08-01" },
        { name: "Health Records", status: "Available", updated: "2024-07-15" },
      ];
      
      setAcademicData(demoAcademic);
      setFeeData(demoFees);
      setDocuments(demoDocs);
      setLoading(false);
      
      // Try to fetch real data in background
      try {
        const studentId = children[selectedChild].studentId;
        const [performance, feeAccount, transactions, docs] = await Promise.all([
          guardianService.getStudentPerformance(user.guardianId, studentId),
          feeService.getAccount(studentId),
          feeService.getTransactions(studentId),
          documentService.getDocuments(studentId),
        ]);
        setAcademicData(performance);
        setFeeData({ ...feeAccount, paymentHistory: transactions });
        setDocuments(docs);
        setError(null);
      } catch (err) {
        console.log('Using demo data:', err);
        // Keep demo data, already set above
      }
    };
    if (children.length > 0) fetchStudentData();
  }, [selectedChild, children, user?.guardianId, isBackendUnavailable]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'academic', label: 'Academic', icon: BookOpen },
    { id: 'fees', label: 'Payments', icon: DollarSign },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const DashboardView = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName}! 👋</h1>
          <p className="text-blue-100">Here's what's happening with {children[selectedChild]?.name}'s education</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mb-24"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Award className="text-blue-600" size={24} />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+0.3</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Current GPA</h3>
          <p className="text-3xl font-bold text-gray-900">{academicData?.currentGPA || 0}</p>
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <TrendingUp size={14} className="mr-1" />
            <span>Improved from last term</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Calendar className="text-green-600" size={24} />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Good</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Attendance</h3>
          <p className="text-3xl font-bold text-gray-900">{academicData?.attendance || 0}%</p>
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <Clock size={14} className="mr-1" />
            <span>This semester</span>
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

      {/* Recent Activity & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Subject Performance</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {academicData?.subjects?.slice(0, 4).map((subject, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{subject.name}</span>
                    <span className="text-sm font-bold text-gray-900">{subject.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${subject.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Assignments */}
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

  const AcademicView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Academic Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {academicData?.subjects?.map((subject, index) => (
            <div key={index} className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">{subject.name}</h3>
                <span className="text-2xl font-bold text-blue-600">{subject.grade}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">Teacher: {subject.teacher}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                  style={{ width: `${subject.percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{subject.percentage}%</p>
            </div>
          ))}
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
    switch(activeTab) {
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
    
    {/* Sidebar */}
    <div
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-white border-r flex flex-col transition-all duration-300`}
    >
      
      {/* Toggle Button */}
      <div className="p-4 flex justify-between items-center border-b">
        {sidebarOpen && <span className="font-bold">Menu</span>}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Children */}
      <div className="p-4 border-b border-gray-200">
        {children.map((child, index) => (
          <button
            key={index}
            onClick={() => setSelectedChild(index)}
            className={`w-full p-3 rounded-lg mb-2 transition-all ${
              selectedChild === index
                ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{child.photo}</span>
              {sidebarOpen && (
                <div className="text-left">
                  <p className="font-medium text-sm">
                    {child.name.split(' ')[0]}
                  </p>
                  <p className="text-xs opacity-75">
                    {child.grade}
                  </p>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-all ${
              activeTab === item.id
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

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>

    {/* Main Content */}
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