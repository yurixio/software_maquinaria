import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { 
  Machinery, 
  Vehicle, 
  Tool, 
  SparePart, 
  Warehouse, 
  Alert, 
  Rental,
  FuelRecord,
  MaintenanceRecord,
  FinancialRecord,
  User
} from '../types';

// Datos iniciales mínimos
const initialWarehouses: Warehouse[] = [
  {
    id: '1',
    name: 'Almacén Principal Lima',
    address: 'Av. Industrial 123',
    city: 'Lima',
    createdAt: new Date('2024-01-15'),
    createdBy: 'admin'
  }
];

export const useDataStore = () => {
  const [warehouses, setWarehouses, removeWarehouses] = useLocalStorage<Warehouse[]>('warehouses', initialWarehouses);
  const [machinery, setMachinery, removeMachinery] = useLocalStorage<Machinery[]>('machinery', []);
  const [vehicles, setVehicles, removeVehicles] = useLocalStorage<Vehicle[]>('vehicles', []);
  const [tools, setTools, removeTools] = useLocalStorage<Tool[]>('tools', []);
  const [spareParts, setSpareParts, removeSpareParts] = useLocalStorage<SparePart[]>('spareParts', []);
  const [alerts, setAlerts, removeAlerts] = useLocalStorage<Alert[]>('alerts', []);
  const [rentals, setRentals, removeRentals] = useLocalStorage<Rental[]>('rentals', []);
  const [fuelRecords, setFuelRecords, removeFuelRecords] = useLocalStorage<FuelRecord[]>('fuelRecords', []);
  const [maintenanceRecords, setMaintenanceRecords, removeMaintenanceRecords] = useLocalStorage<MaintenanceRecord[]>('maintenanceRecords', []);
  const [financialRecords, setFinancialRecords, removeFinancialRecords] = useLocalStorage<FinancialRecord[]>('financialRecords', []);
  const [users, setUsers, removeUsers] = useLocalStorage<User[]>('users', []);

  // Funciones para generar IDs únicos
  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  // WAREHOUSES
  const addWarehouse = useCallback((warehouseData: Omit<Warehouse, 'id' | 'createdAt' | 'createdBy'>) => {
    const newWarehouse: Warehouse = {
      ...warehouseData,
      id: generateId(),
      createdAt: new Date(),
      createdBy: 'current-user'
    };
    setWarehouses(prev => [...prev, newWarehouse]);
    return newWarehouse;
  }, [setWarehouses]);

  const updateWarehouse = useCallback((id: string, warehouseData: Partial<Warehouse>) => {
    setWarehouses(prev => prev.map(warehouse => 
      warehouse.id === id 
        ? { ...warehouse, ...warehouseData, updatedAt: new Date(), updatedBy: 'current-user' }
        : warehouse
    ));
  }, [setWarehouses]);

  const deleteWarehouse = useCallback((id: string) => {
    setWarehouses(prev => prev.filter(warehouse => warehouse.id !== id));
  }, [setWarehouses]);

  // MACHINERY
  const addMachinery = useCallback((machineryData: Omit<Machinery, 'id' | 'createdAt' | 'createdBy'>) => {
    const newMachinery: Machinery = {
      ...machineryData,
      id: generateId(),
      createdAt: new Date(),
      createdBy: 'current-user'
    };
    setMachinery(prev => [...prev, newMachinery]);
    return newMachinery;
  }, [setMachinery]);

  const updateMachinery = useCallback((id: string, machineryData: Partial<Machinery>) => {
    setMachinery(prev => prev.map(machine => 
      machine.id === id 
        ? { ...machine, ...machineryData, updatedAt: new Date(), updatedBy: 'current-user' }
        : machine
    ));
  }, [setMachinery]);

  const deleteMachinery = useCallback((id: string) => {
    setMachinery(prev => prev.filter(machine => machine.id !== id));
  }, [setMachinery]);

  // VEHICLES
  const addVehicle = useCallback((vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'createdBy'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: generateId(),
      createdAt: new Date(),
      createdBy: 'current-user'
    };
    setVehicles(prev => [...prev, newVehicle]);
    return newVehicle;
  }, [setVehicles]);

  const updateVehicle = useCallback((id: string, vehicleData: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(vehicle => 
      vehicle.id === id 
        ? { ...vehicle, ...vehicleData, updatedAt: new Date(), updatedBy: 'current-user' }
        : vehicle
    ));
  }, [setVehicles]);

  const deleteVehicle = useCallback((id: string) => {
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
  }, [setVehicles]);

  // TOOLS
  const addTool = useCallback((toolData: Omit<Tool, 'id' | 'createdAt' | 'createdBy'>) => {
    const newTool: Tool = {
      ...toolData,
      id: generateId(),
      createdAt: new Date(),
      createdBy: 'current-user'
    };
    setTools(prev => [...prev, newTool]);
    return newTool;
  }, [setTools]);

  const updateTool = useCallback((id: string, toolData: Partial<Tool>) => {
    setTools(prev => prev.map(tool => 
      tool.id === id 
        ? { ...tool, ...toolData, updatedAt: new Date(), updatedBy: 'current-user' }
        : tool
    ));
  }, [setTools]);

  const deleteTool = useCallback((id: string) => {
    setTools(prev => prev.filter(tool => tool.id !== id));
  }, [setTools]);

  // SPARE PARTS
  const addSparePart = useCallback((sparePartData: Omit<SparePart, 'id' | 'createdAt' | 'createdBy'>) => {
    const newSparePart: SparePart = {
      ...sparePartData,
      id: generateId(),
      createdAt: new Date(),
      createdBy: 'current-user'
    };
    setSpareParts(prev => [...prev, newSparePart]);
    return newSparePart;
  }, [setSpareParts]);

  const updateSparePart = useCallback((id: string, sparePartData: Partial<SparePart>) => {
    setSpareParts(prev => prev.map(part => 
      part.id === id 
        ? { ...part, ...sparePartData, updatedAt: new Date(), updatedBy: 'current-user' }
        : part
    ));
  }, [setSpareParts]);

  const deleteSparePart = useCallback((id: string) => {
    setSpareParts(prev => prev.filter(part => part.id !== id));
  }, [setSpareParts]);

  // RENTALS
  const addRental = useCallback((rentalData: Omit<Rental, 'id' | 'createdAt' | 'createdBy'>) => {
    const newRental: Rental = {
      ...rentalData,
      id: generateId(),
      createdAt: new Date(),
      createdBy: 'current-user'
    };
    setRentals(prev => [...prev, newRental]);
    return newRental;
  }, [setRentals]);

  const updateRental = useCallback((id: string, rentalData: Partial<Rental>) => {
    setRentals(prev => prev.map(rental => 
      rental.id === id 
        ? { ...rental, ...rentalData, updatedAt: new Date(), updatedBy: 'current-user' }
        : rental
    ));
  }, [setRentals]);

  const deleteRental = useCallback((id: string) => {
    setRentals(prev => prev.filter(rental => rental.id !== id));
  }, [setRentals]);

  // FUEL RECORDS
  const addFuelRecord = useCallback((fuelData: Omit<FuelRecord, 'id' | 'createdAt' | 'createdBy'>) => {
    const newFuelRecord: FuelRecord = {
      ...fuelData,
      id: generateId(),
      createdAt: new Date(),
      createdBy: 'current-user'
    };
    setFuelRecords(prev => [...prev, newFuelRecord]);
    return newFuelRecord;
  }, [setFuelRecords]);

  const updateFuelRecord = useCallback((id: string, fuelData: Partial<FuelRecord>) => {
    setFuelRecords(prev => prev.map(record => 
      record.id === id 
        ? { ...record, ...fuelData, updatedAt: new Date(), updatedBy: 'current-user' }
        : record
    ));
  }, [setFuelRecords]);

  const deleteFuelRecord = useCallback((id: string) => {
    setFuelRecords(prev => prev.filter(record => record.id !== id));
  }, [setFuelRecords]);

  // MAINTENANCE RECORDS
  const addMaintenanceRecord = useCallback((maintenanceData: Omit<MaintenanceRecord, 'id' | 'createdAt' | 'createdBy'>) => {
    const newMaintenanceRecord: MaintenanceRecord = {
      ...maintenanceData,
      id: generateId(),
      createdAt: new Date(),
      createdBy: 'current-user'
    };
    setMaintenanceRecords(prev => [...prev, newMaintenanceRecord]);
    return newMaintenanceRecord;
  }, [setMaintenanceRecords]);

  const updateMaintenanceRecord = useCallback((id: string, maintenanceData: Partial<MaintenanceRecord>) => {
    setMaintenanceRecords(prev => prev.map(record => 
      record.id === id 
        ? { ...record, ...maintenanceData, updatedAt: new Date(), updatedBy: 'current-user' }
        : record
    ));
  }, [setMaintenanceRecords]);

  const deleteMaintenanceRecord = useCallback((id: string) => {
    setMaintenanceRecords(prev => prev.filter(record => record.id !== id));
  }, [setMaintenanceRecords]);

  // FINANCIAL RECORDS
  const addFinancialRecord = useCallback((financialData: Omit<FinancialRecord, 'id' | 'createdAt' | 'createdBy'>) => {
    const newFinancialRecord: FinancialRecord = {
      ...financialData,
      id: generateId(),
      currency: 'PEN',
      status: 'pagado',
      createdAt: new Date(),
      createdBy: 'current-user'
    };
    setFinancialRecords(prev => [...prev, newFinancialRecord]);
    return newFinancialRecord;
  }, [setFinancialRecords]);

  const updateFinancialRecord = useCallback((id: string, financialData: Partial<FinancialRecord>) => {
    setFinancialRecords(prev => prev.map(record => 
      record.id === id 
        ? { ...record, ...financialData, updatedAt: new Date(), updatedBy: 'current-user' }
        : record
    ));
  }, [setFinancialRecords]);

  const deleteFinancialRecord = useCallback((id: string) => {
    setFinancialRecords(prev => prev.filter(record => record.id !== id));
  }, [setFinancialRecords]);

  // ALERTS
  const addAlert = useCallback((alertData: Omit<Alert, 'id' | 'createdAt' | 'createdBy'>) => {
    const newAlert: Alert = {
      ...alertData,
      id: generateId(),
      createdAt: new Date(),
      createdBy: 'system',
      resolved: false,
      autoGenerated: false
    };
    setAlerts(prev => [...prev, newAlert]);
    return newAlert;
  }, [setAlerts]);

  const updateAlert = useCallback((id: string, alertData: Partial<Alert>) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id 
        ? { ...alert, ...alertData }
        : alert
    ));
  }, [setAlerts]);

  const resolveAlert = useCallback((id: string, resolutionNotes?: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id 
        ? { 
            ...alert, 
            resolved: true, 
            resolvedAt: new Date(), 
            resolvedBy: 'current-user',
            resolutionNotes 
          }
        : alert
    ));
  }, [setAlerts]);

  // USERS
  const addUser = useCallback((userData: Omit<User, 'id' | 'createdAt' | 'createdBy'>) => {
    const newUser: User = {
      ...userData,
      id: generateId(),
      createdAt: new Date(),
      createdBy: 'current-user'
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  }, [setUsers]);

  const updateUser = useCallback((id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id 
        ? { ...user, ...userData, updatedAt: new Date(), updatedBy: 'current-user' }
        : user
    ));
  }, [setUsers]);

  const deleteUser = useCallback((id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  }, [setUsers]);

  // CLEAR ALL DATA
  const clearAllData = useCallback(() => {
    removeWarehouses();
    removeMachinery();
    removeVehicles();
    removeTools();
    removeSpareParts();
    removeAlerts();
    removeRentals();
    removeFuelRecords();
    removeMaintenanceRecords();
    removeFinancialRecords();
    removeUsers();
  }, [
    removeWarehouses, removeMachinery, removeVehicles, removeTools, 
    removeSpareParts, removeAlerts, removeRentals, removeFuelRecords,
    removeMaintenanceRecords, removeFinancialRecords, removeUsers
  ]);

  return {
    // Data
    warehouses,
    machinery,
    vehicles,
    tools,
    spareParts,
    alerts,
    rentals,
    fuelRecords,
    maintenanceRecords,
    financialRecords,
    users,
    
    // Warehouse operations
    addWarehouse,
    updateWarehouse,
    deleteWarehouse,
    
    // Machinery operations
    addMachinery,
    updateMachinery,
    deleteMachinery,
    
    // Vehicle operations
    addVehicle,
    updateVehicle,
    deleteVehicle,
    
    // Tool operations
    addTool,
    updateTool,
    deleteTool,
    
    // Spare part operations
    addSparePart,
    updateSparePart,
    deleteSparePart,
    
    // Rental operations
    addRental,
    updateRental,
    deleteRental,
    
    // Fuel record operations
    addFuelRecord,
    updateFuelRecord,
    deleteFuelRecord,
    
    // Maintenance record operations
    addMaintenanceRecord,
    updateMaintenanceRecord,
    deleteMaintenanceRecord,
    
    // Financial record operations
    addFinancialRecord,
    updateFinancialRecord,
    deleteFinancialRecord,
    
    // Alert operations
    addAlert,
    updateAlert,
    resolveAlert,
    
    // User operations
    addUser,
    updateUser,
    deleteUser,
    
    // Utility
    clearAllData
  };
};