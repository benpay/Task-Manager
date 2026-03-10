/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Bell, 
  ChevronDown, 
  Wrench, 
  Calendar, 
  Circle, 
  Paintbrush, 
  CheckCircle, 
  PlusCircle, 
  List, 
  CalendarDays, 
  Plus, 
  Folder, 
  Package,
  Trash2,
  ArrowLeft,
  MoreVertical,
  Tag,
  RotateCcw,
  ShoppingBag,
  Pencil,
  Upload,
  Image as ImageIcon,
  Video,
  Save,
  X,
  Play,
  AlertCircle,
  AlertTriangle,
  Minus,
  ChevronDown as ChevronDownIcon,
  Link as LinkIcon,
  PlusCircle as AddCircleIcon,
  Camera,
  Check,
  Menu,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Hammer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'urgente' | 'alta' | 'media' | 'baja';
  type: 'DIY' | 'Tareas';
  status: 'en curso' | 'hecho';
  progress?: number;
  dueDate?: string;
  dueTime?: string;
  icon: React.ReactNode;
  // DIY specific fields
  materials?: { name: string; checked: boolean }[];
  steps?: { title: string; description: string }[];
  gallery?: { type: 'image' | 'video'; url: string }[];
  bannerImage?: string;
  resources?: { title: string; type: 'video' | 'pdf'; url: string }[];
}

