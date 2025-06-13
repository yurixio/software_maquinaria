import React from 'react';
import { Truck, Car, Wrench, AlertTriangle, DollarSign, TrendingUp, Package, Calendar } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { AlertsPanel } from './AlertsPanel';
import { useData } from '../../hooks/useData';

export const Dashboard: React.FC = () => {
  const { dashboardStats, alerts, machinery, vehicles } = useData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Resumen general del sistema de gestión</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Maquinaria Total"
          value={dashboardStats.totalMachinery}
          change={{ value: 8, type: 'increase' }}
          icon={Truck}
          color="blue"
        />
        <StatsCard
          title="Vehículos Disponibles"
          value={`${dashboardStats.availableVehicles}/${dashboardStats.totalVehicles}`}
          icon={Car}
          color="green"
        />
        <StatsCard
          title="Alertas Críticas"
          value={dashboardStats.criticalAlerts}
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="Ingresos del Mes"
          value={`S/ ${dashboardStats.monthlyRevenue.toLocaleString()}`}
          change={{ value: 12, type: 'increase' }}
          icon={DollarSign}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Maquinaria por Estado</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Disponible</span>
                </div>
                <span className="text-sm text-gray-600">
                  {machinery.filter(m => m.status === 'disponible').length} unidades
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Alquilado</span>
                </div>
                <span className="text-sm text-gray-600">
                  {machinery.filter(m => m.status === 'alquilado').length} unidades
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Mantenimiento</span>
                </div>
                <span className="text-sm text-gray-600">
                  {machinery.filter(m => m.status === 'mantenimiento').length} unidades
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Panel */}
        <div>
          <AlertsPanel alerts={alerts} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
            <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Nuevo Alquiler</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
            <Wrench className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Registrar Mantenimiento</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Ver Reportes</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
            <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Programar Servicio</span>
          </button>
        </div>
      </div>
    </div>
  );
};