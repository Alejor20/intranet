import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  Layers, 
  ArrowRight, 
  ExternalLink, 
  Globe, 
  ChevronRight, 
  Terminal,
  Check,
  Copy,
  Laptop
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CompanyDocument, SoftwarePackage } from '../types';

export const DashboardView: React.FC = () => {
  const { 
    softwareList, 
    documents, 
    apps, 
    setActiveTab, 
    incrementDocDownload,
    openControlEquipos
  } = useApp();

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDownloadSoftware = (sw: SoftwarePackage) => {
    if (sw.downloadUrl && sw.downloadUrl.startsWith('http')) {
      const link = document.createElement('a');
      link.href = sw.downloadUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = sw.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      const blob = new Blob([
        `// NECSOFT PC - INSTALADOR OFICIAL\n// Paquete: ${sw.name} v${sw.version}\n`
      ], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = sw.fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  };

  const handleCopyCmd = (id: string, cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadDoc = (doc: CompanyDocument) => {
    incrementDocDownload(doc.id);
    const content = doc.contentPreview || `// DOCUMENTO OFICIAL NECSOFT PC\n${doc.title}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/[\s/]/g, '_')}_${doc.version}.${doc.fileType}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Top 6 primary software packages requested
  const featuredSoftware = softwareList.slice(0, 6);
  const featuredDocs = documents.slice(0, 4);

  return (
    <div className="space-y-10">

      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 lg:p-9 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
              <span>NECSOFT PC</span>
              <span aria-hidden="true">·</span>
              <span>Intranet Corporativa de Soluciones Tecnológicas</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Portal Oficial de Descargas, Documentos y Aplicativos
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Repositorio centralizado para el personal y técnicos de NECSOFT PC: descarga programas oficiales para computadores de arrendamiento (Office, navegadores, utilidades), consulta documentación interna y accede a las herramientas empresariales.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('software')}
              className="flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-98 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-900/30 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Ver Descargas de Software</span>
            </button>
            <button
              onClick={() => setActiveTab('apps')}
              className="flex items-center justify-center gap-2 px-4 py-3.5 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-xl border border-white/10 transition-colors cursor-pointer"
            >
              <Layers className="w-4 h-4 text-blue-300" />
              <span>Directorio de Aplicativos</span>
            </button>
          </div>
        </div>

        {/* Ambient subtle blur */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* SECCIÓN 1: DESCARGAS OFICIALES DE SOFTWARE PARA PCs */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <Download className="w-3.5 h-3.5" />
              <span>Instaladores Oficiales para PCs en Arrendamiento</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Descargas y Programas Básicos
            </h2>
          </div>

          <button
            onClick={() => setActiveTab('software')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ver todo el software ({softwareList.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredSoftware.map(sw => (
            <div
              key={sw.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {sw.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {sw.name}
                    </h3>
                  </div>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold shrink-0">
                    {sw.version}
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {sw.description}
                </p>

                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span className="font-mono">{sw.sizeMb} MB</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                    <Globe className="w-3 h-3" />
                    <span>Enlace Oficial</span>
                  </span>
                </div>
              </div>

              {/* Action buttons: Descargar directo u opción por CMD / PowerShell */}
              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyCmd(sw.id, sw.silentInstallCmd)}
                  title="Copiar comando para CMD o PowerShell"
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium rounded-lg transition-colors cursor-pointer"
                >
                  <Terminal className="w-3 h-3 text-slate-500" />
                  <span>{copiedId === sw.id ? 'Copiado!' : 'Comando CMD/PS'}</span>
                  {copiedId === sw.id && <Check className="w-3 h-3 text-emerald-600" />}
                </button>

                <button
                  onClick={() => handleDownloadSoftware(sw)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN 2: DOCUMENTOS Y FORMATOS CORPORATIVOS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <FileText className="w-3.5 h-3.5" />
              <span>Gestión Documental Corporativa</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Documentos, Actas y Políticas
            </h2>
          </div>

          <button
            onClick={() => setActiveTab('documents')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Explorar todos ({documents.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredDocs.map(doc => (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-bold text-blue-600 dark:text-blue-400 uppercase">{doc.department}</span>
                  <span className="font-mono uppercase font-bold text-slate-400">{doc.fileType}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                  {doc.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {doc.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">
                  {doc.version} · {doc.sizeKb} KB
                </span>

                <button
                  onClick={() => handleDownloadDoc(doc)}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Descargar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN 3: DIRECTORIO DE APLICATIVOS INTERNOS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <Layers className="w-3.5 h-3.5" />
              <span>Sistemas Internos de Gestión</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Directorio de Aplicativos
            </h2>
          </div>

          <button
            onClick={() => setActiveTab('apps')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ver todos los aplicativos</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card: Control de Entradas y Salidas como aplicativo que redirecciona */}
          <div
            onClick={() => openControlEquipos()}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-blue-500/80 dark:border-blue-600/80 shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs group-hover:scale-105 transition-transform">
                  <Laptop className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-md uppercase tracking-wider border border-blue-200 dark:border-blue-800">
                  Sistema Web TI
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Control de Entradas y Salidas (QR)
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                Plataforma web de inventario, despacho a ciudades de Colombia, técnicos responsables y stickers de activos QR.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-3 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
              <span className="flex items-center gap-1">
                <span>Abrir Aplicativo</span>
                <ExternalLink className="w-3 h-3" />
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Cards for other standard apps */}
          {apps.slice(0, 3).map(app => (
            <div
              key={app.id}
              onClick={() => setActiveTab('apps')}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {app.category}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Operativo</span>
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  {app.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {app.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>{app.accessLevel}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
              </div>
            </div>
          ))}

        </div>
      </section>

    </div>
  );
};
