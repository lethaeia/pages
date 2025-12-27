import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  toggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, toggle }) => {
  return (
    <button
      onClick={toggle}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="
        p-2 rounded-md
        bg-transparent 
        hover:bg-black/5 dark:hover:bg-white/10
        active:bg-black/10 dark:active:bg-white/20
        transition-colors duration-150
        text-gray-600 dark:text-gray-300
        focus:outline-none focus:ring-2 focus:ring-blue-500/50
      "
      aria-label="Toggle Dark Mode"
    >
      {isDark ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
    </button>
  );
};