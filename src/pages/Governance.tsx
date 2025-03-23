import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Vote, Users, Check, X, AlertCircle, Clock, XCircle, TrendingUp, BarChart as ChartBar, FileText, History } from 'lucide-react';
import { useTheme } from '../App';
import { fetchValidators, fetchProposals, ValidatorWithVotingPower, Proposal } from '../api/terra';
import AnimatedCard from '../components/AnimatedCard';

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(num);
};

const formatPercentage = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

const getProposalStatusColor = (status: string, isDark: boolean) => {
  switch (status) {
    case 'PROPOSAL_STATUS_PASSED':
      return isDark ? 'bg-green-500' : 'bg-green-600';
    case 'PROPOSAL_STATUS_REJECTED':
      return isDark ? 'bg-red-500' : 'bg-red-600';
    case 'PROPOSAL_STATUS_VOTING_PERIOD':
      return isDark ? 'bg-blue-500' : 'bg-blue-600';
    case 'PROPOSAL_STATUS_DEPOSIT_PERIOD':
      return isDark ? 'bg-yellow-500' : 'bg-yellow-600';
    default:
      return isDark ? 'bg-gray-500' : 'bg-gray-600';
  }
};

const getProposalStatusText = (status: string) => {
  switch (status) {
    case 'PROPOSAL_STATUS_PASSED':
      return 'Passed';
    case 'PROPOSAL_STATUS_REJECTED':
      return 'Rejected';
    case 'PROPOSAL_STATUS_VOTING_PERIOD':
      return 'Voting';
    case 'PROPOSAL_STATUS_DEPOSIT_PERIOD':
      return 'Deposit';
    default:
      return 'Unknown';
  }
};

const ProposalModal = ({ proposal, onClose }: { proposal: Proposal; onClose: () => void }) => {
  const { isDark } = useTheme();
  
  const totalVotes = parseInt(proposal.final_tally_result.yes) +
    parseInt(proposal.final_tally_result.no) +
    parseInt(proposal.final_tally_result.abstain) +
    parseInt(proposal.final_tally_result.no_with_veto);

  const calculatePercentage = (votes: string) => {
    return totalVotes === 0 ? 0 : (parseInt(votes) / totalVotes) * 100;
  };

  const timeLeft = new Date(proposal.voting_end_time).getTime() - new Date().getTime();
  const daysLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60 * 24)));
  const hoursLeft = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));

  const quorum = 33.4; // Example quorum percentage
  const currentParticipation = (totalVotes / 1000000) * 100; // Example total supply of 1M tokens

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`${
          isDark ? 'bg-gray-900' : 'bg-white'
        } rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto`}
      >
        <div className={`sticky top-0 z-10 ${isDark ? 'bg-gray-900' : 'bg-white'} px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  #{proposal.proposal_id}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                  getProposalStatusColor(proposal.status, isDark)
                }`}>
                  {getProposalStatusText(proposal.status)}
                </span>
              </div>
              <h2 className="text-2xl font-bold">{proposal.content.title}</h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-full ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              } transition-colors`}
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {proposal.status === 'PROPOSAL_STATUS_VOTING_PERIOD' && (
            <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <div className="text-center">
                <div className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{daysLeft}d {hoursLeft}h</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Time Remaining</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>{formatPercentage(currentParticipation)}%</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Participation Rate</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>{quorum}%</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Quorum Required</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{formatNumber(totalVotes)}</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Votes</div>
              </div>
            </div>
          )}

          <div>
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Description
            </h3>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} whitespace-pre-wrap`}>
                {proposal.content.description}
              </p>
            </div>
          </div>

          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Voting Results
            </h3>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} space-y-4`}>
              {['yes', 'no', 'no_with_veto', 'abstain'].map((voteType) => {
                const percentage = calculatePercentage(proposal.final_tally_result[voteType]);
                const votes = parseInt(proposal.final_tally_result[voteType]);
                return (
                  <div key={voteType} className="space-y-2">
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
                          {formatNumber(votes)} votes
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
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <h4 className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Submit Time
              </h4>
              <p className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {format(new Date(proposal.submit_time), 'PPP p')}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <h4 className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Voting End Time
              </h4>
              <p className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {format(new Date(proposal.voting_end_time), 'PPP p')}
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
            <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Deposit
            </h4>
            <div className="space-y-2">
              {proposal.total_deposit.map((deposit, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    {deposit.denom.toUpperCase()}
                  </span>
                  <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {formatNumber(parseInt(deposit.amount))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ProposalCard = ({ proposal, onClick }: { proposal: Proposal; onClick: () => void }) => {
  const { isDark } = useTheme();
  
  return (
    <AnimatedCard>
      <button
        onClick={onClick}
        className={`w-full text-left ${
          isDark ? 'bg-gray-800/50 hover:bg-gray-800/70' : 'bg-white hover:bg-gray-50'
        } rounded-xl p-6 shadow-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02]`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-500/10' : 'bg-blue-100'}`}>
            <Vote className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                #{proposal.proposal_id}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                getProposalStatusColor(proposal.status, isDark)
              }`}>
                {getProposalStatusText(proposal.status)}
              </span>
            </div>
            
            <h3 className="text-xl font-bold mb-2">{proposal.content.title}</h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4 line-clamp-3`}>
              {proposal.content.description}
            </p>

            <div className="flex justify-between text-sm mt-4 pt-4 border-t border-gray-700">
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

