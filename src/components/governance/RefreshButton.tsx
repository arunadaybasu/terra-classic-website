import React from 'react';
import { RefreshCw } from 'lucide-react';

interface RefreshButtonProps {
  isDark: boolean;
  isFetching: boolean;
  onRefresh: () => void;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({
  isDark,
  isFetching,
  onRefresh
}) => {
  return (
    <button
      onClick={onRefresh}
      disabled={isFetching}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
        isDark 
          ? 'bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50' 
          : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50'
      } text-white transition-colors disabled:cursor-not-allowed`}
    >
      <RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
      {isFetching ? 'Refreshing...' : 'Refresh Proposals'}
    </button>
  );
};

export default RefreshButton;
