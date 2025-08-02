import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, FileText, BarChart3, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { ProcessingResult } from '../types';

interface ResultsDisplayProps {
  results: ProcessingResult;
  query: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, query }) => {
  const [showJson, setShowJson] = useState(false);
  const [showAllClauses, setShowAllClauses] = useState(false);

  const getDecisionIcon = () => {
    switch (results.decision) {
      case 'approved':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-400" />;
    }
  };

  const getDecisionStyles = () => {
    switch (results.decision) {
      case 'approved':
        return 'text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800';
      case 'rejected':
        return 'text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800';
      case 'pending':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-900/20 dark:border-gray-700';
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const displayedClauses = showAllClauses 
    ? results.justification.clauseMapping 
    : results.justification.clauseMapping.slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Analysis Results
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <BarChart3 className="h-4 w-4" />
              <span>{results.confidence}% confidence</span>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your Question:
            </p>
            <p className="text-gray-900 dark:text-white">{query}</p>
          </div>

          <div className={`flex items-center justify-between p-4 rounded-lg border ${getDecisionStyles()}`}>
            <div className="flex items-center space-x-3">
              {getDecisionIcon()}
              <div>
                <p className="font-semibold capitalize text-lg">
                  {results.decision}
                </p>
                {results.amount && (
                  <p className="text-2xl font-bold">
                    {results.currency || '₹'}{results.amount.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-75">Processed in</p>
              <p className="font-medium">{results.processingTime}ms</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
            Key Information Extracted
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(results.queryStructure).map(([key, value]) => {
              if (key === 'rawQuery' || !value) return null;
              return (
                <div key={key} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
            Decision Explanation
          </h3>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
            <p className="text-gray-700 dark:text-gray-300">
              {results.justification.summary}
            </p>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              How I Reached This Decision
            </h4>
            <ol className="space-y-3">
              {results.justification.reasoningSteps.map((step, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Supporting Evidence from Documents
              </h4>
              {results.justification.clauseMapping.length > 2 && (
                <button
                  onClick={() => setShowAllClauses(!showAllClauses)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-1"
                >
                  <span>{showAllClauses ? 'Show Less' : 'Show All'}</span>
                  {showAllClauses ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              {displayedClauses.map((clause) => (
                <div key={clause.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {clause.documentSource}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        • {clause.section}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.round(clause.relevanceScore * 100)}% match
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        clause.relevanceScore > 0.8 ? 'bg-green-400' :
                        clause.relevanceScore > 0.6 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}></div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border-l-4 border-blue-400">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {clause.text}
                    </p>
                  </div>
                  {clause.pageNumber && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Page {clause.pageNumber}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-semibold text-gray-900 dark:text-white">
            Raw Response Data
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => copyToClipboard(JSON.stringify(results, null, 2))}
              className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm transition-colors"
            >
              <Copy className="h-4 w-4" />
              <span>Copy</span>
            </button>
            <button
              onClick={() => setShowJson(!showJson)}
              className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm transition-colors"
            >
              {showJson ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span>{showJson ? 'Hide' : 'Show'} JSON</span>
            </button>
          </div>
        </div>
        
        {showJson && (
          <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
            {JSON.stringify(results, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;