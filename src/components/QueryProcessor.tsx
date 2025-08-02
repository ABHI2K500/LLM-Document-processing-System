import React, { useState } from 'react';
import { Search, Send, Loader2, Lightbulb } from 'lucide-react';

interface QueryProcessorProps {
  onQuerySubmit: (query: string) => void;
  isProcessing: boolean;
  disabled?: boolean;
}

const QueryProcessor: React.FC<QueryProcessorProps> = ({ 
  onQuerySubmit, 
  isProcessing, 
  disabled = false 
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isProcessing && !disabled) {
      onQuerySubmit(query.trim());
      setQuery('');
    }
  };

  const sampleQueries = [
    "46-year-old male, knee surgery in Pune, 3-month-old insurance policy",
    "Maternity coverage for 28F, delivery in Mumbai, 2-year policy",
    "Cardiac surgery claim, 55M, Chennai hospital, premium policy"
  ];

  const handleSampleClick = (sample: string) => {
    if (!disabled && !isProcessing) {
      setQuery(sample);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Ask a Question
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask me anything about your documents..."
            rows={3}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            disabled={disabled || isProcessing}
          />
          <button
            type="submit"
            disabled={!query.trim() || isProcessing || disabled}
            className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>

        {disabled && (
          <div className="flex items-center space-x-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Upload some documents first to get started
            </p>
          </div>
        )}
      </form>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Try these examples
        </h3>
        <div className="space-y-2">
          {sampleQueries.map((example, index) => (
            <button
              key={index}
              onClick={() => handleSampleClick(example)}
              disabled={disabled || isProcessing}
              className="w-full text-left p-3 text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QueryProcessor;