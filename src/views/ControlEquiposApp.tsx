import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Globe, 
  Lock, 
  Laptop, 
  QrCode, 
  TrendingUp, 
  ChevronDown, 
  Check, 
  LogOut, 
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EquipmentView } from './EquipmentView';
import { MovementsView } from './MovementsView';
import { LoginView } from '../components/LoginView';
import { QrScannerModal } from '../components/QrScannerModal';
import { EquipmentActionModal } from '../components/EquipmentActionModal';
import { EquipmentLabelModal } from '../components/EquipmentLabelModal';

export const ControlEquiposApp: React.FC = () => {
  const { 
    backToIntranet,
    controlEquiposTab, 
    setControlEquiposTab,
    isAuthenticated,
    currentUser,
    setCurrentUser,
    systemUsers,
    logout,
    setIsScannerOpen
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      
      {/* Simulated Browser Web Application Bar */}
      <div className="bg-slate-900 text-slate-300 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 no-print">
        
        {/* Return to Intranet button */}
        <div className="flex items-center gap-3">
          <button
            onClick={backToIntranet}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors cursor-pointer border border-slate-700"
            title="Volver al Portal Principal de la Intranet NECSOFT"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la Intranet Corporativa</span>
          </button>

          <span className="text-slate-600 hidden sm:inline" aria-hidden="true">|</span>

          {/* Simulated Browser URL bar */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-950 rounded-lg text-slate-400 font-mono text-[11px] border border-slate-800">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span className="text-slate-200">https://activos.necsoftpc.com</span>
            <span className="text-slate-500">/sistema-entradas-salidas</span>
          </div>
        </div>

        {/* System security status */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden md:inline font-mono">Conexión Cifrada SSL · Red Interna TI</span>
          <span className="px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 font-bold text-[10px]">
            SISTEMA INDEPENDIENTE
          </span>
        </div>

      </div>

      {/* Dedicated App Header & Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-16">
            
            {/* Brand Wordmark & System Title */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30 font-bold">
                <Laptop className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                    NECSOFT PC
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                    RENTAL TI
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                  Control de Entradas y Salidas · Trazabilidad QR
                </span>
              </div>
            </div>

            {/* Navigation Tabs (Only visible when authenticated) */}
            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-1.5">
                <button
                  onClick={() => setControlEquiposTab('equipment')}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    controlEquiposTab === 'equipment'
                      ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Laptop className="w-4 h-4" />
                  <span>Inventario y Despachos</span>
                </button>

                <button
                  onClick={() => setControlEquiposTab('movements')}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    controlEquiposTab === 'movements'
                      ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Auditoría QR & Movimientos</span>
                </button>
              </nav>
            )}

            {/* Right actions: Logged Reviewer User + Escanear QR button */}
            <div className="flex items-center gap-2.5 shrink-0">
              {isAuthenticated ? (
                <>
                  {/* Current Active Reviewer User Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs transition-colors cursor-pointer"
                      title="Usuario activo que valida y firma salidas e ingresos"
                    >
                      <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[11px]">
                        {currentUser.name.charAt(0)}
                      </div>
                      <div className="text-left hidden md:block">
                        <div className="font-bold text-slate-900 dark:text-white text-[11px] leading-tight truncate max-w-[130px]">
                          {currentUser.name}
                        </div>
                        <div className="text-[10px] text-slate-500 leading-tight">
                          Revisor Activo
                        </div>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                    </button>

                    {/* Dropdown Menu */}
                    {isUserMenuOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setIsUserMenuOpen(false)} 
                        />
                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 text-xs">
                          <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                              Sesión Activa de TI
                            </span>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Este usuario firma automáticamente las actas de salida e ingreso en Colombia.
                            </p>
                          </div>

                          <div className="py-1">
                            {systemUsers.map(u => {
                              const isCurrent = u.id === currentUser.id;
                              return (
                                <button
                                  key={u.id}
                                  onClick={() => {
                                    setCurrentUser(u);
                                    setIsUserMenuOpen(false);
                                  }}
                                  className={`w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                                    isCurrent ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold' : 'text-slate-700 dark:text-slate-300'
                                  }`}
                                >
                                  <div>
                                    <div className="text-xs font-bold">{u.name}</div>
                                    <div className="text-[10px] text-slate-500">{u.jobTitle}</div>
                                  </div>
                                  {isCurrent && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                                </button>
                              );
                            })}
                          </div>

                          <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                            <button
                              onClick={() => {
                                setIsUserMenuOpen(false);
                                logout();
                              }}
                              className="w-full px-3.5 py-2 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 font-semibold cursor-pointer"
                            >
                              <LogOut className="w-3.5 h-3.5" />
                              <span>Cerrar Sesión</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Direct QR Scanner trigger */}
                  <button
                    onClick={() => setIsScannerOpen(true)}
                    className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-semibold rounded-xl shadow-sm transition-all whitespace-nowrap cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span className="hidden sm:inline">Escanear QR</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Acceso Protegido</span>
                </div>
              )}
            </div>

          </div>

          {/* Mobile subnavigation for authenticated user */}
          {isAuthenticated && (
            <div className="md:hidden flex items-center gap-2 py-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                onClick={() => setControlEquiposTab('equipment')}
                className={`flex-1 py-1.5 rounded-lg text-center font-medium transition-colors ${
                  controlEquiposTab === 'equipment'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Inventario
              </button>
              <button
                onClick={() => setControlEquiposTab('movements')}
                className={`flex-1 py-1.5 rounded-lg text-center font-medium transition-colors ${
                  controlEquiposTab === 'movements'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Auditoría QR
              </button>
            </div>
          )}

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {!isAuthenticated ? (
          <LoginView />
        ) : (
          <>
            {controlEquiposTab === 'equipment' && <EquipmentView />}
            {controlEquiposTab === 'movements' && <MovementsView />}
          </>
        )}
      </main>

      {/* Global Modals for Control de Entradas y Salidas */}
      <QrScannerModal />
      <EquipmentActionModal />
      <EquipmentLabelModal />

    </div>
  );
};
