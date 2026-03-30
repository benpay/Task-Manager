/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  List, 
  Calendar, 
  Plus, 
  Folder, 
  Package, 
  CheckCircle,
  Settings,
  User
} from 'lucide-react';

interface SidebarProps {
  view: string;
  setView: (view: 'list' | 'calendar' | 'create' | 'projects' | 'materials') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ view, setView }) => {
  const menuItems = [
    { id: 'list', label: 'Tareas', icon: List },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'projects', label: 'Proyectos', icon: Folder },
    { id: 'materials', label: 'Materiales', icon: Package },
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 h-screen sticky top-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 p-8 z-20">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="bg-primary p-1.5 rounded-lg shadow-lg shadow-primary/20">
          <CheckCircle className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-black tracking-tighter dark:text-white uppercase">Taskly</h1>
      </div>

      <button 
        onClick={() => setView('create')}
        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-4 rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 mb-10 active:scale-95 group"
      >
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        <span>Nueva Tarea</span>
      </button>

      <div className="flex-1 space-y-1">
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 px-4">Menu Principal</p>
        <nav className="space-y-1.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${
                view === item.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <item.icon className={`w-5 h-5 ${view === item.id ? 'text-white' : 'text-slate-400'}`} />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
        <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
          <Settings className="w-5 h-5" />
          <span className="text-sm">Configuración</span>
        </button>
        <div className="p-2 mt-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center gap-3 border border-slate-100 dark:border-slate-700">
          <div className="size-10 rounded-xl bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold shadow-sm">
            BP
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black dark:text-white truncate">Benpay User</p>
            <p className="text-[10px] text-slate-500 font-medium">Plan Premium</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
