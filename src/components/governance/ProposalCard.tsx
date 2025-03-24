import React from 'react';
import { Vote } from 'lucide-react';
import { format } from 'date-fns';
import { useTheme } from '../../App';
import { Proposal } from '../../api/terra';
import AnimatedCard from '../AnimatedCard';
import { getProposalStatusColor, getProposalStatusText } from '../../utils/proposals';

interface ProposalCardProps {
  proposal: Proposal;
  onClick: () => void;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, onClick }) => {
  const { isDark } = useTheme();
  
  if (!proposal) return null;

  return (
    <AnimatedCard>
      <button
        onClick={onClick}
        className={`w-full text-left ${
          isDark ? 'bg-gray-800/50 hover:bg-gray-800/70' : 'bg-white hover:bg-gray-50'
        } rounded-xl p-4 sm:p-6 shadow-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02]`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className={`p-2 sm:p-3 rounded-lg ${isDark ? 'bg-blue-500/10' : 'bg-blue-100'} self-start`}>
            <Vote className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                #{proposal.id}
              </span>
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium text-white ${
                getProposalStatusColor(proposal.status, isDark)
              }`}>
                {getProposalStatusText(proposal.status)}
              </span>
            </div>
            
            <h3 className="text-lg sm:text-xl font-bold mb-2 line-clamp-2">
              {proposal.content?.title || 'No title available'}
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4 line-clamp-3`}>
              {proposal.content?.description || 'No description available'}
            </p>

            <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm mt-4 pt-4 border-t border-gray-700 gap-2">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Submitted: {format(new Date(proposal.submit_time), 'MMM d, yyyy')}
              </span>
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Ends: {format(new Date(proposal.voting_end_time), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
        </div>
      </button>
    </AnimatedCard>
  );
};

export default ProposalCard;