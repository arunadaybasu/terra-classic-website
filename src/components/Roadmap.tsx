import React from 'react';
import { useTheme } from '../App';
import { motion } from 'framer-motion';
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
  
  // First roadmap item for hero section
  const featuredItem = roadmapItems[0];

  return (
    <section id="roadmap" className="scroll-mt-16">
      {/* Featured Roadmap Hero Section with Second Background */}
      <div className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-back/hero-back (2).jpeg" 
            alt="Terra Luna Classic Roadmap Background"
            className="h-full w-full object-cover"
          />
          <div 
            className={`absolute inset-0 bg-gradient-to-b ${
              isDark 
                ? 'from-purple-900/70 via-gray-900/80 to-black/90' 
                : 'from-purple-900/50 via-blue-800/60 to-purple-900/70'
            }`}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-4 text-white">Development Roadmap</h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
              Our strategic vision for evolving the Terra Luna Classic ecosystem
            </p>
            
            {/* Featured roadmap item */}
            <div className={`max-w-3xl mx-auto ${
              isDark ? 'bg-gray-800/40' : 'bg-white/80'
            } rounded-xl p-6 shadow-lg backdrop-blur-sm mb-8`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                    <featuredItem.icon className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div className="text-left">
                    <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      {featuredItem.phase}
                    </span>
                    <h3 className="text-xl font-bold text-white">{featuredItem.title}</h3>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                  getStatusColor(featuredItem.status, isDark)
                }`}>
                  {getStatusText(featuredItem.status)}
                </span>
              </div>
              
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-800'} text-left mb-4`}>
                {featuredItem.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Development Progress
                    </span>
                    <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      {featuredItem.metrics.progress}%
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                      className={`h-2 rounded-full ${getStatusColor(featuredItem.status, isDark)}`}
                      style={{ width: `${featuredItem.metrics.progress}%` }}
                    />
                  </div>
                </div>
                <ul className="space-y-2 text-left">
                  {featuredItem.objectives.slice(0, 2).map((objective, idx) => (
                    <li
                      key={idx}
                      className={`flex items-center text-sm ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
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
            </div>
            
            <div className="flex justify-center gap-3 mb-4">
              <div className={`px-4 py-2 rounded-lg ${isDark ? 'bg-purple-600' : 'bg-purple-700'} text-white`}>
                Q1 2025
              </div>
              <div className={`px-4 py-2 rounded-lg ${isDark ? 'bg-blue-600' : 'bg-blue-700'} text-white`}>
                Q2 2025
              </div>
              <div className={`px-4 py-2 rounded-lg ${isDark ? 'bg-indigo-600' : 'bg-indigo-700'} text-white`}>
                Q3 2025
              </div>
              <div className={`px-4 py-2 rounded-lg ${isDark ? 'bg-teal-600' : 'bg-teal-700'} text-white`}>
                Q4 2025
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Roadmap Detailed Content */}
      <div className={`py-16 ${isDark ? 'bg-gray-900/50' : 'bg-gradient-to-b from-blue-50 to-yellow-50'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
      </div>
    </section>
  );
};

export default Roadmap;