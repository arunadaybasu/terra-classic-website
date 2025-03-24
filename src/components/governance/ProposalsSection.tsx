import React from 'react';
import { Proposal } from '../../api/terra';
import ProposalCard from './ProposalCard';
import PaginationControls from './PaginationControls';

interface ProposalsSectionProps {
  title: string;
  proposals: Proposal[];
  allProposals: Proposal[];
  currentPage: number;
  proposalsPerPage: number;
  isDark: boolean;
  onProposalClick: (proposal: Proposal) => void;
  onPageChange: (page: number) => void;
}

const ProposalsSection: React.FC<ProposalsSectionProps> = ({
  title,
  proposals,
  allProposals,
  currentPage,
  proposalsPerPage,
  isDark,
  onProposalClick,
  onPageChange
}) => {
  return (
    <div className="mb-8 sm:mb-16">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {proposals.map((proposal) => (
          <ProposalCard
            key={proposal.proposal_id}
            proposal={proposal}
            onClick={() => onProposalClick(proposal)}
          />
        ))}
      </div>
      {allProposals.length > proposalsPerPage && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={Math.ceil(allProposals.length / proposalsPerPage)}
          isDark={isDark}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default ProposalsSection;
