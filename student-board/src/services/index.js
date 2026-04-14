/**
 * Services Module
 * 
 * Naming: kebab-case files, camelCase exports
 * Pattern: Domain-based API service modules
 */

export { guardianService } from './guardian-service.js';
export { feeService } from './fee-service.js';
export { studentService } from './student-service.js';
export { documentService } from './document-service.js';
export {
  initMockData,
  getMockDb,
  setMockDb,
  getStudentsByGuardian,
  getAllStudents,
  getStudentAcademic,
  getStudentFees,
  getStudentDocs,
  updateStudentAcademic,
} from './mock-data-service.js';
