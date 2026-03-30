/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { Task } from '../types/task';

// Local storage key to track which tasks have already triggered a notification
const NOTIFIED_TASKS_KEY = 'notified_tasks';

function parseDateTime(dateStr?: string, timeStr?: string): Date | null {
  if (!dateStr || !timeStr) return null;
  const [year, month, day] = dateStr.split('-').map(Number);
  
  const [time, modifier] = timeStr.split(' ');
  if (!time || !modifier) return null;

  let [hours, minutes] = time.split(':').map(Number);
  
  if (modifier === 'PM' && hours < 12) {
    hours += 12;
  }
  if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return new Date(year, month - 1, day, hours, minutes);
}

export function useNotifications(tasks: Task[]) {
  useEffect(() => {
    // Solicitar permiso de notificaciones si no se ha hecho
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const checkTasks = () => {
      const now = new Date();
      const notifiedTasksStr = localStorage.getItem(NOTIFIED_TASKS_KEY);
      const notifiedTasks: number[] = notifiedTasksStr ? JSON.parse(notifiedTasksStr) : [];
      let updatedNotifiedTasks = [...notifiedTasks];
      let hasNewNotifications = false;

      const todayStr = now.toISOString().split('T')[0];

      tasks.forEach(task => {
        if (task.status === 'hecho' || !task.dueDate) return;
        
        // Skip if we already notified for this task
        if (notifiedTasks.includes(task.id)) return;

        let shouldNotify = false;

        if (!task.dueTime) {
          // If the task has no time but due date is today, notify when checking (e.g. on mount)
          if (task.dueDate === todayStr) {
            shouldNotify = true;
          }
        } else {
          const taskDate = parseDateTime(task.dueDate, task.dueTime);
          if (taskDate) {
            // Calculate time difference in minutes
            const diffMs = taskDate.getTime() - now.getTime();
            const diffMins = Math.floor(diffMs / 60000);

            // Notify if task is due in 60 minutes or less (including overdue tasks that are still 'en curso')
            if (diffMins <= 60) {
              shouldNotify = true;
            }
          }
        }

        if (shouldNotify) {
          try {
            // Check if service worker is supported for mobile push-like local notification
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(`¡Tarea Próxima: ${task.title}!`, {
                  body: task.dueTime ? `La tarea está programada para el ${task.dueDate} a las ${task.dueTime}` : `La tarea tienes que hacerla para hoy (${task.dueDate})`,
                  icon: '/icon-192.png',
                  vibrate: [200, 100, 200],
                  tag: `task-${task.id}`
                } as any);
              }).catch(() => {
                // Fallback a Notification clásica
                new Notification(`¡Tarea Próxima: ${task.title}!`, {
                  body: task.dueTime ? `La tarea está programada para el ${task.dueDate} a las ${task.dueTime}` : `La tarea tienes que hacerla para hoy (${task.dueDate})`,
                });
              });
            } else {
              new Notification(`¡Tarea Próxima: ${task.title}!`, {
                body: task.dueTime ? `La tarea está programada para el ${task.dueDate} a las ${task.dueTime}` : `La tarea tienes que hacerla para hoy (${task.dueDate})`,
              });
            }
          } catch (e) {
            console.error("Error showing notification", e);
          }

          updatedNotifiedTasks.push(task.id);
          hasNewNotifications = true;
        }
      });

      if (hasNewNotifications) {
        localStorage.setItem(NOTIFIED_TASKS_KEY, JSON.stringify(updatedNotifiedTasks));
      }
    };

    // Check immediately and then every 1 hour (3600000 ms)
    checkTasks();
    const interval = setInterval(checkTasks, 3600000);

    return () => clearInterval(interval);
  }, [tasks]);
}
