import React from 'react';
import { Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../App';

const Header = () => {
  const { isDark } = useTheme();
  
  return (
    <header className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-blue-600 via-blue-500 to-yellow-500' : 'bg-gradient-to-b from-blue-900 to-blue-800'} py-24 sm:py-32`}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      >
        <img
          src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80"
          alt="Space background"
          className="h-full w-full object-cover"
        />
        {!isDark && (
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-blue-800/50 backdrop-blur-sm"></div>
        )}
      </motion.div>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          className="flex items-center justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Moon className={`h-16 w-16 ${isDark ? 'text-blue-500' : 'text-blue-300'}`} />
          <h1 className="ml-4 text-5xl font-bold">
            Terra <span className="text-yellow-400">Luna</span> Classic
          </h1>
        </motion.div>
        <motion.p 
          className="mx-auto mt-6 max-w-2xl text-center text-xl text-blue-100"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          The community-driven blockchain platform rebuilding the future of decentralized finance
        </motion.p>
      </div>
    </header>
  );
};

export default Header;