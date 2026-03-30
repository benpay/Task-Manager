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
  Loader2
} from 'lucide-react';
import { Task } from '../../types/task';
import { PriorityBadge } from '../tasks/PriorityBadge';
import { LinearProgressBar } from '../tasks/ProgressBar';
import { getAIImageKeywords, generateTaskDescription, generateImageBase64 } from '../../services/AIService';

interface DetailsViewProps {
  task: Task;
  onBack: () => void;
  updateTaskField: (taskId: number, field: keyof Task, value: any) => void;
  updateTaskProgress: (taskId: number, progress: number) => void;
  toggleMaterial: (taskId: number, materialName: string) => void;
  updateBannerImage: (taskId: number, imageUrl: string) => void;
  addToGallery: (taskId: number, item: { type: 'image' | 'video'; url: string }) => void;
  saveSteps: (taskId: number, steps: { title: string; description: string }[]) => void;
  toggleTaskStatus: (taskId: number) => void;
}

export const DetailsView: React.FC<DetailsViewProps> = ({ 
  task, 
  onBack,
  updateTaskField,
  updateTaskProgress,
  toggleMaterial,
  updateBannerImage,
  addToGallery,
  saveSteps,
  toggleTaskStatus
}) => {
  const [isEditingSteps, setIsEditingSteps] = useState(false);
  const [editingSteps, setEditingSteps] = useState<{ title: string; description: string }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

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
          <button className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-red-500 transition-all">
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
                    <button onClick={() => setIsEditingSteps(!isEditingSteps)} className="text-primary font-black text-[10px] uppercase tracking-widest hover:underline">Editar Pasos</button>
                  </div>
                  <div className="space-y-6">
                    {task.steps.map((step, idx) => (
                      <div key={idx} className="flex gap-6 group">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-primary font-black group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 dark:text-white">{step.title}</h4>
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{step.description}</p>
                        </div>
                      </div>
                    ))}
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
               <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                 <div className="size-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm">
                   <Calendar className="w-6 h-6" />
                 </div>
                 <div>
                   <p className="text-sm font-black dark:text-white leading-tight">{task.dueDate || "Sin fecha"}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{task.dueTime || "Todo el día"}</p>
                 </div>
               </div>
             </div>

             {isDIY && task.materials && (
               <div>
                 <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Inventario Necesario</h4>
                 <div className="space-y-3">
                    {task.materials.map((m, idx) => (
                      <label key={idx} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-transparent hover:border-primary/20 transition-all cursor-pointer group">
                        <input type="checkbox" checked={m.checked} onChange={() => toggleMaterial(task.id, m.name)} className="size-5 rounded-lg border-slate-200 text-primary focus:ring-primary" />
                        <span className={`text-sm font-bold transition-all ${m.checked ? 'text-slate-300 line-through' : 'text-slate-700 dark:text-slate-300 group-hover:text-primary'}`}>{m.name}</span>
                      </label>
                    ))}
                 </div>
               </div>
             )}
          </section>

          {/* Resources */}
          {task.resources && task.resources.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] px-2">Recursos y Tutoriales</h3>
              <div className="space-y-3">
                {task.resources.map((res, idx) => (
                  <a key={idx} href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all group">
                    <div className="size-10 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black dark:text-white truncate">{res.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{res.url}</p>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </motion.div>
  );
};
