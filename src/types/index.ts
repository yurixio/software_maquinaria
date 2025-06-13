export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  permissions?: Permission[];
  lastLogin?: Date;
  createdAt: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

export type UserRole = 'admin' | 'warehouse' | 'mechanic' | 'accountant' | 'viewer';

export interface Permission {
  module: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
  warehouseRestrictions?: string[];
}

export interface SystemConfig {
  id: string;
  companyName: string;
  companyLogo?: string;
  currency: string;
  taxRate: number;
  defaultWarehouseId: string;
  alertSettings: AlertSettings;
  maintenanceSettings: MaintenanceSettings;
  backupSettings: BackupSettings;
  holidays: Date[];
  exchangeRate?: number;
  language: 'es' | 'en';
  theme: 'light' | 'dark';
  updatedAt: Date;
  updatedBy: string;
}

export interface AlertSettings {
  documentExpirationDays: number;
  stockMinimumThreshold: number;
  maintenanceDueDays: number;
  fuelLowThreshold: number;
}

export interface MaintenanceSettings {
  defaultIntervalHours: number;
  defaultIntervalDays: number;
  reminderDays: number;
}

export interface BackupSettings {
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  retentionDays: number;
}

export interface Warehouse {
  id: string;
  name: string;
  address: string;
  city: string;
  phone?: string;
  manager?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  notes?: string;
  attachments?: Attachment[];
}

export interface Machinery {
  id: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  serialNumber: string;
  year: number;
  hourmeter: number;
  condition: 'excelente' | 'bueno' | 'regular' | 'malo';
  status: 'disponible' | 'alquilado' | 'mantenimiento' | 'fuera_servicio';
  warehouseId: string;
  warehouse?: Warehouse;
  images: string[];
  purchasePrice?: number;
  currentValue?: number;
  insuranceExpiration?: Date;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  maintenanceIntervalHours?: number;
  maintenanceIntervalDays?: number;
  notes?: string;
  attachments?: Attachment[];
  specifications?: Record<string, string>;
  fuelType?: string;
  fuelCapacity?: number;
}

export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  status: 'disponible' | 'alquilado' | 'mantenimiento' | 'fuera_servicio';
  soatExpiration: Date;
  technicalReviewExpiration: Date;
  driverLicenseRequired: string;
  warehouseId: string;
  warehouse?: Warehouse;
  documents: VehicleDocument[];
  purchasePrice?: number;
  currentValue?: number;
  insuranceExpiration?: Date;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  notes?: string;
  attachments?: Attachment[];
  fuelType?: string;
  fuelCapacity?: number;
}

export interface VehicleDocument {
  id: string;
  type: 'soat' | 'revision_tecnica' | 'tarjeta_propiedad' | 'licencia_conducir' | 'seguro' | 'otros';
  name: string;
  url: string;
  expirationDate?: Date;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface Tool {
  id: string;
  name: string;
  internalCode: string;
  category?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  status: 'disponible' | 'no_disponible' | 'mantenimiento' | 'perdido';
  condition: 'excelente' | 'bueno' | 'regular' | 'malo';
  purchasePrice?: number;
  purchaseDate?: Date;
  warrantyExpiration?: Date;
  observations: string;
  warehouseId: string;
  warehouse?: Warehouse;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  notes?: string;
  attachments?: Attachment[];
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
}

export interface SparePart {
  id: string;
  code: string;
  name: string;
  category?: string;
  brand: string;
  model?: string;
  description?: string;
  unitPrice: number;
  stockByWarehouse: Record<string, number>;
  minStock: number;
  maxStock?: number;
  reorderPoint?: number;
  compatibleMachinery: string[];
  compatibleVehicles?: string[];
  suppliers: string[];
  location?: string;
  weight?: number;
  dimensions?: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  notes?: string;
  attachments?: Attachment[];
  lastPurchaseDate?: Date;
  lastPurchasePrice?: number;
}

export interface FuelRecord {
  id: string;
  entityType: 'machinery' | 'vehicle';
  entityId: string;
  entityName: string;
  date: Date;
  liters: number;
  unitCost: number;
  totalCost: number;
  fuelType: 'diesel' | 'gasolina' | 'gas';
  location: string;
  supplier?: string;
  invoiceNumber?: string;
  odometer?: number;
  hourmeter?: number;
  operatorName?: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  notes?: string;
  attachments?: Attachment[];
}

export interface MaintenanceRecord {
  id: string;
  entityType: 'machinery' | 'vehicle' | 'tool';
  entityId: string;
  entityName: string;
  type: 'preventivo' | 'correctivo' | 'emergencia';
  priority: 'baja' | 'media' | 'alta' | 'critica';
  status: 'programado' | 'en_progreso' | 'completado' | 'cancelado';
  scheduledDate: Date;
  completedDate?: Date;
  description: string;
  technicianName: string;
  technicianId?: string;
  laborHours: number;
  laborCost: number;
  spareParts: MaintenanceSparePart[];
  totalCost: number;
  nextMaintenanceDate?: Date;
  nextMaintenanceHours?: number;
  warehouseId: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  notes?: string;
  attachments?: Attachment[];
  beforePhotos?: string[];
  afterPhotos?: string[];
}

export interface MaintenanceSparePart {
  sparePartId: string;
  sparePartName: string;
  sparePartCode: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  warehouseId: string;
}

export interface Rental {
  id: string;
  clientName: string;
  clientContact: string;
  clientEmail?: string;
  clientAddress?: string;
  clientDocument?: string;
  machineryId?: string;
  vehicleId?: string;
  entityName: string;
  startDate: Date;
  endDate: Date;
  actualEndDate?: Date;
  dailyRate: number;
  totalAmount: number;
  deposit?: number;
  status: 'cotizado' | 'confirmado' | 'activo' | 'completado' | 'cancelado';
  paymentStatus: 'pendiente' | 'parcial' | 'pagado' | 'vencido';
  description: string;
  terms?: string;
  deliveryAddress?: string;
  operatorIncluded: boolean;
  operatorName?: string;
  operatorCost?: number;
  fuelIncluded: boolean;
  transportCost?: number;
  checkInPhotos: string[];
  checkOutPhotos: string[];
  checkInHourmeter?: number;
  checkOutHourmeter?: number;
  checkInOdometer?: number;
  checkOutOdometer?: number;
  damageReport?: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  notes?: string;
  attachments?: Attachment[];
}

export interface Alert {
  id: string;
  type: 'maintenance' | 'document' | 'stock' | 'fuel' | 'rental' | 'payment' | 'system';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category?: string;
  relatedEntity: string;
  relatedEntityId: string;
  actionRequired?: string;
  dueDate?: Date;
  assignedTo?: string;
  createdAt: Date;
  createdBy: string;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolutionNotes?: string;
  autoGenerated: boolean;
}

export interface DashboardStats {
  totalMachinery: number;
  availableMachinery: number;
  totalVehicles: number;
  availableVehicles: number;
  totalTools: number;
  availableTools: number;
  totalRentals: number;
  activeRentals: number;
  criticalAlerts: number;
  pendingMaintenances: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  profitMargin: number;
  utilizationRate: number;
}

export interface FinancialRecord {
  id: string;
  type: 'ingreso' | 'egreso';
  category: string;
  subcategory?: string;
  description: string;
  amount: number;
  currency: string;
  exchangeRate?: number;
  date: Date;
  dueDate?: Date;
  paymentMethod?: string;
  referenceNumber?: string;
  relatedEntity?: string;
  relatedEntityId?: string;
  warehouseId?: string;
  isRecurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurringEndDate?: Date;
  status: 'pendiente' | 'pagado' | 'vencido' | 'cancelado';
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  notes?: string;
  attachments?: Attachment[];
  approvedBy?: string;
  approvedAt?: Date;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  type: 'fijo' | 'variable' | 'inesperado';
  subcategories: string[];
  budgetLimit?: number;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
}

export interface MonthlyReport {
  month: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  incomeByCategory: Record<string, number>;
  expensesByCategory: Record<string, number>;
  machineryProfitability: Array<{
    machineryId: string;
    machineryName: string;
    income: number;
    expenses: number;
    profit: number;
    utilizationRate: number;
  }>;
  kpis: {
    revenueGrowth: number;
    expenseGrowth: number;
    profitGrowth: number;
    utilizationRate: number;
    maintenanceCostRatio: number;
  };
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
  description?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  entityType?: string;
  entityId?: string;
  entityName?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
  readAt?: Date;
}

export interface ExportRequest {
  id: string;
  type: 'excel' | 'pdf' | 'csv';
  module: string;
  filters?: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  requestedBy: string;
  requestedAt: Date;
  completedAt?: Date;
  expiresAt?: Date;
}

export interface BackupRecord {
  id: string;
  type: 'manual' | 'automatic';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  size?: number;
  downloadUrl?: string;
  createdBy: string;
  createdAt: Date;
  completedAt?: Date;
  expiresAt?: Date;
  error?: string;
}

export interface SearchResult {
  id: string;
  type: 'machinery' | 'vehicle' | 'tool' | 'sparepart' | 'rental' | 'maintenance';
  title: string;
  subtitle?: string;
  description?: string;
  url: string;
  relevance: number;
  highlightedText?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface FormState<T> {
  data: T;
  errors: Record<string, string>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  status?: string;
  category?: string;
  warehouseId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  [key: string]: any;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: ValidationError[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}