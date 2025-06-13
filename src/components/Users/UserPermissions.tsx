import React, { useState } from 'react';
import { X, Save, Shield, Check, AlertTriangle } from 'lucide-react';
import { User, Permission } from '../../types';
import { useData } from '../../hooks/useData';

interface UserPermissionsProps {
  user: User;
  onSave: (permissions: Permission[]) => void;
  onCancel: () => void;
}

const modules = [
  { id: 'dashboard', name: 'Dashboard', description: 'Vista general del sistema' },
  { id: 'warehouses', name: 'Almacenes', description: 'Gestión de ubicaciones' },
  { id: 'machinery', name: 'Maquinaria', description: 'Equipos pesados' },
  { id: 'vehicles', name: 'Vehículos', description: 'Flota vehicular' },
  { id: 'tools', name: 'Herramientas', description: 'Herramientas y equipos menores' },
  { id: 'spareparts', name: 'Repuestos', description: 'Inventario de repuestos' },
  { id: 'fuel', name: 'Combustible', description: 'Registro de cargas de combustible' },
  { id: 'maintenance', name: 'Mantenimiento', description: 'Mantenimientos preventivos y correctivos' },
  { id: 'rentals', name: 'Alquileres', description: 'Gestión de alquileres' },
  { id: 'finance', name: 'Finanzas', description: 'Ingresos, gastos y reportes financieros' },
  { id: 'reports', name: 'Reportes', description: 'Reportes y análisis' },
  { id: 'alerts', name: 'Alertas', description: 'Notificaciones del sistema' },
  { id: 'users', name: 'Usuarios', description: 'Gestión de usuarios (solo admin)' },
  { id: 'settings', name: 'Configuración', description: 'Configuración del sistema (solo admin)' }
];

const actions = [
  { id: 'create', name: 'Crear', description: 'Agregar nuevos registros' },
  { id: 'read', name: 'Ver', description: 'Consultar información' },
  { id: 'update', name: 'Editar', description: 'Modificar registros existentes' },
  { id: 'delete', name: 'Eliminar', description: 'Borrar registros' }
];

const roleDefaults: Record<string, Permission[]> = {
  admin: [
    { module: 'all', actions: ['create', 'read', 'update', 'delete'] }
  ],
  warehouse: [
    { module: 'dashboard', actions: ['read'] },
    { module: 'warehouses', actions: ['read', 'update'] },
    { module: 'machinery', actions: ['read'] },
    { module: 'vehicles', actions: ['read'] },
    { module: 'tools', actions: ['create', 'read', 'update', 'delete'] },
    { module: 'spareparts', actions: ['create', 'read', 'update', 'delete'] },
    { module: 'fuel', actions: ['create', 'read'] },
    { module: 'alerts', actions: ['read'] }
  ],
  mechanic: [
    { module: 'dashboard', actions: ['read'] },
    { module: 'machinery', actions: ['read', 'update'] },
    { module: 'vehicles', actions: ['read', 'update'] },
    { module: 'tools', actions: ['read'] },
    { module: 'spareparts', actions: ['read'] },
    { module: 'fuel', actions: ['create', 'read'] },
    { module: 'maintenance', actions: ['create', 'read', 'update'] },
    { module: 'alerts', actions: ['read'] }
  ],
  accountant: [
    { module: 'dashboard', actions: ['read'] },
    { module: 'machinery', actions: ['read'] },
    { module: 'vehicles', actions: ['read'] },
    { module: 'rentals', actions: ['read', 'update'] },
    { module: 'finance', actions: ['create', 'read', 'update', 'delete'] },
    { module: 'reports', actions: ['read'] },
    { module: 'alerts', actions: ['read'] }
  ],
  viewer: [
    { module: 'dashboard', actions: ['read'] },
    { module: 'machinery', actions: ['read'] },
    { module: 'vehicles', actions: ['read'] },
    { module: 'tools', actions: ['read'] },
    { module: 'spareparts', actions: ['read'] },
    { module: 'reports', actions: ['read'] }
  ]
};

