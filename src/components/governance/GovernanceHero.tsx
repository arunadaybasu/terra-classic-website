import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Vote, Check, X } from 'lucide-react';
import { useTheme } from '../../App';
import { Proposal } from '../../api/terra';
import { format } from 'date-fns';
import { getProposalStatusColor, getProposalStatusText } from '../../utils/proposals';

interface GovernanceHeroProps {
  proposals: Proposal[];
}

const GovernanceHero: React.FC<GovernanceHeroProps> = ({ proposals = [] }) => {
  const { isDark } = useTheme();
  
  const stats = {
    total: proposals?.length || 0,
    active: proposals?.filter(p => p.status === 'PROPOSAL_STATUS_VOTING_PERIOD').length || 0,
    passed: proposals?.filter(p => p.status === 'PROPOSAL_STATUS_PASSED').length || 0,
    rejected: proposals?.filter(p => p.status === 'PROPOSAL_STATUS_REJECTED').length || 0
  };

  const latestProposal = proposals?.[0];

  return (
    <div className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-900' : 'bg-gradient-to-br from-blue-100 via-blue-50 to-yellow-50'} pt-24 pb-8 sm:py-16`}>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
          >
            Terra Luna Classic Governance
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-base sm:text-lg md:text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'} max-w-3xl mx-auto px-4`}
          >
            Shape the future of Terra Luna Classic through decentralized governance
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 sm:mb-12"
        >
          <div className={`${isDark ? 'bg-gray-800/30' : 'bg-white'} rounded-xl p-4 sm:p-6 backdrop-blur-sm`}>
            <div className="flex items-center gap-3 mb-2">
              <FileText className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <h3 className={`text-sm sm:text-base font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                Total Proposals
              </h3>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{stats.total}</p>
          </div>
          <div className={`${isDark ? 'bg-gray-800/30' : 'bg-white'} rounded-xl p-4 sm:p-6 backdrop-blur-sm`}>
            <div className="flex items-center gap-3 mb-2">
              <Vote className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <h3 className={`text-sm sm:text-base font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                Active Voting
              </h3>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{stats.active}</p>
          </div>
          <div className={`${isDark ? 'bg-gray-800/30' : 'bg-white'} rounded-xl p-4 sm:p-6 backdrop-blur-sm`}>
            <div className="flex items-center gap-3 mb-2">
              <Check className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              <h3 className={`text-sm sm:text-base font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                Passed
              </h3>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{stats.passed}</p>
          </div>
          <div className={`${isDark ? 'bg-gray-800/30' : 'bg-white'} rounded-xl p-4 sm:p-6 backdrop-blur-sm`}>
            <div className="flex items-center gap-3 mb-2">
              <X className={`w-5 h-5 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
              <h3 className={`text-sm sm:text-base font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                Rejected
              </h3>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{stats.rejected}</p>
          </div>
        </motion.div>

        {latestProposal && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className={`${isDark ? 'bg-gray-800/30' : 'bg-white'} rounded-xl p-4 sm:p-6 backdrop-blur-sm`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <h3 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                Latest Proposal
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                getProposalStatusColor(latestProposal.status, isDark)
              }`}>
                {getProposalStatusText(latestProposal.status)}
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-medium mb-2 line-clamp-2">
              {latestProposal.content?.title || 'No title available'}
            </h4>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} line-clamp-2 mb-4 text-sm sm:text-base`}>
              {latestProposal.content?.description || 'No description available'}
            </p>
            <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm gap-2">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Submitted {format(new Date(latestProposal.submit_time), 'MMM d, yyyy')}
              </span>
              <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                #{latestProposal.id}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GovernanceHero;