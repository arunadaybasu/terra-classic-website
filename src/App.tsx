import React, { createContext, useContext, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Moon, Sun } from 'lucide-react';
import Header from './components/Header';
import PriceFeeds from './components/PriceFeeds';
import Features from './components/Features';
import Roadmap from './components/Roadmap';
import Projects from './components/Projects';
import GovernancePage from './pages/Governance';
import ValidatorsPage from './pages/Validators';
import ProjectsPage from './pages/Projects';

const ThemeContext = createContext<{
  isDark: boolean;
  toggleTheme: () => void;
}>({
  isDark: true,
  toggleTheme: () => {},
});

const queryClient = new QueryClient();

function App() {
  const [isDark, setIsDark] = useState(true);
  const [currentPage, setCurrentPage] = useState<'home' | 'governance' | 'validators' | 'projects'>('home');

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={{ isDark, toggleTheme }}>
        <div className={`min-h-screen ${isDark ? 'bg-gradient-to-b from-gray-900 to-black text-white' : 'bg-gradient-to-b from-blue-50 to-white text-gray-900'}`}>
          <div className="fixed top-4 right-4 z-50 flex gap-4">
            <button
              onClick={() => setCurrentPage('home')}
              className={`px-4 py-2 rounded-lg ${
                isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100 shadow-lg'
              } transition-colors duration-200`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage('governance')}
              className={`px-4 py-2 rounded-lg ${
                isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100 shadow-lg'
              } transition-colors duration-200`}
            >
              Governance
            </button>
            <button
              onClick={() => setCurrentPage('validators')}
              className={`px-4 py-2 rounded-lg ${
                isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100 shadow-lg'
              } transition-colors duration-200`}
            >
              Validators
            </button>
            <button
              onClick={() => setCurrentPage('projects')}
              className={`px-4 py-2 rounded-lg ${
                isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100 shadow-lg'
              } transition-colors duration-200`}
            >
              Projects
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                isDark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-white text-gray-800 hover:bg-gray-100 shadow-lg'
              } transition-colors duration-200`}
            >
              {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>
          {currentPage === 'governance' ? (
            <GovernancePage />
          ) : currentPage === 'validators' ? (
            <ValidatorsPage />
          ) : currentPage === 'projects' ? (
            <ProjectsPage />
          ) : (
            <>
              <Header />
              <main>
                <PriceFeeds />
                <Features />
                <Roadmap />
                <Projects />
              </main>
              <footer className={`${isDark ? 'bg-gray-900/50' : 'bg-gray-50'} py-8 text-center`}>
                <p className={isDark ? 'text-white' : 'text-gray-600'}>© 2025 Terra Luna Classic. All rights reserved.</p>
              </footer>
            </>
          )}
        </div>
      </ThemeContext.Provider>
    </QueryClientProvider>
  );
}

export const useTheme = () => useContext(ThemeContext);

export default App;