export const UserPermissions: React.FC<UserPermissionsProps> = ({
  user,
  onSave,
  onCancel
}) => {
  const { warehouses } = useData();
  const [permissions, setPermissions] = useState<Permission[]>(
    user.permissions || roleDefaults[user.role] || []
  );
  const [warehouseRestrictions, setWarehouseRestrictions] = useState<string[]>(
    user.warehouseRestrictions || []
  );

  const hasPermission = (moduleId: string, action: string): boolean => {
    if (user.role === 'admin') return true;
    
    const modulePermission = permissions.find(p => p.module === moduleId);
    return modulePermission?.actions.includes(action as any) || false;
  };

  const togglePermission = (moduleId: string, action: string) => {
    if (user.role === 'admin') return; // Admin has all permissions

    setPermissions(prev => {
      const existingPermission = prev.find(p => p.module === moduleId);
      
      if (existingPermission) {
        const hasAction = existingPermission.actions.includes(action as any);
        
        if (hasAction) {
          // Remove action
          const newActions = existingPermission.actions.filter(a => a !== action);
          if (newActions.length === 0) {
            // Remove entire permission if no actions left
            return prev.filter(p => p.module !== moduleId);
          } else {
            // Update actions
            return prev.map(p => 
              p.module === moduleId 
                ? { ...p, actions: newActions }
                : p
            );
          }
        } else {
          // Add action
          return prev.map(p => 
            p.module === moduleId 
              ? { ...p, actions: [...p.actions, action as any] }
              : p
          );
        }
      } else {
        // Create new permission
        return [...prev, { module: moduleId, actions: [action as any] }];
      }
    });
  };

  const applyRoleDefaults = () => {
    setPermissions(roleDefaults[user.role] || []);
  };

  const toggleWarehouseRestriction = (warehouseId: string) => {
    setWarehouseRestrictions(prev => 
      prev.includes(warehouseId)
        ? prev.filter(id => id !== warehouseId)
        : [...prev, warehouseId]
    );
  };

  const handleSave = () => {
    const finalPermissions = permissions.map(p => ({
      ...p,
      warehouseRestrictions: warehouseRestrictions.length > 0 ? warehouseRestrictions : undefined
    }));
    
    onSave(finalPermissions);
  };

  const getModulePermissionCount = (moduleId: string): number => {
    if (user.role === 'admin') return 4;
    const permission = permissions.find(p => p.module === moduleId);
    return permission?.actions.length || 0;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Permisos de Usuario
              </h2>
              <p className="text-sm text-gray-600">
                {user.name} - {user.role === 'admin' ? 'Administrador' : 
                 user.role === 'warehouse' ? 'Almacenero' :
                 user.role === 'mechanic' ? 'Mecánico' :
                 user.role === 'accountant' ? 'Contador' : 'Solo Lectura'}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Role Warning */}
          {user.role === 'admin' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">
                    Usuario Administrador
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Los administradores tienen acceso completo a todos los módulos y no pueden ser restringidos.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {user.role !== 'admin' && (
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Permisos por Módulo</h3>
              <button
                onClick={applyRoleDefaults}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Aplicar permisos por defecto del rol
              </button>
            </div>
          )}

          {/* Permissions Grid */}
          <div className="space-y-4">
            {modules.map((module) => {
              const permissionCount = getModulePermissionCount(module.id);
              const isRestricted = module.id === 'users' || module.id === 'settings';
              const canAccess = user.role === 'admin' || !isRestricted;

              return (
                <div
                  key={module.id}
                  className={`border rounded-lg p-4 ${
                    !canAccess ? 'bg-gray-50 opacity-60' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{module.name}</h4>
                      <p className="text-sm text-gray-600">{module.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isRestricted && user.role !== 'admin' && (
                        <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                          Solo Admin
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        {permissionCount}/4 permisos
                      </span>
                    </div>
                  </div>
                  
                  {canAccess && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {actions.map((action) => {
                        const hasAccess = hasPermission(module.id, action.id);
                        
                        return (
                          <label
                            key={action.id}
                            className={`relative flex cursor-pointer rounded-lg border p-3 focus:outline-none ${
                              hasAccess
                                ? 'border-green-600 bg-green-50'
                                : 'border-gray-300 bg-white hover:bg-gray-50'
                            } ${user.role === 'admin' ? 'cursor-not-allowed' : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={hasAccess}
                              onChange={() => togglePermission(module.id, action.id)}
                              disabled={user.role === 'admin'}
                              className="sr-only"
                            />
                            <div className="flex flex-1 items-center">
                              <div className="flex flex-col">
                                <span className={`block text-sm font-medium ${
                                  hasAccess ? 'text-green-900' : 'text-gray-900'
                                }`}>
                                  {action.name}
                                </span>
                                <span className={`block text-xs ${
                                  hasAccess ? 'text-green-700' : 'text-gray-500'
                                }`}>
                                  {action.description}
                                </span>
                              </div>
                            </div>
                            {hasAccess && (
                              <Check className="w-4 h-4 text-green-600" />
                            )}
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Warehouse Restrictions */}
          {user.role !== 'admin' && warehouses.length > 1 && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Restricciones por Almacén</h4>
              <p className="text-sm text-gray-600 mb-4">
                Si no seleccionas ningún almacén, el usuario tendrá acceso a todos.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {warehouses.map((warehouse) => {
                  const hasAccess = warehouseRestrictions.includes(warehouse.id);
                  
                  return (
                    <label
                      key={warehouse.id}
                      className={`relative flex cursor-pointer rounded-lg border p-3 focus:outline-none ${
                        hasAccess
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={hasAccess}
                        onChange={() => toggleWarehouseRestriction(warehouse.id)}
                        className="sr-only"
                      />
                      <div className="flex flex-1 items-center">
                        <div className="flex flex-col">
                          <span className={`block text-sm font-medium ${
                            hasAccess ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {warehouse.name}
                          </span>
                          <span className={`block text-xs ${
                            hasAccess ? 'text-blue-700' : 'text-gray-500'
                          }`}>
                            {warehouse.city}
                          </span>
                        </div>
                      </div>
                      {hasAccess && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Permisos</span>
          </button>
        </div>
      </div>
    </div>
  );
};