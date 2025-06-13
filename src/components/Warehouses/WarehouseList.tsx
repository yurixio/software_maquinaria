import React, { useState } from 'react';
import { Search, Plus, MapPin, Package, Truck, Car, Wrench, Edit, Eye } from 'lucide-react';
import { Warehouse } from '../../types';
import { useData } from '../../hooks/useData';
import { WarehouseForm } from '../Forms/WarehouseForm';

export const WarehouseList: React.FC = () => {
  const { warehouses, machinery, vehicles } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | undefined>();

  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getWarehouseStats = (warehouseId: string) => {
    const machineryCount = machinery.filter(m => m.warehouseId === warehouseId).length;
    const vehicleCount = vehicles.filter(v => v.warehouseId === warehouseId).length;
    const availableMachinery = machinery.filter(m => m.warehouseId === warehouseId && m.status === 'disponible').length;
    const availableVehicles = vehicles.filter(v => v.warehouseId === warehouseId && v.status === 'disponible').length;
    
    return {
      machineryCount,
      vehicleCount,
      availableMachinery,
      availableVehicles,
      toolCount: 0, // Mock data
      sparePartCount: 0 // Mock data
    };
  };

  const handleSave = (warehouseData: Partial<Warehouse>) => {
    console.log('Saving warehouse:', warehouseData);
    // In real app, save to backend
    setShowForm(false);
    setSelectedWarehouse(undefined);
  };

  const handleEdit = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Almacenes</h1>
          <p className="text-gray-600 mt-1">Gestión de ubicaciones y centros de distribución</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Almacén</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por nombre, ciudad o dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Warehouse Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWarehouses.map((warehouse) => {
          const stats = getWarehouseStats(warehouse.id);
          
          return (
            <div key={warehouse.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{warehouse.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{warehouse.city}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => handleEdit(warehouse)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">{warehouse.address}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Maquinaria</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-lg font-bold text-blue-900">{stats.machineryCount}</span>
                      <span className="text-sm text-blue-600 ml-1">
                        ({stats.availableMachinery} disp.)
                      </span>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Car className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Vehículos</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-lg font-bold text-green-900">{stats.vehicleCount}</span>
                      <span className="text-sm text-green-600 ml-1">
                        ({stats.availableVehicles} disp.)
                      </span>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Wrench className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">Herramientas</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-lg font-bold text-purple-900">{stats.toolCount}</span>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-900">Repuestos</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-lg font-bold text-orange-900">{stats.sparePartCount}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Creado: {warehouse.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredWarehouses.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron almacenes</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza creando tu primer almacén'}
          </p>
          {!searchTerm && (
            <button 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Almacén
            </button>
          )}
        </div>
      )}

      {showForm && (
        <WarehouseForm
          warehouse={selectedWarehouse}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setSelectedWarehouse(undefined);
          }}
        />
      )}
    </div>
  );
};