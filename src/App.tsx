/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useTasks } from './hooks/useTasks';
import { useNotifications } from './hooks/useNotifications';
import { BottomNav } from './components/common/BottomNav';
import { ListView } from './components/views/ListView';
import { DetailsView } from './components/views/DetailsView';
import { CalendarView } from './components/views/CalendarView';
import { ProjectsView } from './components/views/ProjectsView';
import { MaterialsView } from './components/views/MaterialsView';
import { CreateView } from './components/views/CreateView';
import { Sidebar } from './components/common/Sidebar';
import { LoginView } from './components/views/LoginView';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'details' | 'create' | 'calendar' | 'projects' | 'materials'>('list');
  const [detailsSource, setDetailsSource] = useState<'list' | 'calendar' | 'projects'>('list');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const {
    tasks,
    materials,
    toggleTaskStatus,
    updateTaskProgress,
    toggleMaterial,
    updateBannerImage,
    addToGallery,
    updateTaskField,
    saveSteps,
    createTask,
    updateMaterialQuantity
  } = useTasks();

  useNotifications(tasks);

  const handleLogin = async (username: string, password: string) => {
    setLoginError(null);
    try {
      // Mock login for local development since Vite cannot execute PHP
      if ((import.meta as any).env.DEV) {
        if (username === 'benpay' && password === 'Traducete1!') {
          setIsAuthenticated(true);
          localStorage.setItem('auth_token', 'dev_token_123');
        } else {
          setLoginError('Credenciales incorrectas (Modo Taller Local)');
        }
        return;
      }

      const API_BASE_URL = ((import.meta as any).env.VITE_API_URL || '').replace(/\/$/, '');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de límite

      const response = await fetch(`${API_BASE_URL}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
      }

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("No es válido JSON:", responseText);
        throw new Error(`Respuesta no válida del servidor. Recibe HTML o ruta incorrecta.`);
      }

      if (data.success) {
        setIsAuthenticated(true);
        // Opcionalmente guardar el token en localStorage o cookies
        localStorage.setItem('auth_token', data.token);
      } else {
        setLoginError(data.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setLoginError(`Error de sistema o red: ${errorMessage}`);
    }
  };


  const handleSelectTask = (taskId: number, source: 'list' | 'calendar' | 'projects') => {
    setSelectedTaskId(taskId);
    setDetailsSource(source);
    setView('details');
  };

  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} error={loginError} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors font-sans text-slate-900 dark:text-slate-200">
      {/* Sidebar - Fixed on Desktop */}
      <Sidebar view={view} setView={setView} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="container mx-auto px-4 py-8 lg:px-8 max-w-7xl">
            <AnimatePresence mode="wait">
              {view === 'list' && (
                <ListView 
                  key="list"
                  tasks={tasks}
                  toggleTaskStatus={toggleTaskStatus}
                  onSelectTask={(id) => handleSelectTask(id, 'list')}
                  onCreateTask={() => setView('create')}
                />
              )}
              
              {view === 'details' && selectedTask && (
                <DetailsView 
                  key="details"
                  task={selectedTask}
                  onBack={() => setView(detailsSource)}
                  updateTaskField={updateTaskField}
                  updateTaskProgress={updateTaskProgress}
                  toggleMaterial={toggleMaterial}
                  updateBannerImage={updateBannerImage}
                  addToGallery={addToGallery}
                  saveSteps={saveSteps}
                  toggleTaskStatus={toggleTaskStatus}
                />
              )}

              {view === 'calendar' && (
                <CalendarView 
                  key="calendar"
                  tasks={tasks}
                  onSelectTask={(id) => handleSelectTask(id, 'calendar')}
                />
              )}

              {view === 'projects' && (
                <ProjectsView 
                  key="projects"
                  tasks={tasks}
                  onSelectTask={(id) => handleSelectTask(id, 'projects')}
                />
              )}

              {view === 'materials' && (
                <MaterialsView 
                  key="materials"
                  materials={materials}
                  onBack={() => setView('list')}
                  updateMaterialQuantity={updateMaterialQuantity}
                />
              )}

              {view === 'create' && (
                <CreateView 
                  key="create"
                  onBack={() => setView('list')}
                  onCreateTask={(task) => {
                    createTask(task);
                    setView('list');
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Bottom Nav - Only on Mobile */}
        <BottomNav view={view} setView={setView} />
      </div>
    </div>
  );
}
