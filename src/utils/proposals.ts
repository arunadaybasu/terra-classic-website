export const getProposalStatusColor = (status: string, isDark: boolean) => {
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

export const getProposalStatusText = (status: string) => {
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