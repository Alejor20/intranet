import React, { useState } from 'react';
import { X, Plus, Laptop } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EquipmentType } from '../types';

interface NewEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewEquipmentModal: React.FC<NewEquipmentModalProps> = ({ isOpen, onClose }) => {
  const { addEquipment, equipment } = useApp();

  const nextCodeNumber = equipment.length + 1;
  const defaultCode = `NEC-2026-${String(nextCodeNumber).padStart(3, '0')}`;

  const [code, setCode] = useState(defaultCode);
  const [serialNumber, setSerialNumber] = useState('');
  const [brand, setBrand] = useState('Lenovo');
  const [model, setModel] = useState('');
  const [type, setType] = useState<EquipmentType>('laptop');
  const [cpu, setCpu] = useState('Intel Core i5-1345U');
  const [ram, setRam] = useState('16 GB DDR4');
  const [storage, setStorage] = useState('512 GB SSD NVMe');
  const [os, setOs] = useState('Windows 11 Pro 64-bit');
  const [screenSize, setScreenSize] = useState('14" FHD');
  const [installedSoftwarePack, setInstalledSoftwarePack] = useState('Pack Básico Ofimática');
  const [conditionNotes, setConditionNotes] = useState('Equipo nuevo ingresado al inventario de NECSOFT PC en estado impecable.');

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!serialNumber.trim() || !model.trim()) {
      setError('Por favor completa el número de serie y modelo del equipo.');
      return;
    }

    await addEquipment({
      code,
      serialNumber: serialNumber.trim().toUpperCase(),
      brand,
      model,
      type,
      specs: {
        cpu,
        ram,
        storage,
        os,
        screenSize: type === 'desktop' || type === 'workstation' ? undefined : screenSize
      },
      status: 'available',
      conditionNotes,
      installedSoftwarePack,
      lastMaintenanceDate: new Date().toISOString().split('T')[0]
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-xl">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Dar de Alta Nuevo Equipo en Inventario
              </h3>
              <p className="text-xs text-slate-500">
                Se generará su código QR corporativo automáticamente
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form id="new-eq-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Código de Activo Fijo *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Número de Serie (Fabricante) *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: 5CD1489X7L"
                value={serialNumber}
                onChange={e => setSerialNumber(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Marca
              </label>
              <select
                value={brand}
                onChange={e => setBrand(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
              >
                <option value="Lenovo">Lenovo</option>
                <option value="Dell">Dell</option>
                <option value="HP">HP</option>
                <option value="Apple">Apple</option>
                <option value="Asus">Asus</option>
                <option value="Otra">Otra</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Modelo Comercial *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: ThinkPad T14s Gen 4"
                value={model}
                onChange={e => setModel(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tipo de Dispositivo
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as EquipmentType)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
              >
                <option value="laptop">Portátil / Laptop</option>
                <option value="desktop">PC de Escritorio / Mini PC</option>
                <option value="workstation">Estación de Trabajo (Workstation)</option>
                <option value="monitor">Monitor Corporativo</option>
                <option value="accessory">Periférico / Accesorio</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pack de Software Preinstalado
              </label>
              <select
                value={installedSoftwarePack}
                onChange={e => setInstalledSoftwarePack(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
              >
                <option value="Pack Administrativo">Pack Administrativo & Operaciones</option>
                <option value="Pack Desarrollador">Pack Ingeniería & Desarrollo</option>
                <option value="Pack Call Center">Pack Call Center & BPO</option>
                <option value="Pack Diseño & 3D">Pack Diseño Gráfico & 3D</option>
                <option value="Sin pack previo">Sin pack previo (Limpio)</option>
              </select>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
              Especificaciones de Hardware
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-slate-500 mb-0.5">CPU / Procesador</label>
                <input
                  type="text"
                  value={cpu}
                  onChange={e => setCpu(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-0.5">Memoria RAM</label>
                <input
                  type="text"
                  value={ram}
                  onChange={e => setRam(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-0.5">Almacenamiento</label>
                <input
                  type="text"
                  value={storage}
                  onChange={e => setStorage(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-0.5">Sistema Operativo</label>
                <input
                  type="text"
                  value={os}
                  onChange={e => setOs(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md"
                />
              </div>
              {(type === 'laptop' || type === 'monitor') && (
                <div className="col-span-2">
                  <label className="block text-slate-500 mb-0.5">Pantalla</label>
                  <input
                    type="text"
                    value={screenSize}
                    onChange={e => setScreenSize(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notas Iniciales de Condición
            </label>
            <textarea
              rows={2}
              value={conditionNotes}
              onChange={e => setConditionNotes(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
            />
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Cancelar
          </button>

          <button
            type="submit"
            form="new-eq-form"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-semibold rounded-xl shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Guardar y Generar QR</span>
          </button>
        </div>

      </div>
    </div>
  );
};
