import { useState, useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { AnimatePresence } from 'framer-motion';
import { useTheme } from '../App';
import { fetchProposals, Proposal } from '../api/terra';
import ProposalModal from '../components/governance/ProposalModal';
import GovernanceHero from '../components/governance/GovernanceHero';
import LoadingState from '../components/governance/LoadingState';
import ErrorState from '../components/governance/ErrorState';
import RefreshButton from '../components/governance/RefreshButton';
import ProposalsSection from '../components/governance/ProposalsSection';

const PROPOSALS_PER_PAGE = 10;
const PROPOSALS_CACHE_KEY = 'terra_proposals_cache';
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours

const GovernancePage = () => {
  const { isDark } = useTheme();
  const queryClient = useQueryClient();
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  
  // Check if we have valid cached data
  useEffect(() => {
    const cachedData = localStorage.getItem(PROPOSALS_CACHE_KEY);
    if (cachedData) {
      try {
        const { proposals, timestamp } = JSON.parse(cachedData);
        const isExpired = Date.now() - timestamp > CACHE_EXPIRY_TIME;
        
        if (!isExpired && Array.isArray(proposals) && proposals.length > 0) {
          // If we have fresh cached data, set it as the query data
          queryClient.setQueryData('proposals', proposals);
          setInitialDataLoaded(true);
        }
      } catch (e) {
        console.error('Error parsing cached proposals:', e);
      }
    }
  }, [queryClient]);

  const { data: proposals, isLoading, isError, isFetching } = useQuery(
    'proposals',
    () => fetchProposals(false),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      enabled: !initialDataLoaded, // Only run the query if we don't have valid cached data
      onSuccess: (data) => {
        // Store successful responses in localStorage with a timestamp
        if (data && Array.isArray(data)) {
          localStorage.setItem(
            PROPOSALS_CACHE_KEY,
            JSON.stringify({ proposals: data, timestamp: Date.now() })
          );
        }
      }
    }
  );

  const handleRefresh = useCallback(async () => {
    try {
      await queryClient.invalidateQueries('proposals');
      const freshData = await fetchProposals(true);
      
      // Update localStorage with fresh data
      localStorage.setItem(
        PROPOSALS_CACHE_KEY,
        JSON.stringify({ proposals: freshData, timestamp: Date.now() })
      );
    } catch (error) {
      console.error('Error refreshing proposals:', error);
    }
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

  if (isLoading && !initialDataLoaded) {
    return <LoadingState isDark={isDark} />;
  }

  if (isError) {
    return <ErrorState isDark={isDark} onRetry={handleRefresh} />;
  }

  return (
    <div className="min-h-screen">
      <GovernanceHero proposals={proposalsArray} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold">Proposals</h2>
          <RefreshButton isDark={isDark} isFetching={isFetching} onRefresh={handleRefresh} />
        </div>

        {votingProposals.length > 0 && (
          <ProposalsSection 
            title="Active Voting Proposals"
            proposals={votingProposals}
            allProposals={allVotingProposals}
            currentPage={currentPage}
            proposalsPerPage={PROPOSALS_PER_PAGE}
            isDark={isDark}
            onProposalClick={setSelectedProposal}
            onPageChange={setCurrentPage}
          />
        )}

        <ProposalsSection 
          title="All Proposals"
          proposals={otherProposals}
          allProposals={allOtherProposals}
          currentPage={currentPage}
          proposalsPerPage={PROPOSALS_PER_PAGE}
          isDark={isDark}
          onProposalClick={setSelectedProposal}
          onPageChange={setCurrentPage}
        />
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