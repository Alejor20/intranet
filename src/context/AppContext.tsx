import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Equipment, 
  MovementLog, 
  SoftwarePackage, 
  SoftwareProfile, 
  CompanyDocument, 
  InternalApp, 
  ClientAssignment, 
  MovementChecklist,
  LoggedUserProfile
} from '../types';
import { 
  INITIAL_EQUIPMENT, 
  INITIAL_MOVEMENTS, 
  INITIAL_SOFTWARE, 
  INITIAL_PROFILES, 
  INITIAL_DOCUMENTS, 
  INITIAL_APPS 
} from '../data/initialData';
import { generateQrCodeDataUrl } from '../utils/qrUtils';

export type NavigationTab = 'dashboard' | 'software' | 'documents' | 'apps';
export type SystemMode = 'intranet' | 'control_equipos';
export type ControlEquiposTab = 'equipment' | 'movements';

export const SYSTEM_USERS: LoggedUserProfile[] = [
  {
    id: 'usr-1',
    name: 'Daniel Ramos',
    email: 'admin@necsoftpc.com',
    role: 'admin',
    jobTitle: 'Administrador TI & Infraestructura',
    department: 'TI & Sistemas'
  },
  {
    id: 'usr-2',
    name: 'Valentina Restrepo',
    email: 'activos@necsoftpc.com',
    role: 'admin',
    jobTitle: 'Supervisora de Gestión de Activos',
    department: 'Operaciones'
  },
  {
    id: 'usr-3',
    name: 'Esteban Cruz',
    email: 'tecnico@necsoftpc.com',
    role: 'staff',
    jobTitle: 'Técnico de Despachos y Laboratorio',
    department: 'TI & Sistemas'
  }
];

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  userRole: 'admin' | 'staff';
  setUserRole: (role: 'admin' | 'staff') => void;
  
  // Dedicated Systems Separation
  currentSystem: SystemMode;
  setCurrentSystem: (sys: SystemMode) => void;
  controlEquiposTab: ControlEquiposTab;
  setControlEquiposTab: (tab: ControlEquiposTab) => void;
  openControlEquipos: (tab?: ControlEquiposTab) => void;
  backToIntranet: () => void;

  // Mandatory Authentication State (for Control de Entradas y Salidas)
  isAuthenticated: boolean;
  currentUser: LoggedUserProfile;
  setCurrentUser: (user: LoggedUserProfile) => void;
  systemUsers: LoggedUserProfile[];
  login: (email: string, password?: string) => boolean;
  logout: () => void;

  // Data
  equipment: Equipment[];
  movements: MovementLog[];
  softwareList: SoftwarePackage[];
  softwareProfiles: SoftwareProfile[];
  documents: CompanyDocument[];
  apps: InternalApp[];

  // Modals & fast actions
  isScannerOpen: boolean;
  setIsScannerOpen: (open: boolean) => void;
  selectedEquipmentForLabel: Equipment | null;
  setSelectedEquipmentForLabel: (eq: Equipment | null) => void;
  selectedEquipmentForAction: Equipment | null;
  setSelectedEquipmentForAction: (eq: Equipment | null) => void;
  actionModalType: 'checkout' | 'checkin' | null;
  setActionModalType: (type: 'checkout' | 'checkin' | null) => void;

  // Actions
  handleEquipmentScan: (codeOrSerial: string) => { success: boolean; message: string; equipment?: Equipment };
  registerCheckOut: (
    equipmentId: string, 
    assignment: ClientAssignment, 
    checklist: MovementChecklist, 
    observations: string
  ) => void;
  registerCheckIn: (
    equipmentId: string, 
    receivingTechnician: string,
    condition: 'Excelente' | 'Bueno' | 'Regular con observaciones' | 'Dañado para taller', 
    checklist: MovementChecklist, 
    observations: string,
    technicianSignature?: string
  ) => void;
  addEquipment: (newEq: Omit<Equipment, 'id' | 'createdAt'>) => Promise<void>;
  updateEquipment: (id: string, updates: Partial<Equipment>) => void;
  addDocument: (doc: Omit<CompanyDocument, 'id' | 'downloadCount'>) => void;
  incrementDocDownload: (id: string) => void;
  addSoftware: (sw: Omit<SoftwarePackage, 'id'>) => void;
  exportBackupJson: () => void;
  resetDatabase: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_AUTH = 'necsoft_auth_user_v1';
