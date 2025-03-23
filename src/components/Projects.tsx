import React from 'react';
import { useTheme } from '../App';

const projects = [
  {
    name: 'Terraport',
    description: 'Advanced DEX platform offering swap, staking, and yield farming capabilities',
    logo: 'https://terraport.finance/logo.png',
    url: 'https://terraport.finance'
  },
  {
    name: 'Juris Protocol',
    description: 'Innovative governance and DeFi initiative driving ecosystem revitalization',
    logo: 'https://jurisprotocol.com/logo.png',
    url: '#'
  },
  {
    name: 'Terra Swap',
    description: 'Decentralized protocol enabling seamless asset liquidity and trading',
    logo: 'https://terraswap.io/logo.png',
    url: 'https://terraswap.io'
  },
  {
    name: 'Eris Protocol',
    description: 'Community-driven DeFi platform with self-funded development initiatives',
    logo: 'https://erisprotocol.com/logo.png',
    url: 'https://erisprotocol.com'
  },
  {
    name: 'Loop',
    description: 'Comprehensive hub featuring DEX and NFT launchpad/marketplace',
    logo: 'https://loop.markets/logo.png',
    url: 'https://loop.markets'
  },
  {
    name: 'TFM',
    description: 'Advanced DeFi and NFT trading platform with analytics and yield farming',
    logo: 'https://lunc.tfm.com/logo.png',
    url: 'https://lunc.tfm.com'
  },
  {
    name: 'Hermes Protocol',
    description: 'Scalable on-chain communication platform for blockchain alerts',
    logo: 'https://hermesprotocol.io/logo.png',
    url: 'https://hermesprotocol.io'
  },
  {
    name: 'Smart Stake',
    description: 'Transparent validator service with comprehensive analytics hub',
    logo: 'https://smartstake.io/logo.png',
    url: 'https://smartstake.io'
  },
  {
    name: 'Talis Protocol',
    description: 'DAO Marketplace bridging blockchain with real-world applications',
    logo: 'https://talis.art/logo.png',
    url: 'https://talis.art'
  },
  {
    name: 'Terrarity',
    description: 'Gamified staking experience for Terra Classic ecosystem',
    logo: 'https://terrarity.io/logo.png',
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
          {projects.map((project, index) => (
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
                <div className="h-16 mb-6 flex items-center justify-center">
                  <img
                    src={project.logo}
                    alt={`${project.name} logo`}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMjJDMTcuNTIyOCAyMiAyMiAxNy41MjI4IDIyIDEyQzIyIDYuNDc3MTUgMTcuNTIyOCAyIDEyIDJDNi40NzcxNSAyIDIgNi40NzcxNSAyIDEyQzIgMTcuNTIyOCA2LjQ3NzE1IDIyIDEyIDIyWiIgc3Ryb2tlPSIjNjA3ZDhiIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik05LjA5IDkuMDAwMDFDOS4zMjUxIDguMzMxNjggOS43NzQxNSA3Ljc2ODExIDEwLjM3NSA3LjQwOTI0QzEwLjk3NTkgNy4wNTAzNiAxMS42ODI1IDYuOTE4ODkgMTIuMzcyNyA3LjAzODI2QzEzLjA2MjkgNy4xNTc2NCAxMy42OTI3IDcuNTIxMjQgMTQuMTUzMiA4LjA2MDYyQzE0LjYxMzYgOC42MDAwMSAxNC44NzQ5IDkuMjg0MDUgMTQuODkgMTAuMDAwMUMxNC44OSAxMiAxMS44OSAxMyAxMS44OSAxMyIgc3Ryb2tlPSIjNjA3ZDhiIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0xMiAxN0gxMi4wMSIgc3Ryb2tlPSIjNjA3ZDhiIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==';
                    }}
                  />
                </div>
                <h3 className={`text-xl font-semibold mb-2 text-center ${isDark ? 'group-hover:text-blue-400' : 'group-hover:text-blue-600'} transition duration-300`}>
                  {project.name}
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-center`}>{project.description}</p>
                <div className={`mt-4 flex items-center justify-center ${isDark ? 'text-blue-400' : 'text-blue-600'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                  <span className="text-sm">Learn More</span>
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </a>
          ))}
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
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-center`}>Stay tuned for new projects joining the Terra Luna Classic ecosystem</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;