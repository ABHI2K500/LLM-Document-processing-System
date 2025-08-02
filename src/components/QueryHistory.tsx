import React from 'react';
import { CheckCircle, XCircle, Clock, History } from 'lucide-react';
import { QueryHistory as QueryHistoryType } from '../types';

interface QueryHistoryProps {
  history: QueryHistoryType[];
  onSelect: (result: any) => void;
}

const QueryHistory: React.FC<QueryHistoryProps> = ({ history, onSelect }) => {
  const getStatusIcon = (decision: string) => {
    switch (decision) {
      case 'approved':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-3 w-3 text-red-500" />;
      default:
        return <Clock className="h-3 w-3 text-yellow-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <History className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Queries
        </h3>
      </div>
      
      <div className="space-y-3">
        {history.slice(0, 5).map((entry) => (
          <div 
            key={entry.id}
            className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer group"
            onClick={() => onSelect(entry.result)}
          >
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {entry.query}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {entry.timestamp.toLocaleTimeString()}
              </span>
              <div className="flex items-center space-x-1">
                {getStatusIcon(entry.result.decision)}
                <span className="text-xs capitalize text-gray-600 dark:text-gray-300">
                  {entry.result.decision}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QueryHistory;