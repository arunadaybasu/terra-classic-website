import React from 'react';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import { Shield, Vote, Users, Check, X, AlertCircle, Clock } from 'lucide-react';
import { useTheme } from '../App';
import { fetchValidators, fetchProposals, ValidatorWithVotingPower, Proposal } from '../api/terra';

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

const ValidatorCard = ({ validator }: { validator: ValidatorWithVotingPower }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`${
      isDark ? 'bg-gray-800/50' : 'bg-white'
    } rounded-xl p-6 shadow-lg backdrop-blur-sm transition-transform duration-300 hover:scale-[1.02]`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-500/10' : 'bg-blue-100'}`}>
          <Shield className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">{validator.description.moniker}</h3>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4`}>
            {validator.description.details || 'No description provided'}
          </p>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Voting Power
                </span>
                <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  {formatPercentage(validator.voting_percentage)}%
                </span>
              </div>
              <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className={`h-2 rounded-full ${isDark ? 'bg-blue-500' : 'bg-blue-600'}`}
                  style={{ width: `${validator.voting_percentage}%` }}
                />
              </div>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Commission</span>
              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                {formatPercentage(parseFloat(validator.commission.commission_rates.rate) * 100)}%
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Tokens</span>
              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                {formatNumber(parseInt(validator.tokens) / 1000000)} LUNC
              </span>
            </div>
          </div>

          {validator.description.website && (
            <a
              href={validator.description.website}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-4 inline-flex items-center text-sm ${
                isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              Visit Website
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const ProposalCard = ({ proposal }: { proposal: Proposal }) => {
  const { isDark } = useTheme();
  
  const totalVotes = parseInt(proposal.final_tally_result.yes) +
    parseInt(proposal.final_tally_result.no) +
    parseInt(proposal.final_tally_result.abstain) +
    parseInt(proposal.final_tally_result.no_with_veto);

  const calculatePercentage = (votes: string) => {
    return totalVotes === 0 ? 0 : (parseInt(votes) / totalVotes) * 100;
  };

  return (
    <div className={`${
      isDark ? 'bg-gray-800/50' : 'bg-white'
    } rounded-xl p-6 shadow-lg backdrop-blur-sm`}>
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

          {proposal.status === 'PROPOSAL_STATUS_VOTING_PERIOD' && (
            <div className="space-y-3 mb-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={`flex items-center ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    <Check className="w-4 h-4 mr-1" /> Yes
                  </span>
                  <span>{formatPercentage(calculatePercentage(proposal.final_tally_result.yes))}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`flex items-center ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                    <X className="w-4 h-4 mr-1" /> No
                  </span>
                  <span>{formatPercentage(calculatePercentage(proposal.final_tally_result.no))}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`flex items-center ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                    <AlertCircle className="w-4 h-4 mr-1" /> No with Veto
                  </span>
                  <span>{formatPercentage(calculatePercentage(proposal.final_tally_result.no_with_veto))}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`flex items-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Clock className="w-4 h-4 mr-1" /> Abstain
                  </span>
                  <span>{formatPercentage(calculatePercentage(proposal.final_tally_result.abstain))}%</span>
                </div>
              </div>
            </div>
          )}

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
    </div>
  );
};

const Governance = () => {
  const { isDark } = useTheme();
  const { data: validators } = useQuery('validators', fetchValidators);
  const { data: proposals } = useQuery('proposals', fetchProposals);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Governance</h2>
          <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto`}>
            Participate in the decentralized governance of Terra Luna Classic
          </p>
        </div>

        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">Top Validators</h3>
            <div className={`flex items-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <Users className="w-5 h-5 mr-2" />
              <span>Total Validators: {validators?.length || 0}</span>
            </div>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {validators?.slice(0, 8).map((validator) => (
              <ValidatorCard key={validator.operator_address} validator={validator} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">Active Proposals</h3>
            <div className={`flex items-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <Vote className="w-5 h-5 mr-2" />
              <span>Total Proposals: {proposals?.length || 0}</span>
            </div>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {proposals?.slice(0, 6).map((proposal) => (
              <ProposalCard key={proposal.proposal_id} proposal={proposal} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Governance;