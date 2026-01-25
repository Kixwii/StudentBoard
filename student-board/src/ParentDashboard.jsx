import React, { useState, useEffect } from 'react';
import { User, BookOpen, DollarSign, FileText, Calendar, Download, Bell, LogOut, AlertCircle, Loader2 } from 'lucide-react';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// API Service Layer
const api = {
  request: async (endpoint, options = {}) => {
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

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
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  get: (endpoint) => api.request(endpoint, { method: 'GET' }),
  post: (endpoint, data) => api.request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data) => api.request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint) => api.request(endpoint, { method: 'DELETE' }),
};

// Service modules
const guardianService = {
  getStudents: async (guardianId) => {
    const response = await api.get(`/guardians/${guardianId}/students`);
    return response.data;
  },

  getStudentPerformance: async (guardianId, studentId) => {
    const response = await api.get(`/guardians/${guardianId}/students/${studentId}/performance`);
    return response.data;
  },

  makePayment: async (guardianId, paymentData) => {
    const response = await api.post(`/guardians/${guardianId}/payments`, paymentData);
    return response.data;
  },
};

const feeService = {
  getAccount: async (studentId) => {
    const response = await api.get(`/fees/accounts/${studentId}`);
    return response.data;
  },

  getTransactions: async (studentId) => {
    const response = await api.get(`/fees/accounts/${studentId}/transactions`);
    return response.data;
  },
};

const documentService = {
  getDocuments: async (studentId) => {
    const response = await api.get(`/students/${studentId}/documents`);
    return response.data;
  },
};

