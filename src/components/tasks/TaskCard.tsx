/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Wrench, Paintbrush, CheckCircle, Circle } from 'lucide-react';
import { Task } from '../../types/task';
import { PriorityBadge } from './PriorityBadge';
import { ProgressBar } from './ProgressBar';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (taskId: number) => void;
  onSelect: (taskId: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onToggleStatus, 
  onSelect 
}) => {
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const priorityColors = {
    urgente: 'bg-red-500',
    alta: 'bg-orange-500',
    media: 'bg-blue-500',
    baja: 'bg-slate-300',
  };

  return (
    <motion.div 
      layout
      whileHover={{ y: -5, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={() => onSelect(task.id)}
      className={`group relative bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full min-h-[180px] ${
        task.status === 'hecho' ? 'opacity-60 saturate-50' : ''
      }`}
    >
      {/* Dynamic Background Glow */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${
        task.status === 'hecho' ? 'bg-slate-400' : priorityColors[task.priority]
      }`} />

      <div className="flex justify-between items-start mb-4 relative z-10 font-sans">
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 items-center">
            <PriorityBadge priority={task.priority} />
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-slate-900/50 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-800">
              {task.type}
            </span>
          </div>
          <h3 className={`text-lg font-black tracking-tight text-slate-900 dark:text-white leading-tight mt-1 truncate ${task.status === 'hecho' ? 'line-through decoration-primary decoration-2' : ''}`}>
            {task.title}
          </h3>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        </div>

        <div className="flex flex-col items-end gap-3 ml-4">
          {task.type === 'DIY' && task.status !== 'hecho' ? (
            <div className="scale-75 origin-top-right">
              <ProgressBar progress={task.progress || 0} />
            </div>
          ) : (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(task.id);
              }}
              className={`p-2.5 rounded-2xl transition-all ${
                task.status === 'hecho' 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-300 dark:text-slate-600 hover:text-primary dark:hover:text-primary'
              }`}
            >
              {task.status === 'hecho' ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50 dark:border-slate-700/50 relative z-10 font-sans">
        <div className="flex items-center gap-2">
          {task.dueDate === formatDate(new Date()) ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-[10px] font-black text-red-500 uppercase tracking-wider animate-pulse">
              <Calendar className="w-3 h-3" />
              Para hoy
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <Calendar className="w-3 h-3" />
              {task.dueDate || 'Sin fecha'}
            </span>
          )}
        </div>

        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200" />
          <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 bg-primary/20 flex items-center justify-center text-[8px] font-black text-primary">
            +1
          </div>
        </div>
      </div>
    </motion.div>
  );
};
