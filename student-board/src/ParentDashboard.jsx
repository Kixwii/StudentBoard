import React, { useState, useEffect } from 'react';
import { User, BookOpen, DollarSign, FileText, Calendar, Download, Bell, LogOut, AlertCircle, Loader2, CreditCard, CheckCircle } from 'lucide-react';
import './ParentDashboard.css';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const encodePathParam = (value) => encodeURIComponent(String(value ?? ''));

const getDemoStudentPayload = () => ({
  academicData: {
    currentGPA: 3.7,
    attendance: 94,
    subjects: [
      { name: 'Mathematics', grade: 'A-', percentage: 87, teacher: 'Ms. Rodriguez' },
      { name: 'English Literature', grade: 'B+', percentage: 85, teacher: 'Mr. Thompson' },
      { name: 'Science', grade: 'A', percentage: 92, teacher: 'Dr. Chen' },
    ],
    recentAssignments: [
      { subject: 'Mathematics', assignment: 'Algebra Quiz 3', score: '18/20', date: '2024-08-15' },
    ],
  },
  feeData: {
    currentBalance: 1250.0,
    dueDate: '2024-09-15',
    breakdown: [
      { category: 'Tuition Fee', amount: 800.0 },
      { category: 'Activity Fee', amount: 150.0 },
    ],
    paymentHistory: [
      { date: '2024-07-15', amount: 1200.0, description: 'Q1 Tuition Payment', method: 'Bank Transfer' },
    ],
  },
  documents: [{ name: 'Academic Transcript', status: 'Available', updated: '2024-08-01' }],
});

const isNetworkFailure = (error) =>
  error?.name === 'TypeError' ||
  /networkerror|failed to fetch|load failed/i.test(error?.message || '');

// API Service Layer
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

