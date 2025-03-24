import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../App';
import { 
  Wallet, 
  BarChart, 
  Globe, 
  Shield, 
  Zap, 
  Users, 
  Award, 
  Gamepad2,
  XCircle,
  ExternalLink,
  GitBranch,
  Github,
  Twitter,
  MessageCircle,
  ChevronRight
} from 'lucide-react';
import AnimatedCard from '../components/AnimatedCard';

const projects = [
  {
    id: 'terraport',
    name: 'Terraport',
    description: 'Advanced DEX platform offering swap, staking, and yield farming capabilities',
    icon: Wallet,
    category: 'DeFi',
    url: 'https://terraport.finance',
    stats: {
      tvl: '125.5M',
      volume24h: '2.8M',
      users: '45K'
    },
    features: [
      'Automated Market Making',
      'Yield Farming',
      'Liquidity Provision',
      'Token Swaps'
    ],
    social: {
      twitter: 'https://twitter.com/terraport',
      telegram: 'https://t.me/terraport',
      github: 'https://github.com/terraport'
    }
  },
  {
    id: 'juris',
    name: 'Juris Protocol',
    description: 'Innovative governance and DeFi initiative driving ecosystem revitalization',
    icon: Shield,
    category: 'Governance',
    url: '#',
    stats: {
      tvl: '85.2M',
      proposals: '124',
      validators: '100'
    },
    features: [
      'Decentralized Governance',
      'Protocol Security',
      'Community Voting',
      'Treasury Management'
    ],
    social: {
      twitter: 'https://twitter.com/jurisprotocol',
      telegram: 'https://t.me/jurisprotocol',
      github: 'https://github.com/jurisprotocol'
    }
  },
  {
    id: 'terraswap',
    name: 'Terra Swap',
    description: 'Decentralized protocol enabling seamless asset liquidity and trading',
    icon: BarChart,
    category: 'DeFi',
    url: 'https://terraswap.io',
    stats: {
      tvl: '95.8M',
      volume24h: '1.5M',
      pairs: '245'
    },
    features: [
      'Token Swaps',
      'Liquidity Pools',
      'Flash Loans',
      'Price Oracles'
    ],
    social: {
      twitter: 'https://twitter.com/terraswap',
      telegram: 'https://t.me/terraswap',
      github: 'https://github.com/terraswap'
    }
  },
  {
    id: 'eris',
    name: 'Eris Protocol',
    description: 'Community-driven DeFi platform with self-funded development initiatives',
    icon: Users,
    category: 'DeFi',
    url: 'https://erisprotocol.com',
    stats: {
      tvl: '45.3M',
      stakeholders: '12K',
      proposals: '78'
    },
    features: [
      'Community Governance',
      'Yield Optimization',
      'Risk Management',
      'Asset Integration'
    ],
    social: {
      twitter: 'https://twitter.com/erisprotocol',
      telegram: 'https://t.me/erisprotocol',
      github: 'https://github.com/erisprotocol'
    }
  },
  {
    id: 'loop',
    name: 'Loop',
    description: 'Comprehensive hub featuring DEX and NFT launchpad/marketplace',
    icon: Globe,
    category: 'NFT',
    url: 'https://loop.markets',
    stats: {
      volume24h: '850K',
      collections: '125',
      users: '28K'
    },
    features: [
      'NFT Marketplace',
      'Token Launchpad',
      'Creator Tools',
      'Trading Interface'
    ],
    social: {
      twitter: 'https://twitter.com/loop_markets',
      telegram: 'https://t.me/loop_markets',
      github: 'https://github.com/loop-markets'
    }
  },
  {
    id: 'tfm',
    name: 'TFM',
    description: 'Advanced DeFi and NFT trading platform with analytics and yield farming',
    icon: Zap,
    category: 'DeFi',
    url: 'https://lunc.tfm.com',
    stats: {
      tvl: '72.1M',
      volume24h: '1.2M',
      users: '35K'
    },
    features: [
      'Cross-chain Trading',
      'Analytics Dashboard',
      'Yield Farming',
      'Portfolio Management'
    ],
    social: {
      twitter: 'https://twitter.com/tfm_com',
      telegram: 'https://t.me/tfm_com',
      github: 'https://github.com/tfm'
    }
  },
  {
    id: 'hermes',
    name: 'Hermes Protocol',
    description: 'Scalable on-chain communication platform for blockchain alerts',
    icon: MessageCircle,
    category: 'Infrastructure',
    url: 'https://hermesprotocol.io',
    stats: {
      messages: '1.2M',
      nodes: '150',
      uptime: '99.99%'
    },
    features: [
      'Cross-chain Messaging',
      'Alert System',
      'Data Indexing',
      'Node Infrastructure'
    ],
    social: {
      twitter: 'https://twitter.com/hermesprotocol',
      telegram: 'https://t.me/hermesprotocol',
      github: 'https://github.com/hermesprotocol'
    }
  },
  {
    id: 'smartstake',
    name: 'Smart Stake',
    description: 'Transparent validator service with comprehensive analytics hub',
    icon: Award,
    category: 'Infrastructure',
    url: 'https://smartstake.io',
    stats: {
      validators: '100',
      staked: '450M',
      apy: '12.5%'
    },
    features: [
      'Validator Analytics',
      'Staking Dashboard',
      'Performance Metrics',
      'Reward Calculator'
    ],
    social: {
      twitter: 'https://twitter.com/smartstake',
      telegram: 'https://t.me/smartstake',
      github: 'https://github.com/smartstake'
    }
  },
  {
    id: 'talis',
    name: 'Talis Protocol',
    description: 'DAO Marketplace bridging blockchain with real-world applications',
    icon: GitBranch,
    category: 'DAO',
    url: 'https://talis.art',
    stats: {
      daos: '85',
      members: '25K',
      treasury: '15.5M'
    },
    features: [
      'DAO Creation',
      'Governance Tools',
      'Treasury Management',
      'Proposal System'
    ],
    social: {
      twitter: 'https://twitter.com/talisprotocol',
      telegram: 'https://t.me/talisprotocol',
      github: 'https://github.com/talisprotocol'
    }
  },
  {
    id: 'terrarity',
    name: 'Terrarity',
    description: 'Gamified staking experience for Terra Classic ecosystem',
    icon: Gamepad2,
    category: 'Gaming',
    url: 'https://terrarity.io',
    stats: {
      players: '18K',
      staked: '25M',
      rewards: '150K'
    },
    features: [
      'Gamified Staking',
      'NFT Integration',
      'Achievement System',
      'Reward Distribution'
    ],
    social: {
      twitter: 'https://twitter.com/terrarity',
      telegram: 'https://t.me/terrarity',
      github: 'https://github.com/terrarity'
    }
  }
];

