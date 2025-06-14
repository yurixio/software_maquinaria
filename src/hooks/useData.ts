import { useMemo } from 'react';
import { DashboardStats } from '../types';
import { useDataStore } from './useDataStore';

export const useData = () => {
  const {
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
    users
  } = useDataStore();

  // Memoize dashboard stats calculation
  const dashboardStats = useMemo<DashboardStats>(() => {
    const availableMachinery = machinery.filter(m => m.status === 'disponible').length;
    const availableVehicles = vehicles.filter(v => v.status === 'disponible').length;
    const availableTools = tools.filter(t => t.status === 'disponible').length;
    const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.resolved).length;
    
    // Calculate monthly revenue and expenses
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyRevenue = financialRecords
      .filter(r => r.type === 'ingreso' && 
                   r.date.getMonth() === currentMonth && 
                   r.date.getFullYear() === currentYear)
      .reduce((sum, r) => sum + r.amount, 0);
      
    const monthlyExpenses = financialRecords
      .filter(r => r.type === 'egreso' && 
                   r.date.getMonth() === currentMonth && 
                   r.date.getFullYear() === currentYear)
      .reduce((sum, r) => sum + r.amount, 0);
    
    const profitMargin = monthlyRevenue > 0 ? ((monthlyRevenue - monthlyExpenses) / monthlyRevenue) * 100 : 0;
    
    // Calculate utilization rate
    const totalAssets = machinery.length + vehicles.length;
    const inUseAssets = machinery.filter(m => m.status === 'alquilado').length + 
                       vehicles.filter(v => v.status === 'alquilado').length;
    const utilizationRate = totalAssets > 0 ? (inUseAssets / totalAssets) * 100 : 0;
    
    return {
      totalMachinery: machinery.length,
      availableMachinery,
      totalVehicles: vehicles.length,
      availableVehicles,
      totalTools: tools.length,
      availableTools,
      totalRentals: rentals.length,
      activeRentals: rentals.filter(r => r.status === 'activo').length,
      criticalAlerts,
      pendingMaintenances: maintenanceRecords.filter(m => m.status === 'programado').length,
      monthlyRevenue,
      monthlyExpenses,
      profitMargin,
      utilizationRate
    };
  }, [machinery, vehicles, tools, alerts, rentals, maintenanceRecords, financialRecords]);

  // Memoize warehouse lookup
  const warehouseMap = useMemo(() => {
    return warehouses.reduce((map, warehouse) => {
      map[warehouse.id] = warehouse;
      return map;
    }, {} as Record<string, typeof warehouses[0]>);
  }, [warehouses]);

  return {
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
    dashboardStats,
    warehouseMap
  };
};