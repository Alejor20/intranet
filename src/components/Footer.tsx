import React from 'react';
import { Download, RefreshCw, Shield, Laptop, QrCode } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { exportBackupJson, resetDatabase, equipment, movements } = useApp();

  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 text-xs py-8 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
            N
          </div>
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              NECSOFT PC · Intranet Corporativa
            </span>
            <span className="text-slate-400 block text-[11px]">
              Trazabilidad de flota con QR · Gestión documental · Descarga de software oficial
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={exportBackupJson}
            className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
            title="Descargar copia de seguridad en JSON de NECSOFT PC"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Backup JSON</span>
          </button>

          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">|</span>

          <button
            onClick={resetDatabase}
            className="flex items-center gap-1.5 text-slate-400 hover:text-rose-600 transition-colors"
            title="Restaurar base de datos a valores por defecto de NECSOFT PC"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restaurar Datos Ejemplo</span>
          </button>
        </div>

      </div>
    </footer>
  );
};
