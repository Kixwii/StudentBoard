import React, { useState } from 'react';
import { User, BookOpen, DollarSign, FileText, ArrowRight, Calendar, Download, Bell } from 'lucide-react';

const ParentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChild, setSelectedChild] = useState(0);

  // Sample data
  const children = [
    {
      name: "Richard Kingangi",
      grade: "Grade 8",
      class: "8A",
      photo: "👧",
      studentId: "STU2024001"
    },
    {
      name: "Onesmus Oliech", 
      grade: "Grade 5",
      class: "5B",
      photo: "👦",
      studentId: "STU2024002"
    }
  ];

  const currentChild = children[selectedChild];

  const academicData = {
    currentGPA: 3.7,
    attendance: 94,
    subjects: [
      { name: "Mathematics", grade: "A-", percentage: 87, teacher: "Ms. Rodriguez" },
      { name: "English Literature", grade: "B+", percentage: 85, teacher: "Mr. Thompson" },
      { name: "Science", grade: "A", percentage: 92, teacher: "Dr. Chen" },
      { name: "History", grade: "B", percentage: 82, teacher: "Ms. Williams" },
      { name: "Art", grade: "A", percentage: 95, teacher: "Mr. Davis" }
    ],
    recentAssignments: [
      { subject: "Mathematics", assignment: "Algebra Quiz 3", score: "18/20", date: "2024-08-15" },
      { subject: "Science", assignment: "Chemistry Lab Report", score: "A", date: "2024-08-12" },
      { subject: "English", assignment: "Book Report - To Kill a Mockingbird", score: "B+", date: "2024-08-10" }
    ]
  };

  const feeData = {
    currentBalance: 1250.00,
    dueDate: "2024-09-15",
    breakdown: [
      { category: "Tuition Fee", amount: 800.00 },
      { category: "Activity Fee", amount: 150.00 },
      { category: "Library Fee", amount: 50.00 },
      { category: "Lab Fee", amount: 100.00 },
      { category: "Transportation", amount: 150.00 }
    ],
    paymentHistory: [
      { date: "2024-07-15", amount: 1200.00, description: "Q1 Tuition Payment", method: "Bank Transfer" },
      { date: "2024-06-01", amount: 200.00, description: "Registration Fee", method: "Cash" },
      { date: "2024-04-20", amount: 1200.00, description: "Q4 Previous Year", method: "Check" }
    ]
  };

  const transferData = {
    status: "No Active Transfer",
    requestDate: null,
    documents: [
      { name: "Academic Transcript", status: "Available", updated: "2024-08-01" },
      { name: "Conduct Certificate", status: "Available", updated: "2024-08-01" },
      { name: "Health Records", status: "Available", updated: "2024-07-15" }
    ]
  };

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        isActive 
          ? 'bg-blue-100 text-blue-700 border-2 border-blue-200' 
          : 'bg-white text-gray-600 border-2 border-gray-200 hover:bg-gray-50'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="text-green-600" size={20} />
            <span className="font-semibold text-green-800">Academic Performance</span>
          </div>
          <div className="text-2xl font-bold text-green-700">{academicData.currentGPA} GPA</div>
          <div className="text-sm text-green-600">{academicData.attendance}% Attendance</div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-orange-600" size={20} />
            <span className="font-semibold text-orange-800">Fee Balance</span>
          </div>
          <div className="text-2xl font-bold text-orange-700">${feeData.currentBalance.toFixed(2)}</div>
          <div className="text-sm text-orange-600">Due: {feeData.dueDate}</div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="text-blue-600" size={20} />
            <span className="font-semibold text-blue-800">Documents</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">3</div>
          <div className="text-sm text-blue-600">Available for download</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Updates</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Bell className="text-blue-500" size={16} />
            <div>
              <div className="font-medium text-gray-800">New grade posted</div>
              <div className="text-sm text-gray-600">Science - Chemistry Lab Report: A (Aug 12)</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Bell className="text-green-500" size={16} />
            <div>
              <div className="font-medium text-gray-800">Fee payment recorded</div>
              <div className="text-sm text-gray-600">Payment of $200 received (Aug 10)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AcademicTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold mb-2 text-gray-800">Current Semester</h3>
          <div className="text-3xl font-bold text-blue-600">{academicData.currentGPA}</div>
          <div className="text-sm text-gray-600">Cumulative GPA</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold mb-2 text-gray-800">Attendance</h3>
          <div className="text-3xl font-bold text-green-600">{academicData.attendance}%</div>
          <div className="text-sm text-gray-600">Present this semester</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Subject Performance</h3>
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
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Assignments</h3>
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
      </div>
    </div>
  );

  const FeesTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Current Balance</h3>
        <div className="text-center">
          <div className="text-4xl font-bold text-orange-600 mb-2">${feeData.currentBalance.toFixed(2)}</div>
          <div className="text-gray-600">Due Date: <span className="font-semibold">{feeData.dueDate}</span></div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Fee Breakdown</h3>
        <div className="space-y-3">
          {feeData.breakdown.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">{item.category}</span>
              <span className="font-semibold text-gray-800">${item.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Payment History</h3>
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
      </div>
    </div>
  );

  const TranscriptsTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Available Documents</h3>
        <div className="space-y-3">
          {transferData.documents.map((doc, index) => (
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
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Transfer Status</h3>
        <div className="text-center py-8">
          <div className="text-2xl mb-2">📄</div>
          <div className="text-lg font-medium text-gray-800 mb-2">{transferData.status}</div>
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

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">School Parent Portal</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <User size={20} />
              <span>Welcome, Parent</span>
            </div>
          </div>

          {/* Child selector */}
          <div className="flex gap-4">
            {children.map((child, index) => (
              <button
                key={index}
                onClick={() => setSelectedChild(index)}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                  selectedChild === index 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl">{child.photo}</span>
                <div className="text-left">
                  <div className="font-semibold text-gray-800">{child.name}</div>
                  <div className="text-sm text-gray-600">{child.grade} - {child.class}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
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
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;