const STORAGE_KEY_EQUIPMENT = 'necsoft_equipment_v3';
const STORAGE_KEY_MOVEMENTS = 'necsoft_movements_v3';
const STORAGE_KEY_DOCS = 'necsoft_docs_v3';
const STORAGE_KEY_SOFTWARE = 'necsoft_software_v3';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  
  // Independent System Mode State: Intranet vs Control de Entradas y Salidas
  const [currentSystem, setCurrentSystem] = useState<SystemMode>('intranet');
  const [controlEquiposTab, setControlEquiposTab] = useState<ControlEquiposTab>('equipment');

  const openControlEquipos = useCallback((tab?: ControlEquiposTab) => {
    setCurrentSystem('control_equipos');
    if (tab) setControlEquiposTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const backToIntranet = useCallback(() => {
    setCurrentSystem('intranet');
    setActiveTab('apps');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  // Authentication State
  const [currentUser, setCurrentUser] = useState<LoggedUserProfile>(() => {
    try {
      const savedAuth = localStorage.getItem(STORAGE_KEY_AUTH);
      if (savedAuth) {
        return JSON.parse(savedAuth);
      }
    } catch {
      // fallback
    }
    return SYSTEM_USERS[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem(STORAGE_KEY_AUTH));
    } catch {
      return false;
    }
  });

  const [userRole, setUserRole] = useState<'admin' | 'staff'>(currentUser.role);

  // Keep userRole synchronized with currentUser
  useEffect(() => {
    setUserRole(currentUser.role);
  }, [currentUser]);

  const login = (email: string, _password?: string): boolean => {
    const trimmed = email.trim().toLowerCase();
    const matched = SYSTEM_USERS.find(u => u.email.toLowerCase() === trimmed);
    
    // Allow matching user or fallback to standard admin if company email
    const userToLogin = matched || {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      role: 'admin' as const,
      jobTitle: 'Especialista TI NECSOFT PC',
      department: 'Sistemas & Operaciones'
    };

    setCurrentUser(userToLogin);
    setUserRole(userToLogin.role);
    setIsAuthenticated(true);
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(userToLogin));
    } catch {
      // ignore
    }
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch {
      // ignore
    }
  };

  // Scanner & Modal controls
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedEquipmentForLabel, setSelectedEquipmentForLabel] = useState<Equipment | null>(null);
  const [selectedEquipmentForAction, setSelectedEquipmentForAction] = useState<Equipment | null>(null);
  const [actionModalType, setActionModalType] = useState<'checkout' | 'checkin' | null>(null);

  // Initialize state with localStorage or defaults
  const [equipment, setEquipment] = useState<Equipment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EQUIPMENT);
      return saved ? JSON.parse(saved) : INITIAL_EQUIPMENT;
    } catch {
      return INITIAL_EQUIPMENT;
    }
  });

  const [movements, setMovements] = useState<MovementLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MOVEMENTS);
      return saved ? JSON.parse(saved) : INITIAL_MOVEMENTS;
    } catch {
      return INITIAL_MOVEMENTS;
    }
  });

  const [softwareList, setSoftwareList] = useState<SoftwarePackage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SOFTWARE);
      return saved ? JSON.parse(saved) : INITIAL_SOFTWARE;
    } catch {
      return INITIAL_SOFTWARE;
    }
  });

  const [documents, setDocuments] = useState<CompanyDocument[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DOCS);
      return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
    } catch {
      return INITIAL_DOCUMENTS;
    }
  });

  const [softwareProfiles] = useState<SoftwareProfile[]>(INITIAL_PROFILES);
  const [apps] = useState<InternalApp[]>(INITIAL_APPS);

  // Generate QR code data URLs for items without them
  useEffect(() => {
    let isCancelled = false;
    const enrichQrCodes = async () => {
      let changed = false;
      const updated = await Promise.all(
        equipment.map(async (eq) => {
          if (!eq.qrCodeDataUrl) {
            changed = true;
            const url = await generateQrCodeDataUrl(eq.code);
            return { ...eq, qrCodeDataUrl: url };
          }
          return eq;
        })
      );
      if (!isCancelled && changed) {
        setEquipment(updated);
      }
    };
    enrichQrCodes();
    return () => {
      isCancelled = true;
    };
  }, [equipment.length]);

  // Persist changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EQUIPMENT, JSON.stringify(equipment));
    } catch (e) {
      console.error('Storage error for equipment:', e);
    }
  }, [equipment]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MOVEMENTS, JSON.stringify(movements));
    } catch (e) {
      console.error('Storage error for movements:', e);
    }
  }, [movements]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SOFTWARE, JSON.stringify(softwareList));
    } catch (e) {
      console.error('Storage error for software:', e);
    }
  }, [softwareList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(documents));
    } catch (e) {
      console.error('Storage error for documents:', e);
    }
  }, [documents]);

  /**
   * Search and resolve scanned QR code or serial number
   */
  const handleEquipmentScan = useCallback((codeOrSerial: string) => {
    const query = codeOrSerial.trim().toLowerCase();
    if (!query) {
      return { success: false, message: 'Código QR no reconocido o vacío.' };
    }

    const found = equipment.find(
      eq => eq.code.toLowerCase() === query || 
            eq.serialNumber.toLowerCase() === query ||
            eq.id.toLowerCase() === query
    );

    if (found) {
      setSelectedEquipmentForAction(found);
      if (found.status === 'available') {
        setActionModalType('checkout');
      } else if (found.status === 'rented') {
        setActionModalType('checkin');
      } else {
        setActionModalType(null);
      }
      return {
        success: true,
        message: `Equipo ${found.code} (${found.brand} ${found.model}) identificado con éxito en NECSOFT PC.`,
        equipment: found
      };
    } else {
      return {
        success: false,
        message: `No se encontró ningún equipo en NECSOFT PC con el código o serial "${codeOrSerial}".`
      };
    }
  }, [equipment]);

  /**
   * Check-out equipment (salida a arrendamiento)
   */
  const registerCheckOut = useCallback((
    equipmentId: string, 
    assignment: ClientAssignment, 
    checklist: MovementChecklist, 
    observations: string
  ) => {
    const eq = equipment.find(e => e.id === equipmentId);
    if (!eq) return;

    const now = new Date();
    const timestamp = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0].slice(0, 5)}`;

    const newLog: MovementLog = {
      id: `mov-${Date.now()}`,
      equipmentId: eq.id,
      equipmentCode: eq.code,
      equipmentSerial: eq.serialNumber,
      equipmentModel: `${eq.brand} ${eq.model}`,
      equipmentSpecs: eq.specs,
      type: 'checkout',
      timestamp,
      reviewerUser: `${currentUser.name} (${currentUser.jobTitle})`,
      deliveryTechnician: assignment.deliveryTechnician,
      technicianSignature: assignment.technicianSignature,
      destinationCity: assignment.destinationCity,
      clientId: assignment.clientId || `cli-${Date.now()}`,
      clientName: assignment.clientName,
      contractNumber: assignment.contractNumber,
      conditionAtMovement: 'Excelente',
      checklist,
      observations
    };

    setEquipment(prev => prev.map(item => {
      if (item.id === equipmentId) {
        return {
          ...item,
          status: 'rented',
          currentAssignment: {
            ...assignment,
            reviewerUser: `${currentUser.name} (${currentUser.jobTitle})`
          }
        };
      }
      return item;
    }));

    setMovements(prev => [newLog, ...prev]);
    setSelectedEquipmentForAction(null);
    setActionModalType(null);
  }, [equipment, currentUser]);

  /**
   * Check-in equipment (entrada / retorno de arrendamiento)
   */
  const registerCheckIn = useCallback((
    equipmentId: string, 
    receivingTechnician: string,
    condition: 'Excelente' | 'Bueno' | 'Regular con observaciones' | 'Dañado para taller', 
    checklist: MovementChecklist, 
    observations: string,
    technicianSignature?: string
  ) => {
    const eq = equipment.find(e => e.id === equipmentId);
    if (!eq) return;

    const now = new Date();
    const timestamp = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0].slice(0, 5)}`;
    const previousAssignment = eq.currentAssignment;

    const newLog: MovementLog = {
      id: `mov-${Date.now()}`,
      equipmentId: eq.id,
      equipmentCode: eq.code,
      equipmentSerial: eq.serialNumber,
      equipmentModel: `${eq.brand} ${eq.model}`,
      equipmentSpecs: eq.specs,
      type: 'checkin',
      timestamp,
      reviewerUser: `${currentUser.name} (${currentUser.jobTitle})`,
      receivingTechnician,
      technicianSignature: technicianSignature || previousAssignment?.technicianSignature,
      destinationCity: previousAssignment?.destinationCity || 'Sede Central NECSOFT',
      clientId: previousAssignment?.clientId || 'N/A',
      clientName: previousAssignment?.clientName || 'Cliente No Especificado',
      contractNumber: previousAssignment?.contractNumber,
      conditionAtMovement: condition,
      checklist,
      observations
    };

    const nextStatus = condition === 'Dañado para taller' ? 'maintenance' : 'available';

    setEquipment(prev => prev.map(item => {
      if (item.id === equipmentId) {
        return {
          ...item,
          status: nextStatus,
          conditionNotes: observations || `Retornado el ${timestamp} en estado ${condition} desde ${previousAssignment?.destinationCity || 'Sede'}.`,
          currentAssignment: undefined,
          lastMaintenanceDate: nextStatus === 'maintenance' ? now.toISOString().split('T')[0] : item.lastMaintenanceDate
        };
      }
      return item;
    }));

    setMovements(prev => [newLog, ...prev]);
    setSelectedEquipmentForAction(null);
    setActionModalType(null);
  }, [equipment, currentUser]);

  /**
   * Add new equipment
   */
  const addEquipment = async (newEq: Omit<Equipment, 'id' | 'createdAt'>) => {
    const id = `eq-${Date.now()}`;
    const qrUrl = await generateQrCodeDataUrl(newEq.code);
    const fullEquipment: Equipment = {
      ...newEq,
      id,
      qrCodeDataUrl: qrUrl,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setEquipment(prev => [fullEquipment, ...prev]);
  };

  /**
   * Update equipment details
   */
  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    setEquipment(prev => prev.map(e => (e.id === id ? { ...e, ...updates } : e)));
  };

  /**
   * Documents handling
   */
  const addDocument = (doc: Omit<CompanyDocument, 'id' | 'downloadCount'>) => {
    const id = `doc-${Date.now()}`;
    const fullDoc: CompanyDocument = {
      ...doc,
      id,
      downloadCount: 0
    };
    setDocuments(prev => [fullDoc, ...prev]);
  };

  const incrementDocDownload = (id: string) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, downloadCount: d.downloadCount + 1 } : d));
  };

  /**
   * Software handling
   */
  const addSoftware = (sw: Omit<SoftwarePackage, 'id'>) => {
    const id = `sw-${Date.now()}`;
    setSoftwareList(prev => [ { ...sw, id }, ...prev ]);
  };

  /**
   * Backup and Reset
   */
  const exportBackupJson = () => {
    const payload = {
      company: 'NECSOFT PC',
      exportedAt: new Date().toISOString(),
      equipment,
      movements,
      softwareList,
      documents
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `necsoft_pc_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const resetDatabase = () => {
    if (window.confirm('¿Deseas restaurar todos los datos a los valores predeterminados de NECSOFT PC?')) {
      localStorage.removeItem(STORAGE_KEY_EQUIPMENT);
      localStorage.removeItem(STORAGE_KEY_MOVEMENTS);
      localStorage.removeItem(STORAGE_KEY_SOFTWARE);
      localStorage.removeItem(STORAGE_KEY_DOCS);
      setEquipment(INITIAL_EQUIPMENT);
      setMovements(INITIAL_MOVEMENTS);
      setSoftwareList(INITIAL_SOFTWARE);
      setDocuments(INITIAL_DOCUMENTS);
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userRole,
        setUserRole,
        currentSystem,
        setCurrentSystem,
        controlEquiposTab,
        setControlEquiposTab,
        openControlEquipos,
        backToIntranet,
        isAuthenticated,
        currentUser,
        setCurrentUser,
        systemUsers: SYSTEM_USERS,
        login,
        logout,
        equipment,
        movements,
        softwareList,
        softwareProfiles,
        documents,
        apps,
        isScannerOpen,
        setIsScannerOpen,
        selectedEquipmentForLabel,
        setSelectedEquipmentForLabel,
        selectedEquipmentForAction,
        setSelectedEquipmentForAction,
        actionModalType,
        setActionModalType,
        handleEquipmentScan,
        registerCheckOut,
        registerCheckIn,
        addEquipment,
        updateEquipment,
        addDocument,
        incrementDocDownload,
        addSoftware,
        exportBackupJson,
        resetDatabase
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
