import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Download, 
  CheckCircle2, 
  X, 
  MapPin, 
  Truck, 
  UserCheck, 
  Building, 
  FileText, 
  ShieldCheck,
  CheckSquare,
  Square
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MovementLog } from '../types';

export const MovementsView: React.FC = () => {
  const { movements } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'checkout' | 'checkin'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovement, setSelectedMovement] = useState<MovementLog | null>(null);

  const filteredMovements = movements.filter(mov => {
    if (filterType !== 'all' && mov.type !== filterType) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      mov.equipmentCode.toLowerCase().includes(q) ||
      mov.equipmentModel.toLowerCase().includes(q) ||
      mov.clientName.toLowerCase().includes(q) ||
      mov.destinationCity.toLowerCase().includes(q) ||
      mov.reviewerUser.toLowerCase().includes(q) ||
      (mov.deliveryTechnician && mov.deliveryTechnician.toLowerCase().includes(q)) ||
      (mov.receivingTechnician && mov.receivingTechnician.toLowerCase().includes(q)) ||
      (mov.contractNumber && mov.contractNumber.toLowerCase().includes(q))
    );
  });

  const exportCsv = () => {
    const headers = [
      'ID', 
      'Tipo', 
      'Codigo_Equipo', 
      'Modelo', 
      'Cliente', 
      'Contrato', 
      'Ciudad_Destino', 
      'Tecnico_Entrega_Recibe', 
      'Usuario_Revisa_Logueado', 
      'Fecha_Hora', 
      'Estado_Fisico', 
      'Observaciones'
    ];
    const rows = filteredMovements.map(m => [
      m.id,
      m.type === 'checkout' ? 'SALIDA' : 'ENTRADA',
      m.equipmentCode,
      `"${m.equipmentModel}"`,
      `"${m.clientName}"`,
      m.contractNumber || 'N/A',
      `"${m.destinationCity}"`,
      `"${m.type === 'checkout' ? m.deliveryTechnician : m.receivingTechnician}"`,
      `"${m.reviewerUser}"`,
      m.timestamp,
      `"${m.conditionAtMovement}"`,
      `"${(m.observations || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `auditoria_movimientos_rental_colombia_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Auditoría de Entradas & Salidas de Equipos
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Registro de despachos por ciudad de destino en Colombia, técnico de entrega y usuario que revisa.
          </p>
        </div>

        <button
          onClick={exportCsv}
          className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl shadow-sm transition-all shrink-0"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Exportar Bitácora CSV</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Todos ({movements.length})
          </button>
          <button
            onClick={() => setFilterType('checkout')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'checkout'
                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Salidas ({movements.filter(m => m.type === 'checkout').length})
          </button>
          <button
            onClick={() => setFilterType('checkin')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'checkin'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Entradas ({movements.filter(m => m.type === 'checkin').length})
          </button>
        </div>

        <div className="relative sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por equipo, ciudad, técnico..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
          />
        </div>
      </div>

      {/* Movements Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Operación</th>
                <th className="py-3 px-4">Código Activo</th>
                <th className="py-3 px-4">Modelo</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Ciudad Destino (Col)</th>
                <th className="py-3 px-4">Técnico Entrega/Recibe</th>
                <th className="py-3 px-4">Usuario que Revisa</th>
                <th className="py-3 px-4">Fecha & Hora</th>
                <th className="py-3 px-4 text-right">Constancia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-xs text-slate-400">
                    No se encontraron registros de movimiento con los filtros actuales.
                  </td>
                </tr>
              ) : (
                filteredMovements.map(mov => (
                  <tr
                    key={mov.id}
                    onClick={() => setSelectedMovement(mov)}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-850/60 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 font-bold ${
                        mov.type === 'checkout'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {mov.type === 'checkout' ? (
                          <>
                            <ArrowUpRight className="w-4 h-4" />
                            <span>Salida</span>
                          </>
                        ) : (
                          <>
                            <ArrowDownLeft className="w-4 h-4" />
                            <span>Entrada</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono font-bold text-slate-900 dark:text-white">
                      {mov.equipmentCode}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                      {mov.equipmentModel}
                    </td>
                    <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-medium">
                      {mov.clientName}
                      {mov.contractNumber && (
                        <span className="block text-[10px] text-slate-400 font-mono">
                          {mov.contractNumber}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md">
                        <MapPin className="w-3 h-3" />
                        <span>{mov.destinationCity}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-700 dark:text-slate-300">
                      {mov.type === 'checkout' ? mov.deliveryTechnician : mov.receivingTechnician}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-blue-700 dark:text-blue-300 font-medium">
                      {mov.reviewerUser}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-500">
                      {mov.timestamp}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                        Ver Acta
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movement Detail / Certificate Modal */}
      {selectedMovement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in no-print">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className={`flex items-center justify-between px-6 py-4 border-b ${
              selectedMovement.type === 'checkout'
                ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40'
                : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl text-white ${
                  selectedMovement.type === 'checkout' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}>
                  {selectedMovement.type === 'checkout' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedMovement.type === 'checkout' ? 'Acta de Salida a Arrendamiento' : 'Acta de Entrada y Devolución'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Registro ID: <span className="font-mono">{selectedMovement.id}</span> · {selectedMovement.timestamp}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMovement(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* Asset & Client Strip */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">Equipo:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{selectedMovement.equipmentCode}</span>
                  <span className="block text-slate-500 text-[11px]">{selectedMovement.equipmentModel}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Cliente / Contrato:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedMovement.clientName}</span>
                  {selectedMovement.contractNumber && (
                    <span className="block text-slate-500 text-[11px] font-mono">{selectedMovement.contractNumber}</span>
                  )}
                </div>
              </div>

              {/* Specific fields requested by user */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 bg-rose-50/60 dark:bg-rose-950/30 rounded-xl border border-rose-200/80 dark:border-rose-900/40">
                  <span className="text-rose-700 dark:text-rose-400 block font-semibold text-[10px] uppercase">
                    Ciudad de Destino:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{selectedMovement.destinationCity}</span>
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                    {selectedMovement.type === 'checkout' ? 'Técnico que Entrega:' : 'Técnico que Recibe:'}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-xs mt-0.5 block truncate">
                    {selectedMovement.type === 'checkout' ? selectedMovement.deliveryTechnician : selectedMovement.receivingTechnician}
                  </span>
                </div>

                <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200/80 dark:border-blue-900/40">
                  <span className="text-blue-700 dark:text-blue-300 block font-semibold text-[10px] uppercase">
                    Usuario que Revisa:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-xs mt-0.5 block truncate">
                    {selectedMovement.reviewerUser}
                  </span>
                </div>
              </div>

              {/* Physical Condition and Checklist */}
              <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Estado Físico Verificado:</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {selectedMovement.conditionAtMovement}
                  </span>
                </div>
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>

              {/* Checklist details */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                  Verificación de Accesorios & Componentes
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { key: 'chargerIncluded', label: 'Cargador de corriente' },
                    { key: 'screenIntact', label: 'Pantalla en buen estado' },
                    { key: 'cablesIncluded', label: 'Cables correspondientes' },
                    { key: 'mouseKeyboardIncluded', label: 'Mouse / Teclado' },
                    { key: 'softwareVerified', label: 'Software y antivirus' },
                    { key: 'cleanAndDisinfected', label: 'Limpieza y desinfección' }
                  ].map(item => {
                    const checked = selectedMovement.checklist[item.key as keyof typeof selectedMovement.checklist];
                    return (
                      <div key={item.key} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        {checked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Observations */}
              {selectedMovement.observations && (
                <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Observaciones Técnicas:
                  </span>
                  <p className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                    {selectedMovement.observations}
                  </p>
                </div>
              )}

            </div>

            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
              <button
                onClick={() => setSelectedMovement(null)}
                className="text-xs font-semibold text-slate-600 dark:text-slate-400"
              >
                Cerrar
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
              >
                Imprimir Constancia
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
