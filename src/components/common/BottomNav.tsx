/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { List, Calendar, Plus, Folder, Package } from 'lucide-react';

interface BottomNavProps {
  view: string;
  setView: (view: 'list' | 'calendar' | 'create' | 'projects' | 'materials') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ view, setView }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 pb-6 pt-2 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between gap-2">
        <button 
          onClick={() => setView('list')}
          className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${view === 'list' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <div className={`p-1 rounded-lg ${view === 'list' ? 'bg-primary/10' : ''}`}>
            <List className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider">Tareas</p>
        </button>

        <button 
          onClick={() => setView('calendar')}
          className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${view === 'calendar' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <div className={`p-1 rounded-lg ${view === 'calendar' ? 'bg-primary/10' : ''}`}>
            <Calendar className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider">Calendario</p>
        </button>

        <div className="flex flex-1 justify-center">
          <button 
            onClick={() => setView('create')}
            className="flex size-14 -mt-8 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 active:scale-95 transition-transform border-4 border-white dark:border-slate-900"
          >
            <Plus className="w-8 h-8" />
          </button>
        </div>

        <button 
          onClick={() => setView('projects')}
          className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${view === 'projects' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <div className={`p-1 rounded-lg ${view === 'projects' ? 'bg-primary/10' : ''}`}>
            <Folder className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider">Proyectos</p>
        </button>

        <button 
          onClick={() => setView('materials')}
          className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${view === 'materials' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <div className={`p-1 rounded-lg ${view === 'materials' ? 'bg-primary/10' : ''}`}>
            <Package className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider">Materiales</p>
        </button>
      </div>
    </nav>
  );
};
