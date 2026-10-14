import React, { useState, useMemo } from 'react';
import { 
  Laptop, 
  Monitor, 
  Server, 
  QrCode, 
  Search, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Printer, 
  Cpu, 
  HardDrive, 
  Building, 
  MapPin, 
  Truck, 
  UserCheck, 
  Wrench
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Equipment, EquipmentStatus } from '../types';
import { NewEquipmentModal } from '../components/NewEquipmentModal';

export const EquipmentView: React.FC = () => {
  const { 
    equipment, 
    updateEquipment,
    setIsScannerOpen, 
    setSelectedEquipmentForLabel,
    setSelectedEquipmentForAction,
    setActionModalType
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | EquipmentStatus>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Filtered equipment
  const filteredEquipment = useMemo(() => {
    return equipment.filter(eq => {
      // Status filter
      if (statusFilter !== 'all' && eq.status !== statusFilter) return false;
      // Type filter
      if (typeFilter !== 'all' && eq.type !== typeFilter) return false;

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchCode = eq.code.toLowerCase().includes(q);
      const matchSerial = eq.serialNumber.toLowerCase().includes(q);
      const matchModel = `${eq.brand} ${eq.model}`.toLowerCase().includes(q);
      const matchClient = eq.currentAssignment?.clientName.toLowerCase().includes(q);
      const matchContract = eq.currentAssignment?.contractNumber.toLowerCase().includes(q);
      const matchCity = eq.currentAssignment?.destinationCity.toLowerCase().includes(q);
      const matchTech = eq.currentAssignment?.deliveryTechnician.toLowerCase().includes(q);

      return matchCode || matchSerial || matchModel || matchClient || matchContract || matchCity || matchTech;
    });
  }, [equipment, statusFilter, typeFilter, searchQuery]);

  // Counts for tabs
  const countAvailable = equipment.filter(e => e.status === 'available').length;
  const countRented = equipment.filter(e => e.status === 'rented').length;
  const countMaintenance = equipment.filter(e => e.status === 'maintenance').length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'desktop':
        return <Server className="w-4 h-4" />;
      case 'workstation':
        return <Server className="w-4 h-4 text-purple-600" />;
      case 'monitor':
        return <Monitor className="w-4 h-4" />;
      default:
        return <Laptop className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">

      {/* Header and Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Control de Entradas y Salidas
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Inventario de computadores en alquiler NECSOFT PC, trazabilidad con códigos QR y ciudades de destino en Colombia.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Escanear QR</span>
          </button>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Dar de Alta Equipo</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        
        {/* Top Controls: Tabs and Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-x-auto text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Todos ({equipment.length})
            </button>
            <button
              onClick={() => setStatusFilter('available')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                statusFilter === 'available'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Disponibles ({countAvailable})
            </button>
            <button
              onClick={() => setStatusFilter('rented')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                statusFilter === 'rented'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              En Arrendamiento ({countRented})
            </button>
            <button
              onClick={() => setStatusFilter('maintenance')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                statusFilter === 'maintenance'
                  ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              En Taller ({countMaintenance})
            </button>
          </div>

          {/* Search Input & Hardware Type Filter */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar por código, serial, cliente, ciudad..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
              />
            </div>

            <div className="relative shrink-0">
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="all">Tipo: Todos</option>
                <option value="laptop">Portátiles</option>
                <option value="desktop">Escritorio</option>
                <option value="workstation">Workstations</option>
                <option value="monitor">Monitores</option>
              </select>
            </div>
          </div>

        </div>

      </div>

      {/* Equipment Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredEquipment.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
            <Laptop className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No se encontraron equipos con los filtros seleccionados
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Intenta ajustar tu búsqueda o registra un nuevo equipo para agregarlo al parque de arrendamiento.
            </p>
          </div>
        ) : (
          filteredEquipment.map(eq => (
            <div
              key={eq.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between overflow-hidden"
            >
              
              {/* Card Header */}
              <div className="p-5 space-y-3">
                
                {/* Code, Status and QR trigger */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                        {eq.code}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        {getTypeIcon(eq.type)}
                        <span className="capitalize">{eq.brand}</span>
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {eq.brand} {eq.model}
                    </h3>
                  </div>

                  {/* QR Preview Thumbnail */}
                  <button
                    onClick={() => setSelectedEquipmentForLabel(eq)}
                    className="p-1.5 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-blue-600 transition-colors shrink-0 group relative"
                    title="Ver e imprimir etiqueta con código QR"
                  >
                    <QrCode className="w-5 h-5" />
                  </button>
                </div>

                {/* Serial Number & Hardware Specs */}
                <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Serial:</span>
                    <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                      {eq.serialNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-slate-400" />
                      <span>{eq.specs.cpu.slice(0, 24)}...</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3 text-slate-400" />
                      <span>{eq.specs.ram}</span>
                    </span>
                  </div>
                </div>

                {/* Status Specific Section: Updated with City, Delivery Tech & Reviewer User */}
                {eq.status === 'rented' && eq.currentAssignment && (
                  <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200/80 dark:border-amber-900/40 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-semibold text-amber-900 dark:text-amber-300">
                      <span className="flex items-center gap-1.5 truncate">
                        <Building className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{eq.currentAssignment.clientName}</span>
                      </span>
                      <span className="text-[10px] font-mono shrink-0">
                        {eq.currentAssignment.contractNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-semibold text-[11px]">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>Ciudad Destino: {eq.currentAssignment.destinationCity}</span>
                    </div>

                    <div className="text-[10px] text-slate-600 dark:text-slate-400 space-y-0.5 pt-0.5 border-t border-amber-200/60 dark:border-amber-900/40">
                      <div>
                        Entregó: <strong>{eq.currentAssignment.deliveryTechnician}</strong>
                      </div>
                      <div>
                        Revisó: <strong>{eq.currentAssignment.reviewerUser}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {eq.status === 'available' && (
                  <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/80 dark:border-emerald-900/40 text-xs flex items-center justify-between">
                    <span className="text-emerald-800 dark:text-emerald-300 font-medium">
                      Disponible para entrega inmediata
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Pack: {eq.installedSoftwarePack || 'Base'}
                    </span>
                  </div>
                )}

                {eq.status === 'maintenance' && (
                  <div className="p-3 bg-rose-50/70 dark:bg-rose-950/30 rounded-xl border border-rose-200/80 dark:border-rose-900/40 text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold text-rose-800 dark:text-rose-300">
                      <span className="flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5" />
                        <span>En Laboratorio Técnico</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                      {eq.conditionNotes}
                    </p>
                  </div>
                )}

              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60 flex items-center justify-between gap-2">
                
                {/* Print sticker button */}
                <button
                  onClick={() => setSelectedEquipmentForLabel(eq)}
                  className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Sticker QR</span>
                </button>

                {/* Primary Transition Action */}
                {eq.status === 'available' && (
                  <button
                    onClick={() => {
                      setSelectedEquipmentForAction(eq);
                      setActionModalType('checkout');
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Registrar Salida</span>
                  </button>
                )}

                {eq.status === 'rented' && (
                  <button
                    onClick={() => {
                      setSelectedEquipmentForAction(eq);
                      setActionModalType('checkin');
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                    <span>Registrar Ingreso</span>
                  </button>
                )}

                {eq.status === 'maintenance' && (
                  <button
                    onClick={() => {
                      updateEquipment(eq.id, {
                        status: 'available',
                        conditionNotes: 'Mantenimiento preventivo/correctivo completado. Equipo verificado en banco de pruebas.'
                      });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-all"
                  >
                    <span>Dar Alta de Taller</span>
                  </button>
                )}

              </div>

            </div>
          ))
        )}
      </div>

      {/* New Equipment Modal */}
      <NewEquipmentModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
      />

    </div>
  );
};