export default function App() {
  const [view, setView] = useState<'list' | 'details' | 'create' | 'calendar' | 'projects' | 'materials'>('list');
  const [detailsSource, setDetailsSource] = useState<'list' | 'calendar' | 'projects'>('list');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [projectSearch, setProjectSearch] = useState('');
  const [materialSearch, setMaterialSearch] = useState('');
  const [materialCategory, setMaterialCategory] = useState('Todos');
  const [projectFilterStatus, setProjectFilterStatus] = useState<'en curso' | 'hecho'>('en curso');
  const [materials, setMaterials] = useState([
    {
      id: 1,
      name: 'Pintura Acrílica Blanca',
      description: 'Interior - Mate',
      category: 'Pintura',
      have: 2.5,
      need: 5.0,
      unit: 'litros',
      shortUnit: 'L',
      location: 'Bote mediano',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAokQ_pWccMec6sQwIiUSe_Ym2TTvegaFCflcc_DxlTYWalQ_r8TWEZtBWqMW_UXCpjIq4cs6nhRE2FIqg3H9JzQNdP4S0bF0c5n74AYvvGsf-CvsoW-9PfjYzzk-CnVrGmL92tNW4gQUt7NYUYryPs4ugKD6op6XdWuuw2TNddLeXdQhpqunlPx6UQhwVILaUcf_RA5v4xPDtr1MXxq8l1sof6w_ud_0O8H_ubAaWgFgsS3w4u3AQOrzvX2eCLAB49gwEnCzw97wk'
    },
    {
      id: 2,
      name: 'Tablones de Pino',
      description: '240cm x 20cm',
      category: 'Madera',
      have: 3,
      need: 10,
      unit: 'unidades',
      shortUnit: 'u',
      location: 'Sección A2',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3M-PE9IqQxBAq277Dg8ggjV36AQvcBAlnCkM0Z2MOptaapMilCZCi-5a5C62F-nlcoCq8Vk_FWfDp6KMQRAZ5yrXpn3pcq3is1gvVupnBdjgX3zaIEWj5o_bua-LsjFvCJklSszEDcri_0k_xYk_tC3FboVEG0nRQBzufljrM6zE1-8LyII-LxhUcSD6thwoAO7FoRVkBr3PoyRQQIIQdxPEiC5CYmb_76Gwi-MsHYa63ACc5E3uSrs1gv1c6NYeDsjkWABjbyMU'
    },
    {
      id: 3,
      name: 'Cable de Cobre 2.5mm',
      description: 'Azul (Neutro)',
      category: 'Electricidad',
      have: 15,
      need: 50,
      unit: 'metros',
      shortUnit: 'm',
      location: 'Rollo parcial',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaAXiPTuL4I3tqBXHsyhPsoK5gfKUJSutgkKPzf_1Oo5diDZN1XVjwgZfiC-XzEgR0hgftdRd2gLhJnkFEA_y2Aa0U46cicZuKKkvPqEwkQNuyKBVC6W8WCkzWpGcUtjHafCVyzDClyuud88Zgz6ANNSq9ezL4LiWNER9i6MSKNPpbfuNWr0OVO6usFbHoqLVHYNA_Dg6z1wPcCwKgZCpRxLH0TtBnub63RLXK5RVL9FPbbc0dvE0DF736KNH0hGx1RFVp8GOXT-U'
    },
    {
      id: 4,
      name: 'Tornillos para Madera',
      description: '4x40mm - Zincado',
      category: 'Ferretería',
      have: 0,
      need: 100,
      unit: 'unidades',
      shortUnit: 'u',
      location: 'Caja vacía',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrGq9kRuJHk6GvLKE52UHgU6rMwjIY8uXbOQWsxZ77K1anIyiAraPjI2QLJFN03gVfgOOvFeeGm3nodjl06thgCt8cKvSIOH-1JCaVcv4m1vu3plfU40uQRP0xVBwXMELITZNd7M1E-IhjHg7Z-yXQFpVSg0rYHSBhw7W7EskBgPR1PTx9L-s66r45u5qmMFdoIK4_ZWGctB7bJ23hfB4OtVTyps-bz65jr8c907IswDbueTRNTMFHFIdrLquqIiDMhFOEElU7Pqs'
    }
  ]);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 101,
      title: 'Kitchen Remodel',
      description: 'Renovación completa de la cocina, incluyendo armarios y encimeras.',
      priority: 'urgente',
      type: 'DIY',
      status: 'en curso',
      progress: 60,
      dueDate: '2026-04-15',
      dueTime: '09:00 AM',
      icon: <Hammer className="w-5 h-5" />,
      bannerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDwAsDUwGud5OcFP7Vpuvjd3aXe4KM6zIb6hjfe_tB1Mkc-sOZd6Utj6FEa7ON8jiLgsNqoDlrotYMQxzwbCPf_RUYSWPRQdKtGX4Ou8hE3b-lkzK20uUnuqpNkzXmKcLcj6BM1x8X5KEszCqGvEQXbnm0b7b1ojjAl6YCrHO14aVzrHoOCjiIwq8W0Zj05mIAInibAEvoSV5xTuXkobwQKYNSAvCkw2TaBxvYOXQotUryLsgeczNZlCK4AuOpUoUMhLe--iAiMG0',
    },
    {
      id: 102,
      title: 'Backyard Deck',
      description: 'Construcción de una plataforma de madera en el patio trasero.',
      priority: 'media',
      type: 'DIY',
      status: 'en curso',
      progress: 35,
      dueDate: '2026-05-20',
      dueTime: '10:00 AM',
      icon: <Hammer className="w-5 h-5" />,
      bannerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCeSuSut9fmGWAZIfBgTNRNaDnveo9HeuFFk8ZNzlq0OgNuxHa1J17W9l6-Dzszgfxe1P8P-tZ9n-H180GM70qAeviqZgGDCoPsynYQ2JGjKLhjmVWYMk1dlueANfDMGyZAgoo_VIUYPDz3UXgACGiFq_1vTqWVHpF-qM_3-rNNl1s9JCK-K32md6aRLwWtsrW-u2TQnYfrYAEm7_T4HigT992OeuLVpz5brY2ClRosanKkHpV0pmEiPBcVZ_IJSPjjWQWxTAeqjw',
    },
    {
      id: 103,
      title: 'Home Office Setup',
      description: 'Organización y montaje de un espacio de trabajo productivo en casa.',
      priority: 'baja',
      type: 'DIY',
      status: 'en curso',
      progress: 85,
      dueDate: '2026-03-25',
      dueTime: '02:00 PM',
      icon: <Hammer className="w-5 h-5" />,
      bannerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4cAKj7GZUU1aI5s2eBzi735H7N3l-XdtUs0bqL4Fy9pUsOhgeQHl9rHrUdUTZlX61rhQogZvIKJskUcO7tbluXzdTLXbKk2sjDXRPgqlbtL6g5zIx7YfkkRgJfxvJ76eqv2Y3OYBG9yvT2AZ3ZeQ0SpU_QQAz4Oi8kBa7jS4QT_JUHmh-IIpp5_3DC3mTg036Ggz4ArOk5YA52ORiFQaPqjabSA6YebGRTKBr0vyHcioDn46PQni6J2o5T1vxNlSl8j9CuZcEr5w',
    },
    {
      id: 1,
      title: 'Arreglar grifo cocina',
      description: 'Reparar la fuga en el monomando de la cocina. El grifo principal tiene un goteo persistente desde la base de la maneta.',
      priority: 'urgente',
      type: 'DIY',
      status: 'en curso',
      progress: 50,
      dueDate: '2026-03-09',
      dueTime: '10:00 AM',
      icon: <Wrench className="w-5 h-5" />,
      bannerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBdz1LcLSRwJ4FNt4bImgjqXMg9oJzT3MEk50bbo_bapwq2rwsyeXNb1Efu4CivDIq8wwjeVTUtkoRoCj6jRPle2ghI4r2oNWOC9FpE_0XCqHzd452G2Ry0Tf4Qpv8Gn8T86PUKxsaioD2gJrwzQ-ausi-ETEVpqGGJFvxiosyWXvkO2yQ3IErtajb44yQcc0PL0K3UX8YKC82zUcWLrD2I--I7WFU_Y6OBugZUKgPriTUfVzWouy33tLFcvwNL0BVBtoSechP9KE',
      gallery: [
        { type: 'image', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX03fvI0rCrMpsijaW9-iFLxpv3U0dchKSArrjYNAT8TR9Uu8AGSMFvooEV3OT3KUo14TXYr6LsKPFohEZG5NtbK93vA_Ei6cEXUhqatuNNmwCF-AYB218VO6c4Fymag564tpFGx_rIm2deNHEAke5ikC1W2GuS3HYmolhSVviTys40dp8X_TA7rdBXAGMyzvoNqbCYzcXBI6TTTIVrtjwsp7j0zoV46n6fTfKdM85OfaV0Cs_G43Z0CJbzdAj2N-yFKKu0kED9HU' },
        { type: 'image', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsFm6cHsLJk9dlkeJeGtnbQO1HFt8nDLXb1acyM_cl8Q8habmLo4cgv5kuP-8xBOjxfSDLl8UD8lDJX3n-_rdAfJjSsN-4xVl1rIge92pT0Ui-O9-Lx2NQr63wlNziTdqg8gftY8ztrFJ8kNr_BKUrGERlbGL_6k25qRI_Eds-Ez7bspgUJnCAVaVr1ijHhXe5LvyoJvR2dG7pD3T4D18yoy5w-zVaQUc6uFKAAMv7ZnhrgH-6nHAt8pgvvoDIoRQXPjc6XVqrAuA' },
      ],
      materials: [
        { name: 'Cartucho de repuesto (Modelo X)', checked: false },
        { name: 'Juego de llaves Allen', checked: false },
        { name: 'Grasa de fontanero', checked: false },
        { name: 'Llave inglesa ajustable', checked: false },
      ],
      steps: [
        { title: 'Cerrar el suministro de agua', description: 'Localiza las llaves de paso bajo el fregadero y gíralas en sentido horario hasta que estén apretadas.' },
        { title: 'Quitar la maneta', description: 'Usa la llave Allen para aflojar el tornillo prisionero detrás de la maneta y tira de ella.' },
        { title: 'Reemplazar el cartucho', description: 'Desenrosca la tuerca de retención y extrae el cartucho viejo. Inserta el nuevo con cuidado.' },
      ],
      resources: [
        { title: 'Video: Cómo cambiar el cartucho de un grifo', type: 'video', url: '#' },
        { title: 'Diagrama de piezas del fabricante (PDF)', type: 'pdf', url: '#' },
      ]
    },
    {
      id: 2,
      title: 'Enviar reporte mensual',
      description: 'Resumen de gastos y actividades del mes',
      priority: 'alta',
      type: 'Tareas',
      status: 'en curso',
      dueDate: '2026-03-09',
      dueTime: '01:30 PM',
      icon: <Circle className="w-5 h-5" />,
    },
    {
      id: 3,
      title: 'Pintar estantería salón',
      description: 'Lijar y aplicar dos capas de barniz color roble',
      priority: 'media',
      type: 'DIY',
      status: 'en curso',
      progress: 40,
      dueDate: '2026-03-09',
      dueTime: '04:00 PM',
      icon: <Paintbrush className="w-5 h-5" />,
    },
    {
      id: 4,
      title: 'Comprar bombillas LED',
      description: 'Necesito 4 bombillas de luz cálida E27',
      priority: 'baja',
      type: 'Tareas',
      status: 'hecho',
      dueDate: '2026-03-08',
      dueTime: 'Done',
      icon: <CheckCircle className="w-5 h-5" />,
    },
    {
      id: 5,
      title: 'Restauración de cómoda antigua',
      description: 'Lijado, imprimación y pintura en color verde salvia con tiradores dorados.',
      priority: 'media',
      type: 'DIY',
      status: 'hecho',
      progress: 100,
      icon: <CheckCircle className="w-5 h-5" />,
      bannerImage: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800',
      gallery: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=400' }, // Before
        { type: 'image', url: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=400' }, // After
      ]
    },
    {
      id: 6,
      title: 'Instalación de estantes flotantes',
      description: 'Montaje de 3 estantes de madera en la pared del estudio.',
      priority: 'baja',
      type: 'DIY',
      status: 'hecho',
      progress: 100,
      icon: <CheckCircle className="w-5 h-5" />,
      bannerImage: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800',
      gallery: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1513512147376-c2ad33994651?auto=format&fit=crop&q=80&w=400' }, // Before
        { type: 'image', url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=400' }, // After
      ]
    }
  ]);

  const [filterPriority, setFilterPriority] = useState('');
  const [filterType, setFilterType] = useState<'DIY' | 'Tareas' | ''>('');
  const [filterStatus, setFilterStatus] = useState<'en curso' | 'hecho' | ''>('');
  const [isEditingSteps, setIsEditingSteps] = useState(false);
  const [editingSteps, setEditingSteps] = useState<{ title: string; description: string }[]>([]);

  // Create Task State
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
  
  const toggleTaskStatus = (taskId: number) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        const isNowHecho = task.status !== 'hecho';
        let newIcon = task.icon;
        
        if (taskId === 4) {
          newIcon = isNowHecho 
            ? <CheckCircle className="w-5 h-5" /> 
            : <ShoppingBag className="w-5 h-5" />;
        } else if (isNowHecho) {
          newIcon = <CheckCircle className="w-5 h-5" />;
        } else {
          if (taskId === 1) newIcon = <Wrench className="w-5 h-5" />;
          if (taskId === 2) newIcon = <Circle className="w-5 h-5" />;
          if (taskId === 3) newIcon = <Paintbrush className="w-5 h-5" />;
        }
        
        return { 
          ...task, 
          status: isNowHecho ? 'hecho' : 'en curso',
          progress: isNowHecho ? 100 : task.progress,
          icon: newIcon
        };
      }
      return task;
    }));
  };

  const updateTaskProgress = (taskId: number, progress: number) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId ? { ...task, progress, status: progress === 100 ? 'hecho' : 'en curso' } : task
    ));
  };

  const toggleMaterial = (taskId: number, materialName: string) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId && task.materials) {
        return {
          ...task,
          materials: task.materials.map(m => m.name === materialName ? { ...m, checked: !m.checked } : m)
        };
      }
      return task;
    }));
  };

  const updateBannerImage = (taskId: number, imageUrl: string) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId ? { ...task, bannerImage: imageUrl } : task
    ));
  };

  const addToGallery = (taskId: number, item: { type: 'image' | 'video'; url: string }) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          gallery: [...(task.gallery || []), item]
        };
      }
      return task;
    }));
  };

  const updateTaskField = (taskId: number, field: keyof Task, value: any) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId ? { ...task, [field]: value } : task
    ));
  };

  const saveSteps = (taskId: number) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId ? { ...task, steps: editingSteps } : task
    ));
    setIsEditingSteps(false);
  };

  const handleCreateTask = () => {
    if (!newTask.title) return;

    const id = tasks.length + 1;
    const taskToAdd: Task = {
      id,
      title: newTask.title || '',
      description: newTask.description || '',
      priority: newTask.priority as any || 'media',
      type: newTask.type as any || 'Tareas',
      status: 'en curso',
      progress: newTask.type === 'DIY' ? 0 : undefined,
      icon: newTask.type === 'DIY' ? <Wrench className="w-5 h-5" /> : <Circle className="w-5 h-5" />,
      dueDate: newTask.dueDate || formatDate(new Date()),
      dueTime: newTask.dueTime || '12:00 PM',
      materials: newTask.materials,
      steps: newTask.steps as any,
      gallery: newTask.gallery,
      resources: newTask.resources as any,
      bannerImage: newTask.bannerImage
    };

    setTasks([taskToAdd, ...tasks]);
    setView('list');
    // Reset newTask state
    setNewTask({
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
  };

  const startEditingSteps = (steps: { title: string; description: string }[]) => {
    setEditingSteps([...steps]);
    setIsEditingSteps(true);
  };

  const updateStep = (index: number, field: 'title' | 'description', value: string) => {
    const newSteps = [...editingSteps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setEditingSteps(newSteps);
  };

  const addStep = () => {
    setEditingSteps([...editingSteps, { title: '', description: '' }]);
  };

  const removeStep = (index: number) => {
    setEditingSteps(editingSteps.filter((_, i) => i !== index));
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

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
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden relative">
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col flex-1 overflow-hidden"
          >
            {/* Header */}
            <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-primary w-8 h-8" />
                  <h1 className="text-xl font-bold tracking-tight">Task Manager</h1>
                </div>
                <button className="relative p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-red-500"></span>
                </button>
              </div>
            </header>

            {/* Filters Section */}
            <section className="px-4 py-4 space-y-4 bg-white dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              {/* Priority Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Prioridad</label>
                <div className="relative">
                  <select 
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="appearance-none w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
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

              {/* Segmented Controls Side-by-Side */}
              <div className="grid grid-cols-2 gap-4">
                {/* Project Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Tipo</label>
                  <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <button 
                      onClick={() => setFilterType(filterType === 'DIY' ? '' : 'DIY')}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${filterType === 'DIY' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                      DIY
                    </button>
                    <button 
                      onClick={() => setFilterType(filterType === 'Tareas' ? '' : 'Tareas')}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${filterType === 'Tareas' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                      Tareas
                    </button>
                  </div>
                </div>
                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Estado</label>
                  <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <button 
                      onClick={() => setFilterStatus(filterStatus === 'en curso' ? '' : 'en curso')}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${filterStatus === 'en curso' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                      En curso
                    </button>
                    <button 
                      onClick={() => setFilterStatus(filterStatus === 'hecho' ? '' : 'hecho')}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${filterStatus === 'hecho' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                      Hecho
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Task List */}
            <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4 custom-scrollbar">
              {filteredTasks.length > 0 ? (
                <>
                  {filteredTasks.map((task) => (
                    <motion.div 
                      key={task.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => {
                        setSelectedTaskId(task.id);
                        setDetailsSource('list');
                        setView('details');
                      }}
                      className={`relative bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/50 transition-colors cursor-pointer overflow-hidden ${
                        task.status === 'hecho' ? 'opacity-60' : ''
                      }`}
                    >
                      {/* Priority Bar */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                        task.status === 'hecho' ? 'bg-slate-300 dark:bg-slate-700' : 
                        task.priority === 'urgente' ? 'bg-red-500' : 
                        task.priority === 'alta' ? 'bg-orange-500' : 
                        task.priority === 'media' ? 'bg-blue-500' : 'bg-slate-300'
                      }`} />

                      <div className="flex justify-between items-start pl-2">
                        <div className="flex flex-col flex-1">
                          <div className="flex gap-2 items-center mb-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${
                              task.status === 'hecho' ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400' :
                              task.priority === 'urgente' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                              task.priority === 'alta' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                              task.priority === 'media' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                              'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}>
                              {task.priority}
                            </span>
                            {task.type === 'Tareas' && (
                              <span className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded uppercase tracking-tighter">
                                Tareas
                              </span>
                            )}
                          </div>
                          <h3 className={`font-semibold text-slate-900 dark:text-slate-100 ${task.status === 'hecho' ? 'line-through' : ''}`}>
                            {task.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                            {task.description}
                          </p>
                          {task.dueDate === formatDate(new Date()) && task.status !== 'hecho' && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-red-500 font-medium">
                              <Calendar className="w-3 h-3" />
                              Para hoy
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3 ml-4">
                          {task.type === 'DIY' && task.status !== 'hecho' && (
                            <div className="relative flex items-center justify-center w-11 h-11">
                              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <circle className="stroke-slate-100 dark:stroke-slate-800" cx="18" cy="18" fill="none" r="16" strokeWidth="4"></circle>
                                <circle 
                                  className="stroke-primary transition-all duration-500" 
                                  cx="18" cy="18" fill="none" r="16" 
                                  strokeWidth="4"
                                  strokeDasharray="100"
                                  strokeDashoffset={100 - (task.progress || 0)}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <span className="absolute text-[10px] font-bold text-slate-700 dark:text-slate-200">
                                {task.progress || 0}%
                              </span>
                            </div>
                          )}
                          
                          {task.type === 'DIY' && task.status !== 'hecho' && (
                            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              {task.priority === 'urgente' ? <Wrench className="w-4 h-4 text-slate-400" /> : <Paintbrush className="w-4 h-4 text-slate-400" />}
                            </div>
                          )}

                          {task.type === 'Tareas' || task.status === 'hecho' ? (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTaskStatus(task.id);
                              }}
                              className={`p-2 transition-colors ${task.status === 'hecho' ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}
                            >
                              {task.status === 'hecho' ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  <button 
                    onClick={() => setView('create')}
                    className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 dark:text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span className="font-medium text-sm">Nueva tarea</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <List className="w-12 h-12 mb-2 opacity-20" />
                  <p className="text-sm">No hay tareas que coincidan</p>
                </div>
              )}
            </main>
          </motion.div>
        ) : view === 'details' ? (
          <motion.div 
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col flex-1 overflow-hidden"
          >
            {/* Details Header */}
            <header className="sticky top-0 z-10 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <button 
                onClick={() => setView(detailsSource)}
                className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              </button>
              <h1 className="ml-2 text-lg font-bold tracking-tight">Detalles de Tarea</h1>
              <div className="ml-auto">
                <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
                  <MoreVertical className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                </button>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto pb-24">
              {(() => {
                const task = tasks.find(t => t.id === selectedTaskId);
                if (!task) return null;

                const isCompleted = task.status === 'hecho';
                const isDIY = task.type === 'DIY';

                return (
                  <div className="max-w-md mx-auto p-4 space-y-6">
                    {/* Task Banner Image */}
                    <section className="relative rounded-3xl overflow-hidden shadow-lg bg-white p-2 group cursor-pointer" onClick={() => document.getElementById('banner-upload')?.click()}>
                      <img 
                        alt={task.title} 
                        className="w-full h-48 object-cover rounded-2xl transition-transform group-hover:scale-105" 
                        src={task.bannerImage || (isDIY ? 'https://picsum.photos/seed/diy/800/400' : 'https://picsum.photos/seed/task/800/400')} 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white/90 p-3 rounded-full shadow-lg">
                          <Upload className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="absolute top-6 left-6 flex flex-col gap-2">
                        <div className="relative">
                          <select 
                            className={`appearance-none text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border-none focus:ring-2 focus:ring-white/50 cursor-pointer ${task.priority === 'urgente' ? 'bg-orange-500' : 'bg-blue-500'}`}
                            value={task.priority}
                            onChange={(e) => updateTaskField(task.id, 'priority', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="urgente">Urgente</option>
                            <option value="alta">Alta</option>
                            <option value="media">Media</option>
                            <option value="baja">Baja</option>
                          </select>
                        </div>
                        <span className="bg-white/90 backdrop-blur-sm text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm w-fit">
                          {task.type}
                        </span>
                      </div>
                      <input 
                        id="banner-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            updateBannerImage(task.id, url);
                          }
                        }}
                      />
                    </section>

                    {/* Title and Description */}
                    <section className="space-y-2">
                      <input 
                        className={`w-full bg-transparent text-3xl font-extrabold text-slate-900 dark:text-white leading-tight border-none p-0 focus:ring-0 ${isCompleted ? 'line-through opacity-50' : ''}`}
                        value={task.title}
                        onChange={(e) => updateTaskField(task.id, 'title', e.target.value)}
                      />
                      <textarea 
                        className="w-full bg-transparent text-slate-500 dark:text-slate-400 leading-relaxed border-none p-0 focus:ring-0 resize-none min-h-[60px]"
                        value={task.description}
                        onChange={(e) => updateTaskField(task.id, 'description', e.target.value)}
                        placeholder="Añade una descripción..."
                      />
                    </section>

                    {/* Metadata Row: Type and Due Date */}
                    <section className="grid grid-cols-2 gap-4">
                      {/* Category Selector */}
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-3 text-slate-500 dark:text-slate-400">
                          <Tag className="w-4 h-4" />
                          <span className="text-xs font-semibold uppercase tracking-wider">Categoría</span>
                        </div>
                        <div className="flex bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-100 dark:border-slate-700">
                          <button 
                            onClick={() => updateTaskField(task.id, 'type', 'DIY')}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${task.type === 'DIY' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            DIY
                          </button>
                          <button 
                            onClick={() => updateTaskField(task.id, 'type', 'Tareas')}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${task.type === 'Tareas' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            Tareas
                          </button>
                        </div>
                      </div>

                      {/* Due Date Picker */}
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 relative hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2 mb-1 text-slate-500 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-xs font-semibold uppercase tracking-wider">Fecha y Hora</span>
                        </div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {task.dueDate || 'Sin fecha'} - {task.dueTime || 'Todo el día'}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <input 
                            type="date"
                            className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs p-1 cursor-pointer"
                            value={task.dueDate && /^\d{4}-\d{2}-\d{2}$/.test(task.dueDate) ? task.dueDate : ''}
                            onChange={(e) => updateTaskField(task.id, 'dueDate', e.target.value)}
                          />
                          <input 
                            type="time"
                            className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs p-1 cursor-pointer"
                            onChange={(e) => {
                              const [h, m] = e.target.value.split(':');
                              const hour = parseInt(h);
                              const ampm = hour >= 12 ? 'PM' : 'AM';
                              const h12 = hour % 12 || 12;
                              updateTaskField(task.id, 'dueTime', `${String(h12).padStart(2, '0')}:${m} ${ampm}`);
                            }}
                          />
                        </div>
                      </div>
                    </section>

                    {/* DIY Specific Sections */}
                    {isDIY && (
                      <>
                        {/* Task Progress Section */}
                        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                              <Package className="h-6 w-6 text-blue-600" />
                              <span className="font-bold text-lg dark:text-white">Progreso de Tarea</span>
                            </div>
                            <span className="text-blue-600 font-bold text-lg">{task.progress || 0}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 mb-6">
                            <div 
                              className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                              style={{ width: `${task.progress || 0}%` }}
                            ></div>
                          </div>
                          <div className="space-y-3">
                            <p className="text-sm text-slate-500 font-medium">Actualizar porcentaje:</p>
                            <div className="grid grid-cols-4 gap-2">
                              {[0, 25, 50, 75].map((p) => (
                                <button 
                                  key={p}
                                  onClick={() => updateTaskProgress(task.id, p)}
                                  className={`py-2.5 rounded-xl text-sm font-semibold transition-colors ${task.progress === p ? 'bg-blue-600 text-white' : 'border border-slate-200 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                  {p}%
                                </button>
                              ))}
                              <input 
                                className="col-span-2 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl text-sm font-semibold text-center focus:ring-2 focus:ring-blue-500 outline-none" 
                                placeholder="Set %" 
                                type="number"
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val) && val >= 0 && val <= 100) updateTaskProgress(task.id, val);
                                }}
                              />
                              <button 
                                onClick={() => updateTaskProgress(task.id, 100)}
                                className={`col-span-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${task.progress === 100 ? 'bg-blue-600 text-white' : 'border border-slate-200 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                              >
                                100%
                              </button>
                            </div>
                          </div>
                        </section>

                        {/* Needed Materials */}
                        {task.materials && (
                          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 mb-4">
                              <Wrench className="h-6 w-6 text-blue-600" />
                              <span className="font-bold text-lg dark:text-white">Materiales Necesarios</span>
                            </div>
                            <div className="space-y-2">
                              {task.materials.map((material, idx) => (
                                <label key={idx} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                  <input 
                                    type="checkbox" 
                                    checked={material.checked}
                                    onChange={() => toggleMaterial(task.id, material.name)}
                                    className="h-5 w-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500" 
                                  />
                                  <span className={`font-medium ${material.checked ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                                    {material.name}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </section>
                        )}

                        {/* Repair Steps */}
                        {task.steps && (
                          <section className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <List className="h-6 w-6 text-blue-600" />
                                <span className="font-bold text-lg dark:text-white">Pasos de Reparación</span>
                              </div>
                              {!isEditingSteps ? (
                                <button 
                                  onClick={() => startEditingSteps(task.steps || [])}
                                  className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 text-slate-500 hover:text-blue-600 transition-colors"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                              ) : (
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => setIsEditingSteps(false)}
                                    className="p-2 bg-red-50 dark:bg-red-900/20 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => saveSteps(task.id)}
                                    className="p-2 bg-green-50 dark:bg-green-900/20 rounded-full text-green-600 hover:bg-green-100 transition-colors"
                                  >
                                    <Save className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>

                            {isEditingSteps ? (
                              <div className="space-y-4">
                                {editingSteps.map((step, idx) => (
                                  <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 space-y-3">
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs font-bold text-blue-600 uppercase">Paso {idx + 1}</span>
                                      <button onClick={() => removeStep(idx)} className="text-red-500 hover:text-red-600">
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                    <input 
                                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm font-bold dark:text-white focus:ring-2 focus:ring-blue-500"
                                      value={step.title}
                                      onChange={(e) => updateStep(idx, 'title', e.target.value)}
                                      placeholder="Título del paso"
                                    />
                                    <textarea 
                                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm dark:text-slate-300 focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                                      value={step.description}
                                      onChange={(e) => updateStep(idx, 'description', e.target.value)}
                                      placeholder="Descripción detallada"
                                    />
                                  </div>
                                ))}
                                <button 
                                  onClick={addStep}
                                  className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all flex items-center justify-center gap-2"
                                >
                                  <Plus className="w-4 h-4" />
                                  <span className="text-sm font-bold">Añadir Paso</span>
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {task.steps.map((step, idx) => (
                                  <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">{idx + 1}</div>
                                    <div>
                                      <h4 className="font-bold text-slate-900 dark:text-white">{step.title}</h4>
                                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{step.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </section>
                        )}

                        {/* Gallery Section */}
                        <section className="space-y-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <ImageIcon className="h-6 w-6 text-blue-600" />
                              <span className="font-bold text-lg dark:text-white">Antes y Después</span>
                            </div>
                            <button 
                              onClick={() => document.getElementById('gallery-upload')?.click()}
                              className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full text-xs font-bold hover:bg-blue-100 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Añadir
                            </button>
                            <input 
                              id="gallery-upload" 
                              type="file" 
                              className="hidden" 
                              accept="image/*,video/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const url = URL.createObjectURL(file);
                                  const type = file.type.startsWith('video') ? 'video' : 'image';
                                  addToGallery(task.id, { type, url });
                                }
                              }}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            {task.gallery?.map((item, idx) => (
                              <div key={idx} className="relative group rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 aspect-square">
                                {item.type === 'image' ? (
                                  <img 
                                    alt={`Gallery ${idx}`} 
                                    className="w-full h-full object-cover" 
                                    src={item.url} 
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="relative w-full h-full">
                                    <video 
                                      className="w-full h-full object-cover"
                                      src={item.url}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                      <div className="bg-white/90 p-2 rounded-full shadow-lg">
                                        <Play className="w-5 h-5 text-blue-600 fill-blue-600" />
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="bg-black/50 backdrop-blur-sm text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">
                                    {item.type === 'image' ? 'Foto' : 'Video'}
                                  </span>
                                </div>
                              </div>
                            ))}
                            
                            {(!task.gallery || task.gallery.length === 0) && (
                              <div className="col-span-2 py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400">
                                <ImageIcon className="w-8 h-8 mb-2 opacity-20" />
                                <p className="text-xs font-medium">No hay fotos o videos aún</p>
                              </div>
                            )}
                          </div>
                        </section>

                        {/* Helpful Resources */}
                        {task.resources && (
                          <section className="bg-blue-50 dark:bg-blue-900/20 rounded-3xl p-6 border border-blue-100 dark:border-blue-800 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Bell className="h-6 w-6 text-blue-600" />
                              <span className="font-bold text-lg dark:text-white">Recursos Útiles</span>
                            </div>
                            <div className="space-y-3">
                              {task.resources.map((res, idx) => (
                                <a key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-blue-100 dark:border-blue-800" href={res.url}>
                                  <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${res.type === 'video' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                                      {res.type === 'video' ? <CheckCircle className="h-6 w-6 text-red-600" /> : <Package className="h-6 w-6 text-blue-600" />}
                                    </div>
                                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{res.title}</span>
                                  </div>
                                  <ChevronDown className="h-5 w-5 text-slate-400 -rotate-90" />
                                </a>
                              ))}
                            </div>
                          </section>
                        )}
                      </>
                    )}

                    {/* Action Button */}
                    <div className="pt-4 pb-8">
                      {isCompleted ? (
                        <div className="flex w-full overflow-hidden rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
                          <div className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold py-4 px-6 flex items-center justify-center gap-2">
                            <CheckCircle className="w-6 h-6" />
                            Tarea Completada
                          </div>
                          <button 
                            onClick={() => toggleTaskStatus(task.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 flex items-center justify-center transition-colors border-l border-red-600"
                            title="Reabrir tarea"
                          >
                            <RotateCcw className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => toggleTaskStatus(task.id)}
                          className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-orange-400/20 transition-all flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-6 h-6" />
                          Marcar como Completada
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </main>
          </motion.div>
        ) : view === 'calendar' ? (
          <motion.div 
            key="calendar"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col flex-1 overflow-hidden bg-white dark:bg-slate-900"
          >
            {/* Header */}
            <div className="flex items-center p-4 justify-between border-b border-slate-200 dark:border-slate-800">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Menu className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">Calendar</h2>
              <div className="flex w-10 items-center justify-end">
                <button className="flex size-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Calendar Component */}
            <div className="flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between mb-2">
                <button 
                  onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
                  className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <p className="text-base font-bold leading-tight flex-1 text-center font-display text-slate-900 dark:text-slate-100">
                  {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </p>
                <button 
                  onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
                  className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-7 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                  <p key={day} className="text-slate-400 text-[10px] font-bold py-2 uppercase tracking-widest">{day}</p>
                ))}
                
                {/* Calendar Grid */}
                {(() => {
                  const daysInMonth = getDaysInMonth(selectedDate.getFullYear(), selectedDate.getMonth());
                  const firstDay = getFirstDayOfMonth(selectedDate.getFullYear(), selectedDate.getMonth());
                  const days = [];
                  
                  // Empty slots before first day
                  for (let i = 0; i < firstDay; i++) {
                    days.push(<div key={`empty-${i}`} className="h-12 w-full"></div>);
                  }
                  
                  for (let d = 1; d <= daysInMonth; d++) {
                    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                    const isSelected = selectedDate.getDate() === d;
                    const hasTasks = tasks.some(t => t.dueDate === dateStr);
                    
                    days.push(
                      <button 
                        key={d}
                        onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), d))}
                        className={`h-12 w-full text-sm font-medium relative group`}
                      >
                        <div className={`flex size-10 mx-auto items-center justify-center rounded-full transition-all ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                          {d}
                        </div>
                        {hasTasks && !isSelected && (
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                            <div className="size-1 rounded-full bg-primary"></div>
                          </div>
                        )}
                      </button>
                    );
                  }
                  return days;
                })()}
              </div>
            </div>

            <div className="flex flex-col flex-1 bg-background-light dark:bg-slate-950 rounded-t-[2.5rem] border-t border-slate-200 dark:border-slate-800 mt-4 overflow-hidden">
              <div className="flex items-center justify-between px-6 pt-8 pb-2">
                <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight font-display">
                  Tasks for {selectedDate.toLocaleString('default', { month: 'short', day: 'numeric' })}
                </h3>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  {tasks.filter(t => t.dueDate === formatDate(selectedDate)).length} Tasks
                </span>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 custom-scrollbar pb-24">
                {tasks
                  .filter(t => t.dueDate === formatDate(selectedDate))
                  .map(task => (
                    <div 
                      key={task.id}
                      onClick={() => {
                        setSelectedTaskId(task.id);
                        setDetailsSource('calendar');
                        setView('details');
                      }}
                      className={`relative flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:scale-[1.02] transition-transform overflow-hidden ${
                        task.status === 'hecho' ? 'opacity-60' : ''
                      }`}
                    >
                      {/* Priority Bar */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                        task.status === 'hecho' ? 'bg-slate-300 dark:bg-slate-700' : 
                        task.priority === 'urgente' ? 'bg-red-500' : 
                        task.priority === 'alta' ? 'bg-orange-500' : 
                        task.priority === 'media' ? 'bg-blue-500' : 'bg-slate-300'
                      }`} />

                      <div className="flex items-center justify-center shrink-0 pl-2">
                        <div className={`w-6 h-6 rounded border flex items-center justify-center ${task.status === 'hecho' ? 'bg-slate-400 border-slate-400 text-white' : 'border-slate-300 dark:border-slate-700'}`}>
                          {task.status === 'hecho' && <Check className="w-4 h-4" />}
                        </div>
                      </div>
                      <div className="flex flex-col flex-1 gap-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            task.status === 'hecho' ? 'bg-slate-200 text-slate-500' :
                            task.priority === 'urgente' ? 'bg-red-100 text-red-500 dark:bg-red-900/30' :
                            task.priority === 'alta' ? 'bg-orange-100 text-orange-500 dark:bg-orange-900/30' :
                            'bg-primary/10 text-primary'
                          }`}>
                            {task.status === 'hecho' ? 'Done' : task.priority}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">{task.dueTime || 'All day'}</span>
                        </div>
                        <p className={`text-slate-900 dark:text-slate-100 text-sm font-bold ${task.status === 'hecho' ? 'line-through' : ''}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-1.5">
                          {task.type === 'DIY' ? <Hammer className="w-3 h-3 text-slate-400" /> : <Tag className="w-3 h-3 text-slate-400" />}
                          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">{task.type}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                
                {tasks.filter(t => t.dueDate === formatDate(selectedDate)).length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <CalendarDays className="w-12 h-12 mb-2 opacity-10" />
                    <p className="text-sm font-medium">No tasks for this day</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : view === 'projects' ? (
          <motion.div
            key="projects"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col flex-1 overflow-hidden bg-background-light dark:bg-background-dark"
          >
            {/* Projects Header */}
            <header className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 pt-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Folder className="text-primary w-6 h-6" />
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
                </div>
                <button className="size-10 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800">
                  <Circle className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  className="w-full bg-white dark:bg-slate-900 border-none rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary shadow-sm dark:shadow-none" 
                  placeholder="Search projects..." 
                  type="text"
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 mt-4 px-1 overflow-x-auto no-scrollbar">
                <button 
                  onClick={() => setProjectFilterStatus('en curso')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm transition-colors ${projectFilterStatus === 'en curso' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'}`}
                >
                  En curso
                </button>
                <button 
                  onClick={() => setProjectFilterStatus('hecho')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm transition-colors ${projectFilterStatus === 'hecho' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'}`}
                >
                  Terminado
                </button>
              </div>
            </header>

            {/* Projects Content */}
            <main className="flex-1 px-4 py-4 space-y-4 overflow-y-auto pb-24 custom-scrollbar">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
                {projectFilterStatus === 'en curso' ? 'Ongoing DIY Projects' : 'Completed DIY Projects'}
              </h2>

              {tasks
                .filter(t => t.type === 'DIY' && t.status === projectFilterStatus && t.title.toLowerCase().includes(projectSearch.toLowerCase()))
                .map(project => (
                  <div 
                    key={project.id}
                    onClick={() => {
                      setSelectedTaskId(project.id);
                      setDetailsSource('projects');
                      setView('details');
                    }}
                    className={`relative bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer hover:scale-[1.01] transition-transform overflow-hidden ${
                      project.status === 'hecho' ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Priority Bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                      project.status === 'hecho' ? 'bg-slate-300 dark:bg-slate-700' : 
                      project.priority === 'urgente' ? 'bg-red-500' : 
                      project.priority === 'alta' ? 'bg-orange-500' : 
                      project.priority === 'media' ? 'bg-blue-500' : 'bg-slate-300'
                    }`} />

                    <div className="flex justify-between items-start mb-3 pl-2">
                      <div 
                        className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0" 
                        style={{ backgroundImage: `url('${project.bannerImage || 'https://picsum.photos/seed/' + project.id + '/200/200'}')` }}
                      ></div>
                      <div className="flex-1 ml-4">
                        <div className="flex justify-between items-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            project.priority === 'urgente' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                            project.priority === 'alta' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                            project.priority === 'media' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                            'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {project.priority} Priority
                          </span>
                          <span className="text-xs font-medium text-slate-400">{project.progress || 0}%</span>
                        </div>
                        <h3 className="text-lg font-bold mt-1 dark:text-white">{project.title}</h3>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-full transition-all duration-500" 
                          style={{ width: `${project.progress || 0}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {Math.round(((project.progress || 0) / 100) * 20)} of 20 tasks completed
                        </p>
                        <div className="flex -space-x-2">
                          <div className="size-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-300"></div>
                          <div className="size-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-400"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              {tasks.filter(t => t.type === 'DIY' && t.status === projectFilterStatus && t.title.toLowerCase().includes(projectSearch.toLowerCase())).length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Folder className="w-12 h-12 mb-2 opacity-20" />
                  <p className="text-sm">No se encontraron proyectos</p>
                </div>
              )}
            </main>
          </motion.div>
        ) : view === 'materials' ? (
          <motion.div
            key="materials"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col flex-1 overflow-hidden bg-background-light dark:bg-background-dark"
          >
            {/* Materials Header */}
            <header className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 pt-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setView('list')}
                    className="size-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ArrowLeft className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                  </button>
                  <h1 className="text-2xl font-bold tracking-tight">Inventario</h1>
                </div>
                <button className="size-10 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800">
                  <MoreVertical className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  className="w-full bg-white dark:bg-slate-900 border-none rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary shadow-sm dark:shadow-none" 
                  placeholder="Buscar materiales (madera, pintura...)" 
                  type="text"
                  value={materialSearch}
                  onChange={(e) => setMaterialSearch(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 mt-4 px-1 overflow-x-auto no-scrollbar">
                {['Todos', 'Madera', 'Pintura', 'Ferretería', 'Electricidad'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setMaterialCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm transition-colors ${materialCategory === cat ? 'bg-primary text-white' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </header>

            {/* Materials List */}
            <main className="flex-1 px-4 py-4 space-y-0 overflow-y-auto pb-32 custom-scrollbar divide-y divide-slate-100 dark:divide-slate-800">
              {materials
                .filter(m => (materialCategory === 'Todos' || m.category === materialCategory) && m.name.toLowerCase().includes(materialSearch.toLowerCase()))
                .map(material => (
                  <div key={material.id} className="flex items-center gap-4 py-4 justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16 bg-slate-200 dark:bg-slate-700" 
                        style={{ backgroundImage: `url("${material.image}")` }}
                      ></div>
                      <div className="flex flex-col">
                        <p className="text-slate-900 dark:text-slate-100 text-base font-semibold">{material.name}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">{material.description}</p>
                        <div className="mt-2 flex gap-3 text-xs font-medium">
                          <span className="text-slate-600 dark:text-slate-400">Tengo: <span className="text-slate-900 dark:text-slate-100">{material.have} {material.shortUnit}</span></span>
                          <span className="text-slate-600 dark:text-slate-400">Necesito: <span className="text-slate-900 dark:text-slate-100">{material.need} {material.shortUnit}</span></span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          setMaterials(materials.map(m => m.id === material.id ? { ...m, have: Math.max(0, m.have - 0.5) } : m));
                        }}
                        className="flex size-8 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <div className="text-center min-w-[60px]">
                        <p className="text-slate-900 dark:text-slate-100 text-sm font-bold">{material.have} {material.shortUnit}</p>
                        <p className="text-slate-400 text-[10px]">{material.location}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setMaterials(materials.map(m => m.id === material.id ? { ...m, have: m.have + 0.5 } : m));
                        }}
                        className="flex size-8 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              
              {materials.filter(m => (materialCategory === 'Todos' || m.category === materialCategory) && m.name.toLowerCase().includes(materialSearch.toLowerCase())).length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Package className="w-12 h-12 mb-2 opacity-20" />
                  <p className="text-sm">No se encontraron materiales</p>
                </div>
              )}
            </main>

            {/* Floating Action Button for Materials */}
            <button className="fixed bottom-24 right-4 flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 active:scale-95 transition-transform z-30">
              <Plus className="w-8 h-8" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="create"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col flex-1 overflow-hidden bg-background-light dark:bg-background-dark"
          >
            {/* Create Header */}
            <header className="sticky top-0 z-10 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <button 
                onClick={() => setView('list')}
                className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              </button>
              <h1 className="ml-2 text-lg font-bold tracking-tight flex-1 text-center">Nueva Tarea</h1>
              <button 
                onClick={handleCreateTask}
                className="text-primary font-bold text-base px-2"
              >
                Guardar
              </button>
            </header>

            <main className="flex-1 overflow-y-auto pb-24 custom-scrollbar">
              <div className="max-w-md mx-auto p-4 space-y-6">
                {/* Type Toggle */}
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

                {/* Common Fields */}
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
                        { id: 'urgente', label: 'Urgente', icon: <AlertCircle className="w-5 h-5" />, color: 'red', iconName: 'priority_high' },
                        { id: 'alta', label: 'Alta', icon: <AlertTriangle className="w-5 h-5" />, color: 'orange', iconName: 'stat_3' },
                        { id: 'media', label: 'Media', icon: <Minus className="w-5 h-5" />, color: 'blue', iconName: 'stat_2' },
                        { id: 'baja', label: 'Baja', icon: <ChevronDownIcon className="w-5 h-5" />, color: 'emerald', iconName: 'stat_1' }
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

                  {/* DIY Specific Fields */}
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
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    setNewTask({
                                      ...newTask,
                                      materials: [...(newTask.materials || []), { name: `${newMaterial.quantity}x ${newMaterial.name}`, checked: false }]
                                    });
                                    setNewMaterial({ name: '', quantity: 1 });
                                  }
                                }}
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
                    onClick={handleCreateTask}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-6 h-6" />
                    {newTask.type === 'DIY' ? 'Guardar Proyecto' : 'Crear Tarea'}
                  </button>
                </div>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 pb-6 pt-2 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between gap-2">
          <button 
            onClick={() => setView('list')}
            className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${view === 'list' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
          >
            <div className={`p-1 rounded-lg ${view === 'list' ? 'bg-primary/10' : ''}`}>
              <List className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider">Tareas</p>
          </button>

          <button 
            onClick={() => setView('calendar')}
            className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${view === 'calendar' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
          >
            <div className={`p-1 rounded-lg ${view === 'calendar' ? 'bg-primary/10' : ''}`}>
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider">Calendario</p>
          </button>

          <div className="flex flex-1 justify-center">
            <button 
              onClick={() => setView('create')}
              className="flex size-14 -mt-8 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 active:scale-95 transition-transform border-4 border-white dark:border-slate-900"
            >
              <Plus className="w-8 h-8" />
            </button>
          </div>

          <button 
            onClick={() => setView('projects')}
            className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${view === 'projects' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
          >
            <div className={`p-1 rounded-lg ${view === 'projects' ? 'bg-primary/10' : ''}`}>
              <Folder className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider">Proyectos</p>
          </button>

          <button 
            onClick={() => setView('materials')}
            className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${view === 'materials' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
          >
            <div className={`p-1 rounded-lg ${view === 'materials' ? 'bg-primary/10' : ''}`}>
              <Package className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider">Materiales</p>
          </button>
        </div>
      </nav>
    </div>
  );
}
