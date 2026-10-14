import React from 'react';
import { Laptop, ShieldCheck, Layers, Download, FileText, Home } from 'lucide-react';
import { useApp, NavigationTab } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navLinks: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Portal Intranet', icon: <Home className="w-4 h-4" /> },
    { id: 'software', label: 'Descargas Software', icon: <Download className="w-4 h-4" /> },
    { id: 'documents', label: 'Documentos', icon: <FileText className="w-4 h-4" /> },
    { id: 'apps', label: 'Aplicativos Internos', icon: <Layers className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          
          {/* Zone 1: Brand Wordmark (NECSOFT PC) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/25 group-hover:scale-105 transition-transform font-bold">
                <Laptop className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap block">
                  NECSOFT PC
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider hidden sm:block">
                  INTRANET CORPORATIVA
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links for the Intranet */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map(link => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Corporate Info Status */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-[11px] text-slate-600 dark:text-slate-300 font-medium border border-slate-200/60 dark:border-slate-700/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Portal de Servicios Corporativos</span>
            </div>
            
            <button
              onClick={() => setActiveTab('apps')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-semibold border border-blue-200/70 dark:border-blue-800 cursor-pointer transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Aplicativos</span>
            </button>
          </div>

        </div>

        {/* Mobile / Tablet Horizontal Navigation */}
        <div className="md:hidden flex items-center gap-1.5 overflow-x-auto py-2.5 border-t border-slate-100 dark:border-slate-800 text-xs">
          {navLinks.map(link => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
