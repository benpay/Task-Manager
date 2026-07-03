/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { config } from '../../config';

interface LoginViewProps {
  onLogin: (username: string, password: string) => Promise<void> | void;
  error?: string | null;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Add artificial delay for premium feel and wait for login request
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      await onLogin(username, password);
    } catch (err) {
      console.error("Error en submit:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50 dark:bg-[#080c14] overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative w-full max-w-md p-8"
      >
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-3xl rounded-[3rem] p-10 shadow-2xl border border-white/20 dark:border-slate-800 shadow-primary/5">
          <header className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-primary to-blue-600 rounded-3xl shadow-xl shadow-primary/30 mb-6 group transition-transform hover:scale-110">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Bienvenido</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Inicia sesión en tu gestor de tareas</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Usuario</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/30 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold dark:text-white transition-all outline-none"
                  placeholder="Introduce tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input 
                  type="password"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/30 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold dark:text-white transition-all outline-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-black uppercase tracking-widest p-4 rounded-xl text-center border border-red-100 dark:border-red-900/30"
              >
                {error}
              </motion.div>
            )}

            <div className="pt-4">
              <button 
                type="submit"
                disabled={isLoading}
                className="group w-full bg-gradient-to-r from-primary to-blue-600 hover:to-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/25 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Entrar ahora</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <footer className="mt-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-100 dark:border-slate-800">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium Member Access</span>
            </div>
          </footer>
        </div>
        
        {/* Subtle Brand Logo */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">{config.appName} OS v{config.version}</p>
        </div>
      </motion.div>
    </div>
  );
};
