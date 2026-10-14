import React, { useState } from 'react';
import { 
  Layers, 
  ExternalLink, 
  Search, 
  ShieldCheck, 
  LifeBuoy, 
  Receipt, 
  Users, 
  Activity, 
  KeyRound, 
  Briefcase, 
  CloudCheck, 
  BookOpen,
  X,
  QrCode,
  Laptop,
  ArrowRight,
  Lock,
  Truck,
  MapPin,
  Printer,
  Globe,
  Loader2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { InternalApp } from '../types';

export const InternalAppsView: React.FC = () => {
  const { apps, openControlEquipos, isAuthenticated, currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [launchedApp, setLaunchedApp] = useState<InternalApp | null>(null);
  const [isRedirectingToRental, setIsRedirectingToRental] = useState(false);

  const categories = ['all', 'Sistemas Principales', 'Soporte', 'Gestión', 'Finanzas', 'Herramientas TI'];

  const handleLaunchRentalApp = () => {
    setIsRedirectingToRental(true);
    setTimeout(() => {
      setIsRedirectingToRental(false);
      openControlEquipos();
    }, 700);
  };

  const filteredApps = apps.filter(app => {
    if (selectedCategory !== 'all' && app.category !== selectedCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.name.toLowerCase().includes(q) ||
      app.description.toLowerCase().includes(q) ||
      app.category.toLowerCase().includes(q)
    );
  });

  const getAppIcon = (iconName: string) => {
    switch (iconName) {
      case 'LifeBuoy':
        return <LifeBuoy className="w-5 h-5 text-blue-600" />;
      case 'Receipt':
        return <Receipt className="w-5 h-5 text-emerald-600" />;
      case 'Users':
        return <Users className="w-5 h-5 text-indigo-600" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-rose-600" />;
      case 'KeyRound':
        return <KeyRound className="w-5 h-5 text-amber-600" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-purple-600" />;
      case 'CloudCheck':
        return <CloudCheck className="w-5 h-5 text-cyan-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-teal-600" />;
    }
  };

  const getStatusBadge = (status: InternalApp['status']) => {
    switch (status) {
      case 'operativo':
        return (
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Operativo</span>
          </span>
        );
      case 'mantenimiento':
        return (
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Mantenimiento</span>
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Degradado</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <span>NECSOFT PC</span>
            <span aria-hidden="true">·</span>
            <span>Plataforma Corporativa</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Directorio de Aplicativos Internos
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Lanzador de sistemas empresariales, herramientas de soporte y módulos especializados de NECSOFT PC.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Red Interna Segura NECSOFT</span>
        </div>
      </div>

      {/* Filter and Search Bar for apps */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-blue-600 font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'Todos los Aplicativos' : cat}
            </button>
          ))}
        </div>

        <div className="relative sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar aplicativo corporativo..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
          />
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card for Control de Entradas y Salidas inside the grid */}
        <div
          onClick={handleLaunchRentalApp}
          className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-blue-500/80 dark:border-blue-600/80 shadow-sm hover:border-blue-600 hover:shadow-lg p-5 flex flex-col justify-between transition-all cursor-pointer group"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-600 group-hover:scale-105 transition-transform">
                <Laptop className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                Portal TI
              </span>
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                Logística & Hardware
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 transition-colors">
                Control de Entradas y Salidas (QR)
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
              Módulo de despacho de computadores, registro de técnicos, municipios de Colombia y trazabilidad con código QR.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-400 font-mono">
              activos.necsoftpc.com
            </span>

            <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
              <span>Abrir Web</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {filteredApps.map(app => (
          <div
            key={app.id}
            onClick={() => setLaunchedApp(app)}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md p-5 flex flex-col justify-between transition-all cursor-pointer group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 group-hover:scale-105 transition-transform">
                  {getAppIcon(app.iconName)}
                </div>
                {getStatusBadge(app.status)}
              </div>

              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                  {app.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 transition-colors">
                  {app.name}
                </h3>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {app.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">
                Acceso: {app.accessLevel}
              </span>

              <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                <span>Abrir</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* Simulated Redirection Screen Overlay */}
      {isRedirectingToRental && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in no-print">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-sm w-full text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30">
              <Laptop className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Redirigiendo a Sistema Rental TI
              </h4>
              <p className="text-xs text-slate-500 font-mono mt-1">
                activos.necsoftpc.com/sistema-entradas-salidas
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-semibold">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Cargando plataforma independiente...</span>
            </div>
          </div>
        </div>
      )}

      {/* Application Launcher Modal for regular internal apps */}
      {launchedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in no-print">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                  {getAppIcon(launchedApp.iconName)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {launchedApp.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {launchedApp.url}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLaunchedApp(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Estado del Servicio:
                  </span>
                  {getStatusBadge(launchedApp.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Nivel de Permisos Requerido:
                  </span>
                  <span className="font-medium text-slate-600 dark:text-slate-400">
                    {launchedApp.accessLevel}
                  </span>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {launchedApp.description}
              </p>

              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/50 text-[11px] text-blue-900 dark:text-blue-300">
                La sesión se iniciará de forma protegida utilizando tu cuenta corporativa autorizada bajo la red interna NECSOFT PC.
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
              <button
                onClick={() => setLaunchedApp(null)}
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Cerrar
              </button>
              <div className="flex items-center gap-2">
                <a
                  href={launchedApp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setTimeout(() => setLaunchedApp(null), 500);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <span>Acceder al Sistema</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
