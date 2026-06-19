import { useState, useEffect, useCallback } from 'react';
import { guardianService } from '../services/guardianService';
import { feeService } from '../services/feeService';
import { documentService } from '../services/documentService';

/**
 * Custom hook to manage parent dashboard state and data fetching.
 * Encapsulates the operations for fetching children lists and loading detailed performance,
 * financial, and document data for the active child.
 *
 * @param {string} guardianId - The unique identifier of the guardian.
 * @returns {Object} State and operations for the parent dashboard view:
 *   - children: Array of children objects under the guardian.
 *   - selectedChild: Index of the currently selected child.
 *   - setSelectedChild: Setter function for changing selectedChild.
 *   - academicData: Performance metrics, strand ratings, and assignments for the selected child.
 *   - feeData: Current balance, breakdown, due date, and transaction logs.
 *   - documents: Array of downloadable files.
 *   - loading: Boolean indicating if a network request is in progress.
 *   - error: Error message string if a service call fails.
 *   - refreshFeeData: Function to re-fetch fees and transactions after a successful payment.
 */
export const useParentData = (guardianId) => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(0);
  const [academicData, setAcademicData] = useState(null);
  const [feeData, setFeeData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch list of children associated with the guardian
  useEffect(() => {
    const fetchChildren = async () => {
      if (!guardianId) return;
      try {
        const studentsData = await guardianService.getStudents(guardianId);
        if (studentsData?.length > 0) {
          setChildren(studentsData);
        }
        setError(null);
      } catch (err) {
        console.error('API Error fetching children:', err);
        setError('Could not load children data');
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, [guardianId]);

  // Fetch detailed information whenever the selected child or children list updates
  useEffect(() => {
    const fetchStudentData = async () => {
      if (children.length === 0 || !children[selectedChild]) return;
      
      const child = children[selectedChild];
      const studentId = child.id || child.studentId;
      setLoading(true);
      
      try {
        const [performance, feeAccount, transactions, docs] = await Promise.all([
          guardianService.getStudentPerformance(guardianId, studentId),
          feeService.getAccount(studentId),
          feeService.getTransactions(studentId),
          documentService.getDocuments(studentId),
        ]);
        
        if (performance) {
          setAcademicData(performance);
        }
        
        if (feeAccount) {
          setFeeData({ 
            ...feeAccount, 
            paymentHistory: transactions || [] 
          });
        }
        
        if (docs) {
          setDocuments(docs);
        }
        
        setError(null);
      } catch (err) {
        console.error('API Error fetching student detail:', err);
        setError('Could not load full student details');
      } finally {
        setLoading(false);
      }
    };

    if (children.length > 0) {
      fetchStudentData();
    }
  }, [children, selectedChild, guardianId]);

  // Pure function to refresh fee and payment transaction state (used after payment success)
  const refreshFeeData = useCallback(async () => {
    if (children.length === 0 || !children[selectedChild]) return;
    
    const child = children[selectedChild];
    const studentId = child.id || child.studentId;
    
    try {
      const [account, transactions] = await Promise.all([
        feeService.getAccount(studentId),
        feeService.getTransactions(studentId),
      ]);
      
      setFeeData((prevFee) => {
        if (!account) return prevFee;
        return {
          ...account,
          paymentHistory: transactions || []
        };
      });
    } catch (err) {
      console.error('Error refreshing fee details:', err);
    }
  }, [children, selectedChild]);

  return {
    children,
    selectedChild,
    setSelectedChild,
    academicData,
    feeData,
    documents,
    loading,
    error,
    refreshFeeData,
  };
};
