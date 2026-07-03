/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  MoreVertical, 
  Upload, 
  Tag, 
  Calendar, 
  Package, 
  Wrench, 
  List, 
  Pencil, 
  X, 
  Save, 
  Trash2, 
  Plus, 
  Image as ImageIcon, 
  Play, 
  Bell, 
  CheckCircle, 
  RotateCcw,
  Sparkles,
  Loader2,
  Link
} from 'lucide-react';
import { Task, Material } from '../../types/task';
import { PriorityBadge } from '../tasks/PriorityBadge';
import { LinearProgressBar } from '../tasks/ProgressBar';
import { getAIImageKeywords, generateTaskDescription, generateImageBase64 } from '../../services/AIService';

interface DetailsViewProps {
  task: Task;
  onBack: () => void;
  updateTaskField: (taskId: number, field: keyof Task | Partial<Task>, value?: any) => void;
  updateTaskProgress: (taskId: number, progress: number) => void;
  toggleMaterial: (taskId: number, materialName: string) => void;
  updateBannerImage: (taskId: number, imageUrl: string) => void;
  addToGallery: (taskId: number, item: { type: 'image' | 'video'; url: string }) => void;
  saveSteps: (taskId: number, steps: { title: string; description: string }[]) => void;
  toggleTaskStatus: (taskId: number) => void;
  addTaskMaterial: (taskId: number, name: string, quantity: number, unit: string) => void;
  removeTaskMaterial: (taskId: number, name: string) => void;
  deleteTask: (taskId: number) => void;
  materials: Material[];
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const DetailsView: React.FC<DetailsViewProps> = ({ 
  task, 
  onBack,
  updateTaskField,
  updateTaskProgress,
  toggleMaterial,
  updateBannerImage,
  addToGallery,
  saveSteps,
  toggleTaskStatus,
  addTaskMaterial,
  removeTaskMaterial,
  deleteTask,
  materials
}) => {
  const [isEditingSteps, setIsEditingSteps] = useState(false);
  const [editingSteps, setEditingSteps] = useState<{ title: string; description: string }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newResourceUrl, setNewResourceUrl] = useState('');

  const [isEditingDate, setIsEditingDate] = useState(false);
  const [tempDueDate, setTempDueDate] = useState('');
  const [tempDueTime, setTempDueTime] = useState('');

  const [newMatName, setNewMatName] = useState('');
  const [newMatQty, setNewMatQty] = useState(1);
  const [newMatUnit, setNewMatUnit] = useState('uds');

  const handleAddMaterial = () => {
    if (!newMatName.trim()) return;
    addTaskMaterial(task.id, newMatName.trim(), newMatQty, newMatUnit);
    setNewMatName('');
    setNewMatQty(1);
  };

  const handleAddResource = () => {
    if (!newResourceUrl.trim()) return;
    
    let title = 'Tutorial';
    try {
      const urlObj = new URL(newResourceUrl);
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        title = 'Video de YouTube';
      } else if (urlObj.hostname.includes('pinterest.com')) {
        title = 'Pinterest';
      } else {
        title = urlObj.hostname.replace('www.', '');
      }
    } catch (e) {
      // fallback
    }

    const currentResources = task.resources || [];
    const newResource = {
      title,
      type: 'video' as const,
      url: newResourceUrl.trim()
    };
    
