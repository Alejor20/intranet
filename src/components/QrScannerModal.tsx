import React, { useEffect, useRef, useState, useCallback } from 'react';
import jsQR from 'jsqr';
import { Camera, X, AlertCircle, CheckCircle2, RefreshCw, Upload, Keyboard, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { parseScannedQr } from '../utils/qrUtils';

export const QrScannerModal: React.FC = () => {
  const { 
    isScannerOpen, 
    setIsScannerOpen, 
    handleEquipmentScan,
    equipment
  } = useApp();

  const [scanMode, setScanMode] = useState<'camera' | 'manual' | 'image'>('camera');
  const [manualCode, setManualCode] = useState('');
  const [scanFeedback, setScanFeedback] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Play a gentle beep upon successful scan
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.18);
    } catch {
      // AudioContext not allowed or muted
    }
  };

  // Process code scanning result
  const processCode = useCallback((rawCode: string) => {
    const parsed = parseScannedQr(rawCode);
    if (!parsed) return;

    playBeep();
    const result = handleEquipmentScan(parsed);

    if (result.success) {
      setScanFeedback({
        type: 'success',
        message: result.message
      });
      // Close scanner modal after a moment so user can view the action modal
      setTimeout(() => {
        setIsScannerOpen(false);
        setScanFeedback({ type: null, message: '' });
      }, 700);
    } else {
      setScanFeedback({
        type: 'error',
        message: result.message
      });
    }
  }, [handleEquipmentScan, setIsScannerOpen]);

  // Start webcam
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: unknown) {
      console.warn('Camera access issue:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setCameraError('No se pudo acceder a la cámara web. Puedes ingresar el código manualmente o subir una foto del código QR.');
      setIsCameraActive(false);
    }
  }, []);

  // Stop webcam
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  // Video frame scanning loop
  useEffect(() => {
    if (!isScannerOpen || scanMode !== 'camera') {
      stopCamera();
      return;
    }

    startCamera();

    const scanFrame = () => {
      if (
        videoRef.current && 
        videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA &&
        canvasRef.current
      ) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          });

          if (code && code.data) {
            processCode(code.data);
            return; // pause scan loop after match
          }
        }
      }
      animationFrameRef.current = requestAnimationFrame(scanFrame);
    };

    animationFrameRef.current = requestAnimationFrame(scanFrame);

    return () => {
      stopCamera();
    };
  }, [isScannerOpen, scanMode, startCamera, stopCamera, processCode]);

  // Handle uploaded image with QR
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            processCode(code.data);
          } else {
            setScanFeedback({
              type: 'error',
              message: 'No se detectó ningún código QR legible en la imagen seleccionada.'
            });
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Handle manual submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    processCode(manualCode);
  };

  if (!isScannerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-xl">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Escáner de Equipos QR
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Punto de control para entrada y salida de computadores
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              setIsScannerOpen(false);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="px-6 pt-4 pb-2 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-xl text-xs font-medium">
            <button
              onClick={() => setScanMode('camera')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
                scanMode === 'camera'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Cámara Web</span>
            </button>
            <button
              onClick={() => setScanMode('manual')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
                scanMode === 'manual'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Código Manual</span>
            </button>
            <button
              onClick={() => setScanMode('image')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
                scanMode === 'image'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Subir Foto</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* CAMERA MODE */}
          {scanMode === 'camera' && (
            <div className="space-y-4">
              <div className="relative aspect-4/3 w-full max-w-md mx-auto bg-slate-950 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border-2 border-slate-700">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Reticle Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="relative w-56 h-56 border-2 border-blue-400/80 rounded-xl bg-blue-500/5">
                    {/* Reticle corner markers */}
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />
                    
                    {/* Scanning animated beam */}
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#38bdf8] animate-bounce mt-24" />
                  </div>
                </div>

                {!isCameraActive && !cameraError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-300 p-4 text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-400 mb-2" />
                    <p className="text-sm">Iniciando cámara web...</p>
                  </div>
                )}

                {cameraError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 text-slate-200 p-6 text-center">
                    <AlertCircle className="w-10 h-10 text-amber-400 mb-3" />
                    <p className="text-xs text-slate-300 mb-4 max-w-xs">{cameraError}</p>
                    <button
                      onClick={() => setScanMode('manual')}
                      className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Usar Entrada Manual
                    </button>
                  </div>
                )}
              </div>

              <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                Apunta la cámara al sticker con código QR adherido al chasis del equipo.
              </div>
            </div>
          )}

          {/* MANUAL / GUN SCANNER MODE */}
          {scanMode === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-4 max-w-md mx-auto py-2">
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Lectura directa por teclado o pistola de códigos USB
                </p>
                <p className="text-xs text-slate-500">
                  Ingresa el código de activo (ej: <span className="font-mono text-blue-600 dark:text-blue-400">NEC-2026-001</span>) o el serial del fabricante.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Código de Activo / Número de Serie
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="NEC-2026-001 o 5CD1489X7L"
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    Buscar
                  </button>
                </div>
              </div>

              {/* Quick Suggestion Chips */}
              <div className="pt-2">
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-2">
                  Equipos de muestra listos para escanear:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {equipment.slice(0, 5).map((eq) => (
                    <button
                      key={eq.id}
                      type="button"
                      onClick={() => {
                        setManualCode(eq.code);
                        processCode(eq.code);
                      }}
                      className="px-2.5 py-1 text-xs font-mono bg-slate-100 hover:bg-blue-50 hover:text-blue-700 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                    >
                      {eq.code}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* IMAGE UPLOAD MODE */}
          {scanMode === 'image' && (
            <div className="max-w-md mx-auto py-4 space-y-4 text-center">
              <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 dark:bg-slate-800/50">
                <Upload className="w-10 h-10 text-slate-400 dark:text-slate-500 mb-3" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Selecciona o arrastra una imagen con código QR
                </span>
                <span className="text-xs text-slate-400 mt-1">
                  Formatos soportados: JPG, PNG, WebP
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          )}

          {/* Feedback Alerts */}
          {scanFeedback.type && (
            <div
              className={`mt-4 p-3.5 rounded-xl flex items-start gap-3 text-xs ${
                scanFeedback.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
            >
              {scanFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 font-medium leading-relaxed">
                {scanFeedback.message}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Detección automática de alta velocidad</span>
          </div>
          <span className="font-mono">v3.2 QR-Engine</span>
        </div>

      </div>
    </div>
  );
};