const ProjectModal = ({ project, onClose }: { project: typeof projects[0]; onClose: () => void }) => {
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
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-500/10' : 'bg-blue-100'}`}>
                <project.icon className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{project.name}</h2>
                <span className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  {project.category}
                </span>
              </div>
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
          <div>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {project.description}
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isDark 
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white transition-colors`}
              >
                <ExternalLink className="w-4 h-4" />
                Visit Website
              </a>
              <div className="flex gap-2">
                {Object.entries(project.social).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg ${
                      isDark 
                        ? 'bg-gray-800 hover:bg-gray-700' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    {platform === 'twitter' && <Twitter className="w-5 h-5" />}
                    {platform === 'telegram' && <MessageCircle className="w-5 h-5" />}
                    {platform === 'github' && <Github className="w-5 h-5" />}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(project.stats).map(([key, value]) => (
              <div
                key={key}
                className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}
              >
                <h4 className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </h4>
                <p className={`text-2xl font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Key Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} flex items-center gap-3`}
                >
                  <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-blue-500' : 'bg-blue-600'}`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ProjectCard = ({ project, onClick }: { project: typeof projects[0]; onClick: () => void }) => {
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
            <project.icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h3 className="text-lg sm:text-xl font-bold">{project.name}</h3>
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600'
              }`}>
                {project.category}
              </span>
            </div>
            
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4 line-clamp-2`}>
              {project.description}
            </p>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
              {Object.entries(project.stats).slice(0, 3).map(([key, value]) => (
                <div key={key}>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </p>
                  <p className={`text-sm sm:text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {Object.entries(project.social).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`p-1.5 rounded-lg ${
                      isDark 
                        ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
                    } transition-colors`}
                  >
                    {platform === 'twitter' && <Twitter className="w-4 h-4" />}
                    {platform === 'telegram' && <MessageCircle className="w-4 h-4" />}
                    {platform === 'github' && <Github className="w-4 h-4" />}
                  </a>
                ))}
              </div>
              <div className={`flex items-center text-sm ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`}>
                View Details
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </button>
    </AnimatedCard>
  );
};

const ProjectsPage = () => {
  const { isDark } = useTheme();
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const categories = ['all', ...new Set(projects.map(p => p.category.toLowerCase()))];
  
  const filteredProjects = projects.filter(project => 
    filter === 'all' || project.category.toLowerCase() === filter
  );

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
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
              Terra Luna Classic Projects
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`text-base sm:text-lg md:text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'} max-w-3xl mx-auto px-4`}
            >
              Discover the innovative projects building on Terra Luna Classic
            </motion.p>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: 'Total Projects', value: projects.length, icon: Globe },
              { label: 'DeFi Projects', value: projects.filter(p => p.category === 'DeFi').length, icon: BarChart },
              { label: 'Infrastructure', value: projects.filter(p => p.category === 'Infrastructure').length, icon: Shield },
              { label: 'Active Users', value: '150K+', icon: Users }
            ].map((stat, index) => (
              <div
                key={index}
                className={`${isDark ? 'bg-gray-800/30' : 'bg-white'} rounded-xl p-4 sm:p-6 backdrop-blur-sm`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <stat.icon className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  <h3 className={`text-sm sm:text-base font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {stat.label}
                  </h3>
                </div>
                <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold">Ecosystem Projects</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === category
                    ? isDark ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'
                    : isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsPage;