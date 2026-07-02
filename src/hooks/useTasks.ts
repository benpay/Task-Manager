/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Task, Material } from '../types/task';
import { dbService } from '../services/DatabaseService';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from DB on mount
  useEffect(() => {
    const initData = async () => {
      try {
        const storedTasks = await dbService.getAllTasks();
        const storedMaterials = await dbService.getAllMaterials();

        setTasks(storedTasks);
        setMaterials(storedMaterials);
      } catch (error) {
        console.error("Database initialization failed:", error);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  // Helper to parse material strings
  const parseTaskMaterialString = (text: string) => {
    const xMatch = text.match(/^([\d.]+)\s*x\s+(.+)$/i);
    if (xMatch) {
      return {
        quantity: parseFloat(xMatch[1]) || 1,
        name: xMatch[2].trim(),
        unit: 'uds'
      };
    }
    const dashMatch = text.match(/^([\d.]+)\s*([a-zA-Z]+)?\s*-\s*(.+)$/i);
    if (dashMatch) {
      return {
        quantity: parseFloat(dashMatch[1]) || 1,
        unit: dashMatch[2] ? dashMatch[2].trim() : 'uds',
        name: dashMatch[3].trim()
      };
    }
    return {
      quantity: 1,
      name: text.trim(),
      unit: 'uds'
    };
  };

  // Helper to adjust global materials list
  const adjustGlobalMaterialNeed = async (currentMaterials: Material[], name: string, quantityDelta: number, unit?: string): Promise<Material[]> => {
    const lowerName = name.toLowerCase();
    const existing = currentMaterials.find(m => m.name.toLowerCase() === lowerName);

    if (existing) {
      const updated = currentMaterials.map(m => {
        if (m.id === existing.id) {
          const newNeed = Math.max(0, m.need + quantityDelta);
          return { ...m, need: newNeed };
        }
        return m;
      });
      const affected = updated.find(m => m.id === existing.id);
      if (affected) await dbService.saveMaterial(affected);
      return updated;
    } else if (quantityDelta > 0) {
      const newMat: Material = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        name: name,
        description: 'Añadido desde tarea',
        category: 'Ferretería',
        have: 0,
        need: quantityDelta,
        unit: unit === 'm' ? 'Metros' : 'Unidades',
        shortUnit: unit || 'uds',
        location: 'Taller',
        image: 'https://images.unsplash.com/photo-1530018607912-eff2df114f11?w=150'
      };
      const updated = [...currentMaterials, newMat];
      await dbService.saveMaterial(newMat);
      return updated;
    }
    return currentMaterials;
  };

  const adjustInventoryForTaskMaterials = async (taskMaterials: { name: string; checked: boolean }[], isAdding: boolean, currentMats: Material[] = materials) => {
    let updatedMats = [...currentMats];
    for (const m of taskMaterials) {
      const parsed = parseTaskMaterialString(m.name);
      const delta = isAdding ? parsed.quantity : -parsed.quantity;
      updatedMats = await adjustGlobalMaterialNeed(updatedMats, parsed.name, delta, parsed.unit);
    }
    setMaterials(updatedMats);
  };

  const toggleTaskStatus = async (taskId: number) => {
    const taskToToggle = tasks.find(t => t.id === taskId);
    if (!taskToToggle) return;

    const isNowHecho = taskToToggle.status !== 'hecho';
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { 
          ...task, 
          status: isNowHecho ? 'hecho' as const : 'en curso' as const,
          progress: isNowHecho ? 100 : task.progress
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    const affectedTask = updatedTasks.find(t => t.id === taskId);
    if (affectedTask) await dbService.saveTask(affectedTask);

    // Sync inventory: if now completed, subtract needs. If now active, add needs back.
    if (taskToToggle.materials && taskToToggle.materials.length > 0) {
      await adjustInventoryForTaskMaterials(taskToToggle.materials, !isNowHecho);
    }
  };

  const updateTaskProgress = async (taskId: number, progress: number) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;

    const wasCompleted = taskToUpdate.status === 'hecho';
    const isNowCompleted = progress === 100;

    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, progress, status: isNowCompleted ? 'hecho' as const : 'en curso' as const } : task
    );
    setTasks(updatedTasks);
    const affectedTask = updatedTasks.find(t => t.id === taskId);
    if (affectedTask) await dbService.saveTask(affectedTask);

    // Sync inventory if status changed
    if (taskToUpdate.materials && taskToUpdate.materials.length > 0 && wasCompleted !== isNowCompleted) {
      await adjustInventoryForTaskMaterials(taskToUpdate.materials, !isNowCompleted);
    }
  };

  const toggleMaterial = async (taskId: number, materialName: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId && task.materials) {
        return {
          ...task,
          materials: task.materials.map(m => m.name === materialName ? { ...m, checked: !m.checked } : m)
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    const affectedTask = updatedTasks.find(t => t.id === taskId);
    if (affectedTask) await dbService.saveTask(affectedTask);
  };

  const updateBannerImage = async (taskId: number, imageUrl: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, bannerImage: imageUrl } : task
    );
    setTasks(updatedTasks);
    const affectedTask = updatedTasks.find(t => t.id === taskId);
    if (affectedTask) await dbService.saveTask(affectedTask);
  };

  const addToGallery = async (taskId: number, item: { type: 'image' | 'video'; url: string }) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          gallery: [...(task.gallery || []), item]
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    const affectedTask = updatedTasks.find(t => t.id === taskId);
    if (affectedTask) await dbService.saveTask(affectedTask);
  };

  const updateTaskField = async (taskId: number, field: keyof Task, value: any) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, [field]: value } : task
    );
    setTasks(updatedTasks);
    const affectedTask = updatedTasks.find(t => t.id === taskId);
    if (affectedTask) await dbService.saveTask(affectedTask);
  };

  const saveSteps = async (taskId: number, steps: { title: string; description: string }[]) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, steps } : task
    );
    setTasks(updatedTasks);
    const affectedTask = updatedTasks.find(t => t.id === taskId);
    if (affectedTask) await dbService.saveTask(affectedTask);
  };

  const createTask = async (newTask: Partial<Task>) => {
    const id = Date.now();
    const taskToAdd: Task = {
      id,
      title: newTask.title || '',
      description: newTask.description || '',
      priority: (newTask.priority as any) || 'media',
      type: (newTask.type as any) || 'Tareas',
      status: 'en curso',
      progress: newTask.type === 'DIY' ? 0 : undefined,
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      dueTime: newTask.dueTime || '12:00 PM',
      materials: newTask.materials || [],
      steps: newTask.steps as any,
      gallery: newTask.gallery,
      resources: newTask.resources as any,
      bannerImage: newTask.bannerImage
    };

    const updatedTasks = [taskToAdd, ...tasks];
    setTasks(updatedTasks);
    await dbService.saveTask(taskToAdd);

    // Sync inventory for newly created task
    if (taskToAdd.materials && taskToAdd.materials.length > 0) {
      await adjustInventoryForTaskMaterials(taskToAdd.materials, true);
    }
  };

  const createMaterial = async (newMaterial: Omit<Material, 'id'>, associatedTaskId?: number) => {
    // Get fresh list of materials to prevent stale closure and duplication issues
    const latestMaterials = await dbService.getAllMaterials();
    const lowerName = newMaterial.name.toLowerCase();
    const existing = latestMaterials.find(m => m.name.toLowerCase() === lowerName);

    let updatedMaterials: Material[] = [];

    if (existing) {
      // If it exists, update need quantity
      updatedMaterials = latestMaterials.map(m => {
        if (m.id === existing.id) {
          const newNeed = Math.max(0, m.need + newMaterial.need);
          return { ...m, need: newNeed };
        }
        return m;
      });
      const affected = updatedMaterials.find(m => m.id === existing.id);
      if (affected) await dbService.saveMaterial(affected);
    } else {
      // If it doesn't exist, create it
      const id = Date.now();
      const materialToAdd: Material = {
        id,
        ...newMaterial
      };
      updatedMaterials = [...latestMaterials, materialToAdd];
      await dbService.saveMaterial(materialToAdd);
    }

    setMaterials(updatedMaterials);

    if (associatedTaskId) {
      const taskToUpdate = tasks.find(t => t.id === associatedTaskId);
      if (taskToUpdate) {
        const materialText = `${newMaterial.need} ${newMaterial.shortUnit} - ${newMaterial.name}`;
        const updatedTask = {
          ...taskToUpdate,
          materials: [...(taskToUpdate.materials || []), { name: materialText, checked: false }]
        };
        const updatedTasks = tasks.map(t => t.id === associatedTaskId ? updatedTask : t);
        setTasks(updatedTasks);
        await dbService.saveTask(updatedTask);
      }
    }
  };

  const updateMaterialQuantity = async (materialId: number, delta: number) => {
    const updatedMaterials = materials.map(m => 
      m.id === materialId ? { ...m, have: Math.max(0, m.have + delta) } : m
    );
    setMaterials(updatedMaterials);
    const affectedMaterial = updatedMaterials.find(m => m.id === materialId);
    if (affectedMaterial) await dbService.saveMaterial(affectedMaterial);
  };

  const addTaskMaterial = async (taskId: number, materialName: string, quantity: number, unit: string) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;

    const shortUnit = unit === 'Metros' || unit === 'm' ? 'm' : 'uds';
    const materialText = `${quantity} ${shortUnit} - ${materialName}`;

    const updatedTask = {
      ...taskToUpdate,
      materials: [...(taskToUpdate.materials || []), { name: materialText, checked: false }]
    };

    const updatedTasks = tasks.map(t => t.id === taskId ? updatedTask : t);
    setTasks(updatedTasks);
    await dbService.saveTask(updatedTask);

    // Sync inventory if task is active
    if (taskToUpdate.status !== 'hecho') {
      const updatedMats = await adjustGlobalMaterialNeed(materials, materialName, quantity, shortUnit);
      setMaterials(updatedMats);
    }
  };

  const removeTaskMaterial = async (taskId: number, materialText: string) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;

    const updatedTask = {
      ...taskToUpdate,
      materials: (taskToUpdate.materials || []).filter(m => m.name !== materialText)
    };

    const updatedTasks = tasks.map(t => t.id === taskId ? updatedTask : t);
    setTasks(updatedTasks);
    await dbService.saveTask(updatedTask);

    // Sync inventory if task is active
    if (taskToUpdate.status !== 'hecho') {
      const parsed = parseTaskMaterialString(materialText);
      const updatedMats = await adjustGlobalMaterialNeed(materials, parsed.name, -parsed.quantity, parsed.unit);
      setMaterials(updatedMats);
    }
  };

  const deleteTask = async (taskId: number) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (!taskToDelete) return;

    // Sync inventory: if task was active, subtract its materials from global inventory
    if (taskToDelete.status !== 'hecho' && taskToDelete.materials && taskToDelete.materials.length > 0) {
      await adjustInventoryForTaskMaterials(taskToDelete.materials, false);
    }

    const updatedTasks = tasks.filter(t => t.id !== taskId);
    setTasks(updatedTasks);
    await dbService.deleteTask(taskId);
  };

  return {
    tasks,
    materials,
    loading,
    toggleTaskStatus,
    updateTaskProgress,
    toggleMaterial,
    updateBannerImage,
    addToGallery,
    updateTaskField,
    saveSteps,
    createTask,
    createMaterial,
    updateMaterialQuantity,
    addTaskMaterial,
    removeTaskMaterial,
    deleteTask
  };
}
