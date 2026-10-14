import React, { useState } from 'react';
import { 
  Download, 
  Terminal, 
  Search, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  X, 
  Globe, 
  Copy 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SoftwarePackage } from '../types';
import { generatePowerShellDeploymentScript } from '../utils/qrUtils';

export const SoftwareView: React.FC = () => {
  const { 
    softwareList, 
    softwareProfiles, 
    addSoftware,
    userRole 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProfileId, setSelectedProfileId] = useState<string>(softwareProfiles[0]?.id || '');
  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isNewSoftwareModalOpen, setIsNewSoftwareModalOpen] = useState(false);

  // New Software Form state
  const [newSwName, setNewSwName] = useState('');
  const [newSwCategory, setNewSwCategory] = useState<SoftwarePackage['category']>('Utilidades');
  const [newSwVersion, setNewSwVersion] = useState('');
  const [newSwSize, setNewSwSize] = useState(50);
  const [newSwDeveloper, setNewSwDeveloper] = useState('');
  const [newSwDesc, setNewSwDesc] = useState('');
  const [newSwFileName, setNewSwFileName] = useState('');
  const [newSwUrl, setNewSwUrl] = useState('');

  // Active selected profile
  const activeProfile = softwareProfiles.find(p => p.id === selectedProfileId) || softwareProfiles[0];
  const profileSoftware = softwareList.filter(s => activeProfile.includedSoftwareIds.includes(s.id));

  // Copy official link
  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrlId(id);
    setTimeout(() => setCopiedUrlId(null), 2000);
  };

  // Download automated PowerShell deploy script
  const handleDownloadProfileScript = () => {
    const scriptContent = generatePowerShellDeploymentScript(profileSoftware, `${activeProfile.name} (NECSOFT PC)`);
    const blob = new Blob([scriptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `necsoft_deploy_${activeProfile.slug}.ps1`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Handle Official Download
  const handleOfficialDownload = (sw: SoftwarePackage) => {
    setDownloadingId(sw.id);

    if (sw.downloadUrl && sw.downloadUrl.startsWith('http')) {
      const link = document.createElement('a');
      link.href = sw.downloadUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = sw.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => setDownloadingId(null), 800);
    } else {
      setTimeout(() => {
        const blob = new Blob([
          `// NECSOFT PC - INSTALADOR OFICIAL\n// Paquete: ${sw.name} v${sw.version}\n// Desarrollador: ${sw.developer}\n`
        ], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = sw.fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        setDownloadingId(null);
      }, 500);
    }
  };

  // Filter software list
  const filteredSoftware = softwareList.filter(sw => {
    if (selectedCategory !== 'all' && sw.category !== selectedCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      sw.name.toLowerCase().includes(q) ||
      sw.developer.toLowerCase().includes(q) ||
      sw.description.toLowerCase().includes(q) ||
      sw.fileName.toLowerCase().includes(q)
    );
  });

  const categories = ['all', 'Ofimática', 'Utilidades', 'Desarrollo', 'Seguridad', 'Drivers'];

  const handleCreateSoftware = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSwName.trim() || !newSwVersion.trim()) return;

    addSoftware({
      name: newSwName,
      category: newSwCategory,
      version: newSwVersion,
      sizeMb: newSwSize,
      developer: newSwDeveloper || 'Proveedor Oficial',
      description: newSwDesc,
      fileName: newSwFileName || `${newSwName.toLowerCase().replace(/\s+/g, '-')}-setup.exe`,
      silentInstallCmd: `${newSwFileName} /install`,
      recommendedFor: ['Administrativo'],
      isMandatory: false,
      releaseDate: new Date().toISOString().split('T')[0],
      checksum: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      downloadUrl: newSwUrl || '#'
    });

    setIsNewSoftwareModalOpen(false);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <span>NECSOFT PC</span>
            <span aria-hidden="true">·</span>
            <span>Repositorio Oficial de Instaladores</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Descargas de Software para PCs en Arrendamiento
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enlaces directos a los instaladores oficiales de Office 2019/2021, Chrome, Firefox, utilitarios y programas básicos.
          </p>
        </div>

        {userRole === 'admin' && (
          <button
            onClick={() => setIsNewSoftwareModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Programa al Catálogo</span>
          </button>
        )}
      </div>

      {/* SECTION 1: Automated Deployment Profiles */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 lg:p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Aprovisionamiento de PCs NECSOFT
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Packs Preconfigurados para Computadores Alquilados
            </h3>
          </div>

          <button
            onClick={handleDownloadProfileScript}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Terminal className="w-4 h-4" />
            <span>Descargar Script PowerShell (.ps1)</span>
          </button>
        </div>

        {/* Profile Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {softwareProfiles.map(prof => {
            const isSelected = prof.id === activeProfile.id;
            return (
              <button
                key={prof.id}
                onClick={() => setSelectedProfileId(prof.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-500 text-blue-950 dark:bg-blue-950/40 dark:border-blue-700 dark:text-blue-200 shadow-sm ring-1 ring-blue-500'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <div className="text-xs font-bold truncate">{prof.name}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {prof.description}
                </div>
                <div className="text-[10px] font-mono mt-2 text-blue-600 dark:text-blue-400 font-semibold">
                  {prof.includedSoftwareIds.length} paquetes incluidos
                </div>
              </button>
            );
          })}
        </div>

        {/* Included software chips for the active profile */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Programas que componen este paquete:
          </div>
          <div className="flex flex-wrap gap-2">
            {profileSoftware.map(sw => (
              <div
                key={sw.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{sw.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">v{sw.version}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: Master Software Repository */}
      <div className="space-y-4">
        
        {/* Filters and Search Bar */}
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
                {cat === 'all' ? 'Todos los Programas' : cat}
              </button>
            ))}
          </div>

          <div className="relative sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, versión, archivo..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
          </div>
        </div>

        {/* Software Cards Grid (Clean Downloaders, command box removed) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSoftware.map(sw => (
            <div
              key={sw.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        {sw.category}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                        <Globe className="w-3 h-3" />
                        <span>Oficial</span>
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {sw.name}
                    </h3>
                    <p className="text-[11px] text-slate-500">{sw.developer}</p>
                  </div>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold shrink-0">
                    {sw.version}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {sw.description}
                </p>

                {/* Metadata Strip */}
                <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2">
                  <span className="font-mono tabular-nums">{sw.sizeMb} MB</span>
                  <span className="truncate font-mono text-[10px] text-slate-400">{sw.fileName}</span>
                </div>
              </div>

              {/* Action Buttons: Descargar Oficial Directa & Copiar Enlace */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                {sw.downloadUrl && sw.downloadUrl.startsWith('http') && (
                  <button
                    onClick={() => handleCopyUrl(sw.id, sw.downloadUrl || '')}
                    className="p-2.5 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                    title="Copiar enlace oficial de descarga"
                  >
                    {copiedUrlId === sw.id ? (
                      <span className="text-[10px] text-emerald-600 font-semibold">Copiado!</span>
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                )}

                <button
                  onClick={() => handleOfficialDownload(sw)}
                  disabled={downloadingId === sw.id}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {downloadingId === sw.id ? 'Iniciando descarga...' : 'Descargar'}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* New Software Modal */}
      {isNewSoftwareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in no-print">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Registrar Nuevo Software en NECSOFT PC
              </h3>
              <button
                onClick={() => setIsNewSoftwareModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSoftware} className="p-6 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Nombre del Software *</label>
                  <input
                    type="text"
                    required
                    value={newSwName}
                    onChange={e => setNewSwName(e.target.value)}
                    placeholder="Ej: Microsoft Office 2022"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Categoría</label>
                  <select
                    value={newSwCategory}
                    onChange={e => setNewSwCategory(e.target.value as SoftwarePackage['category'])}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg"
                  >
                    <option value="Ofimática">Ofimática</option>
                    <option value="Utilidades">Utilidades</option>
                    <option value="Desarrollo">Desarrollo</option>
                    <option value="Seguridad">Seguridad</option>
                    <option value="Drivers">Drivers</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Versión *</label>
                  <input
                    type="text"
                    required
                    value={newSwVersion}
                    onChange={e => setNewSwVersion(e.target.value)}
                    placeholder="Ej: 2022 / 16.0"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Tamaño (MB)</label>
                  <input
                    type="number"
                    value={newSwSize}
                    onChange={e => setNewSwSize(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Desarrollador / Fabricante</label>
                <input
                  type="text"
                  value={newSwDeveloper}
                  onChange={e => setNewSwDeveloper(e.target.value)}
                  placeholder="Ej: Microsoft Corporation"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={newSwDesc}
                  onChange={e => setNewSwDesc(e.target.value)}
                  placeholder="Descripción del programa y función en equipos alquilados..."
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">URL Oficial de Descarga</label>
                <input
                  type="url"
                  value={newSwUrl}
                  onChange={e => setNewSwUrl(e.target.value)}
                  placeholder="https://download.microsoft.com/..."
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg font-mono text-blue-600 dark:text-blue-400"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Nombre de Archivo Ejecutable</label>
                <input
                  type="text"
                  value={newSwFileName}
                  onChange={e => setNewSwFileName(e.target.value)}
                  placeholder="setup.exe"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg font-mono"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewSoftwareModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Guardar en Catálogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
