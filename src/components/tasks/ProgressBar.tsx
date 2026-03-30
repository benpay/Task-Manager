/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ProgressBarProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  size = 'md', 
  showText = true 
}) => {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14'
  };

  const textClasses = {
    sm: 'text-[8px]',
    md: 'text-[10px]',
    lg: 'text-xs'
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]}`}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        <circle 
          className="stroke-slate-100 dark:stroke-slate-800" 
          cx="18" cy="18" fill="none" r={radius} 
          strokeWidth="4"
        />
        <circle 
          className="stroke-primary transition-all duration-500" 
          cx="18" cy="18" fill="none" r={radius} 
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <span className={`absolute font-bold text-slate-700 dark:text-slate-200 ${textClasses[size]}`}>
          {progress}%
        </span>
      )}
    </div>
  );
};

export const LinearProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
    <div 
      className="bg-primary h-full transition-all duration-500" 
      style={{ width: `${progress}%` }}
    />
  </div>
);
