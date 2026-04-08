// services/mockDataService.js

const INITIAL_DATA = {
  students: [
    { id: "STU2024001", name: "Gladys King'ang'i", grade: "Grade 8", class: "8A", photo: "👧🏿", guardianId: "parent@test.com" },
    { id: "STU2024002", name: "Onesmus Oliech", grade: "Grade 5", class: "5B", photo: "👦🏿", guardianId: "parent@test.com" },
    { id: "STU2024003", name: "Amelia Earhart", grade: "Grade 5", class: "5B", photo: "👱‍♀️", guardianId: "other@test.com" },
    { id: "STU2024004", name: "David Johnson", grade: "Grade 8", class: "8A", photo: "👨‍🦱", guardianId: "other@test.com" },
  ],
  academicData: {
    "STU2024001": {
      currentGPA: 3.7,
      attendance: { totalDays: 100, present: 94, absent: 5, late: 1 },
      behavioralAssessment: "Gladys is very attentive and participates actively.",
      subjects: [
        { name: "Mathematics", grade: "A-", score: 87, maxScore: 100, teacher: "Ms. Rodriguez" },
        { name: "English Literature", grade: "B+", score: 85, maxScore: 100, teacher: "Mr. Thompson" },
        { name: "Science", grade: "A", score: 92, maxScore: 100, teacher: "Dr. Chen" },
        { name: "History", grade: "B", score: 82, maxScore: 100, teacher: "Ms. Williams" },
      ],
      recentAssignments: [
        { subject: "Mathematics", assignment: "Algebra Quiz 3", score: "18/20", date: "2024-08-15" },
        { subject: "Science", assignment: "Chemistry Lab Report", score: "100/100", date: "2024-08-12" },
      ]
    },
    "STU2024002": {
      currentGPA: 3.2,
      attendance: { totalDays: 100, present: 88, absent: 10, late: 2 },
      behavioralAssessment: "Onesmus is a bright student but needs to focus more during class.",
      subjects: [
        { name: "Mathematics", grade: "C+", score: 78, maxScore: 100, teacher: "Ms. Rodriguez" },
        { name: "English Literature", grade: "B", score: 84, maxScore: 100, teacher: "Mr. Thompson" },
        { name: "Science", grade: "B-", score: 80, maxScore: 100, teacher: "Dr. Chen" },
        { name: "History", grade: "A-", score: 90, maxScore: 100, teacher: "Ms. Williams" },
      ],
      recentAssignments: [
        { subject: "Mathematics", assignment: "Fractions Worksheet", score: "15/20", date: "2024-08-14" },
      ]
    },
    "STU2024003": {
      currentGPA: 3.9,
      attendance: { totalDays: 100, present: 98, absent: 2, late: 0 },
      behavioralAssessment: "Amelia is an exceptional student with perfect conduct.",
      subjects: [
        { name: "Mathematics", grade: "A", score: 95, maxScore: 100, teacher: "Ms. Rodriguez" },
        { name: "Science", grade: "A+", score: 98, maxScore: 100, teacher: "Dr. Chen" },
      ],
      recentAssignments: []
    },
    "STU2024004": {
      currentGPA: 2.8,
      attendance: { totalDays: 100, present: 82, absent: 15, late: 3 },
      behavioralAssessment: "David has been missing classes frequently, affecting his performance.",
      subjects: [
        { name: "Mathematics", grade: "C", score: 74, maxScore: 100, teacher: "Ms. Rodriguez" },
        { name: "History", grade: "B-", score: 81, maxScore: 100, teacher: "Ms. Williams" },
      ],
      recentAssignments: []
    }
  },
  feeData: {
    "STU2024001": {
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
    },
    "STU2024002": {
      currentBalance: 0.00,
      dueDate: "2024-09-15",
      breakdown: [
        { category: "Tuition Fee", amount: 800.00 },
        { category: "Activity Fee", amount: 150.00 },
      ],
      paymentHistory: [
        { date: "2024-08-01", amount: 950.00, description: "Q1 Full Payment", method: "Credit Card" },
      ]
    }
  },
  documentsData: {
    "STU2024001": [
      { name: "Academic Transcript", status: "Available", updated: "2024-08-01" },
      { name: "Conduct Certificate", status: "Available", updated: "2024-08-01" },
    ],
    "STU2024002": [
      { name: "Health Records", status: "Available", updated: "2024-07-15" },
    ]
  }
};

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

export const getStudentsByGuardian = (guardianId) => {
  const db = getMockDb();
  // For demo parent@test.com, just return the first two if no email match, or match by id
  const matches = db.students.filter(s => s.guardianId === guardianId);
  return matches.length > 0 ? matches : db.students.slice(0, 2); 
};

export const getAllStudents = () => {
  return getMockDb().students;
};

export const getStudentAcademic = (studentId) => {
  return getMockDb().academicData[studentId] || { currentGPA: 0, attendance: { totalDays: 0, present: 0, absent: 0, late: 0 }, behavioralAssessment: "", subjects: [], recentAssignments: [] };
};

export const getStudentFees = (studentId) => {
  return getMockDb().feeData[studentId] || { currentBalance: 0, dueDate: 'N/A', breakdown: [], paymentHistory: [] };
};

export const getStudentDocs = (studentId) => {
  return getMockDb().documentsData[studentId] || [];
};

export const updateStudentAcademic = (studentId, newAcademicData) => {
  const db = getMockDb();
  db.academicData[studentId] = {
    ...db.academicData[studentId],
    ...newAcademicData
  };
  setMockDb(db);
};
