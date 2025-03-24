import React from 'react';
import { formatPercentage } from '../../utils/format';

interface ProposalVotingStatusProps {
  isDark: boolean;
  participationRate: number;
  govParams: {
    quorum: number;
    threshold: number;
    vetoThreshold: number;
  };
  finalTallyResult: {
    quorum_reached?: boolean;
    threshold_reached?: boolean;
    veto_threshold_reached?: boolean;
    yes: string;
    no: string;
    no_with_veto: string;
  };
  calculateNonAbstainPercentage: (votes: string) => number;
}

const ProposalVotingStatus: React.FC<ProposalVotingStatusProps> = ({
  isDark,
  participationRate,
  govParams,
  finalTallyResult,
  calculateNonAbstainPercentage
}) => {
  // Determine voting status for display
  const getVotingStatus = () => {
    if (!finalTallyResult.quorum_reached) {
      return {
        label: 'Quorum Not Reached',
        color: isDark ? 'text-red-400' : 'text-red-600'
      };
    }
    if (finalTallyResult.veto_threshold_reached) {
      return {
        label: 'Veto Threshold Exceeded',
        color: isDark ? 'text-yellow-400' : 'text-yellow-600'
      };
    }
    if (finalTallyResult.threshold_reached) {
      return {
        label: 'Passing Threshold Met',
        color: isDark ? 'text-green-400' : 'text-green-600'
      };
    }
    return {
      label: 'Below Passing Threshold',
      color: isDark ? 'text-red-400' : 'text-red-600'
    };
  };

  const votingStatus = getVotingStatus();

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Current Status</span>
        <span className={`font-medium ${votingStatus.color}`}>
          {votingStatus.label}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Quorum</span>
            <span className={finalTallyResult.quorum_reached ? 'text-green-500' : 'text-red-500'}>
              {formatPercentage(participationRate)}% / {formatPercentage(govParams.quorum * 100)}%
            </span>
          </div>
          <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div
              className={`h-2 rounded-full ${finalTallyResult.quorum_reached ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(100, (participationRate / (govParams.quorum * 100)) * 100)}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Pass Threshold</span>
            <span className={finalTallyResult.threshold_reached ? 'text-green-500' : 'text-red-500'}>
              {formatPercentage(calculateNonAbstainPercentage(finalTallyResult.yes))}% / {formatPercentage(govParams.threshold * 100)}%
            </span>
          </div>
          <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div
              className={`h-2 rounded-full ${finalTallyResult.threshold_reached ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(100, (calculateNonAbstainPercentage(finalTallyResult.yes) / (govParams.threshold * 100)) * 100)}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Veto Threshold</span>
            <span className={!finalTallyResult.veto_threshold_reached ? 'text-green-500' : 'text-red-500'}>
              {formatPercentage(calculateNonAbstainPercentage(finalTallyResult.no_with_veto))}% / {formatPercentage(govParams.vetoThreshold * 100)}%
            </span>
          </div>
          <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div
              className={`h-2 rounded-full ${!finalTallyResult.veto_threshold_reached ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(100, (calculateNonAbstainPercentage(finalTallyResult.no_with_veto) / (govParams.vetoThreshold * 100)) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalVotingStatus;
