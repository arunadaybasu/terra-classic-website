import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useTheme } from '../../App';
import { Proposal, fetchTotalStaked, fetchGovParams } from '../../api/terra';
import { formatNumber, formatPercentage } from '../../utils/format';
import axios from 'axios';

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
        console.log('Tally API response:', tallyData);

        setTotalStaked(totalStakedAmount);
        setGovParams({
          quorum: parseFloat(params.tally_params.quorum),
          threshold: parseFloat(params.tally_params.threshold),
          vetoThreshold: parseFloat(params.tally_params.veto_threshold)
        });

        // Use the tally data from the API directly
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

        // Update proposal data with the API tally results
        setProposalData({
          ...proposal,
          final_tally_result: {
            yes: tallyData.yes,
            no: tallyData.no,
            abstain: tallyData.abstain,
            no_with_veto: tallyData.no_with_veto,
            total_voting_power: totalStakedAmount.toString(),
            quorum_reached: participation >= parseFloat(params.tally_params.quorum),
            threshold_reached: yesRatio > parseFloat(params.tally_params.threshold),
            veto_threshold_reached: vetoRatio > parseFloat(params.tally_params.veto_threshold)
          }
        });

      } catch (error) {
        console.error('Error fetching tally data:', error);
        setProposalData(proposal);
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

  // Determine voting status for display
  const getVotingStatus = () => {
    if (!proposalData.final_tally_result.quorum_reached) {
      return {
        label: 'Quorum Not Reached',
        color: isDark ? 'text-red-400' : 'text-red-600'
      };
    }
    if (proposalData.final_tally_result.veto_threshold_reached) {
      return {
        label: 'Veto Threshold Exceeded',
        color: isDark ? 'text-yellow-400' : 'text-yellow-600'
      };
    }
    if (proposalData.final_tally_result.threshold_reached) {
      return {
        label: 'Passing Threshold Met',
        color: isDark ? 'text-green-400' : 'text-green-600'
      };
    }
    return {
      label: 'Below Passing Threshold',
      color: isDark ? 'text-red-400' : 'text-red-600'
    };
  };

  const votingStatus = getVotingStatus();

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
          {proposalData.status === 'PROPOSAL_STATUS_VOTING_PERIOD' && (
            <>
              <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Time Remaining</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    {formatPercentage(participationRate)}%
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Participation Rate</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                    {formatPercentage(govParams.quorum * 100)}%
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Quorum Required</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                    {formatNumber(totalVotes)} LUNC
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Votes</div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Voting Thresholds
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Current Status</span>
                      <span className={`font-medium ${votingStatus.color}`}>
                        {votingStatus.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Quorum</span>
                          <span className={proposalData.final_tally_result.quorum_reached ? 'text-green-500' : 'text-red-500'}>
                            {formatPercentage(participationRate)}% / {formatPercentage(govParams.quorum * 100)}%
                          </span>
                        </div>
                        <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <div
                            className={`h-2 rounded-full ${proposalData.final_tally_result.quorum_reached ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(100, (participationRate / (govParams.quorum * 100)) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Pass Threshold</span>
                          <span className={proposalData.final_tally_result.threshold_reached ? 'text-green-500' : 'text-red-500'}>
                            {formatPercentage(calculateNonAbstainPercentage(proposalData.final_tally_result.yes))}% / {formatPercentage(govParams.threshold * 100)}%
                          </span>
                        </div>
                        <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <div
                            className={`h-2 rounded-full ${proposalData.final_tally_result.threshold_reached ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(100, (calculateNonAbstainPercentage(proposalData.final_tally_result.yes) / (govParams.threshold * 100)) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Veto Threshold</span>
                          <span className={!proposalData.final_tally_result.veto_threshold_reached ? 'text-green-500' : 'text-red-500'}>
                            {formatPercentage(calculateNonAbstainPercentage(proposalData.final_tally_result.no_with_veto))}% / {formatPercentage(govParams.vetoThreshold * 100)}%
                          </span>
                        </div>
                        <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <div
                            className={`h-2 rounded-full ${!proposalData.final_tally_result.veto_threshold_reached ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(100, (calculateNonAbstainPercentage(proposalData.final_tally_result.no_with_veto) / (govParams.vetoThreshold * 100)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

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
                  
                  {['yes', 'no', 'no_with_veto', 'abstain'].map((voteType) => {
                    const percentage = calculatePercentage(String(proposalData.final_tally_result[voteType as keyof typeof proposalData.final_tally_result]));
                    const votes = convertToLUNC(parseInt(String(proposalData.final_tally_result[voteType as keyof typeof proposalData.final_tally_result] || '0')));
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
                              {formatNumber(votes)} LUNC
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
            </>
          )}

          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Proposal Details
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className={`text-md font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Description</h4>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {proposalData.content?.description || 'No description available'}
                </p>
              </div>
              <div>
                <h4 className={`text-md font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Submit Time</h4>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {format(new Date(proposalData.submit_time), 'PPPppp')}
                </p>
              </div>
              <div>
                <h4 className={`text-md font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Deposit End Time</h4>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {format(new Date(proposalData.deposit_end_time), 'PPPppp')}
                </p>
              </div>
              <div>
                <h4 className={`text-md font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Voting Start Time</h4>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {format(new Date(proposalData.voting_start_time), 'PPPppp')}
                </p>
              </div>
              <div>
                <h4 className={`text-md font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Voting End Time</h4>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {format(new Date(proposalData.voting_end_time), 'PPPppp')}
                </p>
              </div>
              <div>
                <h4 className={`text-md font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Total Deposit</h4>
                <div className="space-y-2">
                  {proposalData.total_deposit.map((deposit, index) => (
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
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProposalModal;