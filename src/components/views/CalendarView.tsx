/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Menu, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  CalendarDays, 
  Hammer, 
  Tag 
} from 'lucide-react';
import { Task } from '../../types/task';
import { PriorityBadge } from '../tasks/PriorityBadge';

interface CalendarViewProps {
  tasks: Task[];
  onSelectTask: (taskId: number) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onSelectTask }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="flex flex-col md:flex-row flex-1 gap-8 h-full"
    >
      <div className="flex-1 flex flex-col gap-6">
        <header className="hidden md:flex flex-col gap-1 mb-2">
          <h2 className="text-3xl font-black tracking-tight">Calendario</h2>
          <p className="text-slate-500 dark:text-slate-400">Planifica tus tareas y proyectos DIY.</p>
        </header>

        {/* Calendar Card */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8 px-2">
            <button 
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
              className="flex size-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-all shadow-sm group"
            >
              <ChevronLeft className="w-6 h-6 group-active:scale-90 transition-transform" />
            </button>
            <h3 className="text-xl font-black dark:text-white uppercase tracking-wider">
              {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            <button 
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
              className="flex size-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-all shadow-sm group"
            >
              <ChevronRight className="w-6 h-6 group-active:scale-90 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-y-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="text-slate-400 text-[10px] font-black py-4 uppercase tracking-[0.2em] text-center">{day}</div>
            ))}
            
            {(() => {
              const daysInMonth = getDaysInMonth(selectedDate.getFullYear(), selectedDate.getMonth());
              const firstDay = getFirstDayOfMonth(selectedDate.getFullYear(), selectedDate.getMonth());
              const days = [];
              
              for (let i = 0; i < firstDay; i++) {
                days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
              }
              
              for (let d = 1; d <= daysInMonth; d++) {
                const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const isSelected = selectedDate.getDate() === d;
                const hasTasks = tasks.some(t => t.dueDate === dateStr);
                const isToday = formatDate(new Date()) === dateStr;
                
                days.push(
                  <button 
                    key={d}
                    onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), d))}
                    className="aspect-square flex items-center justify-center relative group"
                  >
                    <div className={`size-11 flex items-center justify-center rounded-2xl font-bold transition-all ${
                      isSelected 
                        ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                        : isToday ? 'border-2 border-primary/30 text-primary' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}>
                      {d}
                    </div>
                    {hasTasks && !isSelected && (
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-primary ring-4 ring-white dark:ring-slate-800"></div>
                    )}
                  </button>
                );
              }
              return days;
            })()}
          </div>
        </div>
      </div>

      {/* Selected Day Tasks */}
      <div className="w-full md:w-96 flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">
            Tareas {selectedDate.getDate()} {selectedDate.toLocaleString('default', { month: 'short' })}
          </h3>
          <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase">
            {tasks.filter(t => t.dueDate === formatDate(selectedDate)).length} pendientes
          </span>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
          {tasks
            .filter(t => t.dueDate === formatDate(selectedDate))
            .map(task => (
              <div 
                key={task.id}
                onClick={() => onSelectTask(task.id)}
                className={`group relative bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all ${
                  task.status === 'hecho' ? 'opacity-60 saturate-50' : ''
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <PriorityBadge priority={task.priority} />
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{task.dueTime || 'Todo el día'}</span>
                  </div>
                  <p className={`text-slate-900 dark:text-white text-sm font-black leading-tight group-hover:text-primary transition-colors ${task.status === 'hecho' ? 'line-through decoration-primary decoration-2' : ''}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-6 h-6 rounded-lg bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center">
                      <Tag className="w-3 h-3 text-slate-400" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest">{task.type}</p>
                  </div>
                </div>
              </div>
            ))}
          
          {tasks.filter(t => t.dueDate === formatDate(selectedDate)).length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-slate-800/20 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800/50">
              <CalendarDays className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Día despejado</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
