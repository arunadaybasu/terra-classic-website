import React from 'react';
import { Shield, Zap, Users, Lock, Coins, Globe, Code, Wallet, Network, Cpu, Scale, Database } from 'lucide-react';
import { useTheme } from '../App';
import AnimatedCard from './AnimatedCard';

const features = [
  {
    icon: Shield,
    title: 'Enhanced Security',
    description: 'Built on the battle-tested Cosmos SDK and Tendermint consensus, providing robust security through delegated Proof-of-Stake and advanced cryptographic mechanisms.',
    details: [
      'Byzantine Fault Tolerance',
      'Delegated Proof-of-Stake',
      'Secure validator network'
    ]
  },
  {
    icon: Zap,
    title: 'High Performance',
    description: 'Achieve remarkable transaction speeds of up to 10,000 TPS with sub-second finality, while maintaining low transaction fees through efficient block production.',
    details: [
      'Fast block times (6s)',
      'High throughput capacity',
      'Instant finality'
    ]
  },
  {
    icon: Users,
    title: 'Community Governance',
    description: 'True decentralized governance system where LUNC holders can propose and vote on protocol upgrades, parameter changes, and community pool allocations.',
    details: [
      'On-chain voting',
      'Parameter change proposals',
      'Community pool management'
    ]
  },
  {
    icon: Lock,
    title: 'Staking Mechanism',
    description: 'Secure the network and earn rewards through staking. Validators and delegators work together to maintain network integrity while earning staking rewards.',
    details: [
      'Delegated staking',
      'Regular reward distribution',
      'Slashing protection'
    ]
  },
  {
    icon: Coins,
    title: 'Token Economics',
    description: 'Innovative dual-token model with LUNC as the staking and governance token, complemented by a suite of stablecoins for practical transactions.',
    details: [
      'Burn mechanism',
      'Staking rewards',
      'Transaction fee distribution'
    ]
  },
  {
    icon: Globe,
    title: 'Cross-Chain Integration',
    description: 'Built with IBC (Inter-Blockchain Communication) protocol support, enabling seamless asset transfers and communication with other Cosmos ecosystem chains.',
    details: [
      'IBC protocol support',
      'Cross-chain transfers',
      'Multi-chain compatibility'
    ]
  },
  {
    icon: Code,
    title: 'Developer Friendly',
    description: 'Comprehensive development framework with CosmWasm smart contracts, enabling secure and efficient deployment of decentralized applications.',
    details: [
      'CosmWasm integration',
      'Smart contract support',
      'Developer tools'
    ]
  },
  {
    icon: Wallet,
    title: 'DeFi Infrastructure',
    description: 'Robust foundation for DeFi applications including AMM DEXes, lending protocols, and yield farming platforms, all secured by the network.',
    details: [
      'AMM support',
      'Lending protocols',
      'Yield optimization'
    ]
  },
  {
    icon: Network,
    title: 'Network Resilience',
    description: 'Advanced network architecture ensuring high availability and fault tolerance through distributed systems and redundancy mechanisms.',
    details: [
      'Distributed architecture',
      'Fault tolerance',
      'Auto-recovery systems'
    ]
  },
  {
    icon: Cpu,
    title: 'Smart Contract Security',
    description: 'Rigorous security measures for smart contract deployment and execution, including formal verification and automated auditing tools.',
    details: [
      'Formal verification',
      'Security auditing',
      'Sandbox environment'
    ]
  },
  {
    icon: Scale,
    title: 'Scalable Architecture',
    description: 'Future-proof blockchain architecture designed for horizontal scaling and seamless protocol upgrades without disrupting network operations.',
    details: [
      'Horizontal scaling',
      'Protocol upgrades',
      'Backward compatibility'
    ]
  },
  {
    icon: Database,
    title: 'Data Availability',
    description: 'Enhanced data availability layer ensuring transaction history and state data are easily accessible while maintaining decentralization.',
    details: [
      'Distributed storage',
      'State sync',
      'Historical data access'
    ]
  }
];

const Features = () => {
  const { isDark } = useTheme();
  
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Key Features</h2>
          <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto`}>
            Terra Luna Classic combines high performance, security, and community governance to create a powerful blockchain ecosystem
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <AnimatedCard key={index} index={index}>
              <div className={`${
                isDark 
                  ? 'bg-gray-800/50 hover:bg-gray-800/70' 
                  : 'bg-white hover:bg-gray-50 shadow-lg'
              } rounded-xl p-6 transition group h-full`}>
                <div className={`flex items-center justify-center w-16 h-16 rounded-full ${
                  isDark 
                    ? 'bg-blue-500/10 group-hover:bg-blue-500/20' 
                    : 'bg-blue-100 group-hover:bg-blue-200'
                } mb-6 transition`}>
                  <feature.icon className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;