import api from './api';

export const studentService = {
  getGrades: async (studentId) => {
    const response = await api.get(`/students/${studentId}/grades`);
    return response.data.data;
  },

  getSchedule: async (studentId) => {
    const response = await api.get(`/students/${studentId}/schedule`);
    return response.data.data;
  },

  submitAssignment: async (studentId, assignmentId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(
      `/students/${studentId}/assignments/${assignmentId}/submit`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },
};