import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Shield, Eye, Clock, UserCheck, UserX } from 'lucide-react';
import { User, Permission, ActivityLog } from '../../types';
import { UserForm } from '../Forms/UserForm';
import { UserPermissions } from './UserPermissions';
import { ActivityLogViewer } from './ActivityLogViewer';
import { ExportButton } from '../Common/ExportButton';

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Administrador Principal',
    email: 'admin@maquinaria.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100&h=100&fit=crop&crop=face',
    lastLogin: new Date('2024-03-15T10:30:00'),
    createdAt: new Date('2024-01-01'),
    createdBy: 'system',
    permissions: [
      { module: 'all', actions: ['create', 'read', 'update', 'delete'] }
    ]
  },
  {
    id: '2',
    name: 'Carlos Méndez',
    email: 'carlos.mendez@maquinaria.com',
    role: 'mechanic',
    lastLogin: new Date('2024-03-14T16:45:00'),
    createdAt: new Date('2024-01-15'),
    createdBy: '1',
    permissions: [
      { module: 'machinery', actions: ['read', 'update'] },
      { module: 'maintenance', actions: ['create', 'read', 'update'] },
      { module: 'tools', actions: ['read'] }
    ]
  },
  {
    id: '3',
    name: 'Ana García',
    email: 'ana.garcia@maquinaria.com',
    role: 'warehouse',
    lastLogin: new Date('2024-03-15T08:20:00'),
    createdAt: new Date('2024-01-20'),
    createdBy: '1',
    permissions: [
      { module: 'warehouses', actions: ['read', 'update'] },
      { module: 'tools', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'spareparts', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'machinery', actions: ['read'] },
      { module: 'vehicles', actions: ['read'] }
    ],
    warehouseRestrictions: ['1', '2']
  },
  {
    id: '4',
    name: 'Roberto Silva',
    email: 'roberto.silva@maquinaria.com',
    role: 'accountant',
    lastLogin: new Date('2024-03-13T14:15:00'),
    createdAt: new Date('2024-02-01'),
    createdBy: '1',
    permissions: [
      { module: 'finance', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'reports', actions: ['read'] },
      { module: 'rentals', actions: ['read', 'update'] }
    ]
  }
];

const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    userId: '2',
    userName: 'Carlos Méndez',
    action: 'Actualizó mantenimiento',
    module: 'maintenance',
    entityType: 'machinery',
    entityId: '1',
    entityName: 'Excavadora CAT 320D',
    details: 'Completó mantenimiento preventivo',
    ipAddress: '192.168.1.100',
    timestamp: new Date('2024-03-15T10:30:00')
  },
  {
    id: '2',
    userId: '3',
    userName: 'Ana García',
    action: 'Agregó repuesto',
    module: 'spareparts',
    entityType: 'sparepart',
    entityId: '4',
    entityName: 'Filtro de combustible',
    details: 'Agregó 10 unidades al almacén principal',
    ipAddress: '192.168.1.105',
    timestamp: new Date('2024-03-15T09:15:00')
  }
];

const roleLabels = {
  admin: 'Administrador',
  warehouse: 'Almacenero',
  mechanic: 'Mecánico',
  accountant: 'Contador',
  viewer: 'Solo Lectura'
};

const roleColors = {
  admin: 'bg-red-100 text-red-800',
  warehouse: 'bg-blue-100 text-blue-800',
  mechanic: 'bg-green-100 text-green-800',
  accountant: 'bg-purple-100 text-purple-800',
  viewer: 'bg-gray-100 text-gray-800'
};

export const UserManagement: React.FC = () => {
  const [users] = useState<User[]>(mockUsers);
  const [activityLogs] = useState<ActivityLog[]>(mockActivityLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleSave = (userData: Partial<User>) => {
    console.log('Saving user:', userData);
    setShowForm(false);
    setSelectedUser(undefined);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handlePermissions = (user: User) => {
    setSelectedUser(user);
    setShowPermissions(true);
  };

  const handleDelete = (userId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      console.log('Deleting user:', userId);
    }
  };

  const getLastLoginText = (lastLogin?: Date) => {
    if (!lastLogin) return 'Nunca';
    const now = new Date();
    const diffMs = now.getTime() - lastLogin.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return lastLogin.toLocaleDateString();
  };

  const activeUsers = users.filter(u => u.lastLogin && 
    (new Date().getTime() - u.lastLogin.getTime()) < (7 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-1">
            Control de acceso y permisos del sistema - {activeUsers} usuarios activos
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowActivityLog(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Clock className="w-4 h-4" />
            <span>Actividad</span>
          </button>
          <ExportButton
            data={filteredUsers}
            module="users"
            title="Usuarios del Sistema"
          />
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{activeUsers}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Administradores</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactivos</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {users.length - activeUsers}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <UserX className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los roles</option>
              <option value="admin">Administrador</option>
              <option value="warehouse">Almacenero</option>
              <option value="mechanic">Mecánico</option>
              <option value="accountant">Contador</option>
              <option value="viewer">Solo Lectura</option>
            </select>
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Acceso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permisos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Creado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleColors[user.role]}`}>
                      {roleLabels[user.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getLastLoginText(user.lastLogin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => handlePermissions(user)}
                      className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                    >
                      <Shield className="w-4 h-4" />
                      <span>{user.permissions?.length || 0} módulos</span>
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2 justify-end">
                      <button 
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(user)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded"
                        title="Editar usuario"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handlePermissions(user)}
                        className="text-green-600 hover:text-green-900 p-1 rounded"
                        title="Gestionar permisos"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                      {user.role !== 'admin' && (
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron usuarios</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || roleFilter !== 'all'
                ? 'Intenta con otros filtros de búsqueda'
                : 'Comienza creando tu primer usuario'}
            </p>
            {!searchTerm && roleFilter === 'all' && (
              <button 
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Crear Primer Usuario
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <UserForm
          user={selectedUser}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setSelectedUser(undefined);
          }}
        />
      )}

      {showPermissions && selectedUser && (
        <UserPermissions
          user={selectedUser}
          onSave={(permissions) => {
            console.log('Saving permissions:', permissions);
            setShowPermissions(false);
            setSelectedUser(undefined);
          }}
          onCancel={() => {
            setShowPermissions(false);
            setSelectedUser(undefined);
          }}
        />
      )}

      {showActivityLog && (
        <ActivityLogViewer
          logs={activityLogs}
          onClose={() => setShowActivityLog(false)}
        />
      )}
    </div>
  );
};