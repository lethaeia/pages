import React from 'react';
import { UserProfile } from '../types';
import { MapPin } from 'lucide-react';
import { FluentCard } from './FluentCard';
import { ThemeToggle } from './ThemeToggle';

interface ProfileHeaderProps {
  profile: UserProfile;
  isDark: boolean;
  toggleTheme: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, isDark, toggleTheme }) => {
  return (
    <FluentCard className="relative p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 text-center md:text-left transition-all duration-300">
      
      {/* Theme Toggle - Positioned top-right */}
      <div className="absolute top-3 right-3 md:top-5 md:right-5 z-20">
        <ThemeToggle isDark={isDark} toggle={toggleTheme} />
      </div>

      {/* Avatar Section */}
      <div className="relative group shrink-0 mt-1 md:mt-0">
        <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden border-[4px] md:border-[5px] border-white/80 dark:border-gray-700/50 shadow-lg mx-auto">
          <img 
            src={profile.avatarUrl} 
            alt={profile.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-2 md:gap-3 max-w-2xl w-full pt-1">
        
        {/* Name and Title Row */}
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 justify-center md:justify-start">
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
            {profile.name}
          </h1>
          
          {/* Vertical Divider - Visible only on desktop */}
          <span className="hidden md:block w-px h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
          
          <p className="text-base md:text-lg text-blue-600 dark:text-blue-400 font-semibold leading-tight">
            {profile.title}
          </p>
        </div>
        
        {/* Bio - Added whitespace-pre-line to allow line breaks */}
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base max-w-lg mx-auto md:mx-0 whitespace-pre-line">
          {profile.bio}
        </p>

        {/* Location */}
        <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
          <MapPin size={14} className="md:w-[16px] md:h-[16px]" />
          <span>{profile.location}</span>
        </div>
      </div>
    </FluentCard>
  );
};