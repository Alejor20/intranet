import React, { useState } from 'react';
import { Laptop, Lock, Mail, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SYSTEM_USERS } from '../context/AppContext';

export const LoginView: React.FC = () => {
  const { login, backToIntranet } = useApp();
  
  const [email, setEmail] = useState('admin@necsoftpc.com');
  const [password, setPassword] = useState('necsoft2026');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const success = login(email, password);
      setIsLoading(false);
      if (!success) {
        setError('Credenciales incorrectas. Por favor verifica tu correo corporativo y contraseña.');
      }
    }, 400);
  };

  const handleSelectPreset = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('necsoft2026');
    setError(null);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-6 px-4 relative overflow-hidden font-sans">
      
      {/* Background Decorative Atmosphere */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Back to Public Intranet link */}
      <div className="w-full max-w-md mb-3">
        <button
          onClick={backToIntranet}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Portal Principal de la Intranet</span>
        </button>
      </div>

      {/* Login Box */}
      <div className="w-full max-w-md relative z-10 space-y-5">
        
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25 mb-1">
            <Laptop className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            NECSOFT PC
          </h1>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
            Módulo Protegido: Control de Entradas y Salidas
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
          
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Autenticación Requerida para Entradas y Salidas
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Para registrar salidas a arrendamiento, recepciones e inspecciones con código QR debes identificarte con tu usuario de TI.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Email Field */}
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Correo Corporativo NECSOFT
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="usuario@necsoftpc.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Contraseña de Acceso
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <span>Validando credenciales...</span>
              ) : (
                <>
                  <span>Ingresar a Control de Entradas y Salidas</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Quick Demo Access Presets */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
              Cuentas de Demostración TI:
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {SYSTEM_USERS.map(user => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelectPreset(user.email)}
                  className={`p-2.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                    email === user.email
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-950 dark:text-blue-200 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="truncate">
                    <span className="font-bold text-xs block text-slate-900 dark:text-white">{user.name}</span>
                    <span className="text-[10px] text-slate-500 truncate">{user.jobTitle} · {user.email}</span>
                  </div>
                  {email === user.email && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Security Trust Notice */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Acceso Restringido a Personal Técnico de NECSOFT PC</span>
        </div>

      </div>

    </div>
  );
};
