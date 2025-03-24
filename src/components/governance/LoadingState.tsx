import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  isDark: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({ isDark }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className={`w-12 h-12 animate-spin mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
      <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        Loading proposals...
      </p>
    </div>
  );
};

export default LoadingState;
