/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Bell, 
  CheckCircle, 
  ChevronDown, 
  List, 
  PlusCircle 
} from 'lucide-react';
import { Task } from '../../types/task';
import { TaskCard } from '../tasks/TaskCard';

interface ListViewProps {
  tasks: Task[];
  toggleTaskStatus: (taskId: number) => void;
  onSelectTask: (taskId: number) => void;
  onCreateTask: () => void;
}

export const ListView: React.FC<ListViewProps> = ({ 
  tasks, 
  toggleTaskStatus, 
  onSelectTask, 
  onCreateTask 
}) => {
  const [filterPriority, setFilterPriority] = useState('');
  const [filterType, setFilterType] = useState<'DIY' | 'Tareas' | ''>('');
  const [filterStatus, setFilterStatus] = useState<'en curso' | 'hecho' | ''>('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [readNotificationsIds, setReadNotificationsIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('read_notifications_ids');
    return saved ? JSON.parse(saved) : [];
  });

  const getNotificationTasks = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayObj = new Date(todayStr + "T00:00:00");
    
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDateObj = new Date(task.dueDate + "T00:00:00");
      const diffDays = (todayObj.getTime() - taskDateObj.getTime()) / (1000 * 3600 * 24);
      // diffDays gives how many days ago relative to today (0 means today)
      return diffDays >= 0 && diffDays <= 5;
    }).sort((a, b) => new Date(b.dueDate!).getTime() - new Date(a.dueDate!).getTime());
  };

  const notificationTasks = getNotificationTasks();
  const hasUnread = notificationTasks.some(t => !readNotificationsIds.includes(t.id));

  const handleOpenNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      const newReadIds = Array.from(new Set([...readNotificationsIds, ...notificationTasks.map(t => t.id)]));
      setReadNotificationsIds(newReadIds);
      localStorage.setItem('read_notifications_ids', JSON.stringify(newReadIds));
    }
  };

  const NotificationsMenu = () => (
    <div className="relative z-50">
      <button 
        onClick={handleOpenNotifications}
        className="relative p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
      >
        <Bell className="w-6 h-6" />
        {hasUnread && (
          <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-red-500"></span>
        )}
      </button>
      
      {showNotifications && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 mt-2 w-72 md:w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden"
        >
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <h3 className="font-bold text-slate-800 dark:text-white">Notificaciones</h3>
          </div>
          <div className="max-h-80 overflow-y-auto custom-scrollbar p-2">
            {notificationTasks.length > 0 ? (
              notificationTasks.map(task => (
                <div 
                  key={task.id} 
                  className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl cursor-pointer transition-colors" 
                  onClick={() => {
                    setShowNotifications(false);
                    onSelectTask(task.id);
                  }}
                >
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{task.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Vence: {task.dueDate} {task.dueTime ? `a las ${task.dueTime}` : ''}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm">
                No hay tareas recientes.
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesPriority = filterPriority === '' || task.priority === filterPriority;
    const matchesType = filterType === '' || task.type === filterType;
    const matchesStatus = filterStatus === '' || task.status === filterStatus;
    return matchesPriority && matchesType && matchesStatus;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex flex-col flex-1"
    >
      {/* Mobile Header - Hidden on Desktop */}
      <header className="md:hidden flex items-center justify-between py-3 mb-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="text-primary w-8 h-8" />
          <h1 className="text-xl font-bold tracking-tight">Task Manager</h1>
        </div>
        <NotificationsMenu />
      </header>

      {/* Desktop Dashboard Header */}
      <div className="hidden md:flex justify-between items-start mb-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-extrabold tracking-tight">Mi Dashboard</h2>
          <p className="text-slate-500 dark:text-slate-400">Tienes {tasks.filter(t => t.status === 'en curso').length} tareas pendientes para hoy.</p>
        </div>
        <NotificationsMenu />
      </div>
        
      <div className="hidden md:grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Pendientes', value: tasks.filter(t => t.status === 'en curso').length, color: 'blue' },
            { label: 'Urgentes', value: tasks.filter(t => t.priority === 'urgente' && t.status === 'en curso').length, color: 'red' },
            { label: 'Proyectos DIY', value: tasks.filter(t => t.type === 'DIY').length, color: 'purple' },
            { label: 'Completadas', value: tasks.filter(t => t.status === 'hecho').length, color: 'emerald' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className={`text-2xl font-black text-${stat.color}-600 dark:text-${stat.color}-400`}>{stat.value}</p>
            </div>
          ))}
        </div>
      {/* Filters Section - More horizontal on desktop */}
      <section className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Buscar por Prioridad</label>
            <div className="relative">
              <select 
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="appearance-none w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
              >
                <option value="">Todas las prioridades</option>
                <option value="urgente">Urgente</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 w-5 h-5" />
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Tipo de Tarea</label>
            <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
              <button 
                onClick={() => setFilterType(filterType === 'DIY' ? '' : 'DIY')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${filterType === 'DIY' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                DIY
              </button>
              <button 
                onClick={() => setFilterType(filterType === 'Tareas' ? '' : 'Tareas')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${filterType === 'Tareas' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                Tareas
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Estado</label>
            <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
              <button 
                onClick={() => setFilterStatus(filterStatus === 'en curso' ? '' : 'en curso')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${filterStatus === 'en curso' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                En curso
              </button>
              <button 
                onClick={() => setFilterStatus(filterStatus === 'hecho' ? '' : 'hecho')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${filterStatus === 'hecho' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                Hecho
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Task Grid / List */}
      <section className="pb-24">
        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard 
                key={task.id}
                task={task}
                onToggleStatus={toggleTaskStatus}
                onSelect={onSelectTask}
              />
            ))}
            
            <button 
              onClick={onCreateTask}
              className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 dark:text-slate-600 hover:bg-white dark:hover:bg-slate-800 hover:border-primary/50 hover:text-primary transition-all group min-h-[160px]"
            >
              <PlusCircle className="w-10 h-10 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm">Nueva tarea</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <List className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-700" />
            <h3 className="text-xl font-bold dark:text-white">Sin resultados</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1">No hay tareas que coincidan con los filtros.</p>
            <button 
              onClick={() => { setFilterPriority(''); setFilterType(''); setFilterStatus(''); }}
              className="mt-6 text-primary font-bold hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </section>
    </motion.div>
  );
};
