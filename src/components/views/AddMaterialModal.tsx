/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Save, 
  Package, 
  Camera, 
  Clipboard,
  Info
} from 'lucide-react';
import { Material, Task } from '../../types/task';

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onCreate: (material: Omit<Material, 'id'>, associatedTaskId?: number) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const AddMaterialModal: React.FC<AddMaterialModalProps> = ({ 
  isOpen, 
  onClose, 
  tasks,
  onCreate 
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [unitType, setUnitType] = useState<'unidades' | 'metros'>('unidades');
  const [need, setNeed] = useState<number>(0);
  const [image, setImage] = useState('');
  const [associatedTaskId, setAssociatedTaskId] = useState<string>('');
  const [errors, setErrors] = useState<{ name?: string }>({});

  const parseVerbalMaterial = (text: string) => {
    const cleanName = text.trim().replace(',', '.');

    // Check for verbal match, e.g., "2 sacos de cemento", "3 botes de pintura"
    const verbalMatch = cleanName.match(/^([\d.]+)\s+([a-zA-ZáéíóúÁÉÍÓÚñÑ]+)\s+(?:de\s+)?(.+)$/i);
    if (verbalMatch) {
      const quantity = parseFloat(verbalMatch[1]) || 1;
      const parsedUnit = verbalMatch[2].trim();
      const unit = parsedUnit.charAt(0).toUpperCase() + parsedUnit.slice(1);
      const shortUnit = parsedUnit.toLowerCase();
      const name = verbalMatch[3].trim();
      return { quantity, name, unit, shortUnit };
    }

    // Check for simple verbal match, e.g., "2 cemento"
    const simpleMatch = cleanName.match(/^([\d.]+)\s+(.+)$/i);
    if (simpleMatch) {
      const quantity = parseFloat(simpleMatch[1]) || 1;
      const name = simpleMatch[2].trim();
      const unit = unitType === 'unidades' ? 'Unidades' : 'Metros';
      const shortUnit = unitType === 'unidades' ? 'uds' : 'm';
      return { quantity, name, unit, shortUnit };
    }

    // Fallback: use manual inputs
    return {
      quantity: Number(need) || 0,
      name: cleanName,
      unit: unitType === 'unidades' ? 'Unidades' : 'Metros',
      shortUnit: unitType === 'unidades' ? 'uds' : 'm'
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrors({ name: 'El nombre es obligatorio' });
      return;
    }

    const parsed = parseVerbalMaterial(name);

    onCreate({
      name: parsed.name,
      description: description.trim() || 'Sin descripción',
      category: 'Ferretería', // default category
      have: 0, // default availability
      need: parsed.quantity,
      unit: parsed.unit,
      shortUnit: parsed.shortUnit,
      location: 'Taller', // default location
      image: image || 'https://images.unsplash.com/photo-1530018607912-eff2df114f11?w=150' // elegant wood/material placeholder
    }, associatedTaskId ? Number(associatedTaskId) : undefined);

    // Reset fields
    setName('');
    setDescription('');
    setUnitType('unidades');
    setNeed(0);
    setImage('');
    setAssociatedTaskId('');
    setErrors({});
    onClose();
  };

  // Only display tasks that are not completed (status !== 'hecho')
  const activeTasks = tasks.filter(task => task.status !== 'hecho');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Glassmorphic Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-2xl p-6 md:p-8 overflow-hidden max-h-[90vh] flex flex-col z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Nuevo Material</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Añade stock al inventario global del taller</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="size-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-6 custom-scrollbar">
              
              {/* Image Upload Area */}
              <div className="flex justify-center">
                <div 
                  onClick={() => document.getElementById('material-image-upload')?.click()}
                  className="relative group size-28 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center text-slate-400 cursor-pointer overflow-hidden hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                >
                  {image ? (
                    <>
                      <img src={image} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                        <Camera className="w-6 h-6" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Camera className="w-8 h-8 mb-1 text-slate-300 dark:text-slate-600" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Subir Imagen</span>
                    </>
                  )}
                  <input 
                    id="material-image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const base64 = await fileToBase64(file);
                          setImage(base64);
                        } catch (err) {
                          console.error("Error reading file:", err);
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Clipboard className="w-3.5 h-3.5 text-primary" /> Nombre del Material
                </label>
                <input 
                  type="text"
                  className={`w-full bg-slate-50 dark:bg-slate-900 border ${errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-2xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-primary dark:text-white transition-all outline-none`}
                  placeholder="Ej. Madera de Pino Clear o Tornillos de 2 pulgadas"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({});
                  }}
                />
                {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
              </div>

              {/* Description input */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-primary" /> Descripción corta
                </label>
                <input 
                  type="text"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-primary dark:text-white transition-all outline-none"
                  placeholder="Ej. De acero inoxidable, caja de 50 uds"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Measure Unit Toggle Slider */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                  Unidad de Medida
                </label>
                <div className="relative p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl flex">
                  {/* Sliding Indicator */}
                  <motion.div 
                    className="absolute top-1 bottom-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm z-0"
                    layoutId="activeUnitTab"
                    style={{
                      width: 'calc(50% - 4px)',
                      left: unitType === 'unidades' ? '4px' : 'calc(50%)'
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                  <button
                    type="button"
                    onClick={() => setUnitType('unidades')}
                    className={`flex-1 py-3 text-xs font-black rounded-xl transition-all uppercase tracking-wider z-10 ${
                      unitType === 'unidades' ? 'text-primary' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    Unidades (uds)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnitType('metros')}
                    className={`flex-1 py-3 text-xs font-black rounded-xl transition-all uppercase tracking-wider z-10 ${
                      unitType === 'metros' ? 'text-primary' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    Metros (m)
                  </button>
                </div>
              </div>

              {/* Quantity to Buy (Need) */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                  {unitType === 'unidades' ? 'Cantidad a comprar (Unidades)' : 'Cantidad a comprar (Metros)'}
                </label>
                <input 
                  type="number"
                  step="any"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-primary dark:text-white transition-all outline-none"
                  placeholder="0"
                  value={need || ''}
                  onChange={(e) => setNeed(parseFloat(e.target.value) || 0)}
                />
              </div>

              {/* Associated Task selector */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Clipboard className="w-3.5 h-3.5 text-primary" /> Relacionar con Tarea (Opcional)
                </label>
                <select 
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-primary dark:text-white transition-all outline-none appearance-none"
                  value={associatedTaskId}
                  onChange={(e) => setAssociatedTaskId(e.target.value)}
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 1rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.25em 1.25em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="" className="dark:bg-slate-900">-- No relacionar con ninguna tarea --</option>
                  {activeTasks.map(task => (
                    <option key={task.id} value={task.id} className="dark:bg-slate-900">
                      {task.type === 'DIY' ? '🛠️ [DIY] ' : '📝 [Tarea] '} {task.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" /> Guardar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
