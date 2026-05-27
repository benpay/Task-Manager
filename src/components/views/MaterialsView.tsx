/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  MoreVertical, 
  Search, 
  Plus, 
  Minus, 
  Package 
} from 'lucide-react';
import { Material, Task } from '../../types/task';
import { AddMaterialModal } from './AddMaterialModal';

interface MaterialsViewProps {
  tasks: Task[];
  materials: Material[];
  onBack: () => void;
  onCreateMaterial: (material: Omit<Material, 'id'>, associatedTaskId?: number) => void;
  updateMaterialQuantity: (materialId: number, delta: number) => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({ 
  tasks,
  materials, 
  onBack, 
  onCreateMaterial,
  updateMaterialQuantity 
}) => {
  const [materialSearch, setMaterialSearch] = useState('');
  const [materialCategory, setMaterialCategory] = useState('Todos');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex flex-col flex-1"
    >
      <header className="hidden md:flex flex-col gap-1 mb-8">
        <h2 className="text-3xl font-black tracking-tight">Inventario de Materiales</h2>
        <p className="text-slate-500 dark:text-slate-400">Controla tu stock de maderas, pinturas y herrajes.</p>
      </header>

      {/* Mobile Header - Hidden on Desktop */}
      <header className="md:hidden flex items-center justify-between py-3 mb-6">
        <div className="flex items-center gap-3">
          <Package className="text-primary w-8 h-8" />
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Inventario</h1>
        </div>
      </header>

      {/* Filter & Search Bar */}
      <section className="bg-white dark:bg-slate-800/50 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 font-bold" />
            <input 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary shadow-sm dark:shadow-none dark:text-white transition-all outline-none" 
              placeholder="Buscar materiales (madera, pintura...)" 
              type="text"
              value={materialSearch}
              onChange={(e) => setMaterialSearch(e.target.value)}
            />
          </div>

          <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-x-auto no-scrollbar">
            {['Todos', 'Madera', 'Pintura', 'Ferretería'].map(cat => (
              <button 
                key={cat}
                onClick={() => setMaterialCategory(cat)}
                className={`px-4 py-2 text-xs font-black rounded-xl transition-all uppercase tracking-wider whitespace-nowrap ${materialCategory === cat ? 'bg-white dark:bg-slate-700 shadow-lg text-primary' : 'text-slate-500 dark:text-slate-400'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Materials Table/Grid */}
      <main className="pb-32">
        {/* Desktop Table View - Hidden on Mobile */}
        <div className="hidden md:block bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-400">Material</th>
                <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-400">Estado</th>
                <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Disponible</th>
                <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Objetivo</th>
                <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {materials
                .filter(m => (materialCategory === 'Todos' || m.category === materialCategory) && m.name.toLowerCase().includes(materialSearch.toLowerCase()))
                .map(material => {
                  const isUnderStock = material.have < material.need;
                  const isOut = material.have === 0;
                  
                  return (
                    <tr key={material.id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group">
                      {/* Material Info */}
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div 
                            className="size-14 rounded-xl bg-cover bg-center shadow-inner group-hover:scale-105 transition-transform duration-300 bg-slate-100 dark:bg-slate-900 shrink-0" 
                            style={{ backgroundImage: `url("${material.image}")` }}
                          />
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[9px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-widest">{material.category}</span>
                            </div>
                            <p className="text-slate-900 dark:text-white text-sm font-black tracking-tight">{material.name}</p>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium line-clamp-1">{material.description}</p>
                          </div>
                        </div>
                      </td>

                      {/* Stock Status */}
                      <td className="p-5">
                        {isOut ? (
                          <span className="text-[10px] font-black text-red-600 bg-red-50 dark:bg-red-950/30 px-2.5 py-1 rounded-full uppercase tracking-widest">Sin Stock</span>
                        ) : isUnderStock ? (
                          <span className="text-[10px] font-black text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-full uppercase tracking-widest">Bajo Stock</span>
                        ) : (
                          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full uppercase tracking-widest">Suficiente</span>
                        )}
                      </td>

                      {/* Available */}
                      <td className="p-5 text-center font-black dark:text-white text-base">
                        {material.have} <span className="text-xs font-bold text-slate-400">{material.shortUnit}</span>
                      </td>

                      {/* Target */}
                      <td className="p-5 text-center font-black text-slate-500 dark:text-slate-400 text-sm">
                        {material.need} <span className="text-xs font-bold text-slate-400">{material.shortUnit}</span>
                      </td>

                      {/* Stock adjustments */}
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => updateMaterialQuantity(material.id, -0.5)}
                            className="size-9 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all shadow-sm active:scale-90"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => updateMaterialQuantity(material.id, 0.5)}
                            className="size-9 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all shadow-sm active:scale-90"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Mobile View - Cards Layout */}
        <div className="md:hidden grid grid-cols-1 gap-4">
          {materials
            .filter(m => (materialCategory === 'Todos' || m.category === materialCategory) && m.name.toLowerCase().includes(materialSearch.toLowerCase()))
            .map(material => {
              const isUnderStock = material.have < material.need;
              const isOut = material.have === 0;
              
              return (
                <div key={material.id} className="bg-white dark:bg-slate-800 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-lg flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="size-16 rounded-2xl bg-cover bg-center shadow-inner bg-slate-100 dark:bg-slate-900 shrink-0" 
                      style={{ backgroundImage: `url("${material.image}")` }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[8px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-widest">{material.category}</span>
                        {isOut ? (
                          <span className="text-[8px] font-black text-red-600 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded-full uppercase tracking-widest">Sin Stock</span>
                        ) : isUnderStock ? (
                          <span className="text-[8px] font-black text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full uppercase tracking-widest">Bajo Stock</span>
                        ) : (
                          <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full uppercase tracking-widest">Suficiente</span>
                        )}
                      </div>
                      <p className="text-slate-900 dark:text-white text-base font-black tracking-tight truncate">{material.name}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium line-clamp-1">{material.description}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Disponible / Obj</p>
                      <p className="text-base font-black dark:text-white">
                        {material.have} / {material.need} <span className="text-xs font-bold text-slate-400">{material.shortUnit}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => updateMaterialQuantity(material.id, -0.5)}
                        className="size-9 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all shadow-sm active:scale-90"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => updateMaterialQuantity(material.id, 0.5)}
                        className="size-9 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all shadow-sm active:scale-90"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        
        {materials.filter(m => (materialCategory === 'Todos' || m.category === materialCategory) && m.name.toLowerCase().includes(materialSearch.toLowerCase())).length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 shadow-sm">
            <Package className="w-20 h-20 mb-4 text-slate-200 dark:text-slate-700" />
            <h3 className="text-xl font-black dark:text-white">Sin materiales</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">No se encontraron productos en el inventario.</p>
          </div>
        )}
      </main>

      {/* Floating Action Button for Materials - Only on Mobile */}
      <button 
        onClick={() => setIsAddModalOpen(true)}
        className="md:hidden fixed bottom-24 right-4 flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 active:scale-95 transition-transform z-30"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Desktop Add Button */}
      <button 
        onClick={() => setIsAddModalOpen(true)}
        className="hidden md:flex fixed bottom-10 right-10 size-16 items-center justify-center rounded-2xl bg-primary text-white shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all z-30 group"
      >
        <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Add Material Modal */}
      <AddMaterialModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        tasks={tasks}
        onCreate={onCreateMaterial} 
      />
    </motion.div>

  );
};
