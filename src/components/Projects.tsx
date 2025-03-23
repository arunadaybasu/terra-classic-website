import React from 'react';
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
  MessageCircle,
  GitBranch,
  ChevronRight
} from 'lucide-react';

const projects = [
  {
    name: 'Terraport',
    description: 'Advanced DEX platform offering swap, staking, and yield farming capabilities',
    icon: Wallet,
    url: 'https://terraport.finance'
  },
  {
    name: 'Juris Protocol',
    description: 'Innovative governance and DeFi initiative driving ecosystem revitalization',
    icon: Shield,
    url: '#'
  },
  {
    name: 'Terra Swap',
    description: 'Decentralized protocol enabling seamless asset liquidity and trading',
    icon: BarChart,
    url: 'https://terraswap.io'
  },
  {
    name: 'Eris Protocol',
    description: 'Community-driven DeFi platform with self-funded development initiatives',
    icon: Users,
    url: 'https://erisprotocol.com'
  },
  {
    name: 'Loop',
    description: 'Comprehensive hub featuring DEX and NFT launchpad/marketplace',
    icon: Globe,
    url: 'https://loop.markets'
  },
  {
    name: 'TFM',
    description: 'Advanced DeFi and NFT trading platform with analytics and yield farming',
    icon: Zap,
    url: 'https://lunc.tfm.com'
  },
  {
    name: 'Hermes Protocol',
    description: 'Scalable on-chain communication platform for blockchain alerts',
    icon: MessageCircle,
    url: 'https://hermesprotocol.io'
  },
  {
    name: 'Smart Stake',
    description: 'Transparent validator service with comprehensive analytics hub',
    icon: Award,
    url: 'https://smartstake.io'
  },
  {
    name: 'Talis Protocol',
    description: 'DAO Marketplace bridging blockchain with real-world applications',
    icon: GitBranch,
    url: 'https://talis.art'
  },
  {
    name: 'Terrarity',
    description: 'Gamified staking experience for Terra Classic ecosystem',
    icon: Gamepad2,
    url: 'https://terrarity.io'
  }
];

const Projects = () => {
  const { isDark } = useTheme();

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Active Ecosystem Projects</h2>
          <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto`}>
            Discover the innovative projects building the future of decentralized finance on Terra Luna Classic
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <a
                key={index}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group block ${
                  isDark 
                    ? 'bg-gray-800/50 hover:bg-gray-800/70' 
                    : 'bg-white hover:bg-gray-50 shadow-lg'
                } rounded-xl overflow-hidden transition duration-300 transform hover:-translate-y-1`}
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-500/10' : 'bg-blue-100'} transition-colors group-hover:bg-blue-500/20`}>
                      <Icon className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                    <h3 className={`text-xl font-semibold ${isDark ? 'group-hover:text-blue-400' : 'group-hover:text-blue-600'} transition-colors`}>
                      {project.name}
                    </h3>
                  </div>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                    {project.description}
                  </p>
                  <div className={`flex items-center ${isDark ? 'text-blue-400' : 'text-blue-600'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    <span className="text-sm">Learn More</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </a>
            );
          })}
          <div className={`group block ${
            isDark 
              ? 'bg-gray-800/50 hover:bg-gray-800/70' 
              : 'bg-white hover:bg-gray-50 shadow-lg'
            } rounded-xl overflow-hidden transition duration-300 transform hover:-translate-y-1`}>
            <div className="p-6 flex flex-col items-center justify-center h-full min-h-[280px]">
              <div className="h-16 mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">More Projects Coming Soon</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-center`}>
                Stay tuned for new projects joining the Terra Luna Classic ecosystem
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;