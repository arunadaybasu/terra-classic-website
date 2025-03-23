import React from 'react';
import { useTheme } from '../App';
import { Milestone, Rocket, Target, Users, Zap, Globe, Shield, Code } from 'lucide-react';

const roadmapItems = [
  {
    phase: 'Q1 2025',
    title: 'Network Upgrade & Scalability',
    description: 'Major protocol upgrade focusing on scalability and performance improvements',
    icon: Zap,
    status: 'in-progress',
    objectives: [
      'Implement sharding for improved transaction throughput',
      'Upgrade consensus mechanism for better finality',
      'Enhance validator node performance',
      'Optimize smart contract execution'
    ],
    metrics: {
      progress: 35,
      target: 'March 2025'
    }
  },
  {
    phase: 'Q2 2025',
    title: 'DeFi Infrastructure Enhancement',
    description: 'New DeFi primitives and improved staking mechanisms',
    icon: Shield,
    status: 'upcoming',
    objectives: [
      'Launch advanced liquidity pools',
      'Implement cross-chain yield aggregation',
      'Introduce new staking derivatives',
      'Deploy automated market makers v2'
    ],
    metrics: {
      progress: 15,
      target: 'June 2025'
    }
  },
  {
    phase: 'Q3 2025',
    title: 'Cross-chain Integration & Bridges',
    description: 'Enhanced interoperability with major blockchain networks',
    icon: Globe,
    status: 'planned',
    objectives: [
      'Deploy bridges to major L1 networks',
      'Implement cross-chain messaging protocol',
      'Enable seamless asset transfers',
      'Launch multi-chain governance system'
    ],
    metrics: {
      progress: 5,
      target: 'September 2025'
    }
  },
  {
    phase: 'Q4 2025',
    title: 'Governance Evolution & DAO Tools',
    description: 'Advanced DAO tools and community governance features',
    icon: Users,
    status: 'planned',
    objectives: [
      'Launch DAO creation toolkit',
      'Implement quadratic voting',
      'Deploy treasury management system',
      'Introduce reputation-based governance'
    ],
    metrics: {
      progress: 0,
      target: 'December 2025'
    }
  },
  {
    phase: 'Q1 2026',
    title: 'Smart Contract Platform Expansion',
    description: 'Enhanced smart contract capabilities and developer tools',
    icon: Code,
    status: 'planned',
    objectives: [
      'Launch next-gen contract framework',
      'Implement formal verification tools',
      'Deploy contract monitoring system',
      'Introduce automated security checks'
    ],
    metrics: {
      progress: 0,
      target: 'March 2026'
    }
  },
  {
    phase: 'Q2 2026',
    title: 'Enterprise Integration Framework',
    description: 'Enterprise-grade features and integration capabilities',
    icon: Target,
    status: 'planned',
    objectives: [
      'Deploy enterprise connectors',
      'Implement private transaction pools',
      'Launch compliance toolkit',
      'Introduce enterprise governance'
    ],
    metrics: {
      progress: 0,
      target: 'June 2026'
    }
  }
];

const getStatusColor = (status: string, isDark: boolean) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'in-progress':
      return isDark ? 'bg-blue-500' : 'bg-blue-600';
    case 'upcoming':
      return isDark ? 'bg-yellow-500' : 'bg-yellow-600';
    default:
      return isDark ? 'bg-gray-500' : 'bg-gray-600';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'in-progress':
      return 'In Progress';
    case 'upcoming':
      return 'Coming Soon';
    default:
      return 'Planned';
  }
};

const Roadmap = () => {
  const { isDark } = useTheme();

  return (
    <section className={`py-16 ${isDark ? 'bg-gray-900/50' : 'bg-gradient-to-b from-blue-50 to-yellow-50'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Development Roadmap</h2>
          <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto`}>
            Our strategic vision for evolving the Terra Luna Classic ecosystem
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {roadmapItems.map((item, index) => (
            <div
              key={index}
              className={`${
                isDark ? 'bg-gray-800/50' : 'bg-white'
              } rounded-xl p-6 shadow-lg backdrop-blur-sm transition-transform duration-300 hover:scale-[1.02]`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-500/10' : 'bg-blue-100'}`}>
                  <item.icon className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      {item.phase}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isDark ? 'text-white' : 'text-white'
                      } ${getStatusColor(item.status, isDark)}`}
                    >
                      {getStatusText(item.status)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                    {item.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Development Progress
                      </span>
                      <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                        {item.metrics.progress}%
                      </span>
                    </div>
                    <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div
                        className={`h-2 rounded-full ${getStatusColor(item.status, isDark)}`}
                        style={{ width: `${item.metrics.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Key Objectives
                    </h4>
                    <ul className="space-y-2">
                      {item.objectives.map((objective, idx) => (
                        <li
                          key={idx}
                          className={`flex items-center text-sm ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isDark ? 'bg-blue-500' : 'bg-blue-600'
                          } mr-2`} />
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center">
                      <Milestone className={`w-4 h-4 ${isDark ? 'text-yellow-500' : 'text-yellow-600'} mr-2`} />
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Target Completion: {item.metrics.target}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Roadmap;