// services/mockDataService.js
// CBC (Competency-Based Curriculum) aligned mock data service

// ── CBC Constants ────────────────────────────────────────────────────────────
export const CBC_LEVELS = [
  { value: 4, label: 'Exceeding Expectation', short: 'EE', color: '#16a34a', bg: '#f0fdf4' },
  { value: 3, label: 'Meeting Expectation',   short: 'ME', color: '#2563eb', bg: '#eff6ff' },
  { value: 2, label: 'Approaching Expectation', short: 'AE', color: '#ca8a04', bg: '#fefce8' },
  { value: 1, label: 'Below Expectation',      short: 'BE', color: '#dc2626', bg: '#fef2f2' },
];

export const EDUCATION_LEVELS = [
  { key: 'pp',      label: 'Pre-Primary',   grades: ['PP1', 'PP2'], years: 2 },
  { key: 'primary', label: 'Primary School', grades: ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6'], years: 6 },
  { key: 'junior',  label: 'Junior School',  grades: ['Grade 7','Grade 8','Grade 9'], years: 3 },
];

export const ALL_GRADES = EDUCATION_LEVELS.flatMap(l => l.grades);

export const PATHWAYS = ['STEM', 'Social Sciences', 'Arts & Sports Sciences'];

export const getLevelInfo = (indicator) =>
  CBC_LEVELS.find(l => l.value === indicator) || CBC_LEVELS[3];

export const getEducationLevel = (grade) => {
  for (const level of EDUCATION_LEVELS) {
    if (level.grades.includes(grade)) return level.label;
  }
  return 'Unknown';
};

// ── Initial Data ─────────────────────────────────────────────────────────────
const INITIAL_DATA = {
  students: [
    { id: "STU2024001", name: "Gladys King'ang'i", grade: "Grade 8", class: "8A", photo: "👧🏿", guardianId: "cGFyZW50QGRlbW8uY29t" },
    { id: "STU2024002", name: "Onesmus Oliech",    grade: "Grade 5", class: "5B", photo: "👦🏿", guardianId: "cGFyZW50QGRlbW8uY29t" },
    { id: "STU2024003", name: "Amelia Earhart",     grade: "Grade 5", class: "5B", photo: "👱‍♀️", guardianId: "b3RoZXJAdGVzdC5jb20=" },
    { id: "STU2024004", name: "David Johnson",      grade: "Grade 8", class: "8A", photo: "👨‍🦱", guardianId: "b3RoZXJAdGVzdC5jb20=" },
  ],

  academicData: {
    "STU2024001": {
      overallLevel: 3,
      attendance: { totalDays: 100, present: 94, absent: 5, late: 1 },
      behavioralAssessment: "Gladys is very attentive and participates actively in all learning areas.",
      strands: [
        { name: "Mathematics",        subStrand: "Numbers & Operations", indicator: 3, descriptor: "Meeting Expectation",   teacher: "Ms. Rodriguez" },
        { name: "English",            subStrand: "Reading & Comprehension", indicator: 4, descriptor: "Exceeding Expectation", teacher: "Mr. Thompson" },
        { name: "Integrated Science", subStrand: "Living Things",       indicator: 3, descriptor: "Meeting Expectation",   teacher: "Dr. Chen" },
        { name: "Social Studies",     subStrand: "Citizenship",         indicator: 3, descriptor: "Meeting Expectation",   teacher: "Ms. Williams" },
        { name: "Creative Arts",      subStrand: "Visual Art",          indicator: 4, descriptor: "Exceeding Expectation", teacher: "Mr. Davis" },
      ],
      recentAssignments: [
        { id: "A001", strand: "Mathematics", title: "Algebra Concepts Assessment", indicator: 3, feedback: "Good grasp of concepts", date: "2026-03-15" },
        { id: "A002", strand: "Integrated Science", title: "Ecosystem Project", indicator: 4, feedback: "Exceptional research work", date: "2026-03-12" },
      ]
    },
    "STU2024002": {
      overallLevel: 2,
      attendance: { totalDays: 100, present: 88, absent: 10, late: 2 },
      behavioralAssessment: "Onesmus is a bright learner but needs to focus more during group activities.",
      strands: [
        { name: "Mathematics",        subStrand: "Numbers & Operations", indicator: 2, descriptor: "Approaching Expectation", teacher: "Ms. Rodriguez" },
        { name: "English",            subStrand: "Reading & Comprehension", indicator: 3, descriptor: "Meeting Expectation",   teacher: "Mr. Thompson" },
        { name: "Integrated Science", subStrand: "Matter & Energy",     indicator: 2, descriptor: "Approaching Expectation", teacher: "Dr. Chen" },
        { name: "Social Studies",     subStrand: "Our Environment",     indicator: 3, descriptor: "Meeting Expectation",   teacher: "Ms. Williams" },
      ],
      recentAssignments: [
        { id: "A003", strand: "Mathematics", title: "Fractions Worksheet", indicator: 2, feedback: "Needs more practice", date: "2026-03-14" },
      ]
    },
    "STU2024003": {
      overallLevel: 4,
      attendance: { totalDays: 100, present: 98, absent: 2, late: 0 },
      behavioralAssessment: "Amelia is an exceptional learner with perfect conduct and initiative.",
      strands: [
        { name: "Mathematics",        subStrand: "Geometry",            indicator: 4, descriptor: "Exceeding Expectation", teacher: "Ms. Rodriguez" },
        { name: "Integrated Science", subStrand: "Physical Sciences",   indicator: 4, descriptor: "Exceeding Expectation", teacher: "Dr. Chen" },
        { name: "English",            subStrand: "Writing & Composition", indicator: 3, descriptor: "Meeting Expectation",  teacher: "Mr. Thompson" },
      ],
      recentAssignments: []
    },
    "STU2024004": {
      overallLevel: 2,
      attendance: { totalDays: 100, present: 82, absent: 15, late: 3 },
      behavioralAssessment: "David has been missing classes frequently. Needs support to improve attendance.",
      strands: [
        { name: "Mathematics",    subStrand: "Measurement",     indicator: 1, descriptor: "Below Expectation",      teacher: "Ms. Rodriguez" },
        { name: "Social Studies", subStrand: "History & Govt",   indicator: 2, descriptor: "Approaching Expectation", teacher: "Ms. Williams" },
        { name: "English",        subStrand: "Oral Communication", indicator: 2, descriptor: "Approaching Expectation", teacher: "Mr. Thompson" },
      ],
      recentAssignments: []
    }
  },

  feeData: {
    "STU2024001": {
      currentBalance: 12500.00,
      dueDate: "2026-04-30",
      breakdown: [
        { category: "Tuition Fee",     amount: 8000.00 },
        { category: "Activity Fee",    amount: 1500.00 },
        { category: "Library Fee",     amount: 500.00 },
        { category: "Lab Fee",         amount: 1000.00 },
        { category: "Transportation",  amount: 1500.00 },
      ],
      paymentHistory: [
        { date: "2026-01-15", amount: 12000.00, description: "Term 1 Tuition Payment", method: "M-Pesa" },
        { date: "2025-12-01", amount: 2000.00,  description: "Registration Fee",       method: "Bank Transfer" },
      ]
    },
    "STU2024002": {
      currentBalance: 0.00,
      dueDate: "2026-04-30",
      breakdown: [
        { category: "Tuition Fee",  amount: 8000.00 },
        { category: "Activity Fee", amount: 1500.00 },
      ],
      paymentHistory: [
        { date: "2026-02-01", amount: 9500.00, description: "Term 1 Full Payment", method: "M-Pesa" },
      ]
    }
  },

  documentsData: {
    "STU2024001": [
      { name: "Academic Transcript",  status: "Available", updated: "2026-03-01" },
      { name: "Conduct Certificate",  status: "Available", updated: "2026-03-01" },
    ],
    "STU2024002": [
      { name: "Health Records", status: "Available", updated: "2026-02-15" },
    ]
  },

  reportCards: {
    "STU2024001": [
      {
        term: "Term 1 2026",
        generatedDate: "2026-03-28",
        strands: [
          { name: "Mathematics",        indicator: 3, descriptor: "Meeting Expectation" },
          { name: "English",            indicator: 4, descriptor: "Exceeding Expectation" },
          { name: "Integrated Science", indicator: 3, descriptor: "Meeting Expectation" },
          { name: "Social Studies",     indicator: 3, descriptor: "Meeting Expectation" },
          { name: "Creative Arts",      indicator: 4, descriptor: "Exceeding Expectation" },
        ],
        overallIndicator: 3,
        attendance: { totalDays: 100, present: 94 },
        teacherComments: "Gladys has shown consistent performance across all learning areas. She excels in English and Creative Arts."
      }
    ]
  },

  // ── Assignments (teacher-managed) ──────────────────────────────────────────
  assignments: [
    { id: "ASG001", strand: "Mathematics",        title: "Algebra Concepts Assessment",  description: "Solve problems involving algebraic expressions",        dueDate: "2026-03-15", createdDate: "2026-03-08", grade: "Grade 8", class: "8A" },
    { id: "ASG002", strand: "Integrated Science",  title: "Ecosystem Project",            description: "Research and present a local ecosystem",                dueDate: "2026-03-20", createdDate: "2026-03-10", grade: "Grade 8", class: "8A" },
    { id: "ASG003", strand: "Mathematics",          title: "Fractions Worksheet",          description: "Practice problems on fractions and decimals",           dueDate: "2026-03-14", createdDate: "2026-03-07", grade: "Grade 5", class: "5B" },
  ],

  // ── Assignment results (keyed by assignment ID → student ID) ───────────────
  assignmentResults: {
    "ASG001": {
      "STU2024001": { indicator: 3, feedback: "Good grasp of concepts" },
      "STU2024004": { indicator: 1, feedback: "Needs significant improvement" },
    },
    "ASG002": {
      "STU2024001": { indicator: 4, feedback: "Exceptional research work" },
    },
    "ASG003": {
      "STU2024002": { indicator: 2, feedback: "Needs more practice" },
      "STU2024003": { indicator: 4, feedback: "Perfect execution" },
    }
  },

  // ── Staff data (teacher leave management) ──────────────────────────────────
  staffData: {
    leaveBalance: { annual: 21, sick: 10, emergency: 5 },
    leaveHistory: [
      { id: "LV001", type: "Annual",    startDate: "2026-02-10", endDate: "2026-02-12", days: 3, status: "Approved",  reason: "Family event" },
      { id: "LV002", type: "Sick",      startDate: "2026-01-20", endDate: "2026-01-20", days: 1, status: "Approved",  reason: "Flu" },
      { id: "LV003", type: "Emergency", startDate: "2026-04-01", endDate: "2026-04-02", days: 2, status: "Pending",   reason: "Personal matter" },
    ]
  }
};

// ── Core DB accessors ────────────────────────────────────────────────────────

export const initMockData = () => {
  if (!localStorage.getItem('mock_db')) {
    localStorage.setItem('mock_db', JSON.stringify(INITIAL_DATA));
  }
};

export const getMockDb = () => {
  return JSON.parse(localStorage.getItem('mock_db') || JSON.stringify(INITIAL_DATA));
};

export const setMockDb = (data) => {
  localStorage.setItem('mock_db', JSON.stringify(data));
};

// ── Student CRUD ─────────────────────────────────────────────────────────────

export const getStudentsByGuardian = (guardianId) => {
  const db = getMockDb();
  const matches = db.students.filter(s => s.guardianId === guardianId);
  return matches.length > 0 ? matches : db.students.slice(0, 2);
};

export const getAllStudents = () => {
  return getMockDb().students;
};

export const addStudent = (studentData) => {
  const db = getMockDb();
  const nextId = `STU${new Date().getFullYear()}${String(db.students.length + 1).padStart(3, '0')}`;

  const newStudent = { id: nextId, ...studentData };
  db.students.push(newStudent);

  db.academicData[nextId] = {
    overallLevel: 0,
    attendance: { totalDays: 0, present: 0, absent: 0, late: 0 },
    behavioralAssessment: "",
    strands: [],
    recentAssignments: []
  };
  db.feeData[nextId] = { currentBalance: 0, dueDate: 'N/A', breakdown: [], paymentHistory: [] };
  db.documentsData[nextId] = [];
  if (!db.reportCards) db.reportCards = {};
  db.reportCards[nextId] = [];

  setMockDb(db);
  return newStudent;
};

// ── Academic data ────────────────────────────────────────────────────────────

export const getStudentAcademic = (studentId) => {
  return getMockDb().academicData[studentId] || {
    overallLevel: 0,
    attendance: { totalDays: 0, present: 0, absent: 0, late: 0 },
    behavioralAssessment: "",
    strands: [],
    recentAssignments: []
  };
};

export const updateStudentAcademic = (studentId, newAcademicData) => {
  const db = getMockDb();
  db.academicData[studentId] = {
    ...db.academicData[studentId],
    ...newAcademicData
  };
  setMockDb(db);
};

// ── Fee data ─────────────────────────────────────────────────────────────────

export const getStudentFees = (studentId) => {
  return getMockDb().feeData[studentId] || { currentBalance: 0, dueDate: 'N/A', breakdown: [], paymentHistory: [] };
};

// ── Document data ────────────────────────────────────────────────────────────

export const getStudentDocs = (studentId) => {
  return getMockDb().documentsData[studentId] || [];
};

// ── Assignments ──────────────────────────────────────────────────────────────

export const getAssignments = (filterGrade, filterClass) => {
  const db = getMockDb();
  let list = db.assignments || [];
  if (filterGrade) list = list.filter(a => a.grade === filterGrade);
  if (filterClass) list = list.filter(a => a.class === filterClass);
  return list;
};

export const addAssignment = (assignmentData) => {
  const db = getMockDb();
  if (!db.assignments) db.assignments = [];
  const nextId = `ASG${String(db.assignments.length + 1).padStart(3, '0')}`;
  const newAssignment = {
    id: nextId,
    createdDate: new Date().toISOString().split('T')[0],
    ...assignmentData,
  };
  db.assignments.push(newAssignment);
  setMockDb(db);
  return newAssignment;
};

export const uploadResults = (assignmentId, results) => {
  // results: { [studentId]: { indicator, feedback } }
  const db = getMockDb();
  if (!db.assignmentResults) db.assignmentResults = {};
  db.assignmentResults[assignmentId] = {
    ...(db.assignmentResults[assignmentId] || {}),
    ...results,
  };

  // Also update each student's recentAssignments
  const assignment = (db.assignments || []).find(a => a.id === assignmentId);
  if (assignment) {
    Object.entries(results).forEach(([studentId, result]) => {
      if (db.academicData[studentId]) {
        if (!db.academicData[studentId].recentAssignments) {
          db.academicData[studentId].recentAssignments = [];
        }
        // Remove old entry for this assignment if exists
        db.academicData[studentId].recentAssignments = db.academicData[studentId].recentAssignments.filter(
          a => a.id !== assignmentId
        );
        db.academicData[studentId].recentAssignments.unshift({
          id: assignmentId,
          strand: assignment.strand,
          title: assignment.title,
          indicator: result.indicator,
          feedback: result.feedback,
          date: new Date().toISOString().split('T')[0],
        });
      }
    });
  }

  setMockDb(db);
};

export const getAssignmentResults = (assignmentId) => {
  const db = getMockDb();
  return (db.assignmentResults || {})[assignmentId] || {};
};

// ── Report Cards ─────────────────────────────────────────────────────────────

export const getReportCards = (studentId) => {
  const db = getMockDb();
  return (db.reportCards || {})[studentId] || [];
};

export const generateReportCard = (studentId, term, teacherComments) => {
  const db = getMockDb();
  const academic = db.academicData[studentId];
  if (!academic) return null;

  const reportCard = {
    term,
    generatedDate: new Date().toISOString().split('T')[0],
    strands: (academic.strands || []).map(s => ({
      name: s.name,
      indicator: s.indicator,
      descriptor: s.descriptor,
    })),
    overallIndicator: academic.overallLevel,
    attendance: {
      totalDays: academic.attendance?.totalDays || 0,
      present: academic.attendance?.present || 0,
    },
    teacherComments: teacherComments || academic.behavioralAssessment || '',
  };

  if (!db.reportCards) db.reportCards = {};
  if (!db.reportCards[studentId]) db.reportCards[studentId] = [];
  db.reportCards[studentId].unshift(reportCard);

  setMockDb(db);
  return reportCard;
};

// ── Staff / Leave Management ─────────────────────────────────────────────────

export const getStaffLeave = () => {
  const db = getMockDb();
  return db.staffData || {
    leaveBalance: { annual: 21, sick: 10, emergency: 5 },
    leaveHistory: []
  };
};

export const requestLeave = (leaveData) => {
  const db = getMockDb();
  if (!db.staffData) {
    db.staffData = { leaveBalance: { annual: 21, sick: 10, emergency: 5 }, leaveHistory: [] };
  }

  const nextId = `LV${String((db.staffData.leaveHistory || []).length + 1).padStart(3, '0')}`;
  const newLeave = {
    id: nextId,
    status: 'Pending',
    ...leaveData,
  };
  db.staffData.leaveHistory.push(newLeave);

  // Deduct from balance
  const typeKey = leaveData.type.toLowerCase();
  if (db.staffData.leaveBalance[typeKey] !== undefined) {
    db.staffData.leaveBalance[typeKey] = Math.max(0, db.staffData.leaveBalance[typeKey] - (leaveData.days || 0));
  }

  setMockDb(db);
  return newLeave;
};
