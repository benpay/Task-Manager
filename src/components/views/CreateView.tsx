/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Check, 
  AlertCircle, 
  AlertTriangle, 
  Minus, 
  ChevronDown as ChevronDownIcon, 
  PlusCircle as AddCircleIcon, 
  Trash2, 
  Plus, 
  Camera, 
  Link as LinkIcon 
} from 'lucide-react';
import { Task } from '../../types/task';

interface CreateViewProps {
  onBack: () => void;
  onCreateTask: (task: Partial<Task>) => void;
}

export const CreateView: React.FC<CreateViewProps> = ({ onBack, onCreateTask }) => {
  const [newTask, setNewTask] = useState<Partial<Task>>({
    type: 'Tareas',
    priority: 'media',
    title: '',
    description: '',
    dueDate: '',
    materials: [],
    steps: [{ title: '', description: '' }],
    gallery: [],
    resources: []
  });

  const [newMaterial, setNewMaterial] = useState({ name: '', quantity: 1 });
  const [newResource, setNewResource] = useState('');

  const handleSave = () => {
    if (!newTask.title) return;
    onCreateTask(newTask);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex flex-col flex-1 overflow-hidden bg-background-light dark:bg-background-dark"
    >
      <header className="sticky top-0 z-10 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-6 h-6 text-slate-700 dark:text-slate-300" />
        </button>
        <h1 className="ml-2 text-lg font-bold tracking-tight flex-1 text-center dark:text-white">Nueva Tarea</h1>
        <button 
          onClick={handleSave}
          className="text-primary font-bold text-base px-2"
        >
          Guardar
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 custom-scrollbar">
        <div className="max-w-3xl mx-auto p-4 space-y-6">
          <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
            <button 
              onClick={() => setNewTask({ ...newTask, type: 'Tareas' })}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${newTask.type === 'Tareas' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
            >
              Tarea
            </button>
            <button 
              onClick={() => setNewTask({ ...newTask, type: 'DIY' })}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${newTask.type === 'DIY' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
            >
              DIY Project
            </button>
          </div>

          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">
                {newTask.type === 'DIY' ? 'Título del Proyecto' : 'Título de la tarea'}
              </span>
              <input 
                type="text"
                className="w-full h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-base focus:ring-2 focus:ring-primary focus:border-primary outline-none dark:text-white"
                placeholder={newTask.type === 'DIY' ? 'Ej. Restaurar mesa de madera' : 'Ej. Comprar víveres'}
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Descripción</span>
              <textarea 
                className="w-full min-h-[120px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-base focus:ring-2 focus:ring-primary focus:border-primary outline-none dark:text-white resize-none"
                placeholder="Añade más detalles aquí..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Fecha</span>
                <input 
                  type="date"
                  className="w-full h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-base focus:ring-2 focus:ring-primary focus:border-primary outline-none dark:text-white"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Hora</span>
                <input 
                  type="time"
                  className="w-full h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-base focus:ring-2 focus:ring-primary focus:border-primary outline-none dark:text-white"
                  onChange={(e) => {
                    const [h, m] = e.target.value.split(':');
                    const hour = parseInt(h);
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    const h12 = hour % 12 || 12;
                    setNewTask({ ...newTask, dueTime: `${String(h12).padStart(2, '0')}:${m} ${ampm}` });
                  }}
                />
              </label>
            </div>

            <div className="space-y-3">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Prioridad</span>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'urgente', label: 'Urgente', icon: <AlertCircle className="w-5 h-5" />, color: 'red' },
                  { id: 'alta', label: 'Alta', icon: <AlertTriangle className="w-5 h-5" />, color: 'orange' },
                  { id: 'media', label: 'Media', icon: <Minus className="w-5 h-5" />, color: 'blue' },
                  { id: 'baja', label: 'Baja', icon: <ChevronDownIcon className="w-5 h-5" />, color: 'emerald' }
                ].map((p) => (
                  <button 
                    key={p.id}
                    onClick={() => setNewTask({ ...newTask, priority: p.id as any })}
                    className={`flex flex-col items-center justify-center gap-1 p-4 rounded-xl border-2 transition-all ${
                      newTask.priority === p.id 
                        ? `border-${p.color}-500 bg-${p.color}-50 dark:bg-${p.color}-900/20` 
                        : `border-transparent bg-${p.color}-50/50 dark:bg-${p.color}-900/10 hover:bg-${p.color}-100 dark:hover:bg-${p.color}-900/20`
                    }`}
                  >
                    <div className={`text-${p.color}-600 dark:text-${p.color}-400`}>{p.icon}</div>
                    <span className={`text-xs font-bold uppercase tracking-wider text-${p.color}-700 dark:text-${p.color}-400`}>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {newTask.type === 'DIY' && (
              <>
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Materiales Requeridos</span>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        className="w-12 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-center focus:ring-primary outline-none dark:text-white"
                        value={newMaterial.quantity}
                        onChange={(e) => setNewMaterial({ ...newMaterial, quantity: parseInt(e.target.value) || 1 })}
                      />
                      <div className="relative flex items-center">
                        <input 
                          type="text"
                          className="h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs px-2 pr-8 focus:ring-primary outline-none dark:text-white"
                          placeholder="Nuevo material..."
                          value={newMaterial.name}
                          onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                        />
                        <button 
                          onClick={() => {
                            if (newMaterial.name) {
                              setNewTask({
                                ...newTask,
                                materials: [...(newTask.materials || []), { name: `${newMaterial.quantity}x ${newMaterial.name}`, checked: false }]
                              });
                              setNewMaterial({ name: '', quantity: 1 });
                            }
                          }}
                          className="absolute right-1 text-primary p-0.5"
                        >
                          <AddCircleIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newTask.materials?.map((m, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-200 dark:bg-slate-800 px-3 py-1.5 rounded-full text-sm font-medium dark:text-white">
                        <span className="text-primary font-bold">{m.name.split(' ')[0]}</span>
                        {m.name.split(' ').slice(1).join(' ')}
                        <button 
                          onClick={() => setNewTask({
                            ...newTask,
                            materials: newTask.materials?.filter((_, i) => i !== idx)
                          })}
                          className="hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Pasos a seguir</span>
                  <div className="space-y-3">
                    {newTask.steps?.map((step, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs shrink-0 mt-2">{idx + 1}</div>
                        <div className="flex-1 space-y-2">
                          <input 
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm py-2 px-3 outline-none focus:ring-1 focus:ring-primary dark:text-white"
                            placeholder="Título del paso..."
                            value={step.title}
                            onChange={(e) => {
                              const steps = [...(newTask.steps || [])];
                              steps[idx].title = e.target.value;
                              setNewTask({ ...newTask, steps });
                            }}
                          />
                          <textarea 
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm py-2 px-3 outline-none focus:ring-1 focus:ring-primary dark:text-white resize-none"
                            placeholder="Descripción (opcional)..."
                            value={step.description}
                            onChange={(e) => {
                              const steps = [...(newTask.steps || [])];
                              steps[idx].description = e.target.value;
                              setNewTask({ ...newTask, steps });
                            }}
                          />
                        </div>
                        <button 
                          onClick={() => setNewTask({
                            ...newTask,
                            steps: newTask.steps?.filter((_, i) => i !== idx)
                          })}
                          className="mt-2 text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => setNewTask({
                        ...newTask,
                        steps: [...(newTask.steps || []), { title: '', description: '' }]
                      })}
                      className="w-full py-2 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-400 text-sm font-medium hover:text-primary hover:border-primary transition-all"
                    >
                      + Añadir Paso
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Antes / Después</span>
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      onClick={() => document.getElementById('new-gallery-upload')?.click()}
                      className="aspect-square rounded-xl bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center text-slate-400 gap-1 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Camera className="w-6 h-6" />
                      <span className="text-[10px] font-bold">Añadir</span>
                    </button>
                    <input 
                      id="new-gallery-upload"
                      type="file"
                      className="hidden"
                      accept="image/*,video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          const type = file.type.startsWith('video') ? 'video' : 'image';
                          setNewTask({
                            ...newTask,
                            gallery: [...(newTask.gallery || []), { type, url }]
                          });
                        }
                      }}
                    />
                    {newTask.gallery?.map((item, idx) => (
                      <div key={idx} className="aspect-square rounded-xl overflow-hidden relative group">
                        {item.type === 'image' ? (
                          <img src={item.url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <video src={item.url} className="w-full h-full object-cover" />
                        )}
                        <button 
                          onClick={() => setNewTask({
                            ...newTask,
                            gallery: newTask.gallery?.filter((_, i) => i !== idx)
                          })}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                        >
                          <Trash2 className="w-6 h-6" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Enlaces de tutoriales</span>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white pl-10 pr-4 py-3 text-sm focus:ring-primary outline-none"
                        placeholder="URL de YouTube o Pinterest"
                        value={newResource}
                        onChange={(e) => setNewResource(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={() => {
                        if (newResource) {
                          setNewTask({
                            ...newTask,
                            resources: [...(newTask.resources || []), { title: 'Tutorial', type: 'video', url: newResource }]
                          });
                          setNewResource('');
                        }
                      }}
                      className="bg-primary text-white px-4 rounded-xl flex items-center justify-center"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {newTask.resources?.map((res, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-medium dark:text-white truncate max-w-[200px]">{res.url}</span>
                        <button 
                          onClick={() => setNewTask({
                            ...newTask,
                            resources: newTask.resources?.filter((_, i) => i !== idx)
                          })}
                          className="text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="pt-4 pb-8">
            <button 
              onClick={handleSave}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-6 h-6" />
              {newTask.type === 'DIY' ? 'Guardar Proyecto' : 'Crear Tarea'}
            </button>
          </div>
        </div>
      </main>
    </motion.div>
  );
};
