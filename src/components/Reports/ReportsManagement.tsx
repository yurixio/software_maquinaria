import React, { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, DollarSign, Truck, Package, BarChart3 } from 'lucide-react';
import { useData } from '../../hooks/useData';

export const ReportsManagement: React.FC = () => {
  const { machinery, vehicles, spareParts, dashboardStats } = useData();
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const reportTypes = [
    {
      id: 'inventory',
      name: 'Inventario General',
      description: 'Estado actual de maquinaria, vehículos y repuestos',
      icon: Package,
      color: 'blue'
    },
    {
      id: 'financial',
      name: 'Reporte Financiero',
      description: 'Ingresos, gastos y rentabilidad por período',
      icon: DollarSign,
      color: 'green'
    },
    {
      id: 'machinery',
      name: 'Maquinaria por Máquina',
      description: 'Rentabilidad y utilización individual',
      icon: Truck,
      color: 'purple'
    },
    {
      id: 'maintenance',
      name: 'Mantenimiento',
      description: 'Historial y programación de mantenimientos',
      icon: Calendar,
      color: 'orange'
    },
    {
      id: 'fuel',
      name: 'Consumo de Combustible',
      description: 'Análisis de consumo y costos de combustible',
      icon: TrendingUp,
      color: 'red'
    },
    {
      id: 'alerts',
      name: 'Alertas y Notificaciones',
      description: 'Resumen de alertas críticas y pendientes',
      icon: FileText,
      color: 'yellow'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  };

  const handleGenerateReport = (reportId: string) => {
    console.log('Generating report:', reportId, 'for period:', dateRange);
    // In real app, generate and download report
    alert(`Generando reporte: ${reportTypes.find(r => r.id === reportId)?.name}`);
  };

  const quickStats = {
    totalAssets: machinery.length + vehicles.length,
    availableAssets: machinery.filter(m => m.status === 'disponible').length + 
                    vehicles.filter(v => v.status === 'disponible').length,
    monthlyRevenue: dashboardStats.monthlyRevenue,
    monthlyExpenses: dashboardStats.monthlyExpenses,
    netProfit: dashboardStats.monthlyRevenue - dashboardStats.monthlyExpenses
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes y Análisis</h1>
          <p className="text-gray-600 mt-1">Genera reportes detallados para análisis y toma de decisiones</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Activos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{quickStats.totalAssets}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Disponibles</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{quickStats.availableAssets}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Mes</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                S/ {quickStats.monthlyRevenue.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gastos Mes</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                S/ {quickStats.monthlyExpenses.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ganancia Neta</p>
              <p className={`text-2xl font-bold mt-1 ${
                quickStats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                S/ {quickStats.netProfit.toLocaleString()}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              quickStats.netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <BarChart3 className={`w-6 h-6 ${
                quickStats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Período de Análisis</h3>
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Aplicar Período</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          
          return (
            <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[report.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{report.description}</p>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleGenerateReport(report.id)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => handleGenerateReport(report.id)}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Excel</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reportes Recientes</h3>
        <div className="space-y-3">
          {[
            { name: 'Reporte Financiero - Marzo 2024', date: '2024-03-31', type: 'PDF', size: '2.4 MB' },
            { name: 'Inventario General - Marzo 2024', date: '2024-03-30', type: 'Excel', size: '1.8 MB' },
            { name: 'Consumo Combustible - Febrero 2024', date: '2024-02-29', type: 'PDF', size: '1.2 MB' }
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{report.name}</p>
                  <p className="text-sm text-gray-500">{report.date} • {report.type} • {report.size}</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700 p-2 rounded-lg">
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};