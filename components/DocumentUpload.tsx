import React, { useCallback, useEffect, useRef } from 'react';
import { Upload, FileText, Trash2, CheckCircle, X } from 'lucide-react';
import { DocumentInfo } from '../types';
import { formatFileSize, getFileIcon, createDocumentFromFile } from '../utils/fileHelpers';

interface DocumentUploadProps {
  documents: DocumentInfo[];
  onDocumentUpload: (documents: DocumentInfo[]) => void;
  onDocumentRemove: (id: string) => void;
  onClearAll: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ 
  documents, 
  onDocumentUpload, 
  onDocumentRemove,
  onClearAll 
}) => {
  const hasAddedSampleDocuments = useRef(false);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newDocuments = files.map(createDocumentFromFile);
    onDocumentUpload(newDocuments);
    event.target.value = '';
  }, [onDocumentUpload]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const newDocuments = files.map(createDocumentFromFile);
    onDocumentUpload(newDocuments);
  }, [onDocumentUpload]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    if (documents.length === 0 && !hasAddedSampleDocuments.current) {
      const sampleDocuments: DocumentInfo[] = [
        {
          id: 'sample-1',
          name: 'Health Insurance Policy.pdf',
          type: 'application/pdf',
          size: 245760,
          uploadedAt: new Date(),
          content: 'Comprehensive health insurance policy covering surgical procedures, hospitalization, and outpatient treatments with specific clauses for age-based coverage and waiting periods.'
        },
        {
          id: 'sample-2',
          name: 'Claims Processing Guidelines.docx',
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          size: 156420,
          uploadedAt: new Date(),
          content: 'Detailed guidelines for processing insurance claims including approval criteria, documentation requirements, pre-authorization procedures, and payout calculations.'
        }
      ];
      onDocumentUpload(sampleDocuments);
      hasAddedSampleDocuments.current = true;
    }
  }, [documents.length, onDocumentUpload]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Documents
        </h2>
        {documents.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
          >
            Clear All
          </button>
        )}
      </div>
      
      <div
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all cursor-pointer group"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <Upload className="h-10 w-10 text-gray-400 dark:text-gray-500 mx-auto mb-3 group-hover:text-blue-500 transition-colors" />
        <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">
          Drop files here or click to browse
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          PDF, Word, and text files supported
        </p>
        <input
          id="file-upload"
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {documents.length > 0 && (
        <div className="mt-6 space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="text-2xl">{getFileIcon(doc.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {doc.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(doc.size)} • {doc.uploadedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDocumentRemove(doc.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Remove document"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;