// Payment Modal Component
const PaymentModal = ({ balance, onConfirm, onCancel, isProcessing }) => {
  const [amount, setAmount] = useState(balance || '');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [customAmount, setCustomAmount] = useState(false);

  const presetAmounts = [
    { label: 'Full Balance', value: balance },
    { label: 'Half Balance', value: (balance / 2).toFixed(2) },
    { label: 'Custom Amount', value: 'custom' },
  ];

  const handlePreset = (value) => {
    if (value === 'custom') {
      setCustomAmount(true);
      setAmount('');
    } else {
      setCustomAmount(false);
      setAmount(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg border border-gray-200 w-full max-w-md">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <CreditCard className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Make Payment</h2>
              <p className="text-sm text-gray-600">Outstanding balance: <span className="font-semibold text-orange-600">${Number(balance).toFixed(2)}</span></p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Preset Amount Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Amount</label>
            <div className="grid grid-cols-3 gap-2">
              {presetAmounts.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePreset(preset.value)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border-2 transition-all ${
                    (!customAmount && amount == preset.value) || (customAmount && preset.value === 'custom')
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {preset.label}
                  {preset.value !== 'custom' && (
                    <div className="text-xs font-normal">${Number(preset.value).toFixed(2)}</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount Input */}
          {customAmount && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                <input
                  type="number"
                  min="1"
                  max={balance}
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
              {amount > balance && (
                <p className="text-sm text-red-500 mt-1">Amount cannot exceed balance of ${Number(balance).toFixed(2)}</p>
              )}
            </div>
          )}

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <div className="space-y-2">
              {[
                { value: 'bank_transfer', label: 'Bank Transfer' },
                { value: 'credit_card', label: 'Credit Card' },
                { value: 'mobile_money', label: 'Mobile Money' },
                { value: 'cash', label: 'Cash' },
              ].map((method) => (
                <label key={method.value} className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">{method.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 py-2 px-4 border-2 border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(amount, paymentMethod)}
            disabled={!amount || amount <= 0 || amount > balance || isProcessing}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Processing...
              </>
            ) : (
              <>
                <CreditCard size={16} />
                Pay ${Number(amount || 0).toFixed(2)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Payment Success Toast
const PaymentSuccess = ({ amount, onClose }) => (
  <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 shadow-lg z-50 animate-fade-in">
    <CheckCircle className="text-green-600" size={24} />
    <div>
      <div className="font-semibold text-green-800">Payment Successful!</div>
      <div className="text-sm text-green-600">${Number(amount).toFixed(2)} has been processed.</div>
    </div>
    <button onClick={onClose} className="ml-4 text-green-600 hover:text-green-800 font-bold text-lg">×</button>
  </div>
);

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

  // Payment states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [isBackendUnavailable, setIsBackendUnavailable] = useState(false);

  // Fetch children list on mount
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        const studentsData = await guardianService.getStudents(user.guardianId);
        setChildren(studentsData);
        setError(null);
      } catch (err) {
        setError(
          isNetworkFailure(err)
            ? 'Backend unavailable. Using demo data'
            : 'Failed to load students. Using demo data'
        );
        setIsBackendUnavailable(isNetworkFailure(err));
        setChildren([
          { name: "Gladys King'ang'i", grade: "Grade 8", class: "8A", photo: "👧🏿", studentId: "STU2024001" },
          { name: "Onesmus Oliech", grade: "Grade 5", class: "5B", photo: "👦🏿", studentId: "STU2024002" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.guardianId) fetchChildren();
  }, [user?.guardianId]);

  // Fetch data when selected child changes
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!children[selectedChild]) return;

      if (isBackendUnavailable) {
        const demoPayload = getDemoStudentPayload();
        setAcademicData(demoPayload.academicData);
        setFeeData(demoPayload.feeData);
        setDocuments(demoPayload.documents);
        setNotifications([]);
        return;
      }

      try {
        setLoading(true);
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
        setError(
          isNetworkFailure(err)
            ? 'Backend unavailable. Using demo data'
            : 'Failed to load student data. Using demo data'
        );
        setIsBackendUnavailable(isNetworkFailure(err));
        const demoPayload = getDemoStudentPayload();
        setAcademicData(demoPayload.academicData);
        setFeeData(demoPayload.feeData);
        setDocuments(demoPayload.documents);
      } finally {
        setLoading(false);
      }
    };

    if (children.length > 0) fetchStudentData();
  }, [selectedChild, children, user?.guardianId, isBackendUnavailable]);

  const refreshFeeData = async () => {
    const studentId = children[selectedChild].studentId;
    const [feeAccount, transactions] = await Promise.all([
      feeService.getAccount(studentId),
      feeService.getTransactions(studentId),
    ]);
    setFeeData({ ...feeAccount, paymentHistory: transactions });
  };

  const handlePayment = async (amount, paymentMethod) => {
    setIsProcessingPayment(true);
    try {
      await guardianService.makePayment(user.guardianId, {
        student_id: children[selectedChild].studentId,
        amount: Number(amount),
        payment_method: paymentMethod,
      });

      // Refresh fee data after payment
      await refreshFeeData();

      setShowPaymentModal(false);
      setPaymentSuccess(amount);

      // Auto-hide success toast after 5 seconds
      setTimeout(() => setPaymentSuccess(null), 5000);
    } catch (err) {
      console.error('Payment failed:', err);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const TabButton = ({ label, icon: Icon, isActive, onClick }) => (
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
          {feeData?.currentBalance > 0 && (
            <button
              onClick={() => { setActiveTab('fees'); setShowPaymentModal(true); }}
              className="mt-2 text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full hover:bg-orange-200 transition-colors"
            >
              Pay Now →
            </button>
          )}
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
          <div className="text-4xl font-bold text-orange-600 mb-2">
            ${feeData?.currentBalance?.toFixed(2) || '0.00'}
          </div>
          <div className="text-gray-600 mb-4">
            Due Date: <span className="font-semibold">{feeData?.dueDate || 'N/A'}</span>
          </div>
          {feeData?.currentBalance > 0 ? (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <CreditCard size={18} />
              Make Payment
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 text-green-700 rounded-lg font-medium">
              <CheckCircle size={18} />
              Balance Cleared
            </div>
          )}
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
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200 mt-2">
              <span className="font-semibold text-orange-800">Total Outstanding</span>
              <span className="font-bold text-orange-600">${feeData?.currentBalance?.toFixed(2)}</span>
            </div>
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
    switch (activeTab) {
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
      {/* Payment Success Toast */}
      {paymentSuccess && (
        <PaymentSuccess
          amount={paymentSuccess}
          onClose={() => setPaymentSuccess(null)}
        />
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          balance={feeData?.currentBalance}
          onConfirm={handlePayment}
          onCancel={() => setShowPaymentModal(false)}
          isProcessing={isProcessingPayment}
        />
      )}

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
                <span className="text-2xl shrink-0">{child.photo}</span>
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
          <TabButton label="Overview" icon={Calendar} isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <TabButton label="Academic Progress" icon={BookOpen} isActive={activeTab === 'academic'} onClick={() => setActiveTab('academic')} />
          <TabButton label="Fee Information" icon={DollarSign} isActive={activeTab === 'fees'} onClick={() => setActiveTab('fees')} />
          <TabButton label="Documents & Transcripts" icon={FileText} isActive={activeTab === 'transcripts'} onClick={() => setActiveTab('transcripts')} />
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