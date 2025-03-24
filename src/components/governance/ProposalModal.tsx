import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';
import { useTheme } from '../../App';
import { Proposal, fetchTotalStaked, fetchGovParams } from '../../api/terra';
import { formatNumber } from '../../utils/format';
import axios from 'axios';
import ProposalVotingStats from './ProposalVotingStats';
import ProposalVotingStatus from './ProposalVotingStatus';
import VotingProgressBar from './VotingProgressBar';
import ProposalDetails from './ProposalDetails';

interface ProposalModalProps {
  proposal: Proposal;
  onClose: () => void;
}

const ProposalModal: React.FC<ProposalModalProps> = ({ proposal, onClose }) => {
  const { isDark } = useTheme();
  const [totalStaked, setTotalStaked] = useState<number>(0);
  const [proposalData, setProposalData] = useState(proposal);
  const [govParams, setGovParams] = useState<{
    quorum: number;
    threshold: number;
    vetoThreshold: number;
  }>({
    quorum: 0.334, // Default values
    threshold: 0.5,
    vetoThreshold: 0.334
  });
  const [timeLeft, setTimeLeft] = useState<{days: number; hours: number; minutes: number}>({
    days: 0,
    hours: 0,
    minutes: 0
  });

  useEffect(() => {
    const updateProposalData = async () => {
      try {
        // Fetch tally data directly from the API
        const [params, totalStakedAmount, tallyResponse] = await Promise.all([
          fetchGovParams(true),
          fetchTotalStaked(),
          axios.get(`https://terra-classic-lcd.publicnode.com/cosmos/gov/v1beta1/proposals/${proposal.id}/tally`)
        ]);

        const tallyData = tallyResponse.data.tally;
        console.log('Tally API response for proposal #' + proposal.id + ':', tallyData);

        setTotalStaked(totalStakedAmount);
        setGovParams({
          quorum: parseFloat(params.tally_params.quorum),
          threshold: parseFloat(params.tally_params.threshold),
          vetoThreshold: parseFloat(params.tally_params.veto_threshold)
        });

        // Always use the tally data from the API when available
        // It's more reliable than the tally stored in the proposal object
        const yes = BigInt(tallyData.yes || '0');
        const no = BigInt(tallyData.no || '0');
        const abstain = BigInt(tallyData.abstain || '0');
        const noWithVeto = BigInt(tallyData.no_with_veto || '0');
        const totalVoted = yes + no + abstain + noWithVeto;

        // Calculate participation rate against total staked
        const participation = Number(totalVoted) / totalStakedAmount;
        
        // Calculate the threshold against non-abstain votes
        const totalNonAbstain = Number(yes + no + noWithVeto);
        const yesRatio = totalNonAbstain > 0 ? Number(yes) / totalNonAbstain : 0;
        const vetoRatio = totalNonAbstain > 0 ? Number(noWithVeto) / totalNonAbstain : 0;

        // Determine if thresholds are met based on the current values and proposal status
        const quorumReached = proposal.status === 'PROPOSAL_STATUS_PASSED' || 
                              (participation >= parseFloat(params.tally_params.quorum));
        
        const thresholdReached = proposal.status === 'PROPOSAL_STATUS_PASSED' || 
                                (yesRatio > parseFloat(params.tally_params.threshold));
        
        const vetoThresholdReached = proposal.status === 'PROPOSAL_STATUS_REJECTED' && 
                                    (vetoRatio > parseFloat(params.tally_params.veto_threshold));

        // Update proposal data with the API tally results
        setProposalData({
          ...proposal,
          final_tally_result: {
            yes: tallyData.yes || '0',
            no: tallyData.no || '0',
            abstain: tallyData.abstain || '0',
            no_with_veto: tallyData.no_with_veto || '0',
            total_voting_power: totalStakedAmount.toString(),
            quorum_reached: quorumReached,
            threshold_reached: thresholdReached,
            veto_threshold_reached: vetoThresholdReached
          }
        });

      } catch (error) {
        console.error('Error fetching tally data:', error);
        
        // In case of error, use the proposal's final tally if available,
        // otherwise use a fallback with zeros
        if (proposal.final_tally_result) {
          setProposalData(proposal);
        } else {
          setProposalData({
            ...proposal,
            final_tally_result: {
              yes: '0',
              no: '0',
              abstain: '0',
              no_with_veto: '0',
              total_voting_power: totalStaked.toString(),
              quorum_reached: false,
              threshold_reached: false,
              veto_threshold_reached: false
            }
          });
        }
      }
    };

    updateProposalData();
  }, [proposal]);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(proposal.voting_end_time).getTime();
      const diff = Math.max(0, end - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [proposal.voting_end_time]);

  // Helper function to convert uluna to LUNC (divide by 1,000,000)
  const convertToLUNC = (amount: string | number): number => {
    const value = typeof amount === 'string' ? parseInt(amount || '0') : amount;
    return value / 1000000;
  };

  // Calculate votes based on the updated proposal data
  const totalVotes = convertToLUNC(
    parseInt(proposalData.final_tally_result.yes || '0') +
    parseInt(proposalData.final_tally_result.no || '0') +
    parseInt(proposalData.final_tally_result.abstain || '0') +
    parseInt(proposalData.final_tally_result.no_with_veto || '0')
  );

  // Calculate non-abstaining votes for ratio calculations
  const totalNonAbstainVotes = convertToLUNC(
    parseInt(proposalData.final_tally_result.yes || '0') +
    parseInt(proposalData.final_tally_result.no || '0') +
    parseInt(proposalData.final_tally_result.no_with_veto || '0')
  );

  // Convert total staked to LUNC for display
  const totalStakedLUNC = convertToLUNC(totalStaked);

  // Calculate participation rate as percentage of total staked
  const participationRate = totalStakedLUNC > 0 ? (totalVotes / totalStakedLUNC) * 100 : 0;

  // Calculate vote percentages of total votes
  const calculatePercentage = (votes: string) => {
    return totalVotes === 0 ? 0 : (convertToLUNC(parseInt(votes || '0')) / totalVotes) * 100;
  };

  // Calculate vote percentages of non-abstain votes (for threshold calculations)
  const calculateNonAbstainPercentage = (votes: string) => {
    return totalNonAbstainVotes === 0 ? 0 : (convertToLUNC(parseInt(votes || '0')) / totalNonAbstainVotes) * 100;
  };

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
                  #{proposalData.id}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                  proposalData.status === 'PROPOSAL_STATUS_PASSED' ? 'bg-green-500' :
                  proposalData.status === 'PROPOSAL_STATUS_REJECTED' ? 'bg-red-500' :
                  proposalData.status === 'PROPOSAL_STATUS_VOTING_PERIOD' ? 'bg-blue-500' :
                  'bg-yellow-500'
                }`}>
                  {proposalData.status.replace('PROPOSAL_STATUS_', '')}
                </span>
              </div>
              <h2 className="text-2xl font-bold">{proposalData.content?.title || 'No title available'}</h2>
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
          {/* Show voting stats only for active proposals */}
          {proposalData.status === 'PROPOSAL_STATUS_VOTING_PERIOD' && (
            <ProposalVotingStats 
              isDark={isDark} 
              timeLeft={timeLeft} 
              participationRate={participationRate} 
              govParams={govParams} 
              totalVotes={totalVotes} 
            />
          )}

          {/* Show voting thresholds and results for all proposals */}
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {proposalData.status === 'PROPOSAL_STATUS_VOTING_PERIOD' ? 'Voting Thresholds' : 'Voting Results'}
            </h3>
            <div className="space-y-4">
              {/* Show voting status for all proposals */}
              <ProposalVotingStatus 
                isDark={isDark} 
                participationRate={participationRate} 
                govParams={govParams} 
                finalTallyResult={proposalData.final_tally_result} 
                calculateNonAbstainPercentage={calculateNonAbstainPercentage} 
              />

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Total Votes</span>
                  <span className={`font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {formatNumber(totalVotes)} LUNC / {formatNumber(totalStakedLUNC)} LUNC staked
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div
                    className={`h-2 rounded-full bg-blue-500`}
                    style={{ width: `${Math.min(100, participationRate)}%` }}
                  />
                </div>
              </div>
              
              {/* Show vote breakdown for all proposals */}
              {['yes', 'no', 'no_with_veto', 'abstain'].map((voteType) => {
                const percentage = calculatePercentage(String(proposalData.final_tally_result[voteType as keyof typeof proposalData.final_tally_result]));
                const votes = convertToLUNC(parseInt(String(proposalData.final_tally_result[voteType as keyof typeof proposalData.final_tally_result] || '0')));
                return (
                  <VotingProgressBar
                    key={voteType}
                    isDark={isDark}
                    voteType={voteType}
                    votes={votes}
                    percentage={percentage}
                  />
                );
              })}
            </div>
          </div>

          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Proposal Details
            </h3>
            <ProposalDetails 
              isDark={isDark} 
              proposal={proposalData} 
              convertToLUNC={convertToLUNC} 
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProposalModal;