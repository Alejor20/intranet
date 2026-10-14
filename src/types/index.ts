export type EquipmentType = 'laptop' | 'desktop' | 'workstation' | 'monitor' | 'accessory';

export type EquipmentStatus = 'available' | 'rented' | 'maintenance' | 'retired';

export interface EquipmentSpecs {
  cpu: string;
  ram: string;
  storage: string;
  gpu?: string;
  os: string;
  screenSize?: string;
}

export interface ClientAssignment {
  clientId: string;
  clientName: string;
  clientDocOrRUT: string;
  contactEmail?: string;
  contactPhone?: string;
  rentalStartDate: string;
  contractNumber: string;
  destinationCity: string;         // Ciudad de destino en Colombia
  deliveryTechnician: string;      // Técnico que lo entrega físicamente
  reviewerUser: string;            // Usuario que revisa la salida (usuario logueado)
  technicianSignature?: string;    // Firma digital / manuscrita del técnico que entrega
}

export interface Equipment {
  id: string;
  code: string; // e.g., "NEC-2026-001" (Placa de activo fijo)
  serialNumber: string;
  brand: string;
  model: string;
  type: EquipmentType;
  specs: EquipmentSpecs;
  status: EquipmentStatus;
  conditionNotes: string;
  installedSoftwarePack?: string;
  currentAssignment?: ClientAssignment;
  qrCodeDataUrl?: string;
  lastMaintenanceDate?: string;
  createdAt: string;
}

export interface MovementChecklist {
  chargerIncluded: boolean;
  mouseKeyboardIncluded: boolean;
  screenIntact: boolean;
  softwareVerified: boolean;
  cleanAndDisinfected: boolean;
  cablesIncluded: boolean;
}

export interface MovementLog {
  id: string;
  equipmentId: string;
  equipmentCode: string;           // Placa de activo fijo
  equipmentSerial?: string;        // Número de serie del fabricante
  equipmentModel: string;
  equipmentSpecs?: EquipmentSpecs; // Especificaciones completas (RAM, Disco, CPU, GPU, OS)
  type: 'checkout' | 'checkin';    // checkout = salida a arriendo, checkin = entrada / retorno
  timestamp: string;
  
  // Handover responsible parties
  reviewerUser: string;            // Usuario que revisa (el logueado en el momento)
  deliveryTechnician?: string;     // Técnico que lo entrega
  receivingTechnician?: string;    // Técnico que lo recibe (para check-in)
  technicianSignature?: string;    // Firma manuscrita registrada por el técnico

  // Client and location
  clientId: string;
  clientName: string;
  contractNumber?: string;
  destinationCity: string;         // Ciudad de destino / procedencia en Colombia

  conditionAtMovement: 'Excelente' | 'Bueno' | 'Regular con observaciones' | 'Dañado para taller';
  checklist: MovementChecklist;
  observations?: string;
}

export interface SoftwarePackage {
  id: string;
  name: string;
  category: 'Ofimática' | 'Desarrollo' | 'Diseño' | 'Seguridad' | 'Utilidades' | 'Drivers';
  version: string;
  sizeMb: number;
  developer: string;
  description: string;
  fileName: string;
  silentInstallCmd: string;
  recommendedFor: ('Administrativo' | 'Desarrollo' | 'Diseño' | 'Call Center')[];
  isMandatory: boolean;
  releaseDate: string;
  checksum: string;
  downloadUrl?: string;
}

export interface SoftwareProfile {
  id: string;
  name: string;
  slug: string;
  description: string;
  roleBadge: string;
  includedSoftwareIds: string[];
}

export interface CompanyDocument {
  id: string;
  title: string;
  department: 'TI & Sistemas' | 'Recursos Humanos' | 'Operaciones' | 'Legal' | 'Finanzas';
  category: 'Manual' | 'Formato' | 'Política' | 'Plantilla' | 'Acta de Entrega';
  version: string;
  updatedAt: string;
  sizeKb: number;
  author: string;
  fileType: 'pdf' | 'docx' | 'xlsx' | 'zip';
  description: string;
  downloadCount: number;
  contentPreview?: string;
}

export interface InternalApp {
  id: string;
  name: string;
  description: string;
  category: 'Gestión' | 'Soporte' | 'Comunicación' | 'Finanzas' | 'Herramientas TI';
  url: string;
  iconName: string;
  status: 'operativo' | 'mantenimiento' | 'degradado';
  accessLevel: 'Todos' | 'Solo TI' | 'Liderazgo';
  directLaunch?: boolean;
}

export interface LoggedUserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  jobTitle: string;
  department: string;
}
