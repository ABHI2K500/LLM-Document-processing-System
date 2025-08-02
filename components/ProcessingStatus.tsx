import React from 'react';
import { Brain, Search, FileText, Zap } from 'lucide-react';

interface ProcessingStatusProps {
  query: string;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ query }) => {
  const steps = [
    { icon: Search, label: 'Analyzing Query', completed: true },
    { icon: FileText, label: 'Searching Documents', completed: true },
    { icon: Brain, label: 'Processing with AI', completed: false },
    { icon: Zap, label: 'Generating Response', completed: false }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-pulse" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Processing Your Query
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          {query}
        </p>
      </div>
      
      <div className="max-w-md mx-auto">
        <div className="flex justify-between mb-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? 'bg-blue-600 text-white' 
                    : index === 2 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 animate-pulse' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="flex space-x-2">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`flex-1 h-2 rounded ${
                step.completed 
                  ? 'bg-blue-600' 
                  : index === 2 
                    ? 'bg-blue-400 animate-pulse' 
                    : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;