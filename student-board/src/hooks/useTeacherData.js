import { useState, useEffect, useCallback } from 'react';
import {
  getAllStudents,
  getStudentAcademic,
  updateStudentAcademic,
  getLevelInfo
} from '../services/mockDataService';

/**
 * Custom hook to manage teacher dashboard state, data loading, and student updates.
 * Provides functions to edit and update student attendance, behaviors, and strand levels
 * without direct mutation, maintaining clean React state updates.
 *
 * @returns {Object} State and operations for the teacher dashboard view:
 *   - students: List of all students in the class.
 *   - setStudents: Setter to update student list.
 *   - selectedStudent: Currently selected student object.
 *   - setSelectedStudent: Selects a student to view details.
 *   - academicData: The current academic records of the selected student.
 *   - loading: Boolean indicating initial loading state.
 *   - isEditing: Boolean indicating if edit mode is active.
 *   - setIsEditing: Sets editing mode state.
 *   - editedStrands: Immutably tracked state for the strands being edited.
 *   - setEditedStrands: Setter for editedStrands.
 *   - editedAttendance: Immutably tracked state for attendance breakdown.
 *   - editedBehavior: Immutably tracked behavioral assessment text.
 *   - updateStrandIndicator: Pure function to update a single strand's level.
 *   - updateAttendanceField: Pure function to update a single attendance count.
 *   - updateBehaviorText: Pure function to update the behavioral comment.
 *   - handleSave: Callback to save edits to mock database and refresh local state.
 *   - handleCancel: Callback to exit edit mode and restore original values.
 *   - reloadStudents: Reloads list of students from the mock service layer.
 */
export const useTeacherData = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [academicData, setAcademicData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editable records copy
  const [isEditing, setIsEditing] = useState(false);
  const [editedStrands, setEditedStrands] = useState([]);
  const [editedAttendance, setEditedAttendance] = useState({
    totalDays: 0,
    present: 0,
    absent: 0,
    late: 0,
  });
  const [editedBehavior, setEditedBehavior] = useState('');

  // Load students initially
  useEffect(() => {
    const allStudents = getAllStudents().map((student) => ({
      ...student,
      academic: getStudentAcademic(student.id),
    }));
    setStudents(allStudents);
    setLoading(false);
  }, []);

  // Sync editing fields with selected student's academic data
  useEffect(() => {
    if (selectedStudent) {
      // Find updated student object in the loaded students array
      const currentStudent = students.find((s) => s.id === selectedStudent.id) || selectedStudent;
      const data = currentStudent.academic || getStudentAcademic(currentStudent.id);
      setAcademicData(data);
      setIsEditing(false);
      setEditedAttendance(data.attendance || { totalDays: 0, present: 0, absent: 0, late: 0 });
      setEditedBehavior(data.behavioralAssessment || '');
      setEditedStrands((data.strands || []).map((s) => ({ ...s })));
    } else {
      setAcademicData(null);
      setIsEditing(false);
    }
  }, [selectedStudent, students]);

  // Reload student roster from data layer
  const reloadStudents = useCallback(() => {
    const updatedList = getAllStudents().map((student) => ({
      ...student,
      academic: getStudentAcademic(student.id),
    }));
    setStudents(updatedList);
  }, []);

  // Update a specific strand indicator rating using a pure array map operation
  const updateStrandIndicator = useCallback((index, newValue) => {
    setEditedStrands((prev) =>
      prev.map((strand, i) =>
        i === index
          ? { ...strand, indicator: parseInt(newValue, 10) || 1 }
          : strand
      )
    );
  }, []);

  // Update a single field in the attendance record
  const updateAttendanceField = useCallback((field, value) => {
    setEditedAttendance((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Update behavioral assessment description
  const updateBehaviorText = useCallback((text) => {
    setEditedBehavior(text);
  }, []);

  // Save changes immutably to mock database
  const handleSave = useCallback(() => {
    if (!selectedStudent || !academicData) return;

    // Convert string indicators to numbers and attach corresponding label descriptor
    const updatedStrands = editedStrands.map((s) => {
      const ind = parseInt(s.indicator, 10) || 1;
      const info = getLevelInfo(ind);
      return { 
        ...s, 
        indicator: ind, 
        descriptor: info.label 
      };
    });

    // Compute average overall CBC level
    const avg = updatedStrands.length > 0
      ? Math.round(updatedStrands.reduce((sum, s) => sum + s.indicator, 0) / updatedStrands.length)
      : 0;

    const newAcademicRecord = {
      attendance: {
        totalDays: parseInt(editedAttendance.totalDays || 0, 10),
        present: parseInt(editedAttendance.present || 0, 10),
        absent: parseInt(editedAttendance.absent || 0, 10),
        late: parseInt(editedAttendance.late || 0, 10),
      },
      behavioralAssessment: editedBehavior,
      strands: updatedStrands,
      overallLevel: avg,
    };

    updateStudentAcademic(selectedStudent.id, newAcademicRecord);
    setIsEditing(false);

    // Refresh data states
    const refreshedData = getStudentAcademic(selectedStudent.id);
    setAcademicData(refreshedData);
    
    // Refresh student list to ensure stats are in sync across the dashboard
    reloadStudents();
  }, [selectedStudent, academicData, editedStrands, editedAttendance, editedBehavior, reloadStudents]);

  // Cancel edit mode and restore initial values
  const handleCancel = useCallback(() => {
    if (academicData) {
      setEditedAttendance(academicData.attendance || { totalDays: 0, present: 0, absent: 0, late: 0 });
      setEditedBehavior(academicData.behavioralAssessment || '');
      setEditedStrands((academicData.strands || []).map((s) => ({ ...s })));
    }
    setIsEditing(false);
  }, [academicData]);

  return {
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
  };
};
