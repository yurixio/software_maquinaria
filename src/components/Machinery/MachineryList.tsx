import React, { useState, useMemo, useCallback } from 'react';
import { Search, Filter, Plus, Eye, Edit, Wrench } from 'lucide-react';
import { Machinery } from '../../types';
import { useData } from '../../hooks/useData';
import { useDebounce } from '../../hooks/useDebounce';
import { useToast } from '../../hooks/useToast';
import { useRealTimeUpdates } from '../../hooks/useRealTimeUpdates';
import { MachineryForm } from '../Forms/MachineryForm';
import { ExportButton } from '../Common/ExportButton';
import { ActionButton } from '../Common/ActionButton';
import { ConfirmationModal } from '../Common/ConfirmationModal';
import { VirtualizedTable } from '../Common/VirtualizedTable';
import { LazyImage } from '../Common/LazyImage';

const statusColors = {
  disponible: 'bg-green-100 text-green-800',
  alquilado: 'bg-blue-100 text-blue-800',
  mantenimiento: 'bg-yellow-100 text-yellow-800',
  fuera_servicio: 'bg-red-100 text-red-800'
};

const statusLabels = {
  disponible: 'Disponible',
  alquilado: 'Alquilado',
  mantenimiento: 'Mantenimiento',
  fuera_servicio: 'Fuera de Servicio'
};

const conditionColors = {
  excelente: 'bg-green-100 text-green-800',
  bueno: 'bg-blue-100 text-blue-800',
  regular: 'bg-yellow-100 text-yellow-800',
  malo: 'bg-red-100 text-red-800'
};

const conditionLabels = {
  excelente: 'Excelente',
  bueno: 'Bueno',
  regular: 'Regular',
  malo: 'Malo'
};

export const MachineryList: React.FC = () => {
  const { machinery, warehouses, warehouseMap } = useData();
  const { success, error } = useToast();
  const { broadcastUpdate } = useRealTimeUpdates();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedMachinery, setSelectedMachinery] = useState<Machinery | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; machinery?: Machinery }>({
    isOpen: false
  });

  // Debounce search term for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoize filtered machinery to avoid unnecessary recalculations
  const filteredMachinery = useMemo(() => {
    return machinery.filter(machine => {
      const matchesSearch = machine.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           machine.brand.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           machine.model.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || machine.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [machinery, debouncedSearchTerm, statusFilter]);

  // Memoize warehouse name lookup
  const getWarehouseName = useCallback((warehouseId: string) => {
    return warehouseMap[warehouseId]?.name || 'N/A';
  }, [warehouseMap]);

  const handleSave = useCallback(async (machineryData: Partial<Machinery>) => {
    try {
      console.log('Saving machinery:', machineryData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const isEdit = !!selectedMachinery;
      const actionType = isEdit ? 'update' : 'create';
      const machineryName = machineryData.name || selectedMachinery?.name || 'Nueva maquinaria';
      
      // Broadcast real-time update
      broadcastUpdate({
        type: actionType,
        module: 'machinery',
        entityId: selectedMachinery?.id || 'new',
        entityName: machineryName,
        userId: 'current-user',
        userName: 'Usuario Actual'
      });
      
      success(
        isEdit ? 'Maquinaria actualizada' : 'Maquinaria creada',
        `${machineryName} ha sido ${isEdit ? 'actualizada' : 'registrada'} exitosamente`
      );
      
      setShowForm(false);
      setSelectedMachinery(undefined);
    } catch (err) {
      error(
        'Error al guardar',
        'No se pudo guardar la maquinaria. Intenta nuevamente.'
      );
    }
  }, [selectedMachinery, broadcastUpdate, success, error]);

  const handleEdit = useCallback((machinery: Machinery) => {
    setSelectedMachinery(machinery);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (machinery: Machinery) => {
    try {
      console.log('Deleting machinery:', machinery.id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Broadcast real-time update
      broadcastUpdate({
        type: 'delete',
        module: 'machinery',
        entityId: machinery.id,
        entityName: machinery.name,
        userId: 'current-user',
        userName: 'Usuario Actual'
      });
      
      success(
        'Maquinaria eliminada',
        `${machinery.name} ha sido eliminada del sistema`
      );
      
      setDeleteConfirm({ isOpen: false });
    } catch (err) {
      error(
        'Error al eliminar',
        'No se pudo eliminar la maquinaria. Intenta nuevamente.'
      );
    }
  }, [broadcastUpdate, success, error]);

  // Render machinery row for virtualization
  const renderMachineryRow = useCallback((machine: Machinery, index: number) => (
    <tr key={machine.id} className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
            {machine.images[0] ? (
              <LazyImage
                src={machine.images[0]}
                alt={machine.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-6 h-6 bg-gray-400 rounded"></div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{machine.name}</div>
            <div className="text-sm text-gray-500">{machine.category}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{machine.brand}</div>
        <div className="text-sm text-gray-500">{machine.model}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {machine.hourmeter.toLocaleString()} hrs
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${conditionColors[machine.condition]}`}>
          {conditionLabels[machine.condition]}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[machine.status]}`}>
          {statusLabels[machine.status]}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {getWarehouseName(machine.warehouseId)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {machine.nextMaintenance ? machine.nextMaintenance.toLocaleDateString() : 'No programado'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-2 justify-end">
          <button className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleEdit(machine)}
            className="text-gray-600 hover:text-gray-900 p-1 rounded transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button className="text-green-600 hover:text-green-900 p-1 rounded transition-colors">
            <Wrench className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  ), [getWarehouseName, handleEdit]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maquinaria</h1>
          <p className="text-gray-600 mt-1">Gestión de maquinaria pesada</p>
        </div>
        <div className="flex items-center space-x-3">
          <ExportButton
            data={filteredMachinery}
            module="machinery"
            title="Inventario de Maquinaria"
          />
          <ActionButton onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" />
            <span>Nueva Maquinaria</span>
          </ActionButton>
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
                placeholder="Buscar por nombre, marca o modelo..."
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
              <option value="alquilado">Alquilado</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="fuera_servicio">Fuera de Servicio</option>
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
                  Maquinaria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marca/Modelo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horómetro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condición
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Almacén
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Próximo Mantenimiento
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMachinery.length > 20 ? (
                <tr>
                  <td colSpan={8} className="p-0">
                    <VirtualizedTable
                      data={filteredMachinery}
                      itemHeight={80}
                      containerHeight={600}
                      renderItem={renderMachineryRow}
                    />
                  </td>
                </tr>
              ) : (
                filteredMachinery.map(renderMachineryRow)
              )}
            </tbody>
          </table>
        </div>
        
        {filteredMachinery.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">No se encontraron resultados</div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <MachineryForm
          machinery={selectedMachinery}
          warehouses={warehouses}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setSelectedMachinery(undefined);
          }}
        />
      )}

      <ConfirmationModal
        isOpen={deleteConfirm.isOpen}
        title="Eliminar Maquinaria"
        message={`¿Estás seguro de que deseas eliminar "${deleteConfirm.machinery?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        onConfirm={() => deleteConfirm.machinery && handleDelete(deleteConfirm.machinery)}
        onCancel={() => setDeleteConfirm({ isOpen: false })}
      />
    </div>
  );
};