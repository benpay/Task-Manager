/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface PriorityBadgeProps {
  priority: 'urgente' | 'alta' | 'media' | 'baja';
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = "" }) => {
  const styles = {
    urgente: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    alta: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    media: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    baja: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${styles[priority]} ${className}`}>
      {priority}
    </span>
  );
};
