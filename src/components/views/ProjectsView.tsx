/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Folder, 
  Circle, 
  Search 
} from 'lucide-react';
import { Task } from '../../types/task';
import { PriorityBadge } from '../tasks/PriorityBadge';
import { LinearProgressBar } from '../tasks/ProgressBar';

interface ProjectsViewProps {
  tasks: Task[];
  onSelectTask: (taskId: number) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ tasks, onSelectTask }) => {
  const [projectSearch, setProjectSearch] = useState('');
  const [projectFilterStatus, setProjectFilterStatus] = useState<'en curso' | 'hecho'>('en curso');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex flex-col flex-1"
    >
      <header className="hidden md:flex flex-col gap-1 mb-8">
        <h2 className="text-3xl font-black tracking-tight">Proyectos DIY</h2>
        <p className="text-slate-500 dark:text-slate-400">Gestiona tus construcciones y reformas.</p>
      </header>

      {/* Mobile Header - Hidden on Desktop */}
      <header className="md:hidden flex items-center justify-between py-3 mb-6">
        <div className="flex items-center gap-3">
          <Folder className="text-primary w-8 h-8" />
          <h1 className="text-xl font-bold tracking-tight">Proyectos</h1>
        </div>
      </header>

      {/* Control Bar */}
      <section className="bg-white dark:bg-slate-800/50 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 font-bold" />
            <input 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary shadow-sm dark:shadow-none dark:text-white transition-all outline-none" 
              placeholder="Buscar proyectos..." 
              type="text"
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
            />
          </div>

          <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl min-w-[240px]">
            <button 
              onClick={() => setProjectFilterStatus('en curso')}
              className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all uppercase tracking-wider ${projectFilterStatus === 'en curso' ? 'bg-white dark:bg-slate-700 shadow-lg text-primary' : 'text-slate-500 dark:text-slate-400'}`}
            >
              En curso
            </button>
            <button 
              onClick={() => setProjectFilterStatus('hecho')}
              className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all uppercase tracking-wider ${projectFilterStatus === 'hecho' ? 'bg-white dark:bg-slate-700 shadow-lg text-primary' : 'text-slate-500 dark:text-slate-400'}`}
            >
              Terminado
            </button>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-24">
        {tasks
          .filter(t => t.type === 'DIY' && t.status === projectFilterStatus && t.title.toLowerCase().includes(projectSearch.toLowerCase()))
          .map(project => (
            <div 
              key={project.id}
              onClick={() => onSelectTask(project.id)}
              className={`group relative bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 cursor-pointer hover:shadow-2xl hover:border-primary/30 transition-all overflow-hidden flex flex-col ${
                project.status === 'hecho' ? 'opacity-60 saturate-50' : ''
              }`}
            >
              <div className="flex gap-6 mb-6">
                <div 
                  className="w-24 h-24 rounded-3xl bg-cover bg-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-500" 
                  style={{ backgroundImage: `url('${project.bannerImage || 'https://picsum.photos/seed/' + project.id + '/200/200'}')` }}
                ></div>
                <div className="flex-1 flex flex-col justify-center gap-1.5">
                  <div className="flex justify-between items-center">
                    <PriorityBadge priority={project.priority} />
                    <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-tighter">{project.progress || 0}%</span>
                  </div>
                  <h3 className="text-xl font-black dark:text-white leading-tight mt-1">{project.title}</h3>
                </div>
              </div>
              
              <div className="mt-auto space-y-4">
                <div className="bg-slate-100 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress || 0}%` }}
                    className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full"
                  />
                </div>
                <div className="flex justify-between items-center px-1">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    {Math.round(((project.progress || 0) / 100) * 12)} / 12 Pasos
                  </p>
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="size-8 rounded-full border-4 border-white dark:border-slate-800 bg-slate-200 overflow-hidden shadow-sm">
                        <img src={`https://i.pravatar.cc/150?u=${project.id + i}`} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

        {tasks.filter(t => t.type === 'DIY' && t.status === projectFilterStatus && t.title.toLowerCase().includes(projectSearch.toLowerCase())).length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 shadow-sm">
            <Folder className="w-20 h-20 mb-4 text-slate-200 dark:text-slate-700" />
            <h3 className="text-xl font-black dark:text-white">Sin proyectos</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">No se encontraron proyectos DIY con estos filtros.</p>
          </div>
        )}
      </main>
    </motion.div>
  );
};
