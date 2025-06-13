import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, Edit, FileText, AlertTriangle } from 'lucide-react';
import { Vehicle } from '../../types';
import { useData } from '../../hooks/useData';
import { VehicleForm } from '../Forms/VehicleForm';

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

export const VehicleList: React.FC = () => {
  const { vehicles, warehouses } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>();

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getWarehouseName = (warehouseId: string) => {
    const warehouse = warehouses.find(w => w.id === warehouseId);
    return warehouse?.name || 'N/A';
  };

  const isDocumentExpiringSoon = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  const isDocumentExpired = (date: Date) => {
    const today = new Date();
    return date < today;
  };

  const getDocumentStatus = (date: Date) => {
    if (isDocumentExpired(date)) return 'expired';
    if (isDocumentExpiringSoon(date)) return 'expiring';
    return 'valid';
  };

  const handleSave = (vehicleData: Partial<Vehicle>) => {
    console.log('Saving vehicle:', vehicleData);
    // In real app, save to backend
    setShowForm(false);
    setSelectedVehicle(undefined);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehículos</h1>
          <p className="text-gray-600 mt-1">Gestión de flota vehicular</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Vehículo</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por placa, marca o modelo..."
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
                  Vehículo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marca/Modelo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kilometraje
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SOAT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rev. Técnica
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Almacén
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVehicles.map((vehicle) => {
                const soatStatus = getDocumentStatus(vehicle.soatExpiration);
                const techStatus = getDocumentStatus(vehicle.technicalReviewExpiration);
                
                return (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <div className="w-6 h-6 bg-gray-400 rounded"></div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{vehicle.plate}</div>
                          <div className="text-sm text-gray-500">{vehicle.year}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vehicle.brand}</div>
                      <div className="text-sm text-gray-500">{vehicle.model}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vehicle.mileage.toLocaleString()} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[vehicle.status]}`}>
                        {statusLabels[vehicle.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${
                          soatStatus === 'expired' ? 'text-red-600' :
                          soatStatus === 'expiring' ? 'text-yellow-600' :
                          'text-gray-900'
                        }`}>
                          {vehicle.soatExpiration.toLocaleDateString()}
                        </span>
                        {soatStatus !== 'valid' && (
                          <AlertTriangle className={`w-4 h-4 ${
                            soatStatus === 'expired' ? 'text-red-500' : 'text-yellow-500'
                          }`} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${
                          techStatus === 'expired' ? 'text-red-600' :
                          techStatus === 'expiring' ? 'text-yellow-600' :
                          'text-gray-900'
                        }`}>
                          {vehicle.technicalReviewExpiration.toLocaleDateString()}
                        </span>
                        {techStatus !== 'valid' && (
                          <AlertTriangle className={`w-4 h-4 ${
                            techStatus === 'expired' ? 'text-red-500' : 'text-yellow-500'
                          }`} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getWarehouseName(vehicle.warehouseId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2 justify-end">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(vehicle)}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1 rounded">
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">No se encontraron resultados</div>
          </div>
        )}
      </div>

      {showForm && (
        <VehicleForm
          vehicle={selectedVehicle}
          warehouses={warehouses}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setSelectedVehicle(undefined);
          }}
        />
      )}
    </div>
  );
};