import React from 'react';
import { formatNumber, formatPercentage } from '../../utils/format';

interface VotingProgressBarProps {
  isDark: boolean;
  voteType: string;
  votes: number;
  percentage: number;
}

const VotingProgressBar: React.FC<VotingProgressBarProps> = ({
  isDark,
  voteType,
  votes,
  percentage
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${
            voteType === 'yes' ? 'bg-green-500' :
            voteType === 'no' ? 'bg-red-500' :
            voteType === 'no_with_veto' ? 'bg-yellow-500' :
            'bg-gray-500'
          }`}></span>
          <span className={`capitalize ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {voteType.replace(/_/g, ' ')}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {formatNumber(votes)} LUNC
          </span>
          <span className={`w-20 text-right font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {formatPercentage(percentage)}%
          </span>
        </div>
      </div>
      <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <div
          className={`h-2 rounded-full ${
            voteType === 'yes' ? 'bg-green-500' :
            voteType === 'no' ? 'bg-red-500' :
            voteType === 'no_with_veto' ? 'bg-yellow-500' :
            'bg-gray-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default VotingProgressBar;
