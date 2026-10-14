import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  X, 
  CheckSquare, 
  Square, 
  ShieldCheck, 
  UserCheck, 
  Building, 
  FileText, 
  Calendar, 
  MapPin, 
  Truck, 
  AlertTriangle,
  Cpu,
  HardDrive,
  Monitor,
  PenTool,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClientAssignment, MovementChecklist } from '../types';
import { COLOMBIA_CITIES, POPULAR_CITIES } from '../data/colombiaCities';

export const EquipmentActionModal: React.FC = () => {
  const {
    selectedEquipmentForAction,
    setSelectedEquipmentForAction,
    actionModalType,
    setActionModalType,
    currentUser,
    registerCheckOut,
    registerCheckIn
  } = useApp();

  const eq = selectedEquipmentForAction;

  // Checkout form state (Email and Phone removed as requested)
  const [clientName, setClientName] = useState('');
  const [clientDoc, setClientDoc] = useState('');
  const [contractNumber, setContractNumber] = useState(`ARR-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Specific fields:
  const [destinationCity, setDestinationCity] = useState('Bogotá D.C.');
  const [deliveryTechnician, setDeliveryTechnician] = useState('Carlos Ospina (Técnico Logística)');
  const [receivingTechnician, setReceivingTechnician] = useState('Esteban Cruz (Técnico Laboratorio)');

  // Signature canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [technicianSignature, setTechnicianSignature] = useState<string | null>(null);

  // Checkin form state
  const [conditionAtMovement, setConditionAtMovement] = useState<'Excelente' | 'Bueno' | 'Regular con observaciones' | 'Dañado para taller'>('Excelente');

  // Shared Checklist state
  const [checklist, setChecklist] = useState<MovementChecklist>({
    chargerIncluded: true,
    mouseKeyboardIncluded: true,
    screenIntact: true,
    softwareVerified: true,
    cleanAndDisinfected: true,
    cablesIncluded: true
  });

  const [observations, setObservations] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Setup canvas drawing context
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [actionModalType]);

  if (!eq || !actionModalType) return null;

  const toggleCheck = (key: keyof MovementChecklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setTechnicianSignature(canvas.toDataURL('image/png'));
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setTechnicianSignature(null);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!clientName.trim()) {
      setFormError('Por favor indica el nombre de la empresa o cliente arrendatario.');
      return;
    }
    if (!destinationCity.trim()) {
      setFormError('Por favor selecciona la ciudad de destino en Colombia.');
      return;
    }
    if (!deliveryTechnician.trim()) {
      setFormError('Por favor indica el técnico que realiza la entrega.');
      return;
    }
    if (!technicianSignature) {
      setFormError('Es obligatorio que el técnico que realiza la entrega registre su firma manuscrita en el recuadro inferior.');
      return;
    }

    const assignment: ClientAssignment = {
      clientId: `cli-${Date.now()}`,
      clientName,
      clientDocOrRUT: clientDoc || '900.000.000-1',
      rentalStartDate: startDate,
      contractNumber,
      destinationCity,
      deliveryTechnician,
      reviewerUser: `${currentUser.name} (${currentUser.jobTitle})`,
      technicianSignature
    };

    registerCheckOut(eq.id, assignment, checklist, observations);
  };

  const handleCheckinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!receivingTechnician.trim()) {
      setFormError('Por favor indica el técnico que recibe el equipo en bodega.');
      return;
    }
    registerCheckIn(eq.id, receivingTechnician, conditionAtMovement, checklist, observations, technicianSignature || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in no-print">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          actionModalType === 'checkout' 
            ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50' 
            : 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              actionModalType === 'checkout'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-emerald-500 text-white shadow-sm'
            }`}>
              {actionModalType === 'checkout' ? (
                <ArrowUpRight className="w-5 h-5" />
              ) : (
                <ArrowDownLeft className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {actionModalType === 'checkout'
                    ? 'Registrar Salida a Arrendamiento'
                    : 'Registrar Entrada / Devolución de Arrendamiento'}
                </h3>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-slate-900 text-white dark:bg-slate-800 font-bold">
                  Placa: {eq.code}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {eq.brand} {eq.model} · Serial: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{eq.serialNumber}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedEquipmentForAction(null);
              setActionModalType(null);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs text-slate-700 dark:text-slate-300">

          {/* FICHA TÉCNICA DEL EQUIPO (Datos tomados de la Base de Datos) */}
          <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Información Técnica del Equipo (Base de Datos)
                </span>
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                Verificado en BD
              </span>
            </div>

            {/* Grid of database hardware specifications */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              
              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Placa de Activo</span>
                <span className="font-mono font-black text-slate-900 dark:text-white">{eq.code}</span>
              </div>

              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Serial Fabricante</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate block">{eq.serialNumber}</span>
              </div>

              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Memoria RAM</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 block">{eq.specs.ram}</span>
              </div>

              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Almacenamiento (Disco)</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block">{eq.specs.storage}</span>
              </div>

              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 col-span-2">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Procesador (CPU)</span>
                <span className="font-semibold text-slate-900 dark:text-white truncate block">{eq.specs.cpu}</span>
              </div>

            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
              <span>Sistema Operativo: <strong className="text-slate-800 dark:text-slate-200">{eq.specs.os}</strong></span>
              {eq.specs.screenSize && (
                <span>Pantalla: <strong className="text-slate-800 dark:text-slate-200">{eq.specs.screenSize}</strong></span>
              )}
              {eq.specs.gpu && (
                <span>GPU: <strong className="text-slate-800 dark:text-slate-200">{eq.specs.gpu}</strong></span>
              )}
            </div>
          </div>

          {/* Logged-in Reviewer Banner */}
          <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <span className="text-[10px] text-blue-700 dark:text-blue-300 font-semibold uppercase tracking-wider block">
                  Usuario que revisa {actionModalType === 'checkout' ? 'la salida' : 'el ingreso'} (Sesión Activa):
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-xs">
                  {currentUser.name}
                </span>
                <span className="text-slate-500 text-[11px] ml-1.5">
                  ({currentUser.jobTitle})
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 font-medium text-[10px] rounded-md">
              Autenticado
            </span>
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          {/* CHECKOUT FLOW */}
          {actionModalType === 'checkout' && (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Client Name */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Empresa / Cliente Arrendatario *
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                      placeholder="Ej: Fintech Solutions S.A.S."
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-white"
                    />
                  </div>
                </div>

                {/* Contract Number */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Número de Contrato *
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={contractNumber}
                      onChange={e => setContractNumber(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-white font-mono"
                    />
                  </div>
                </div>

                {/* CIUDAD DE DESTINO (Colombia) */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ciudad de Destino (Colombia) *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-rose-500 pointer-events-none" />
                    <select
                      value={destinationCity}
                      onChange={e => setDestinationCity(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-white font-medium"
                    >
                      <optgroup label="Principales Capitales de Colombia">
                        {POPULAR_CITIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Todos los Municipios y Ciudades">
                        {COLOMBIA_CITIES.filter(c => !POPULAR_CITIES.includes(c.city)).map(c => (
                          <option key={`${c.city}-${c.department}`} value={c.city}>
                            {c.city} ({c.department})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>

                {/* TÉCNICO QUE LO ENTREGA */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Técnico que lo entrega *
                  </label>
                  <div className="relative">
                    <Truck className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      required
                      list="technicians-list"
                      value={deliveryTechnician}
                      onChange={e => setDeliveryTechnician(e.target.value)}
                      placeholder="Nombre del técnico responsable de la entrega"
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-white"
                    />
                    <datalist id="technicians-list">
                      <option value="Carlos Ospina (Técnico Logística)" />
                      <option value="Esteban Cruz (Técnico Despachos)" />
                      <option value="Jorge Beltrán (Técnico de Campo)" />
                      <option value="Javier Muñoz (Soporte en Sitio)" />
                    </datalist>
                  </div>
                </div>

                {/* NIT/RUT */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    NIT / RUT o Identificación Cliente
                  </label>
                  <input
                    type="text"
                    value={clientDoc}
                    onChange={e => setClientDoc(e.target.value)}
                    placeholder="901.442.128-4"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-white font-mono"
                  />
                </div>

                {/* Fecha de Entrega */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha de Entrega
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-white"
                    />
                  </div>
                </div>

              </div>

              {/* PANEL DE FIRMA MANUSCRITA DEL TÉCNICO QUE ENTREGA */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PenTool className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <label className="block font-bold text-slate-900 dark:text-white text-xs">
                      Firma del Técnico que Realiza la Entrega *
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    {technicianSignature ? (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Firma Registrada</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                        Pendiente de firma
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Limpiar Firma</span>
                    </button>
                  </div>
                </div>

                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-2 bg-slate-50/50 dark:bg-slate-900/50 relative">
                  <canvas
                    ref={canvasRef}
                    width={560}
                    height={110}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-28 bg-white dark:bg-slate-950 rounded-xl cursor-crosshair touch-none border border-slate-200 dark:border-slate-800"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-1 font-sans">
                    <span>Dibuja la firma del técnico con el mouse o pantalla táctil</span>
                    <span>Técnico: {deliveryTechnician}</span>
                  </div>
                </div>
              </div>

            </form>
          )}

          {/* CHECKIN FLOW */}
          {actionModalType === 'checkin' && (
            <form id="checkin-form" onSubmit={handleCheckinSubmit} className="space-y-4">
              
              {/* Previous Assignment Summary */}
              {eq.currentAssignment && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Cliente: {eq.currentAssignment.clientName}
                    </span>
                    <span className="font-mono text-slate-500">
                      Contrato: {eq.currentAssignment.contractNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>Ciudad de procedencia: <strong>{eq.currentAssignment.destinationCity}</strong></span>
                    </span>
                    <span>Entregado originalmente por: <strong>{eq.currentAssignment.deliveryTechnician}</strong></span>
                  </div>
                </div>
              )}

              {/* TÉCNICO QUE LO RECIBE */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Técnico que lo recibe en Bodega/Taller *
                </label>
                <div className="relative">
                  <Truck className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    list="technicians-list-in"
                    value={receivingTechnician}
                    onChange={e => setReceivingTechnician(e.target.value)}
                    placeholder="Nombre del técnico que inspecciona y recibe"
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
                  />
                  <datalist id="technicians-list-in">
                    <option value="Esteban Cruz (Técnico Laboratorio)" />
                    <option value="Carlos Ospina (Técnico Logística)" />
                    <option value="Jorge Beltrán (Técnico de Campo)" />
                  </datalist>
                </div>
              </div>

              {/* Estado Físico */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Estado Físico del Equipo en Retorno *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Excelente', 'Bueno', 'Regular con observaciones', 'Dañado para taller'] as const).map(option => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => setConditionAtMovement(option)}
                      className={`p-3 rounded-xl border text-left font-medium transition-all cursor-pointer ${
                        conditionAtMovement === option
                          ? option === 'Dañado para taller'
                            ? 'bg-rose-50 border-rose-400 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200 dark:border-rose-700'
                            : 'bg-emerald-50 border-emerald-400 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-700'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {conditionAtMovement === option && <ShieldCheck className="w-4 h-4 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {option === 'Excelente' && 'Sin detalles estéticos ni funcionales'}
                        {option === 'Bueno' && 'Desgaste normal de uso, 100% operativo'}
                        {option === 'Regular con observaciones' && 'Rayones leves o marcas estéticas'}
                        {option === 'Dañado para taller' && 'Falla física, pasa a Mantenimiento'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* FIRMA DE RECEPCIÓN (Opcional para devolución) */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 text-xs">
                    Firma del Técnico que Inspecciona y Recibe
                  </label>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="text-[11px] text-slate-500 hover:text-rose-600 transition-colors"
                  >
                    Limpiar Firma
                  </button>
                </div>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-slate-50 dark:bg-slate-900/40">
                  <canvas
                    ref={canvasRef}
                    width={560}
                    height={90}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-20 bg-white dark:bg-slate-950 rounded-lg cursor-crosshair touch-none border border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>

            </form>
          )}

          {/* CHECKLIST SECTION */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h4 className="font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[11px]">
              Checklist de Control Físico ({actionModalType === 'checkout' ? 'Despacho' : 'Recepción'})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { key: 'chargerIncluded', label: 'Cargador de corriente original verificado' },
                { key: 'screenIntact', label: 'Pantalla sin fisuras, rayas ni píxeles muertos' },
                { key: 'cablesIncluded', label: 'Cables de alimentación / video completos' },
                { key: 'mouseKeyboardIncluded', label: 'Periféricos (mouse/teclado) si aplica' },
                { key: 'softwareVerified', label: 'Software base y antivirus verificado' },
                { key: 'cleanAndDisinfected', label: 'Limpieza y desinfección con alcohol isopropílico' }
              ].map(item => {
                const checked = checklist[item.key as keyof MovementChecklist];
                return (
                  <button
                    type="button"
                    key={item.key}
                    onClick={() => toggleCheck(item.key as keyof MovementChecklist)}
                    className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                      checked
                        ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium'
                        : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-400 line-through'
                    }`}
                  >
                    {checked ? (
                      <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Observations */}
          <div className="space-y-1">
            <label className="block font-semibold text-slate-700 dark:text-slate-300">
              Observaciones del Movimiento
            </label>
            <textarea
              rows={2}
              value={observations}
              onChange={e => setObservations(e.target.value)}
              placeholder="Detalles sobre accesorios, embalaje o transporte intermunicipal..."
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
          </div>

          {conditionAtMovement === 'Dañado para taller' && actionModalType === 'checkin' && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Aviso de Taller Técnico:</strong> Al confirmar esta entrada como "Dañado para taller", el estado del equipo cambiará automáticamente a <strong>En Mantenimiento</strong>.
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setSelectedEquipmentForAction(null);
              setActionModalType(null);
            }}
            className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="submit"
            form={actionModalType === 'checkout' ? 'checkout-form' : 'checkin-form'}
            className={`flex items-center gap-2 px-5 py-2.5 font-semibold text-white rounded-xl shadow-md transition-all cursor-pointer ${
              actionModalType === 'checkout'
                ? 'bg-amber-600 hover:bg-amber-700 active:scale-98'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-98'
            }`}
          >
            {actionModalType === 'checkout' ? (
              <>
                <ArrowUpRight className="w-4 h-4" />
                <span>Confirmar Salida a {destinationCity}</span>
              </>
            ) : (
              <>
                <ArrowDownLeft className="w-4 h-4" />
                <span>Confirmar Entrada en Bodega</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
