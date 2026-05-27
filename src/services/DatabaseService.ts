/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task, Material } from '../types/task';

const DB_NAME = 'TasklyDB';
const DB_VERSION = 1;

export class DatabaseService {
  private db: IDBDatabase | null = null;
  // Use indexedDB only in strictly local dev mode (if there's no backend proxy setup).
  // Assuming the Vite DEV server doesn't proxy /api.php by default.
  private isDev = (import.meta as any).env?.DEV === true;

  async init(): Promise<void> {
    if (!this.isDev) {
      // Intentionally resolved when on production since API is stateless.
      return Promise.resolve();
    }

    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject('Error opening database');
      
      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Tasks Store
        if (!db.objectStoreNames.contains('tasks')) {
          db.createObjectStore('tasks', { keyPath: 'id' });
        }

        // Materials Store
        if (!db.objectStoreNames.contains('materials')) {
          db.createObjectStore('materials', { keyPath: 'id' });
        }
      };
    });
  }

  // --- Remote Backend Helpers ---
  private async apiRequest(action: string, payload?: any): Promise<any> {
    const url = `/api.php?action=${action}`;
    const options: RequestInit = {
      method: payload ? 'POST' : 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    if (payload) options.body = JSON.stringify(payload);

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Network response was not ok');
      const text = await response.text();
      const data = JSON.parse(text);
      if (!data.success) throw new Error(data.error || 'Server error');
      return data;
    } catch (e) {
      console.error(`API Error (${action}):`, e);
      throw e;
    }
  }

  // --- Tasks Operations ---

  async getAllTasks(): Promise<Task[]> {
    if (!this.isDev) {
      try {
        const resp = await this.apiRequest('get_tasks');
        return resp.data || [];
      } catch (error) {
        console.error("Failed to load generic tasks from API:", error);
        return [];
      }
    }

    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tasks'], 'readonly');
      const store = transaction.objectStore('tasks');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject('Error getting tasks');
    });
  }

  async saveTask(task: Task): Promise<void> {
    // We must strip non-serializable objects like React nodes if they exist
    const serializableTask = { ...task };
    delete (serializableTask as any).icon; // Remove React icon node

    if (!this.isDev) {
      await this.apiRequest('save_task', serializableTask);
      return;
    }

    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tasks'], 'readwrite');
      const store = transaction.objectStore('tasks');
      
      const request = store.put(serializableTask);

      request.onsuccess = () => resolve();
      request.onerror = () => reject('Error saving task');
    });
  }

  async deleteTask(id: number): Promise<void> {
    if (!this.isDev) {
      await this.apiRequest('delete_task', { id });
      return;
    }

    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tasks'], 'readwrite');
      const store = transaction.objectStore('tasks');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject('Error deleting task');
    });
  }

  // --- Materials Operations ---

  async getAllMaterials(): Promise<Material[]> {
    if (!this.isDev) {
      try {
        const resp = await this.apiRequest('get_materials');
        return resp.data || [];
      } catch (error) {
        console.error("Failed to load materials from API:", error);
        return [];
      }
    }

    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['materials'], 'readonly');
      const store = transaction.objectStore('materials');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject('Error getting materials');
    });
  }

  async saveMaterial(material: Material): Promise<void> {
    if (!this.isDev) {
      await this.apiRequest('save_material', material);
      return;
    }

    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['materials'], 'readwrite');
      const store = transaction.objectStore('materials');
      const request = store.put(material);

      request.onsuccess = () => resolve();
      request.onerror = () => reject('Error saving material');
    });
  }

  async deleteMaterial(id: number): Promise<void> {
    if (!this.isDev) {
      await this.apiRequest('delete_material', { id });
      return;
    }

    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['materials'], 'readwrite');
      const store = transaction.objectStore('materials');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject('Error deleting material');
    });
  }

  async saveAllMaterials(materials: Material[]): Promise<void> {
    if (!this.isDev) {
      for (const material of materials) {
        await this.apiRequest('save_material', material);
      }
      return;
    }

    await this.init();
    const transaction = this.db!.transaction(['materials'], 'readwrite');
    const store = transaction.objectStore('materials');
    
    for (const material of materials) {
      store.put(material);
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject('Error saving all materials');
    });
  }
}

export const dbService = new DatabaseService();
