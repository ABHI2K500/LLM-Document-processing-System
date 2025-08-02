import { useState, useCallback } from 'react';
import { DocumentInfo } from '../types';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);

  const addDocuments = useCallback((newDocuments: DocumentInfo[]) => {
    setDocuments(prev => [...prev, ...newDocuments]);
  }, []);

  const removeDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  }, []);

  const clearAllDocuments = useCallback(() => {
    setDocuments([]);
  }, []);

  return {
    documents,
    addDocuments,
    removeDocument,
    clearAllDocuments
  };
};