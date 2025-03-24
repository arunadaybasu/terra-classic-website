import React from 'react';
import { format } from 'date-fns';
import { formatNumber } from '../../utils/format';
import { Proposal } from '../../api/terra';

interface ProposalDetailsProps {
  isDark: boolean;
  proposal: Proposal;
  convertToLUNC: (amount: string | number) => number;
}

const ProposalDetails: React.FC<ProposalDetailsProps> = ({
  isDark,
  proposal,
  convertToLUNC
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className={`text-md font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Description</h4>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} whitespace-pre-wrap`}>
          {proposal.content?.description || 'No description available'}
        </p>
      </div>
      <div>
        <h4 className={`text-md font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Submit Time</h4>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {format(new Date(proposal.submit_time), 'PPPppp')}
        </p>
      </div>
      <div>
        <h4 className={`text-md font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Deposit End Time</h4>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {format(new Date(proposal.deposit_end_time), 'PPPppp')}
        </p>
      </div>
      <div>
        <h4 className={`text-md font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Voting Start Time</h4>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {format(new Date(proposal.voting_start_time), 'PPPppp')}
        </p>
      </div>
      <div>
        <h4 className={`text-md font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Voting End Time</h4>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {format(new Date(proposal.voting_end_time), 'PPPppp')}
        </p>
      </div>
      <div>
        <h4 className={`text-md font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Total Deposit</h4>
        <div className="space-y-2">
          {proposal.total_deposit.map((deposit, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                {deposit.denom.replace('uluna', 'LUNC')}
              </span>
              <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {formatNumber(convertToLUNC(parseInt(deposit.amount)))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProposalDetails;
