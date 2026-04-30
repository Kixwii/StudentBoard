import { describe, it, expect, beforeEach } from 'vitest';
import {
  addStudent, getAllStudents, getStudentAcademic, getStudentFees, getStudentDocs,
  initMockData, updateStudentAcademic, getLevelInfo, getEducationLevel,
  addAssignment, getAssignments, uploadResults, getAssignmentResults,
  generateReportCard, getReportCards, getStaffLeave, requestLeave,
  CBC_LEVELS, ALL_GRADES, EDUCATION_LEVELS,
} from './mockDataService';

describe('mockDataService – CBC model', () => {
  beforeEach(() => {
    localStorage.clear();
    initMockData();
  });

  // ── Constants ──────────────────────────────────────────────
  it('exports CBC_LEVELS with 4 levels', () => {
    expect(CBC_LEVELS).toHaveLength(4);
    expect(CBC_LEVELS[0].value).toBe(4);
    expect(CBC_LEVELS[3].value).toBe(1);
  });

  it('exports ALL_GRADES covering PP1 through Grade 9', () => {
    expect(ALL_GRADES).toContain('PP1');
    expect(ALL_GRADES).toContain('Grade 1');
    expect(ALL_GRADES).toContain('Grade 9');
  });

  it('getLevelInfo returns correct descriptor', () => {
    expect(getLevelInfo(4).label).toBe('Exceeding Expectation');
    expect(getLevelInfo(1).label).toBe('Below Expectation');
    expect(getLevelInfo(3).short).toBe('ME');
  });

  it('getEducationLevel maps grades correctly', () => {
    expect(getEducationLevel('PP1')).toBe('Pre-Primary');
    expect(getEducationLevel('Grade 3')).toBe('Primary School');
    expect(getEducationLevel('Grade 8')).toBe('Junior School');
  });

  // ── Student CRUD ───────────────────────────────────────────
  it('can add a new student with CBC defaults', () => {
    const initialCount = getAllStudents().length;
    const newStudent = addStudent({
      name: 'Test Student', grade: 'Grade 7', class: '7A',
      guardianId: 'dGVzdA==', photo: '👤'
    });

    expect(newStudent.id).toMatch(/^STU\d{4}\d{3}$/);
    expect(getAllStudents().length).toBe(initialCount + 1);

    const academic = getStudentAcademic(newStudent.id);
    expect(academic.overallLevel).toBe(0);
    expect(academic.strands).toEqual([]);

    const fees = getStudentFees(newStudent.id);
    expect(fees.currentBalance).toBe(0);

    expect(getStudentDocs(newStudent.id)).toEqual([]);
    expect(getReportCards(newStudent.id)).toEqual([]);
  });

  // ── Academic data (CBC strands) ────────────────────────────
  it('getStudentAcademic returns strands instead of subjects', () => {
    const data = getStudentAcademic('STU2024001');
    expect(data.overallLevel).toBeDefined();
    expect(data.strands).toBeDefined();
    expect(data.strands.length).toBeGreaterThan(0);
    expect(data.strands[0]).toHaveProperty('indicator');
    expect(data.strands[0]).toHaveProperty('descriptor');
  });

  it('updateStudentAcademic persists CBC strand changes', () => {
    updateStudentAcademic('STU2024001', {
      overallLevel: 4,
      strands: [{ name: 'Maths', indicator: 4, descriptor: 'Exceeding Expectation' }],
    });
    const data = getStudentAcademic('STU2024001');
    expect(data.overallLevel).toBe(4);
    expect(data.strands[0].indicator).toBe(4);
  });

  // ── Assignments ────────────────────────────────────────────
  it('can create an assignment and retrieve it', () => {
    const assignment = addAssignment({
      strand: 'Mathematics', title: 'Test Assignment',
      description: 'desc', dueDate: '2026-05-01', grade: 'Grade 8', class: '8A',
    });
    expect(assignment.id).toMatch(/^ASG\d{3}$/);

    const list = getAssignments('Grade 8', '8A');
    expect(list.some(a => a.id === assignment.id)).toBe(true);
  });

  it('can upload results for an assignment', () => {
    uploadResults('ASG001', {
      'STU2024001': { indicator: 4, feedback: 'Excellent' },
    });
    const results = getAssignmentResults('ASG001');
    expect(results['STU2024001'].indicator).toBe(4);

    // Also updates student's recentAssignments
    const academic = getStudentAcademic('STU2024001');
    expect(academic.recentAssignments.some(a => a.id === 'ASG001' && a.indicator === 4)).toBe(true);
  });

  // ── Report Cards ───────────────────────────────────────────
  it('can generate and retrieve a report card', () => {
    const rc = generateReportCard('STU2024001', 'Term 2 2026', 'Great progress');
    expect(rc.term).toBe('Term 2 2026');
    expect(rc.strands.length).toBeGreaterThan(0);
    expect(rc.teacherComments).toBe('Great progress');

    const cards = getReportCards('STU2024001');
    expect(cards.length).toBeGreaterThanOrEqual(2); // seed + new one
    expect(cards[0].term).toBe('Term 2 2026');
  });

  // ── Staff Leave ────────────────────────────────────────────
  it('can retrieve staff leave balance', () => {
    const leave = getStaffLeave();
    expect(leave.leaveBalance.annual).toBeDefined();
    expect(leave.leaveHistory.length).toBeGreaterThan(0);
  });

  it('can request leave and deduct from balance', () => {
    const before = getStaffLeave().leaveBalance.annual;
    const req = requestLeave({ type: 'Annual', startDate: '2026-05-10', endDate: '2026-05-12', days: 3, reason: 'Vacation' });
    expect(req.status).toBe('Pending');

    const after = getStaffLeave().leaveBalance.annual;
    expect(after).toBe(before - 3);
  });
});
