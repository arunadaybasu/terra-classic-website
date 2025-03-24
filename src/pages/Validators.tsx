import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, Award, TrendingUp, Activity, Server, Globe, XCircle, Zap, Lock, Wallet, ChevronRight } from 'lucide-react';
import { useTheme } from '../App';
import { fetchValidators, ValidatorWithVotingPower } from '../api/terra';
import AnimatedCard from '../components/AnimatedCard';
import { formatNumber, formatPercentage, formatLargeNumber } from '../utils/format';
import StakingChart from '../components/StakingChart';

const ValidatorModal = ({ validator, onClose }: { validator: ValidatorWithVotingPower; onClose: () => void }) => {
  const { isDark } = useTheme();

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
                <Shield className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  Validator Details
                </span>
              </div>
              <h2 className="text-2xl font-bold">{validator.description.moniker}</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <h3 className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Voting Power</h3>
              </div>
              <p className="text-2xl font-bold">{formatPercentage(validator.voting_percentage)}%</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {formatNumber(validator.voting_power)} tokens
              </p>
            </div>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Wallet className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                <h3 className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Commission</h3>
              </div>
              <p className="text-2xl font-bold">
                {formatPercentage(parseFloat(validator.commission.commission_rates.rate) * 100)}%
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Current Rate</p>
            </div>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Lock className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                <h3 className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Self Bonded</h3>
              </div>
              <p className="text-2xl font-bold">{formatNumber(parseInt(validator.min_self_delegation))}</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Minimum Delegation</p>
            </div>
          </div>

          <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Validator Information
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Description
                </h4>
                <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  {validator.description.details || 'No description provided'}
                </p>
              </div>
              {validator.description.website && (
                <div>
                  <h4 className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Website
                  </h4>
                  <a
                    href={validator.description.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-blue-500 hover:text-blue-600 flex items-center gap-1`}
                  >
                    {validator.description.website}
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              )}
              {validator.description.security_contact && (
                <div>
                  <h4 className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Security Contact
                  </h4>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    {validator.description.security_contact}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Commission Rates
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Max Rate</span>
                  <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {formatPercentage(parseFloat(validator.commission.commission_rates.max_rate) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Max Change Rate</span>
                  <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {formatPercentage(parseFloat(validator.commission.commission_rates.max_change_rate) * 100)}%
                  </span>
                </div>
              </div>
            </div>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Status Information
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Status</span>
                  <span className={`font-medium ${validator.jailed ? 'text-red-500' : 'text-green-500'}`}>
                    {validator.jailed ? 'Jailed' : 'Active'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Bond Status</span>
                  <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {validator.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ValidatorCard = ({ validator, onClick }: { validator: ValidatorWithVotingPower; onClick: () => void }) => {
  const { isDark } = useTheme();
  
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
            <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold mb-2 line-clamp-1">{validator.description.moniker}</h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4 line-clamp-2`}>
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

              <div className="flex flex-col sm:flex-row justify-between text-sm gap-2">
                <div className="flex justify-between sm:block">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Commission</span>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    {formatPercentage(parseFloat(validator.commission.commission_rates.rate) * 100)}%
                  </span>
                </div>

                <div className="flex justify-between sm:block">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Status</span>
                  <span className={`font-medium ${validator.jailed ? 'text-red-500' : 'text-green-500'}`}>
                    {validator.jailed ? 'Jailed' : 'Active'}
                  </span>
                </div>
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
                onClick={(e) => e.stopPropagation()}
              >
                Visit Website
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            )}
          </div>
        </div>
      </button>
    </AnimatedCard>
  );
};

