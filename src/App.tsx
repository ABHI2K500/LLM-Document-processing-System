import React, { useState } from 'react';
import { Brain, FileText } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import { useDocuments } from './hooks/useDocuments';
import DocumentUpload from './components/DocumentUpload';
import QueryProcessor from './components/QueryProcessor';
import ResultsDisplay from './components/ResultsDisplay';
import QueryHistory from './components/QueryHistory';
import ThemeToggle from './components/ThemeToggle';
import ProcessingStatus from './components/ProcessingStatus';
import { ProcessingResult, QueryHistory as QueryHistoryType } from './types';
import { mockProcessQuery } from './services/mockLLMService';

function AppContent() {
  const { documents, addDocuments, removeDocument, clearAllDocuments } = useDocuments();
  const [currentQuery, setCurrentQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ProcessingResult | null>(null);
  const [queryHistory, setQueryHistory] = useState<QueryHistoryType[]>([]);

  const handleQuerySubmit = async (query: string) => {
    if (!query.trim() || documents.length === 0) return;

    setCurrentQuery(query);
    setIsProcessing(true);
    setResults(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = await mockProcessQuery(query, documents);
      setResults(result);
      
      const historyEntry: QueryHistoryType = {
        id: Date.now().toString(),
        query,
        timestamp: new Date(),
        result
      };
      setQueryHistory(prev => [historyEntry, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error('Processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleHistorySelect = (result: ProcessingResult) => {
    setResults(result);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Document Intelligence
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Smart document analysis powered by AI
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <FileText className="h-4 w-4" />
                <span>{documents.length} documents</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <DocumentUpload 
              documents={documents}
              onDocumentUpload={addDocuments}
              onDocumentRemove={removeDocument}
              onClearAll={clearAllDocuments}
            />
            
            <QueryProcessor
              onQuerySubmit={handleQuerySubmit}
              isProcessing={isProcessing}
              disabled={documents.length === 0}
            />

            {queryHistory.length > 0 && (
              <QueryHistory 
                history={queryHistory}
                onSelect={handleHistorySelect}
              />
            )}
          </div>

          <div className="lg:col-span-2">
            {isProcessing && (
              <ProcessingStatus query={currentQuery} />
            )}

            {results && !isProcessing && (
              <ResultsDisplay results={results} query={currentQuery} />
            )}

            {!isProcessing && !results && documents.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Ready to Analyze
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  Your documents are loaded and ready. Ask me anything about your policies, 
                  contracts, or any other documents you've uploaded.
                </p>
              </div>
            )}

            {documents.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Upload Your Documents
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  Get started by uploading your policy documents, contracts, or any files 
                  you'd like to analyze. I'll help you find answers quickly.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;