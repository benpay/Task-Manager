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
import { Material } from '../../types/task';

interface MaterialsViewProps {
  materials: Material[];
  onBack: () => void;
  updateMaterialQuantity: (materialId: number, delta: number) => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({ 
  materials, 
  onBack, 
  updateMaterialQuantity 
}) => {
  const [materialSearch, setMaterialSearch] = useState('');
  const [materialCategory, setMaterialCategory] = useState('Todos');

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

      {/* Materials Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-32">
        {materials
          .filter(m => (materialCategory === 'Todos' || m.category === materialCategory) && m.name.toLowerCase().includes(materialSearch.toLowerCase()))
          .map(material => (
            <div key={material.id} className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col gap-5 hover:shadow-2xl hover:border-primary/20 transition-all group">
              <div className="flex gap-4">
                <div 
                  className="size-20 rounded-2xl bg-cover bg-center shadow-inner group-hover:scale-105 transition-transform duration-500 bg-slate-100 dark:bg-slate-900" 
                  style={{ backgroundImage: `url("${material.image}")` }}
                ></div>
                <div className="flex flex-col justify-center gap-1">
                  <span className="text-[10px] font-black text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-widest self-start">{material.category}</span>
                  <p className="text-slate-900 dark:text-white text-lg font-black tracking-tight">{material.name}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-medium line-clamp-1">{material.description}</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Disponible</p>
                  <p className="text-xl font-black dark:text-white">{material.have} <span className="text-sm font-bold text-slate-400">{material.shortUnit}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateMaterialQuantity(material.id, -0.5)}
                    className="size-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all shadow-sm active:scale-90"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => updateMaterialQuantity(material.id, 0.5)}
                    className="size-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all shadow-sm active:scale-90"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <span className="flex items-center gap-2">
                  <Package className="w-3 h-3" />
                  Ubicación: {material.location}
                </span>
                <span className={material.have < material.need ? 'text-red-500' : 'text-emerald-500'}>
                  Obj: {material.need} {material.shortUnit}
                </span>
              </div>
            </div>
          ))}
        
        {materials.filter(m => (materialCategory === 'Todos' || m.category === materialCategory) && m.name.toLowerCase().includes(materialSearch.toLowerCase())).length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 shadow-sm">
            <Package className="w-20 h-20 mb-4 text-slate-200 dark:text-slate-700" />
            <h3 className="text-xl font-black dark:text-white">Sin materiales</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">No se encontraron productos en el inventario.</p>
          </div>
        )}
      </main>

      {/* Floating Action Button for Materials - Only on Mobile */}
      <button className="md:hidden fixed bottom-24 right-4 flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 active:scale-95 transition-transform z-30">
        <Plus className="w-8 h-8" />
      </button>

      {/* Desktop Add Button */}
      <button className="hidden md:flex fixed bottom-10 right-10 size-16 items-center justify-center rounded-2xl bg-primary text-white shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all z-30 group">
        <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </motion.div>

  );
};
