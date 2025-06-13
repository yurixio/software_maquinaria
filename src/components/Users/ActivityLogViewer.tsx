import React, { useState } from 'react';
import { X, Clock, User, Filter, Search, Download } from 'lucide-react';
import { ActivityLog } from '../../types';

interface ActivityLogViewerProps {
  logs: ActivityLog[];
  onClose: () => void;
}

const actionColors = {
  'Creó': 'bg-green-100 text-green-800',
  'Actualizó': 'bg-blue-100 text-blue-800',
  'Eliminó': 'bg-red-100 text-red-800',
  'Consultó': 'bg-gray-100 text-gray-800'
};

const moduleIcons = {
  machinery: '🚜',
  vehicles: '🚗',
  tools: '🔧',
  spareparts: '📦',
  maintenance: '⚙️',
  finance: '💰',
  users: '👥',
  settings: '⚙️'
};

export const ActivityLogViewer: React.FC<ActivityLogViewerProps> = ({
  logs,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.entityName && log.entityName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesUser = userFilter === 'all' || log.userId === userFilter;
    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const now = new Date();
      const logDate = new Date(log.timestamp);
      
      switch (dateFilter) {
        case 'today':
          matchesDate = logDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesUser && matchesModule && matchesDate;
  });

  const uniqueUsers = [...new Set(logs.map(log => ({ id: log.userId, name: log.userName })))];
  const uniqueModules = [...new Set(logs.map(log => log.module))];

  const getActionColor = (action: string): string => {
    const actionKey = Object.keys(actionColors).find(key => action.includes(key));
    return actionKey ? actionColors[actionKey as keyof typeof actionColors] : 'bg-gray-100 text-gray-800';
  };

  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Registro de Actividad
              </h2>
              <p className="text-sm text-gray-600">
                {filteredLogs.length} de {logs.length} actividades
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar actividad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los usuarios</option>
              {uniqueUsers.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>

            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los módulos</option>
              {uniqueModules.map(module => (
                <option key={module} value={module}>
                  {module.charAt(0).toUpperCase() + module.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todo el tiempo</option>
              <option value="today">Hoy</option>
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
            </select>
          </div>
        </div>

        {/* Activity List */}
        <div className="overflow-y-auto max-h-96">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay actividad</h3>
              <p className="text-gray-500">
                No se encontraron registros con los filtros seleccionados
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">
                        {moduleIcons[log.module as keyof typeof moduleIcons] || '📋'}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {log.userName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">
                        {log.entityName && (
                          <span className="font-medium">{log.entityName}</span>
                        )}
                        {log.details && (
                          <span className="ml-2">{log.details}</span>
                        )}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Módulo: {log.module}</span>
                        {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                        <span>{log.timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};