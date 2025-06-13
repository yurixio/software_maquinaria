import { useState, useEffect } from 'react';
import { Machinery, Vehicle, Tool, SparePart, Warehouse, Alert, DashboardStats } from '../types';

// Mock data
const mockWarehouses: Warehouse[] = [
  {
    id: '1',
    name: 'Almacén Principal Lima',
    address: 'Av. Industrial 123',
    city: 'Lima',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Almacén Cañete',
    address: 'Carretera Panamericana Sur Km 144',
    city: 'Cañete',
    createdAt: new Date('2024-02-10')
  }
];

const mockMachinery: Machinery[] = [
  {
    id: '1',
    name: 'Excavadora CAT 320D',
    category: 'Excavadora',
    brand: 'Caterpillar',
    model: '320D',
    serialNumber: 'CAT320D001',
    year: 2020,
    hourmeter: 1250,
    condition: 'bueno',
    status: 'disponible',
    warehouseId: '1',
    images: ['https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg'],
    createdAt: new Date('2024-01-20'),
    lastMaintenance: new Date('2024-01-15'),
    nextMaintenance: new Date('2024-04-15'),
    maintenanceIntervalHours: 250,
    maintenanceIntervalDays: 90
  },
  {
    id: '2',
    name: 'Retroexcavadora JCB 3CX',
    category: 'Retroexcavadora',
    brand: 'JCB',
    model: '3CX',
    serialNumber: 'JCB3CX002',
    year: 2019,
    hourmeter: 2100,
    condition: 'bueno',
    status: 'alquilado',
    warehouseId: '1',
    images: ['https://images.pexels.com/photos/1117210/pexels-photo-1117210.jpeg'],
    createdAt: new Date('2024-01-25'),
    lastMaintenance: new Date('2024-02-01'),
    nextMaintenance: new Date('2024-05-01'),
    maintenanceIntervalHours: 300,
    maintenanceIntervalDays: 120
  },
  {
    id: '3',
    name: 'Volquete Volvo FMX',
    category: 'Volquete',
    brand: 'Volvo',
    model: 'FMX 450',
    serialNumber: 'VOLVOFMX003',
    year: 2021,
    hourmeter: 850,
    condition: 'excelente',
    status: 'mantenimiento',
    warehouseId: '2',
    images: ['https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg'],
    createdAt: new Date('2024-02-05'),
    lastMaintenance: new Date('2024-03-01'),
    nextMaintenance: new Date('2024-06-01'),
    maintenanceIntervalHours: 200,
    maintenanceIntervalDays: 60
  }
];

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    plate: 'ABC-123',
    brand: 'Toyota',
    model: 'Hilux',
    year: 2022,
    mileage: 35000,
    status: 'disponible',
    soatExpiration: new Date('2024-12-31'),
    technicalReviewExpiration: new Date('2024-08-15'),
    warehouseId: '1',
    documents: [],
    createdAt: new Date('2024-01-10')
  },
  {
    id: '2',
    plate: 'DEF-456',
    brand: 'Ford',
    model: 'Ranger',
    year: 2021,
    mileage: 42000,
    status: 'alquilado',
    soatExpiration: new Date('2024-11-30'),
    technicalReviewExpiration: new Date('2024-07-20'),
    warehouseId: '2',
    documents: [],
    createdAt: new Date('2024-01-15')
  }
];

const mockTools: Tool[] = [
  {
    id: '1',
    name: 'Taladro Percutor Bosch',
    internalCode: 'TAL-001',
    status: 'disponible',
    observations: 'En excelente estado, incluye maletín',
    warehouseId: '1',
    createdAt: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'Soldadora Inverter 200A',
    internalCode: 'SOL-001',
    status: 'disponible',
    observations: 'Requiere mantenimiento menor',
    warehouseId: '1',
    createdAt: new Date('2024-01-25')
  },
  {
    id: '3',
    name: 'Compresor de Aire 50L',
    internalCode: 'COM-001',
    status: 'no_disponible',
    observations: 'En reparación - válvula dañada',
    warehouseId: '2',
    createdAt: new Date('2024-02-01')
  },
  {
    id: '4',
    name: 'Martillo Neumático',
    internalCode: 'MAR-001',
    status: 'disponible',
    observations: '',
    warehouseId: '2',
    createdAt: new Date('2024-02-05')
  }
];