const GovernanceHero = ({ proposals }: { proposals: Proposal[] }) => {
  const { isDark } = useTheme();
  
  const stats = {
    total: proposals?.length || 0,
    active: proposals?.filter(p => p.status === 'PROPOSAL_STATUS_VOTING_PERIOD').length || 0,
    passed: proposals?.filter(p => p.status === 'PROPOSAL_STATUS_PASSED').length || 0,
    rejected: proposals?.filter(p => p.status === 'PROPOSAL_STATUS_REJECTED').length || 0
  };

  const latestProposal = proposals?.[0];

  return (
    <div className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-900' : 'bg-gradient-to-br from-blue-100 via-blue-50 to-yellow-50'} py-16`}>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold mb-4"
          >
            Terra Luna Classic Governance
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'} max-w-3xl mx-auto`}
          >
            Shape the future of Terra Luna Classic through decentralized governance
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <div className={`${isDark ? 'bg-gray-800/30' : 'bg-white'} rounded-xl p-6 backdrop-blur-sm`}>
            <div className="flex items-center gap-3 mb-2">
              <FileText className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <h3 className={`text-lg font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Total Proposals</h3>
            </div>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>
          <div className={`${isDark ? 'bg-gray-800/30' : 'bg-white'} rounded-xl p-6 backdrop-blur-sm`}>
            <div className="flex items-center gap-3 mb-2">
              <Vote className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <h3 className={`text-lg font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Active Voting</h3>
            </div>
            <p className="text-3xl font-bold">{stats.active}</p>
          </div>
          <div className={`${isDark ? 'bg-gray-800/30' : 'bg-white'} rounded-xl p-6 backdrop-blur-sm`}>
            <div className="flex items-center gap-3 mb-2">
              <Check className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              <h3 className={`text-lg font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Passed</h3>
            </div>
            <p className="text-3xl font-bold">{stats.passed}</p>
          </div>
          <div className={`${isDark ? 'bg-gray-800/30' : 'bg-white'} rounded-xl p-6 backdrop-blur-sm`}>
            <div className="flex items-center gap-3 mb-2">
              <X className={`w-5 h-5 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
              <h3 className={`text-lg font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Rejected</h3>
            </div>
            <p className="text-3xl font-bold">{stats.rejected}</p>
          </div>
        </motion.div>

        {latestProposal && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className={`${isDark ? 'bg-gray-800/30' : 'bg-white'} rounded-xl p-6 backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Latest Proposal</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                getProposalStatusColor(latestProposal.status, isDark)
              }`}>
                {getProposalStatusText(latestProposal.status)}
              </span>
            </div>
            <h4 className="text-lg font-medium mb-2">{latestProposal.content.title}</h4>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} line-clamp-2 mb-4`}>
              {latestProposal.content.description}
            </p>
            <div className="flex justify-between text-sm">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Submitted {format(new Date(latestProposal.submit_time), 'MMM d, yyyy')}
              </span>
              <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                #{latestProposal.proposal_id}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const GovernancePage = () => {
  const { isDark } = useTheme();
  const { data: proposals } = useQuery('proposals', fetchProposals);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  const votingProposals = proposals?.filter(p => p.status === 'PROPOSAL_STATUS_VOTING_PERIOD') || [];
  const otherProposals = proposals?.filter(p => p.status !== 'PROPOSAL_STATUS_VOTING_PERIOD') || [];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <GovernanceHero proposals={proposals || []} />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {votingProposals.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Active Voting Proposals</h2>
            <div className="grid gap-8 lg:grid-cols-2">
              {votingProposals.map((proposal) => (
                <ProposalCard
                  key={proposal.proposal_id}
                  proposal={proposal}
                  onClick={() => setSelectedProposal(proposal)}
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-8">All Proposals</h2>
          <div className="grid gap-8 lg:grid-cols-2">
            {otherProposals.map((proposal) => (
              <ProposalCard
                key={proposal.proposal_id}
                proposal={proposal}
                onClick={() => setSelectedProposal(proposal)}
              />
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedProposal && (
          <ProposalModal
            proposal={selectedProposal}
            onClose={() => setSelectedProposal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GovernancePage;