    updateTaskField(task.id, 'resources', [...currentResources, newResource]);
    setNewResourceUrl('');
  };

  const isCompleted = task.status === 'hecho';
  const isDIY = task.type === 'DIY';

  const handleSaveSteps = () => {
    saveSteps(task.id, editingSteps);
    setIsEditingSteps(false);
  };

  const generateAIImage = async () => {
    setIsGenerating(true);
    try {
      const base64Image = await generateImageBase64(`professional conceptual photo for a task about: ${task.title}. realistic, high quality, cinematic lighting`);
      
      if (base64Image) {
        updateBannerImage(task.id, base64Image);
      } else {
        // Fallback to pollinations if Gemini fails
        const aiKeywords = await getAIImageKeywords(task.title);
        const randomSeed = Math.floor(Math.random() * 1000000);
        const aiImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(aiKeywords)}?width=1200&height=600&seed=${randomSeed}&nologo=true`;
        updateBannerImage(task.id, aiImageUrl);
      }
    } catch (error) {
      console.error("AI Image Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    try {
      const aiDescription = await generateTaskDescription(task.title);
      updateTaskField(task.id, 'description', aiDescription);
    } catch (error) {
      console.error("AI Description Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="flex flex-col flex-1"
    >
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:text-primary transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-3xl font-black tracking-tight dark:text-white line-clamp-1">{task.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <PriorityBadge priority={task.priority} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-full">{task.type}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
                deleteTask(task.id);
                onBack();
              }
            }}
            className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-red-500 transition-all"
            title="Eliminar tarea"
          >
            <Trash2 className="w-6 h-6" />
          </button>
          <button 
            onClick={() => toggleTaskStatus(task.id)}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black uppercase text-xs tracking-wider transition-all shadow-xl shadow-primary/20 ${
              isCompleted ? 'bg-emerald-500 text-white' : 'bg-primary text-white hover:scale-105'
            }`}
          >
            {isCompleted ? <CheckCircle className="w-5 h-5" /> : <RotateCcw className="w-5 h-5" />}
            {isCompleted ? 'Completada' : 'Marcar como Hecha'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info Card */}
          <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 relative">
            <div className="relative h-72 group">
              <img 
                alt={task.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                src={task.bannerImage || (isDIY ? 'https://picsum.photos/seed/diy/1200/600' : 'https://picsum.photos/seed/task/1200/600')} 
              />
              
              {/* AI Overlay & Button */}
              <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
                <button 
                  onClick={(e) => { e.stopPropagation(); generateAIImage(); }}
                  disabled={isGenerating}
                  className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl shadow-2xl flex items-center gap-2 font-black uppercase text-[10px] text-primary hover:scale-105 active:scale-95 transition-all border border-white/20 dark:border-slate-700"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {isGenerating ? 'Generando...' : 'Generar IA'}
                </button>
              </div>

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => document.getElementById('banner-upload')?.click()}>
                <div className="bg-white p-4 rounded-3xl shadow-2xl flex items-center gap-2 font-black uppercase text-xs text-primary">
                  <Upload className="w-5 h-5" /> Cambiar Portada
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Descripción</h3>
                <button 
                  onClick={handleGenerateDescription}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:text-blue-600 transition-colors disabled:opacity-50"
                  title="Generar descripción con IA"
                >
                  <Sparkles className="w-3 h-3" />
                  Sugerir IA
                </button>
              </div>
              <p className="text-lg font-medium text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                {task.description || "Sin descripción proporcionada."}
              </p>

              {isDIY && task.steps && (
                <div className="pt-8 border-t border-slate-50 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Guía paso a paso</h3>
                    {!isEditingSteps ? (
                      <button 
                        onClick={() => {
                          setEditingSteps(task.steps ? task.steps.map(s => ({ ...s })) : []);
                          setIsEditingSteps(true);
                        }} 
                        className="text-primary font-black text-[10px] uppercase tracking-widest hover:underline"
                      >
                        Editar Pasos
                      </button>
                    ) : (
                      <div className="flex gap-4">
                        <button 
                          onClick={handleSaveSteps} 
                          className="text-emerald-500 font-black text-[10px] uppercase tracking-widest hover:underline flex items-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" /> Guardar
                        </button>
                        <button 
                          onClick={() => setIsEditingSteps(false)} 
                          className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:underline flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-6">
                    {isEditingSteps ? (
                      <>
                        {editingSteps.map((step, idx) => (
                          <div key={idx} className="flex gap-4 items-start bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white text-xs shrink-0 font-black mt-1">
                              {idx + 1}
                            </div>
                            <div className="flex-1 space-y-2">
                              <input 
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm py-2 px-3 outline-none focus:ring-1 focus:ring-primary dark:text-white font-bold"
                                placeholder="Título del paso..."
                                value={step.title}
                                onChange={(e) => {
                                  const steps = [...editingSteps];
                                  steps[idx].title = e.target.value;
                                  setEditingSteps(steps);
                                }}
                              />
                              <textarea 
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm py-2 px-3 outline-none focus:ring-1 focus:ring-primary dark:text-white resize-none"
                                placeholder="Descripción (opcional)..."
                                value={step.description}
                                rows={2}
                                onChange={(e) => {
                                  const steps = [...editingSteps];
                                  steps[idx].description = e.target.value;
                                  setEditingSteps(steps);
                                }}
                              />
                            </div>
                            <button 
                              onClick={() => {
                                const steps = editingSteps.filter((_, i) => i !== idx);
                                setEditingSteps(steps);
                              }}
                              className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all mt-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={() => setEditingSteps([...editingSteps, { title: '', description: '' }])}
                          className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 text-sm font-black uppercase tracking-widest hover:text-primary hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-all flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> Añadir Paso
                        </button>
                      </>
                    ) : (
                      task.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-6 group">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-primary font-black group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="font-black text-slate-900 dark:text-white">{step.title}</h4>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{step.description}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Gallery - More horizontal on desktop */}
          <section className="space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] px-2">Galería de Progreso</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {task.gallery?.map((item, idx) => (
                <div key={idx} className="aspect-square rounded-3xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-lg group relative cursor-pointer">
                  <img src={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Gallery item" />
                </div>
              ))}
              <button 
                onClick={() => document.getElementById('gallery-upload')?.click()}
                className="aspect-square rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-primary hover:border-primary transition-all group"
              >
                <Plus className="w-8 h-8 group-hover:rotate-90 transition-all" />
                <span className="text-[10px] font-black uppercase tracking-widest">Añadir Foto</span>
              </button>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Sidebar Info Section */}
          <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 space-y-8">
             {isDIY && (
              <div>
                <div className="flex justify-between items-center mb-4 px-1">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Estado del Proyecto</h4>
                  <span className="text-primary font-black text-lg">{task.progress || 0}%</span>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden mb-6">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${task.progress || 0}%` }} className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[25, 50, 75, 100].map(p => (
                    <button key={p} onClick={() => updateTaskProgress(task.id, p)} className={`py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${task.progress === p ? 'bg-primary text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-500 hover:text-primary'}`}>{p}%</button>
                   ))}
                </div>
              </div>
             )}

             <div>
               <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Fecha de Entrega</h4>
               {!isEditingDate ? (
                 <div 
                   onClick={() => {
                     setTempDueDate(task.dueDate || '');
                     setTempDueTime(task.dueTime || '');
                     setIsEditingDate(true);
                   }}
                   className="bg-slate-50 dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 flex items-center gap-4 cursor-pointer hover:border-primary/30 dark:hover:border-primary/30 hover:bg-slate-100/50 dark:hover:bg-slate-900/80 transition-all group animate-fade-in"
                   title="Haga clic para editar la fecha y hora"
                 >
                   <div className="size-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm group-hover:scale-105 transition-all">
                     <Calendar className="w-6 h-6" />
                   </div>
                   <div>
                     <p className="text-sm font-black dark:text-white leading-tight">{task.dueDate || "Sin fecha"}</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{task.dueTime || "Todo el día"}</p>
                   </div>
                 </div>
               ) : (
                 <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 flex flex-col gap-4">
                   <div className="flex items-center gap-4">
                     <div className="size-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm shrink-0">
                       <Calendar className="w-6 h-6" />
                     </div>
                     <div className="flex-1 space-y-2">
                       <input 
                         type="date"
                         className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs py-2 px-3 outline-none focus:ring-1 focus:ring-primary dark:text-white font-bold"
                         value={tempDueDate}
                         onChange={(e) => setTempDueDate(e.target.value)}
                       />
                       <input 
                         type="time"
                         className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs py-2 px-3 outline-none focus:ring-1 focus:ring-primary dark:text-white font-bold"
                         value={
                           tempDueTime 
                             ? (() => {
                                 const match = tempDueTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
                                 if (match) {
                                   let [_, h, m, ampm] = match;
                                   let hour = parseInt(h);
                                   if (ampm.toUpperCase() === 'PM' && hour < 12) hour += 12;
                                   if (ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
                                   return `${String(hour).padStart(2, '0')}:${m}`;
                                 }
                                 return '';
                               })()
                             : ''
                         }
                         onChange={(e) => {
                           const val = e.target.value;
                           if (!val) {
                             setTempDueTime('');
                             return;
                           }
                           const [h, m] = val.split(':');
                           const hour = parseInt(h);
                           const ampm = hour >= 12 ? 'PM' : 'AM';
                           const h12 = hour % 12 || 12;
                           setTempDueTime(`${String(h12).padStart(2, '0')}:${m} ${ampm}`);
                         }}
                       />
                     </div>
                   </div>
                   <div className="flex justify-end gap-2">
                     <button 
                       onClick={() => setIsEditingDate(false)}
                       className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 transition-all"
                     >
                       Cancelar
                     </button>
                      <button 
                        onClick={() => {
                          updateTaskField(task.id, { dueDate: tempDueDate, dueTime: tempDueTime });
                          setIsEditingDate(false);
                        }}
                       className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-[10px] font-black uppercase tracking-wider text-white transition-all shadow-md shadow-primary/20"
                     >
                       Guardar
                     </button>
                   </div>
                 </div>
               )}
             </div>

             {task.materials && (
               <div>
                 <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Inventario Necesario</h4>
                 <div className="space-y-3">
                    {task.materials.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-transparent hover:border-primary/20 transition-all group">
                        <label className="flex items-center gap-3 cursor-pointer flex-1">
                          <input type="checkbox" checked={m.checked} onChange={() => toggleMaterial(task.id, m.name)} className="size-5 rounded-lg border-slate-200 text-primary focus:ring-primary" />
                          <span className={`text-sm font-bold transition-all ${m.checked ? 'text-slate-300 line-through' : 'text-slate-700 dark:text-slate-300 group-hover:text-primary'}`}>{m.name}</span>
                        </label>
                        <button 
                          onClick={() => removeTaskMaterial(task.id, m.name)}
                          className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                          title="Eliminar material"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                 </div>

                 {/* Form to add new material to task */}
                 <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-3">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Añadir material requerido</p>
                   <div className="flex gap-2">
                     <input 
                       type="number" 
                       min="1"
                       className="w-16 h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-center focus:ring-1 focus:ring-primary outline-none dark:text-white font-bold"
                       value={newMatQty}
                       onChange={(e) => setNewMatQty(parseInt(e.target.value) || 1)}
                     />
                     <select 
                       className="w-16 h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-center focus:ring-1 focus:ring-primary outline-none dark:text-white font-bold"
                       value={newMatUnit}
                       onChange={(e) => setNewMatUnit(e.target.value)}
                     >
                       <option value="uds">uds</option>
                       <option value="m">m</option>
                     </select>
                     <div className="relative flex-1">
                       <input 
                         type="text"
                         list="details-materials-list"
                         className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs px-3 focus:ring-1 focus:ring-primary outline-none dark:text-white font-bold"
                         placeholder="Ej. Saco de cemento"
                         value={newMatName}
                         onChange={(e) => setNewMatName(e.target.value)}
                         onKeyDown={(e) => {
                           if (e.key === 'Enter') {
                             handleAddMaterial();
                           }
                         }}
                       />
                     </div>
                     <button 
                       onClick={handleAddMaterial}
                       className="bg-primary hover:bg-primary/95 text-white size-10 rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-all"
                     >
                       <Plus className="w-5 h-5" />
                     </button>
                   </div>
                   <datalist id="details-materials-list">
                     {materials.map(m => (
                       <option key={m.id} value={m.name} />
                     ))}
                   </datalist>
                 </div>
               </div>
             )}
          </section>

          {/* Resources */}
          {isDIY && (
            <section className="space-y-4">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] px-2">Recursos y Tutoriales</h3>
              <div className="space-y-3">
                {task.resources && task.resources.length > 0 ? (
                  task.resources.map((res, idx) => (
                    <div key={idx} className="relative group">
                      <a href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all pr-12 group-hover:border-primary/20">
                        <div className="size-10 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black dark:text-white truncate font-bold">{res.title}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{res.url}</p>
                        </div>
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          const updated = (task.resources || []).filter((_, i) => i !== idx);
                          updateTaskField(task.id, 'resources', updated);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-slate-50 dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-500 rounded-xl transition-all border border-slate-100 dark:border-slate-800 opacity-0 group-hover:opacity-100"
                        title="Eliminar recurso"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 text-center border border-slate-100 dark:border-slate-800 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400">No hay tutoriales o enlaces agregados.</p>
                  </div>
                )}

                {/* Agregar nuevo recurso */}
                <div className="flex gap-2 pt-2">
                  <div className="relative flex-1">
                    <Link className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-950 dark:text-white pl-11 pr-4 py-3 text-xs focus:ring-1 focus:ring-primary outline-none shadow-sm font-medium"
                      placeholder="Pegar enlace de YouTube, Pinterest..."
                      value={newResourceUrl}
                      onChange={(e) => setNewResourceUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddResource();
                        }
                      }}
                    />
                  </div>
                  <button 
                    onClick={handleAddResource}
                    className="bg-primary hover:bg-primary/95 text-white px-4 rounded-2xl flex items-center justify-center shadow-md active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
      <input 
        id="banner-upload"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            try {
              const base64 = await fileToBase64(file);
              updateBannerImage(task.id, base64);
            } catch (err) {
              console.error("Error reading file:", err);
            }
          }
        }}
      />
      <input 
        id="gallery-upload"
        type="file"
        className="hidden"
        accept="image/*,video/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            try {
              const base64 = await fileToBase64(file);
              const type = file.type.startsWith('video') ? 'video' : 'image';
              addToGallery(task.id, { type, url: base64 });
            } catch (err) {
              console.error("Error reading file:", err);
            }
          }
        }}
      />
    </motion.div>
  );
};
