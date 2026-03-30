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

  const toggleTaskStatus = async (taskId: number) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const isNowHecho = task.status !== 'hecho';
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
  };

  const updateTaskProgress = async (taskId: number, progress: number) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, progress, status: progress === 100 ? 'hecho' as const : 'en curso' as const } : task
    );
    setTasks(updatedTasks);
    const affectedTask = updatedTasks.find(t => t.id === taskId);
    if (affectedTask) await dbService.saveTask(affectedTask);
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
      materials: newTask.materials,
      steps: newTask.steps as any,
      gallery: newTask.gallery,
      resources: newTask.resources as any,
      bannerImage: newTask.bannerImage
    };

    const updatedTasks = [taskToAdd, ...tasks];
    setTasks(updatedTasks);
    await dbService.saveTask(taskToAdd);
  };

  const updateMaterialQuantity = async (materialId: number, delta: number) => {
    const updatedMaterials = materials.map(m => 
      m.id === materialId ? { ...m, have: Math.max(0, m.have + delta) } : m
    );
    setMaterials(updatedMaterials);
    const affectedMaterial = updatedMaterials.find(m => m.id === materialId);
    if (affectedMaterial) await dbService.saveMaterial(affectedMaterial);
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
    updateMaterialQuantity
  };
}
