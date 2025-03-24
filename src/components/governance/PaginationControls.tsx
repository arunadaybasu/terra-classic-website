import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  isDark: boolean;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  isDark,
  onPageChange
}) => {
  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg transition-colors ${
          isDark
            ? 'bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50'
            : 'bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100/50'
        } disabled:cursor-not-allowed`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages || totalPages === 0}
        className={`p-2 rounded-lg transition-colors ${
          isDark
            ? 'bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50'
            : 'bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100/50'
        } disabled:cursor-not-allowed`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default PaginationControls;
