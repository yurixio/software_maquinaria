import React, { useState } from 'react';
import { AlertTriangle, Clock, Package, FileText, CheckCircle, X, Calendar, Fuel, User } from 'lucide-react';
import { Alert } from '../../types';
import { useData } from '../../hooks/useData';
import { useToast } from '../../hooks/useToast';

const alertIcons = {
  maintenance: Clock,
  document: FileText,
  stock: Package,
  fuel: Fuel
};

const severityColors = {
  low: 'text-green-600 bg-green-50 border-green-200',
  medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  high: 'text-orange-600 bg-orange-50 border-orange-200',
  critical: 'text-red-600 bg-red-50 border-red-200'
};

const severityLabels = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  critical: 'Crítica'
};

const typeLabels = {
  maintenance: 'Mantenimiento',
  document: 'Documentos',
  stock: 'Inventario',
  fuel: 'Combustible'
};

export const AlertsManagement: React.FC = () => {
  const { alerts } = useData();
  const { success } = useToast();
  const [filter, setFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [showResolved, setShowResolved] = useState(false);
  const [resolvedAlerts, setResolvedAlerts] = useState<Set<string>>(new Set());

  const filteredAlerts = alerts.filter(alert => {
    const isResolved = resolvedAlerts.has(alert.id);
    const matchesType = filter === 'all' || alert.type === filter;
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesResolved = showResolved || !isResolved;
    return matchesType && matchesSeverity && matchesResolved;
  });

  const handleResolveAlert = (alert: Alert) => {
    setResolvedAlerts(prev => new Set([...prev, alert.id]));
    
    // In real app, update alert status in backend
    console.log('Resolving alert:', {
      alertId: alert.id,
      resolvedBy: 'current-user',
      resolvedAt: new Date(),
      resolutionNotes: 'Alerta resuelta desde el panel de gestión'
    });

    success(
      'Alerta resuelta',
      `La alerta "${alert.title}" ha sido marcada como resuelta`
    );
  };

  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !resolvedAlerts.has(a.id)).length;
  const highAlerts = alerts.filter(a => a.severity === 'high' && !resolvedAlerts.has(a.id)).length;
  const unresolvedAlerts = alerts.filter(a => !resolvedAlerts.has(a.id)).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alertas y Notificaciones</h1>
          <p className="text-gray-600 mt-1">
            {unresolvedAlerts} alertas pendientes - {criticalAlerts} críticas, {highAlerts} altas
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Alertas</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{alerts.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Críticas</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{criticalAlerts}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Altas</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{highAlerts}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resueltas</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {resolvedAlerts.size}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los tipos</option>
              <option value="maintenance">Mantenimiento</option>
              <option value="document">Documentos</option>
              <option value="stock">Inventario</option>
              <option value="fuel">Combustible</option>
            </select>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas las prioridades</option>
              <option value="critical">Crítica</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showResolved}
                onChange={(e) => setShowResolved(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Mostrar resueltas</span>
            </label>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const Icon = alertIcons[alert.type];
          const isResolved = resolvedAlerts.has(alert.id);
          
          return (
            <div
              key={alert.id}
              className={`bg-white rounded-xl shadow-sm border-l-4 p-6 ${
                isResolved ? 'opacity-60' : ''
              } ${severityColors[alert.severity]}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${severityColors[alert.severity]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${severityColors[alert.severity]}`}>
                        {severityLabels[alert.severity]}
                      </span>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {typeLabels[alert.type]}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{alert.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{alert.createdAt.toLocaleDateString()}</span>
                      </div>
                      <span>•</span>
                      <span>Entidad: {alert.relatedEntity}</span>
                    </div>
                    {isResolved && (
                      <div className="flex items-center space-x-2 mt-2 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Resuelta por Usuario Actual el {new Date().toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {isResolved ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Resuelta
                    </span>
                  ) : (
                    <button
                      onClick={() => handleResolveAlert(alert)}
                      className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Resolver
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay alertas</h3>
          <p className="text-gray-500">
            {showResolved || filter !== 'all' || severityFilter !== 'all'
              ? 'No se encontraron alertas con los filtros seleccionados'
              : 'No hay alertas pendientes en este momento'}
          </p>
        </div>
      )}
    </div>
  );
};