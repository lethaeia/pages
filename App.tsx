import React, { useState, useEffect } from 'react';
import { TILES, USER_PROFILE, CUSTOM_BACKGROUND_URL } from './constants';
import { Tile } from './components/Tile';
import { ProfileHeader } from './components/ProfileHeader';

const App: React.FC = () => {
  // Theme State
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('theme') === 'dark' ||
        (!('theme' in window.localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Theme Effect
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className={`min-h-screen flex flex-col justify-center transition-colors duration-300 relative selection:bg-blue-500/30 overflow-x-hidden`}>
      
      {/* Background Layer */}
      <div className="fixed inset-0 -z-10 bg-gray-50 dark:bg-black transition-colors duration-500">
        
        {CUSTOM_BACKGROUND_URL ? (
          /* Custom Background Image Logic */
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-[1.01] blur-[6px]"
              style={{ backgroundImage: `url(${CUSTOM_BACKGROUND_URL})` }}
            />
            {/* Dark Mode Overlay for Custom Background (Dimming) */}
            <div className={`absolute inset-0 bg-white/10 dark:bg-black/40 transition-colors duration-500 pointer-events-none`} />
          </>
        ) : (
          /* Default Gradient Background */
          <>
            <div className={`absolute inset-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-white opacity-100 dark:opacity-0 transition-opacity duration-500`} />
            <div className={`absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-black opacity-0 dark:opacity-100 transition-opacity duration-500`} />
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-300/30 dark:bg-purple-900/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-blue-300/30 dark:bg-blue-900/20 rounded-full blur-[80px]" />
          </>
        )}
      </div>

      {/* Main Container - Centered Flex Item */}
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12 flex flex-col">
        
        {/* Header Section */}
        <header className="mb-8 md:mb-12 animate-[fadeIn_0.5s_ease-out]">
          <ProfileHeader 
            profile={USER_PROFILE} 
            isDark={isDark} 
            toggleTheme={toggleTheme} 
          />
        </header>

        {/* Separator / Subtitle */}
        <div className="mb-4 md:mb-6 pl-4 border-l-[4px] border-blue-600 dark:border-blue-400">
          <h2 className="text-xl md:text-2xl font-bold text-gray-600 dark:text-gray-400 tracking-tight drop-shadow-md">
            Explore
          </h2>
        </div>

        {/* Tiles Grid */}
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(140px,auto)] animate-[fadeIn_0.7s_ease-out_0.2s_both]">
          {TILES.map((tile) => (
            <Tile key={tile.id} data={tile} />
          ))}
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
          <p className="drop-shadow-md text-shadow">© {new Date().getFullYear()} {USER_PROFILE.name}. Built with React & Tailwind.</p>
        </footer>

      </div>
    </div>
  );
};

export default App;