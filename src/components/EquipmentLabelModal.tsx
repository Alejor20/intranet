import React from 'react';
import { X, Printer, Download, QrCode, Laptop, Cpu, HardDrive } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EquipmentLabelModal: React.FC = () => {
  const { selectedEquipmentForLabel, setSelectedEquipmentForLabel } = useApp();
  const eq = selectedEquipmentForLabel;

  if (!eq) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQr = () => {
    if (!eq.qrCodeDataUrl) return;
    const a = document.createElement('a');
    a.href = eq.qrCodeDataUrl;
    a.download = `QR_NECSOFT_${eq.code}_${eq.serialNumber}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in no-print">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-xl">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Sticker QR de Activo Fijo · NECSOFT PC
              </h3>
              <p className="text-xs text-slate-500">
                Rotulado físico para computadores en arrendamiento
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedEquipmentForLabel(null)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sticker Printable Card Preview */}
        <div className="p-6 bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center">
          
          <div 
            id="printable-asset-label" 
            className="printable-card w-full max-w-sm bg-white text-slate-900 p-5 rounded-xl border-2 border-slate-900 shadow-md flex flex-col gap-3 font-sans"
          >
            {/* Header of label */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 bg-slate-900 rounded-xs flex items-center justify-center text-white text-[9px] font-black">
                  N
                </div>
                <span className="font-black text-xs tracking-wider uppercase text-slate-900">
                  NECSOFT PC · RENTAL TI
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-700 tracking-tight">
                ACTIVO FIJO
              </span>
            </div>

            {/* Main Label Body: QR code + metadata */}
            <div className="flex items-center gap-4">
              {/* QR Image */}
              <div className="w-28 h-28 bg-white p-1 rounded-lg border border-slate-300 flex items-center justify-center shrink-0">
                {eq.qrCodeDataUrl ? (
                  <img
                    src={eq.qrCodeDataUrl}
                    alt={`QR Code para ${eq.code}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 text-center">
                    Generando QR...
                  </div>
                )}
              </div>

              {/* Data Strip */}
              <div className="flex-1 space-y-1.5 min-w-0">
                <div>
                  <div className="text-[10px] font-medium text-slate-500 uppercase">Código Activo NECSOFT</div>
                  <div className="text-base font-black font-mono text-slate-900 tracking-tight">
                    {eq.code}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-medium text-slate-500 uppercase">Serial de Fábrica</div>
                  <div className="text-xs font-bold font-mono text-slate-800 truncate">
                    {eq.serialNumber}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-medium text-slate-500 uppercase">Modelo</div>
                  <div className="text-xs font-semibold text-slate-900 truncate">
                    {eq.brand} {eq.model}
                  </div>
                </div>
              </div>
            </div>

            {/* Specs Summary on Sticker */}
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-[10px] space-y-0.5 font-mono">
              <div className="flex items-center gap-1 text-slate-700 truncate">
                <Cpu className="w-3 h-3 text-slate-500 shrink-0" />
                <span>{eq.specs.cpu.slice(0, 32)}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-700">
                <HardDrive className="w-3 h-3 text-slate-500 shrink-0" />
                <span>RAM: {eq.specs.ram} · Disco: {eq.specs.storage}</span>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="text-[9px] text-center text-slate-500 border-t border-slate-200 pt-1.5 leading-tight">
              Escanear con la app de Intranet NECSOFT PC para registrar entrega o retorno.
              No remover este rótulo.
            </div>

          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">
            Formato optimizado para rotuladoras y stickers autoadhesivos (50×70mm o 4×2").
          </p>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <button
            type="button"
            onClick={handleDownloadQr}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Descargar PNG</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Etiqueta</span>
          </button>
        </div>

      </div>
    </div>
  );
};
