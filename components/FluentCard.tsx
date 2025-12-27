import React from 'react';

interface FluentCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export const FluentCard: React.FC<FluentCardProps> = ({ 
  children, 
  className = '', 
  onClick,
  interactive = false
}) => {
  const baseStyles = "relative overflow-hidden rounded-xl border transition-all duration-200";
  
  const materialStyles = `
    bg-white/85 dark:bg-[#1a1a1a]/90
    backdrop-blur-xl saturate-150
    border-white/50 dark:border-white/5
    shadow-sm ring-1 ring-black/5 dark:ring-white/5
  `;

  const interactiveStyles = interactive 
    ? "hover:bg-white/95 dark:hover:bg-[#2d2d2d]/95 hover:scale-[1.02] hover:shadow-md cursor-pointer active:scale-[0.98]" 
    : "";

  return (
    <div 
      onClick={onClick}
      className={`${baseStyles} ${materialStyles} ${interactiveStyles} ${className}`}
    >
      {children}
    </div>
  );
};