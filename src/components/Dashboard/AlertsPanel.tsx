import React from 'react';
import { AlertTriangle, Clock, Package, FileText } from 'lucide-react';
import { Alert } from '../../types';

interface AlertsPanelProps {
  alerts: Alert[];
}

const alertIcons = {
  maintenance: Clock,
  document: FileText,
  stock: Package,
  fuel: AlertTriangle
};

const severityColors = {
  low: 'text-green-600 bg-green-50',
  medium: 'text-yellow-600 bg-yellow-50',
  high: 'text-orange-600 bg-orange-50',
  critical: 'text-red-600 bg-red-50'
};

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  const unresolved = alerts.filter(alert => !alert.resolved).slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Alertas Recientes</h3>
        <span className="text-sm text-gray-500">{unresolved.length} pendientes</span>
      </div>
      
      <div className="space-y-3">
        {unresolved.map((alert) => {
          const Icon = alertIcons[alert.type];
          
          return (
            <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${severityColors[alert.severity]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {alert.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })}
        
        {unresolved.length === 0 && (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay alertas pendientes</p>
          </div>
        )}
      </div>
    </div>
  );
};