import React, { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../App';
import { fetchProposals, Proposal } from '../api/terra';
import ProposalModal from '../components/governance/ProposalModal';
import ProposalCard from '../components/governance/ProposalCard';
import GovernanceHero from '../components/governance/GovernanceHero';

const PROPOSALS_PER_PAGE = 10;

const GovernancePage = () => {
  const { isDark } = useTheme();
  const queryClient = useQueryClient();
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: proposals, isLoading, isError, isFetching } = useQuery(
    'proposals',
    () => fetchProposals(false),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      initialData: () => {
        // Try to get data from localStorage first
        const PROPOSALS_CACHE_KEY = 'terra_proposals_cache';
        const cached = localStorage.getItem(PROPOSALS_CACHE_KEY);
        if (cached) {
          try {
            const { proposals } = JSON.parse(cached);
            return proposals;
          } catch (e) {
            return undefined;
          }
        }
        return undefined;
      }
    }
  );

  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries('proposals');
    await fetchProposals(true);
  }, [queryClient]);

  // Ensure proposals is an array before filtering
  const proposalsArray = Array.isArray(proposals) ? proposals : [];
  
  // Split proposals into voting and other
  const allVotingProposals = proposalsArray.filter(p => p.status === 'PROPOSAL_STATUS_VOTING_PERIOD');
  const allOtherProposals = proposalsArray.filter(p => p.status !== 'PROPOSAL_STATUS_VOTING_PERIOD');

  // Calculate pagination
  const startIndex = (currentPage - 1) * PROPOSALS_PER_PAGE;
  const endIndex = startIndex + PROPOSALS_PER_PAGE;
  
  const votingProposals = allVotingProposals.slice(startIndex, endIndex);
  const otherProposals = allOtherProposals.slice(startIndex, endIndex);

  const totalPages = Math.ceil(Math.max(allVotingProposals.length, allOtherProposals.length) / PROPOSALS_PER_PAGE);

  const PaginationControls = () => (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg transition-colors ${
          isDark
            ? 'bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50'
            : 'bg-white hover:bg-gray-100 disabled:bg-gray-100'
        } disabled:cursor-not-allowed`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg transition-colors ${
          isDark
            ? 'bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50'
            : 'bg-white hover:bg-gray-100 disabled:bg-gray-100'
        } disabled:cursor-not-allowed`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );

  if (isLoading && !proposals) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Loading proposals...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <p className={`text-lg ${isDark ? 'text-red-400' : 'text-red-600'} mb-4`}>
            Failed to load proposals
          </p>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
            Please try again later or contact support if the problem persists.
          </p>
          <button
            onClick={handleRefresh}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
              isDark 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white transition-colors`}
          >
            <RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <GovernanceHero proposals={proposalsArray} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold">Proposals</h2>
          <button
            onClick={handleRefresh}
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
        </div>

        {votingProposals.length > 0 && (
          <div className="mb-8 sm:mb-16">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Active Voting Proposals</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {votingProposals.map((proposal) => (
                <ProposalCard
                  key={proposal.proposal_id}
                  proposal={proposal}
                  onClick={() => setSelectedProposal(proposal)}
                />
              ))}
            </div>
            {allVotingProposals.length > PROPOSALS_PER_PAGE && <PaginationControls />}
          </div>
        )}

        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-6">All Proposals</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {otherProposals.map((proposal) => (
              <ProposalCard
                key={proposal.proposal_id}
                proposal={proposal}
                onClick={() => setSelectedProposal(proposal)}
              />
            ))}
          </div>
          {allOtherProposals.length > PROPOSALS_PER_PAGE && <PaginationControls />}
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