const ValidatorsHero = ({ validators }: { validators: ValidatorWithVotingPower[] }) => {
  const { isDark } = useTheme();

  const totalTokens = validators?.reduce((sum, validator) => sum + validator.voting_power, 0) || 0;
  const activeValidators = validators?.filter(v => !v.jailed).length || 0;
  const averageCommission = validators?.reduce((sum, v) => sum + parseFloat(v.commission.commission_rates.rate), 0) / (validators?.length || 1) * 100;
  
  const stats = {
    totalStaked: totalTokens,
    activeValidators,
    averageCommission: formatPercentage(averageCommission),
    totalValidators: validators?.length || 0
  };

  return (
    <div className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-900' : 'bg-gradient-to-br from-blue-100 via-blue-50 to-yellow-50'} py-8 sm:py-16`}>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
          >
            Terra Luna Classic Validators
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-base sm:text-lg md:text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'} max-w-3xl mx-auto px-4`}
          >
            Discover the network validators securing and maintaining the Terra Luna Classic blockchain
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
              <Shield className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <h3 className={`text-sm sm:text-base font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                Total Validators
              </h3>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{stats.totalValidators}</p>
          </div>
          <div className={`${isDark ? 'bg-gray-800/30' : 'bg-white'} rounded-xl p-4 sm:p-6 backdrop-blur-sm`}>
            <div className="flex items-center gap-3 mb-2">
              <Activity className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              <h3 className={`text-sm sm:text-base font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                Active Validators
              </h3>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{stats.activeValidators}</p>
          </div>
          <div className={`${isDark ? 'bg-gray-800/30' : 'bg-white'} rounded-xl p-4 sm:p-6 backdrop-blur-sm`}>
            <div className="flex items-center gap-3 mb-2">
              <Wallet className={`w-5 h-5 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <h3 className={`text-sm sm:text-base font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                Avg. Commission
              </h3>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{stats.averageCommission}%</p>
          </div>
          <div className={`${isDark ? 'bg-gray-800/30' : 'bg-white'} rounded-xl p-4 sm:p-6 backdrop-blur-sm`}>
            <div className="flex items-center gap-3 mb-2">
              <Lock className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <h3 className={`text-sm sm:text-base font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                Total Staked
              </h3>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{formatLargeNumber(stats.totalStaked)} LUNC</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12"
        >
          <StakingChart
            type="staked"
            title="Total LUNC Staked (30 Days)"
            color={isDark ? '#3B82F6' : '#2563EB'}
          />
          <StakingChart
            type="unstaked"
            title="Total LUNC Unstaked (30 Days)"
            color={isDark ? '#EF4444' : '#DC2626'}
          />
          <StakingChart
            type="rewards"
            title="Staking Rewards Distributed (30 Days)"
            color={isDark ? '#10B981' : '#059669'}
          />
        </motion.div>

        {validators?.[0] && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className={`${isDark ? 'bg-gray-800/30' : 'bg-white'} rounded-xl p-4 sm:p-6 backdrop-blur-sm`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <h3 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                Top Validator
              </h3>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                validators[0].jailed ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
              }`}>
                {validators[0].jailed ? 'Jailed' : 'Active'}
              </div>
            </div>
            <h4 className="text-base sm:text-lg font-medium mb-2">{validators[0].description.moniker}</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Voting Power
                  </span>
                  <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    {formatPercentage(validators[0].voting_percentage)}%
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div
                    className={`h-2 rounded-full ${isDark ? 'bg-blue-500' : 'bg-blue-600'}`}
                    style={{ width: `${validators[0].voting_percentage}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Staked Amount</span>
                <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {formatLargeNumber(validators[0].voting_power)} LUNC
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Commission Rate</span>
                <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {formatPercentage(parseFloat(validators[0].commission.commission_rates.rate) * 100)}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const ValidatorsPage = () => {
  const { isDark } = useTheme();
  const { data: validators } = useQuery('validators', fetchValidators);
  const [selectedValidator, setSelectedValidator] = useState<ValidatorWithVotingPower | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'jailed'>('all');

  const filteredValidators = validators?.filter(validator => {
    switch (filter) {
      case 'active':
        return !validator.jailed;
      case 'jailed':
        return validator.jailed;
      default:
        return true;
    }
  });

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ValidatorsHero validators={validators || []} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold">Network Validators</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? isDark ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'
                  : isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'active'
                  ? isDark ? 'bg-green-500 text-white' : 'bg-green-600 text-white'
                  : isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('jailed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'jailed'
                  ? isDark ? 'bg-red-500 text-white' : 'bg-red-600 text-white'
                  : isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Jailed
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {filteredValidators?.map((validator) => (
            <ValidatorCard
              key={validator.operator_address}
              validator={validator}
              onClick={() => setSelectedValidator(validator)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedValidator && (
          <ValidatorModal
            validator={selectedValidator}
            onClose={() => setSelectedValidator(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ValidatorsPage;