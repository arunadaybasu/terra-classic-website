import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  isDark: boolean;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ isDark, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <AlertCircle className={`w-12 h-12 mb-4 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
      <p className={`text-lg mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        Failed to load proposals. Please try again.
      </p>
      <button
        onClick={onRetry}
        className={`px-4 py-2 rounded-lg ${
          isDark ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'
        } text-white transition-colors`}
      >
        Retry
      </button>
    </div>
  );
};

export default ErrorState;
