import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useTheme } from '../App';

// Generate chart data with a nice curve pattern
const generateChartData = (points = 50) => {
  const baseY = 50;
  const variance = 30;
  const result = [];
  
  for (let i = 0; i < points; i++) {
    const x = i;
    // Create a rolling sine wave with some randomness
    const y = baseY + 
      Math.sin(i / 10) * variance * 0.7 + 
      Math.sin(i / 5) * variance * 0.3 + 
      (Math.random() - 0.5) * variance * 0.2;
    
    result.push({ x, y });
  }
  
  return result;
};

const Header = () => {
  const { isDark } = useTheme();
  const [chartData, setChartData] = useState<{ x: number; y: number }[]>([]);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  useEffect(() => {
    // Generate data once on component mount
    setChartData(generateChartData());
  }, []);
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <header id="home" className="relative h-screen min-h-[650px] max-h-[900px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-back/hero-back (1).jpeg" 
          alt="Terra Luna Classic Background"
          className="h-full w-full object-cover"
        />
        <div 
          className={`absolute inset-0 bg-gradient-to-b ${
            isDark 
              ? 'from-blue-900/70 via-gray-900/80 to-black/90' 
              : 'from-blue-900/50 via-blue-800/60 to-blue-900/70'
          }`}
        />
      </div>

      {/* Animated Background Chart */}
      <div className="absolute inset-0 z-0 opacity-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="w-full h-full"
          onAnimationComplete={() => setAnimationComplete(true)}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isDark ? "#FFD700" : "#FFD700"} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={isDark ? "#3B82F6" : "#3B82F6"} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="y"
                stroke={isDark ? "#FFD700" : "#FFD700"}
                strokeWidth={3}
                fill="url(#chartGradient)"
                isAnimationActive={true}
                animationDuration={2000}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-32" // Added margin-bottom to push content up, making space for buttons
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-white">
            Terra Luna <span className="text-yellow-400">Classic</span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-200 max-w-3xl mx-auto mb-8">
            The community-driven blockchain ecosystem
          </p>
          
          {/* Stats Ticker moved above buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mb-8"
          >
            <div className={`${isDark ? 'bg-gray-800/40' : 'bg-white/40'} px-6 py-3 rounded-xl backdrop-blur-sm flex items-center justify-center gap-6 mx-auto max-w-2xl`}>
              <div>
                <div className="text-sm text-gray-300">LUNC Price</div>
                <div className="text-xl font-bold text-yellow-400">$0.00015</div>
              </div>
              <div className="h-8 w-px bg-gray-600"></div>
              <div>
                <div className="text-sm text-gray-300">Market Cap</div>
                <div className="text-xl font-bold text-white">$892.5M</div>
              </div>
              <div className="h-8 w-px bg-gray-600"></div>
              <div>
                <div className="text-sm text-gray-300">Validators</div>
                <div className="text-xl font-bold text-white">130</div>
              </div>
            </div>
          </motion.div>

          {/* Buttons now appear below the ticker */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => scrollToSection('features')} 
              className={`px-8 py-3 rounded-lg font-medium text-white ${
                isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-700 hover:bg-blue-800'
              } transition-colors`}
            >
              Explore Features
            </button>
            <button 
              onClick={() => scrollToSection('validators')} 
              className={`px-8 py-3 rounded-lg font-medium ${
                isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-blue-900 hover:bg-gray-100'
              } transition-colors`}
            >
              View Validators
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Removed the stats ticker from here and moved it above the buttons */}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-6 left-0 right-0 flex justify-center"
      >
        <button 
          onClick={() => scrollToSection('priceFeeds')}
          className="animate-bounce p-2 cursor-pointer focus:outline-none"
          aria-label="Scroll down"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-white"
          >
            <path d="M7 13l5 5 5-5M7 7l5 5 5-5"/>
          </svg>
        </button>
      </motion.div>
    </header>
  );
};

export default Header;