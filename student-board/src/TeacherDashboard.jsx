import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, UserCheck, AlertCircle, Loader2, Home, BarChart3,
  Menu, X, ChevronRight, Edit3, Save, MessageSquare
} from 'lucide-react';
import { 
  getAllStudents, 
  getStudentAcademic, 
  updateStudentAcademic,
} from './services/mockDataService';

const TeacherDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('classroom');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  
  const [students, setStudents] = useState([]);
  const [academicData, setAcademicData] = useState(null);
  
  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editedGrades, setEditedGrades] = useState({});
  const [editedAttendance, setEditedAttendance] = useState({ totalDays: 0, present: 0, absent: 0, late: 0 });
  const [editedBehavior, setEditedBehavior] = useState("");

  useEffect(() => {
    const fetchStudents = () => {
      const allStudents = getAllStudents();
      setStudents(allStudents);
      setLoading(false);
    };
    fetchStudents();
    
    const interval = setInterval(fetchStudents, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      const data = getStudentAcademic(selectedStudent.id);
      setAcademicData(data);
      // Reset edit states
      setIsEditing(false);
      setEditedAttendance(data.attendance || { totalDays: 0, present: 0, absent: 0, late: 0 });
      setEditedBehavior(data.behavioralAssessment || "");
      
      const grades = {};
      data.subjects.forEach(s => grades[s.name] = { score: s.score, maxScore: s.maxScore });
      setEditedGrades(grades);
    }
  }, [selectedStudent, students]);

  const handleSave = () => {
    if (!selectedStudent || !academicData) return;
    
    // Update the subjects with new percentages and calculate new grades
    const updatedSubjects = academicData.subjects.map(sub => {
      const editSub = editedGrades[sub.name] || { score: sub.score, maxScore: sub.maxScore };
      const score = parseInt(editSub.score || 0, 10);
      const maxScore = parseInt(editSub.maxScore || 100, 10);
      
      let newPct = maxScore > 0 ? (score / maxScore) * 100 : 0;
      let newGrade = 'F';
      if (newPct >= 90) newGrade = 'A';
      else if (newPct >= 80) newGrade = 'B';
      else if (newPct >= 70) newGrade = 'C';
      else if (newPct >= 60) newGrade = 'D';

      return {
        ...sub,
        score: score,
        maxScore: maxScore,
        grade: newGrade
      };
    });

    // Simple GPA calc based on average ratio
    let totalScore = 0;
    let totalMax = 0;
    updatedSubjects.forEach(s => {
       totalScore += s.score;
       totalMax += s.maxScore;
    });
    
    const avgRatio = totalMax > 0 ? (totalScore / totalMax) : 0;
    const newGPA = (avgRatio * 4.0).toFixed(1);

    updateStudentAcademic(selectedStudent.id, {
      attendance: {
        totalDays: parseInt(editedAttendance.totalDays || 0, 10),
        present: parseInt(editedAttendance.present || 0, 10),
        absent: parseInt(editedAttendance.absent || 0, 10),
        late: parseInt(editedAttendance.late || 0, 10),
      },
      behavioralAssessment: editedBehavior,
      subjects: updatedSubjects,
      currentGPA: parseFloat(newGPA)
    });

    setIsEditing(false);
    // Refresh academic data immediately for the UI
    setAcademicData(getStudentAcademic(selectedStudent.id));
  };


  const navItems = [
    { id: 'classroom', label: 'My Classroom', icon: Users },
    { id: 'analytics', label: 'Class Analytics', icon: BarChart3 },
  ];

  const ClassroomView = () => (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.firstName || 'Teacher'}! 🍎</h1>
          <p className="text-indigo-100">Manage your students and their academic progress</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => {
          const stats = getStudentAcademic(student.id);
          const att = stats.attendance || {};
          const attRate = att.totalDays ? Math.round((att.present / att.totalDays) * 100) : 0;
          return (
            <div 
              key={student.id} 
              onClick={() => { setSelectedStudent(student); setActiveTab('studentDetail'); }}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {student.photo}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-500">{student.grade} - {student.class}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-50 flex justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">GPA</p>
                  <p className="font-semibold text-gray-900">{stats.currentGPA}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Attendance</p>
                  <p className="font-semibold text-gray-900">{attRate}%</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );

  const StudentDetailView = () => {
    if (!selectedStudent || !academicData) return null;

    const att = academicData.attendance || { totalDays: 0, present: 0, absent: 0, late: 0 };
    const attendanceRate = att.totalDays > 0 ? Math.round((att.present / att.totalDays) * 100) : 0;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setActiveTab('classroom')}
            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2"
          >
            ← Back to Classroom
          </button>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 flex items-center gap-2 transition"
            >
              <Edit3 size={18} /> Edit Records
            </button>
          ) : (
            <button 
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2 shadow-md transition transform hover:scale-105"
            >
              <Save size={18} /> Save Changes
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex items-center gap-6">
           <div className="text-6xl bg-indigo-50 w-24 h-24 rounded-full flex items-center justify-center">
             {selectedStudent.photo}
           </div>
           <div>
             <h2 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h2>
             <p className="text-gray-500">ID: {selectedStudent.id} • {selectedStudent.grade} ({selectedStudent.class})</p>
           </div>
           <div className="ml-auto text-right">
             <div className="text-sm text-gray-500 mb-1">Overall GPA</div>
             <div className="text-4xl font-bold text-indigo-600">{academicData.currentGPA}</div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Panel */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <UserCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Attendance</h3>
            </div>
            
            {isEditing ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Days</label>
                  <input type="number" min="0" value={editedAttendance.totalDays} onChange={(e) => setEditedAttendance({...editedAttendance, totalDays: e.target.value})} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Present</label>
                  <input type="number" min="0" value={editedAttendance.present} onChange={(e) => setEditedAttendance({...editedAttendance, present: e.target.value})} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Absent</label>
                  <input type="number" min="0" value={editedAttendance.absent} onChange={(e) => setEditedAttendance({...editedAttendance, absent: e.target.value})} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Late</label>
                  <input type="number" min="0" value={editedAttendance.late} onChange={(e) => setEditedAttendance({...editedAttendance, late: e.target.value})} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl font-bold text-gray-900">{attendanceRate}%</div>
                  <div className="w-1/2 bg-gray-100 rounded-full h-3">
                    <div className={`h-3 rounded-full ${attendanceRate >= 90 ? 'bg-green-500' : attendanceRate >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${attendanceRate}%` }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-sm">
                  <div className="p-2 bg-gray-50 rounded"><div className="font-bold text-gray-900">{att.totalDays}</div><div className="text-gray-500 text-xs">Total</div></div>
                  <div className="p-2 bg-green-50 rounded"><div className="font-bold text-green-700">{att.present}</div><div className="text-green-600 text-xs">Present</div></div>
                  <div className="p-2 bg-red-50 rounded"><div className="font-bold text-red-700">{att.absent}</div><div className="text-red-600 text-xs">Absent</div></div>
                  <div className="p-2 bg-yellow-50 rounded"><div className="font-bold text-yellow-700">{att.late}</div><div className="text-yellow-600 text-xs">Late</div></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Behavioral Assessment Panel */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Behavioral Assessment</h3>
            </div>
            {isEditing ? (
              <textarea 
                value={editedBehavior}
                onChange={e => setEditedBehavior(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter behavioral notes here..."
              />
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg h-32 overflow-y-auto">
                <p className="text-gray-700 italic">
                  {academicData.behavioralAssessment || "No assessment provided yet."}
                </p>
              </div>
            )}
          </div>
          
          {/* Grades Panel - Span 2 columns */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Subject Grades</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {academicData.subjects.map((subject, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="font-medium text-gray-700">{subject.name}</span>
                  
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                       <input 
                         type="number" min="0"
                         value={editedGrades[subject.name] ? editedGrades[subject.name].score : subject.score}
                         onChange={(e) => setEditedGrades({...editedGrades, [subject.name]: { ...editedGrades[subject.name], score: e.target.value }})}
                         className="w-16 p-2 border border-gray-300 rounded font-bold text-center"
                       />
                       <span className="text-gray-400">/</span>
                       <input 
                         type="number" min="1"
                         value={editedGrades[subject.name] ? editedGrades[subject.name].maxScore : subject.maxScore}
                         onChange={(e) => setEditedGrades({...editedGrades, [subject.name]: { ...editedGrades[subject.name], maxScore: e.target.value }})}
                         className="w-16 p-2 border border-gray-300 rounded text-center text-sm"
                       />
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-gray-900">{subject.score} <span className="text-gray-400 font-normal">/ {subject.maxScore}</span></span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        subject.grade.includes('A') ? 'bg-green-100 text-green-700' :
                        subject.grade.includes('B') ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {subject.grade}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'classroom': return <ClassroomView />;
      case 'studentDetail': return <StudentDetailView />;
      case 'analytics': return <div className="p-8 text-center text-gray-500">Analytics coming soon...</div>;
      default: return <ClassroomView />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-indigo-600 h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r flex flex-col transition-all duration-300 shadow-sm z-20`}>
        <div className="p-4 flex justify-between items-center border-b">
          {sidebarOpen && <span className="font-bold text-indigo-700">Teacher Portal</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeTab === item.id || (activeTab === 'studentDetail' && item.id === 'classroom')
                  ? 'bg-indigo-50 text-indigo-600 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 font-medium'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium">
            <UserCheck size={20} className="rotate-180" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