const mockSpareParts: SparePart[] = [
  {
    id: '1',
    code: 'FLT-HID-001',
    name: 'Filtro de Aceite Hidráulico',
    brand: 'Caterpillar',
    unitPrice: 85.50,
    minStock: 5,
    stockByWarehouse: {
      '1': 8,
      '2': 3
    },
    compatibleMachinery: ['1', '2'],
    suppliers: ['Ferreyros', 'Komatsu Mitsui'],
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    code: 'FLT-AIR-002',
    name: 'Filtro de Aire Motor',
    brand: 'JCB',
    unitPrice: 45.00,
    minStock: 10,
    stockByWarehouse: {
      '1': 15,
      '2': 2
    },
    compatibleMachinery: ['2'],
    suppliers: ['JCB Perú'],
    createdAt: new Date('2024-01-20')
  },
  {
    id: '3',
    code: 'ACE-MOT-003',
    name: 'Aceite Motor 15W-40',
    brand: 'Shell',
    unitPrice: 25.00,
    minStock: 20,
    stockByWarehouse: {
      '1': 12,
      '2': 5
    },
    compatibleMachinery: ['1', '2', '3'],
    suppliers: ['Shell Perú', 'Mobil'],
    createdAt: new Date('2024-01-25')
  }
];

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'maintenance',
    title: 'Mantenimiento Próximo',
    description: 'Excavadora CAT 320D requiere mantenimiento en 48 horas',
    severity: 'high',
    relatedEntity: 'machinery',
    relatedEntityId: '1',
    createdAt: new Date(),
    resolved: false
  },
  {
    id: '2',
    type: 'document',
    title: 'SOAT por Vencer',
    description: 'SOAT del vehículo DEF-456 vence en 25 días',
    severity: 'medium',
    relatedEntity: 'vehicle',
    relatedEntityId: '2',
    createdAt: new Date(),
    resolved: false
  },
  {
    id: '3',
    type: 'stock',
    title: 'Stock Bajo',
    description: 'Filtro de aceite hidráulico por debajo del stock mínimo en Almacén Cañete',
    severity: 'critical',
    relatedEntity: 'sparepart',
    relatedEntityId: '1',
    createdAt: new Date(),
    resolved: false
  },
  {
    id: '4',
    type: 'stock',
    title: 'Stock Crítico',
    description: 'Aceite Motor 15W-40 con stock muy bajo en ambos almacenes',
    severity: 'critical',
    relatedEntity: 'sparepart',
    relatedEntityId: '3',
    createdAt: new Date(),
    resolved: false
  }
];

export const useData = () => {
  const [warehouses] = useState<Warehouse[]>(mockWarehouses);
  const [machinery] = useState<Machinery[]>(mockMachinery);
  const [vehicles] = useState<Vehicle[]>(mockVehicles);
  const [tools] = useState<Tool[]>(mockTools);
  const [spareParts] = useState<SparePart[]>(mockSpareParts);
  const [alerts] = useState<Alert[]>(mockAlerts);
  
  const [dashboardStats] = useState<DashboardStats>({
    totalMachinery: 3,
    availableMachinery: 1,
    totalVehicles: 2,
    availableVehicles: 1,
    totalTools: 4,
    availableTools: 3,
    criticalAlerts: 3,
    monthlyRevenue: 125000,
    monthlyExpenses: 45000
  });

  return {
    warehouses,
    machinery,
    vehicles,
    tools,
    spareParts,
    alerts,
    dashboardStats
  };
};