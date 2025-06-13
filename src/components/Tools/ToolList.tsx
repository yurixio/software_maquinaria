import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, Edit, Wrench, MapPin, EyeOff } from 'lucide-react';
import { Tool } from '../../types';
import { useData } from '../../hooks/useData';
import { ToolForm } from '../Forms/ToolForm';
import { useToast } from '../../hooks/useToast';

const statusColors = {
  disponible: 'bg-green-100 text-green-800',
  no_disponible: 'bg-red-100 text-red-800'
};

const statusLabels = {
  disponible: 'Disponible',
  no_disponible: 'No Disponible'
};

export const ToolList: React.FC = () => {
  const { tools, warehouses } = useData();
  const { success } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | undefined>();
  const [hiddenTools, setHiddenTools] = useState<Set<string>>(new Set());

  const filteredTools = tools.filter(tool => {
    const isVisible = !hiddenTools.has(tool.id);
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.internalCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tool.status === statusFilter;
    const matchesWarehouse = warehouseFilter === 'all' || tool.warehouseId === warehouseFilter;
    return isVisible && matchesSearch && matchesStatus && matchesWarehouse;
  });

  const getWarehouseName = (warehouseId: string) => {
    const warehouse = warehouses.find(w => w.id === warehouseId);
    return warehouse?.name || 'N/A';
  };

  const handleSave = (toolData: Partial<Tool>) => {
    console.log('Saving tool:', toolData);
    setShowForm(false);
    setSelectedTool(undefined);
  };

  const handleEdit = (tool: Tool) => {
    setSelectedTool(tool);
    setShowForm(true);
  };

  const handleToggleVisibility = (tool: Tool) => {
    const isHidden = hiddenTools.has(tool.id);
    
    if (isHidden) {
      setHiddenTools(prev => {
        const newSet = new Set(prev);
        newSet.delete(tool.id);
        return newSet;
      });
      success('Herramienta visible', `${tool.name} ahora es visible en el sistema`);
    } else {
      setHiddenTools(prev => new Set([...prev, tool.id]));
      success('Herramienta oculta', `${tool.name} ha sido ocultada del sistema`);
    }
  };

  const handleMaintenance = (tool: Tool) => {
    console.log('Registering maintenance for tool:', tool.id);
    // In real app, open maintenance form
    success('Mantenimiento registrado', `Se registró el mantenimiento para ${tool.name}`);
  };

  const availableTools = tools.filter(t => t.status === 'disponible' && !hiddenTools.has(t.id)).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Herramientas</h1>
          <p className="text-gray-600 mt-1">
            Gestión de herramientas y equipos menores - {availableTools} de {tools.length - hiddenTools.size} disponibles
          </p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Herramienta</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Herramientas</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{tools.length - hiddenTools.size}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Disponibles</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{availableTools}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">No Disponibles</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {tools.length - hiddenTools.size - availableTools}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-red-600" />
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
                placeholder="Buscar por nombre o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="disponible">Disponible</option>
              <option value="no_disponible">No Disponible</option>
            </select>
            <select
              value={warehouseFilter}
              onChange={(e) => setWarehouseFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los almacenes</option>
              {warehouses.map(warehouse => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Herramienta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código Interno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Almacén
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Observaciones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Registro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTools.map((tool) => (
                <tr key={tool.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{tool.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tool.internalCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[tool.status]}`}>
                      {statusLabels[tool.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                      {getWarehouseName(tool.warehouseId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                    {tool.observations || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tool.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2 justify-end">
                      <button 
                        onClick={() => handleToggleVisibility(tool)}
                        className={`p-1 rounded transition-colors ${
                          hiddenTools.has(tool.id) 
                            ? 'text-gray-400 hover:text-gray-600' 
                            : 'text-blue-600 hover:text-blue-900'
                        }`}
                        title={hiddenTools.has(tool.id) ? 'Mostrar' : 'Ocultar'}
                      >
                        {hiddenTools.has(tool.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => handleEdit(tool)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleMaintenance(tool)}
                        className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                        title="Registrar mantenimiento"
                      >
                        <Wrench className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron herramientas</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all' || warehouseFilter !== 'all' 
                ? 'Intenta con otros filtros de búsqueda' 
                : 'Comienza registrando tu primera herramienta'}
            </p>
            {!searchTerm && statusFilter === 'all' && warehouseFilter === 'all' && (
              <button 
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Registrar Primera Herramienta
              </button>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <ToolForm
          tool={selectedTool}
          warehouses={warehouses}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setSelectedTool(undefined);
          }}
        />
      )}
    </div>
  );
};