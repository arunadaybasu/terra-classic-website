import React from 'react';
import { formatNumber, formatPercentage } from '../../utils/format';

interface ProposalVotingStatsProps {
  isDark: boolean;
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
  };
  participationRate: number;
  govParams: {
    quorum: number;
  };
  totalVotes: number;
}

const ProposalVotingStats: React.FC<ProposalVotingStatsProps> = ({
  isDark,
  timeLeft,
  participationRate,
  govParams,
  totalVotes
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
      <div className="text-center">
        <div className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
        </div>
        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Time Remaining</div>
      </div>
      <div className="text-center">
        <div className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
          {formatPercentage(participationRate)}
        </div>
        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Participation Rate</div>
      </div>
      <div className="text-center">
        <div className={`text-2xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
          {formatPercentage(govParams.quorum * 100)}
        </div>
        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Quorum Required</div>
      </div>
      <div className="text-center">
        <div className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
          {formatNumber(totalVotes)} LUNC
        </div>
        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Votes</div>
      </div>
    </div>
  );
};

export default ProposalVotingStats;
