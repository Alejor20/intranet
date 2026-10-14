import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Plus, 
  FileSpreadsheet, 
  FileArchive, 
  User, 
  Clock, 
  X,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CompanyDocument } from '../types';

export const DocumentsView: React.FC = () => {
  const { 
    documents, 
    addDocument, 
    incrementDocDownload, 
    userRole 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewingDoc, setViewingDoc] = useState<CompanyDocument | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // New Document state
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState<CompanyDocument['department']>('TI & Sistemas');
  const [newCat, setNewCat] = useState<CompanyDocument['category']>('Formato');
  const [newVersion, setNewVersion] = useState('v1.0');
  const [newAuthor, setNewAuthor] = useState('');
  const [newFileType, setNewFileType] = useState<CompanyDocument['fileType']>('pdf');
  const [newDescription, setNewDescription] = useState('');
  const [newContent, setNewContent] = useState('');

  // Filtering
  const filteredDocuments = documents.filter(doc => {
    if (selectedDept !== 'all' && doc.department !== selectedDept) return false;
    if (selectedCategory !== 'all' && doc.category !== selectedCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.description.toLowerCase().includes(q) ||
      doc.author.toLowerCase().includes(q) ||
      doc.category.toLowerCase().includes(q)
    );
  });

  const departments = ['all', 'TI & Sistemas', 'Operaciones', 'Legal', 'Recursos Humanos', 'Finanzas'];
  const categories = ['all', 'Acta de Entrega', 'Manual', 'Política', 'Formato', 'Plantilla'];

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'xlsx':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
      case 'zip':
        return <FileArchive className="w-5 h-5 text-amber-600" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  const handleDownload = (doc: CompanyDocument) => {
    incrementDocDownload(doc.id);

    // Create simulated file download
    const sampleContent = doc.contentPreview || `// DOCUMENTO CORPORATIVO: ${doc.title}\n// Versión: ${doc.version}\n// Departamento: ${doc.department}\n\n${doc.description}`;
    const blob = new Blob([sampleContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/[\s/]/g, '_')}_${doc.version}.${doc.fileType}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addDocument({
      title: newTitle,
      department: newDept,
      category: newCat,
      version: newVersion,
      updatedAt: new Date().toISOString().split('T')[0],
      sizeKb: Math.floor(100 + Math.random() * 800),
      author: newAuthor || (userRole === 'admin' ? 'Administrador TI' : 'Gestor Documental'),
      fileType: newFileType,
      description: newDescription,
      contentPreview: newContent || newDescription
    });

    setIsUploadModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewContent('');
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Gestión Documental Corporativa
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Formatos oficiales, actas de entrega de equipos, políticas de seguridad y contratos de arrendamiento.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-semibold rounded-xl shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Publicar Documento</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        
        {/* Department Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedDept === dept
                  ? 'bg-slate-900 text-white dark:bg-blue-600 font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {dept === 'all' ? 'Todos los Departamentos' : dept}
            </button>
          ))}
        </div>

        {/* Search and Category Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por título, autor o contenido..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px]">Tipo:</span>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">Todas las categorías</option>
              {categories.filter(c => c !== 'all').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocuments.map(doc => (
          <div
            key={doc.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 p-5 flex flex-col justify-between transition-all space-y-4"
          >
            <div className="space-y-3">
              
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 shrink-0">
                  {getFileIcon(doc.fileType)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span className="font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{doc.department}</span>
                    <span aria-hidden="true">·</span>
                    <span>{doc.category}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug mt-0.5 line-clamp-2">
                    {doc.title}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {doc.description}
              </p>

              {/* Meta */}
              <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  <span className="truncate max-w-[120px]">{doc.author}</span>
                </span>
                <span className="font-mono text-slate-400">{doc.version} · {doc.sizeKb} KB</span>
              </div>

            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setViewingDoc(doc)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Vista Previa</span>
              </button>

              <button
                onClick={() => handleDownload(doc)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Document Preview Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                {getFileIcon(viewingDoc.fileType)}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {viewingDoc.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {viewingDoc.department} · {viewingDoc.version} · Actualizado: {viewingDoc.updatedAt}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Descripción:</span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {viewingDoc.description}
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Extracto del Contenido del Documento:
                </span>
                <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs whitespace-pre-line leading-relaxed max-h-64 overflow-y-auto border border-slate-800">
                  {viewingDoc.contentPreview || 'Vista previa no disponible para este formato binario.'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <strong>Responsable:</strong> {viewingDoc.author}
                </div>
                <div>
                  <strong>Descargas registradas:</strong> {viewingDoc.downloadCount} descargas
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
              <button
                onClick={() => setViewingDoc(null)}
                className="text-xs font-semibold text-slate-600 dark:text-slate-400"
              >
                Cerrar
              </button>
              <button
                onClick={() => handleDownload(viewingDoc)}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Documento Oficial</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Publicar Nuevo Documento Corporativo
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="p-6 space-y-3 text-xs overflow-y-auto">
              <div>
                <label className="block font-semibold mb-1">Título del Documento *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Ej: Acta de Recepción y Control Físico de Periféricos"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Departamento</label>
                  <select
                    value={newDept}
                    onChange={e => setNewDept(e.target.value as CompanyDocument['department'])}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg"
                  >
                    <option value="TI & Sistemas">TI & Sistemas</option>
                    <option value="Operaciones">Operaciones</option>
                    <option value="Legal">Legal</option>
                    <option value="Recursos Humanos">Recursos Humanos</option>
                    <option value="Finanzas">Finanzas</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Categoría</label>
                  <select
                    value={newCat}
                    onChange={e => setNewCat(e.target.value as CompanyDocument['category'])}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg"
                  >
                    <option value="Acta de Entrega">Acta de Entrega</option>
                    <option value="Formato">Formato</option>
                    <option value="Política">Política</option>
                    <option value="Manual">Manual</option>
                    <option value="Plantilla">Plantilla</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Versión</label>
                  <input
                    type="text"
                    value={newVersion}
                    onChange={e => setNewVersion(e.target.value)}
                    placeholder="v1.0"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Tipo de Archivo</label>
                  <select
                    value={newFileType}
                    onChange={e => setNewFileType(e.target.value as CompanyDocument['fileType'])}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg uppercase"
                  >
                    <option value="pdf">PDF</option>
                    <option value="docx">Word (.docx)</option>
                    <option value="xlsx">Excel (.xlsx)</option>
                    <option value="zip">ZIP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Autor / Responsable</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={e => setNewAuthor(e.target.value)}
                  placeholder="Ej: Daniel Ramos (Infraestructura TI)"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Descripción y Propósito</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Explica para qué sirve este formato o procedimiento..."
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Contenido / Cláusulas Clave</label>
                <textarea
                  rows={3}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Pega el texto del documento para previsualización..."
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg font-mono text-xs"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg"
                >
                  Publicar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