// Main Component
const ParentDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChild, setSelectedChild] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data states
  const [children, setChildren] = useState([]);
  const [academicData, setAcademicData] = useState(null);
  const [feeData, setFeeData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Fetch children list on mount
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        const studentsData = await guardianService.getStudents(user.guardianId);
        setChildren(studentsData);
        setError(null);
      } catch (err) {
        setError('Failed to load students');
        console.error(err);
        // Fallback to mock data for demo
        setChildren([
          {
            name: "Gladys King'ang'i",
            grade: "Grade 8",
            class: "8A",
            photo: "👧🏿",
            studentId: "STU2024001"
          },
          {
            name: "Onesmus Oliech", 
            grade: "Grade 5",
            class: "5B",
            photo: "👦🏿",
            studentId: "STU2024002"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.guardianId) {
      fetchChildren();
    }
  }, [user?.guardianId]);

  // Fetch data when selected child changes
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!children[selectedChild]) return;

      try {
        setLoading(true);
        const studentId = children[selectedChild].studentId;

        // Fetch all data in parallel
        const [performance, feeAccount, transactions, docs] = await Promise.all([
          guardianService.getStudentPerformance(user.guardianId, studentId),
          feeService.getAccount(studentId),
          feeService.getTransactions(studentId),
          documentService.getDocuments(studentId),
        ]);

        setAcademicData(performance);
        setFeeData({
          ...feeAccount,
          paymentHistory: transactions,
        });
        setDocuments(docs);
        
        // Mock notifications (replace with real API call)
        setNotifications([
          {
            type: 'grade',
            title: 'New grade posted',
            message: `${performance.subjects?.[0]?.name || 'Science'} - Latest assignment graded`,
            date: new Date().toISOString(),
          },
        ]);

        setError(null);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load student data');
        
        // Fallback to mock data
        setAcademicData({
          currentGPA: 3.7,
          attendance: 94,
          subjects: [
            { name: "Mathematics", grade: "A-", percentage: 87, teacher: "Ms. Rodriguez" },
            { name: "English Literature", grade: "B+", percentage: 85, teacher: "Mr. Thompson" },
            { name: "Science", grade: "A", percentage: 92, teacher: "Dr. Chen" },
          ],
          recentAssignments: [
            { subject: "Mathematics", assignment: "Algebra Quiz 3", score: "18/20", date: "2024-08-15" },
          ]
        });
        
        setFeeData({
          currentBalance: 1250.00,
          dueDate: "2024-09-15",
          breakdown: [
            { category: "Tuition Fee", amount: 800.00 },
            { category: "Activity Fee", amount: 150.00 },
          ],
          paymentHistory: [
            { date: "2024-07-15", amount: 1200.00, description: "Q1 Tuition Payment", method: "Bank Transfer" },
          ]
        });
        
        setDocuments([
          { name: "Academic Transcript", status: "Available", updated: "2024-08-01" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (children.length > 0) {
      fetchStudentData();
    }
  }, [selectedChild, children, user?.guardianId]);

  const handlePayment = async (amount, paymentMethod) => {
    try {
      const payment = await guardianService.makePayment(user.guardianId, {
        student_id: children[selectedChild].studentId,
        amount,
        payment_method: paymentMethod,
      });
      
      // Refresh fee data
      const studentId = children[selectedChild].studentId;
      const [feeAccount, transactions] = await Promise.all([
        feeService.getAccount(studentId),
        feeService.getTransactions(studentId),
      ]);
      
      setFeeData({
        ...feeAccount,
        paymentHistory: transactions,
      });
      
      alert('Payment successful!');
    } catch (err) {
      alert('Payment failed. Please try again.');
      console.error(err);
    }
  };

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-4 sm:px-5 sm:py-5 rounded-lg transition-all flex-1 sm:flex-none justify-center sm:justify-start text-sm sm:text-base ${
        isActive 
          ? 'bg-blue-100 text-blue-700 border-2 border-blue-200' 
          : 'bg-white text-gray-600 border-2 border-gray-200 hover:bg-gray-50'
      }`}
    >
      <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
      <span className="hidden xs:inline sm:inline">{label}</span>
    </button>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="text-green-600" size={20} />
            <span className="font-semibold text-green-800">Academic Performance</span>
          </div>
          <div className="text-2xl font-bold text-green-700">{academicData?.currentGPA || 0} GPA</div>
          <div className="text-sm text-green-600">{academicData?.attendance || 0}% Attendance</div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-orange-600" size={20} />
            <span className="font-semibold text-orange-800">Fee Balance</span>
          </div>
          <div className="text-2xl font-bold text-orange-700">${feeData?.currentBalance?.toFixed(2) || '0.00'}</div>
          <div className="text-sm text-orange-600">Due: {feeData?.dueDate || 'N/A'}</div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="text-blue-600" size={20} />
            <span className="font-semibold text-blue-800">Documents</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">{documents?.length || 0}</div>
          <div className="text-sm text-blue-600">Available for download</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Updates</h3>
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notif, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Bell className={notif.type === 'grade' ? 'text-blue-500' : 'text-green-500'} size={16} />
                <div>
                  <div className="font-medium text-gray-800">{notif.title}</div>
                  <div className="text-sm text-gray-600">{notif.message}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No recent updates</p>
        )}
      </div>
    </div>
  );

  const AcademicTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold mb-2 text-gray-800">Current Semester</h3>
          <div className="text-3xl font-bold text-blue-600">{academicData?.currentGPA || 0}</div>
          <div className="text-sm text-gray-600">Cumulative GPA</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold mb-2 text-gray-800">Attendance</h3>
          <div className="text-3xl font-bold text-green-600">{academicData?.attendance || 0}%</div>
          <div className="text-sm text-gray-600">Present this semester</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Subject Performance</h3>
        {academicData?.subjects?.length > 0 ? (
          <div className="space-y-4">
            {academicData.subjects.map((subject, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">{subject.name}</div>
                  <div className="text-sm text-gray-600">Teacher: {subject.teacher}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-600">{subject.grade}</div>
                  <div className="text-sm text-gray-600">{subject.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No subjects available</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Assignments</h3>
        {academicData?.recentAssignments?.length > 0 ? (
          <div className="space-y-3">
            {academicData.recentAssignments.map((assignment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">{assignment.assignment}</div>
                  <div className="text-sm text-gray-600">{assignment.subject}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{assignment.score}</div>
                  <div className="text-sm text-gray-600">{assignment.date}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No recent assignments</p>
        )}
      </div>
    </div>
  );

  const FeesTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Current Balance</h3>
        <div className="text-center">
          <div className="text-4xl font-bold text-orange-600 mb-2">${feeData?.currentBalance?.toFixed(2) || '0.00'}</div>
          <div className="text-gray-600">Due Date: <span className="font-semibold">{feeData?.dueDate || 'N/A'}</span></div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Fee Breakdown</h3>
        {feeData?.breakdown?.length > 0 ? (
          <div className="space-y-3">
            {feeData.breakdown.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">{item.category}</span>
                <span className="font-semibold text-gray-800">${item.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No fee breakdown available</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Payment History</h3>
        {feeData?.paymentHistory?.length > 0 ? (
          <div className="space-y-3">
            {feeData.paymentHistory.map((payment, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <div className="font-medium text-gray-800">{payment.description}</div>
                  <div className="text-sm text-gray-600">{payment.date} • {payment.method}</div>
                </div>
                <div className="font-bold text-green-600">-${payment.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No payment history</p>
        )}
      </div>
    </div>
  );

  const TranscriptsTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Available Documents</h3>
        {documents?.length > 0 ? (
          <div className="space-y-3">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="text-blue-500" size={20} />
                  <div>
                    <div className="font-medium text-gray-800">{doc.name}</div>
                    <div className="text-sm text-gray-600">Last updated: {doc.updated}</div>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                  <Download size={16} />
                  Download
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No documents available</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Transfer Status</h3>
        <div className="text-center py-8">
          <div className="text-2xl mb-2">📄</div>
          <div className="text-lg font-medium text-gray-800 mb-2">No Active Transfer</div>
          <div className="text-gray-600">All documents are ready for transfer requests</div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview': return <OverviewTab />;
      case 'academic': return <AcademicTab />;
      case 'fees': return <FeesTab />;
      case 'transcripts': return <TranscriptsTab />;
      default: return <OverviewTab />;
    }
  };

  if (loading && children.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">School Parent Portal</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-gray-600">
                <User size={20} />
                <span className="text-sm sm:text-base">
                  Welcome, {user?.firstName || 'Parent'}
                  {user?.username && ` (${user.username})`}
                </span>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              )}
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="text-yellow-600" size={20} />
              <span className="text-sm text-yellow-800">{error} - Using demo data</span>
            </div>
          )}

          {/* Child selector */}
          <div className="flex flex-wrap gap-4">
            {children.map((child, index) => (
              <button
                key={index}
                onClick={() => setSelectedChild(index)}
                className={`flex items-center gap-3 px-4 py-4 sm:px-5 sm:py-5 rounded-lg border-2 transition-all min-w-0 flex-1 sm:flex-none justify-center sm:justify-start ${
                  selectedChild === index 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl flex-shrink-0">{child.photo}</span>
                <div className="text-left min-w-0">
                  <div className="font-semibold text-gray-800 truncate">{child.name}</div>
                  <div className="text-sm text-gray-600 truncate">{child.grade} - {child.class}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6 sm:gap-3">
          <TabButton 
            id="overview" 
            label="Overview" 
            icon={Calendar} 
            isActive={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')} 
          />
          <TabButton 
            id="academic" 
            label="Academic Progress" 
            icon={BookOpen} 
            isActive={activeTab === 'academic'} 
            onClick={() => setActiveTab('academic')} 
          />
          <TabButton 
            id="fees" 
            label="Fee Information" 
            icon={DollarSign} 
            isActive={activeTab === 'fees'} 
            onClick={() => setActiveTab('fees')} 
          />
          <TabButton 
            id="transcripts" 
            label="Documents & Transcripts" 
            icon={FileText} 
            isActive={activeTab === 'transcripts'} 
            onClick={() => setActiveTab('transcripts')} 
          />
        </div>

        {/* Content area */}
        <div>
          {loading && children.length > 0 ? (
            <div className="bg-white p-12 rounded-lg border border-gray-200 text-center">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600">Loading student data...</p>
            </div>
          ) : (
            renderTabContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;