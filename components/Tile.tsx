import React, { useState } from 'react';
import { TileData } from '../types';
import { FluentCard } from './FluentCard';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { DinoGame } from './DinoGame';

interface TileProps {
  data: TileData;
}

export const Tile: React.FC<TileProps> = ({ data }) => {
  const { title, description, icon: Icon, url, color, size, customType } = data;
  const [copied, setCopied] = useState(false);
  const colSpanClass = {
    small: 'col-span-1',
    medium: 'col-span-1', 
    large: 'col-span-1 sm:col-span-2 row-span-1 sm:row-span-2',
    wide: 'col-span-1 sm:col-span-2',
  }[size || 'medium'];
  if (customType === 'dino') {
    return (
      <div className={`block ${colSpanClass} h-full min-h-[140px]`}>
        <DinoGame data={data} />
      </div>
    );
  }
  if (customType === 'email') {
    const handleCopy = (e: React.MouseEvent) => {
      e.preventDefault();
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    };

    return (
      <div 
        onClick={handleCopy} 
        className={`block ${colSpanClass} h-full min-h-[140px] cursor-pointer`}
      >
        <FluentCard interactive className="h-full p-5 flex flex-col justify-between group transition-all duration-300">
          
          <div className="flex justify-between items-start">
            <div 
              className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-colors group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40"
              style={color ? { color: color } : {}}
            >
              <Icon size={24} strokeWidth={1.5} />
            </div>
            {copied ? (
              <Check size={18} className="text-green-500 transition-all scale-110" />
            ) : (
              <Copy size={16} className="opacity-0 group-hover:opacity-50 transition-opacity text-gray-500 dark:text-gray-400" />
            )}
          </div>

          <div className="mt-4">
            <h3 className="text-base font-bold text-black dark:text-white leading-tight">
              {copied ? 'Copied!' : title}
            </h3>
            {description && (
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-200 leading-snug line-clamp-2 font-medium">
                {description}
              </p>
            )}
          </div>
        </FluentCard>
      </div>
    );
  }

  const isMailto = url.startsWith('mailto:');
  const target = isMailto ? undefined : "_blank";
  const rel = isMailto ? undefined : "noopener noreferrer";

  return (
    <a 
      href={url} 
      target={target} 
      rel={rel} 
      className={`block ${colSpanClass} h-full min-h-[140px]`}
    >
      <FluentCard interactive className="h-full p-5 flex flex-col justify-between group transition-all duration-300">
        
        <div className="flex justify-between items-start">
          <div 
            className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-colors group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40"
            style={color ? { color: color } : {}}
          >
            <Icon size={24} strokeWidth={1.5} />
          </div>
          {!isMailto && (
            <ExternalLink size={16} className="opacity-0 group-hover:opacity-50 transition-opacity text-gray-500 dark:text-gray-400" />
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-base font-bold text-black dark:text-white leading-tight">
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-200 leading-snug line-clamp-2 font-medium">
              {description}
            </p>
          )}
        </div>
      </FluentCard>
    </a>
  );
};