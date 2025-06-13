import React, { useState } from 'react';
import { Plus, Search, Filter, Fuel, TrendingUp, Calendar, MapPin, Truck } from 'lucide-react';
import { FuelRecord } from '../../types';
import { useData } from '../../hooks/useData';
import { FuelForm } from '../Forms/FuelForm';

// Mock fuel records
const mockFuelRecords: FuelRecord[] = [
  {
    id: '1',
    entityType: 'machinery',
    entityId: '1',
    entityName: 'Excavadora CAT 320D',
    date: new Date('2024-03-15'),
    liters: 120,
    unitCost: 4.85,
    totalCost: 582,
    fuelType: 'diesel',
    location: 'Grifo Petroperú - Av. Industrial',
    hourmeter: 1250,
    createdAt: new Date('2024-03-15')
  },
  {
    id: '2',
    entityType: 'vehicle',
    entityId: '1',
    entityName: 'Toyota Hilux - ABC-123',
    date: new Date('2024-03-14'),
    liters: 45,
    unitCost: 4.90,
    totalCost: 220.5,
    fuelType: 'diesel',
    location: 'Grifo Shell - Carretera Sur',
    odometer: 35000,
    createdAt: new Date('2024-03-14')
  }
];

export const FuelManagement: React.FC = () => {
  const { machinery, vehicles } = useData();
  const [fuelRecords] = useState<FuelRecord[]>(mockFuelRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [machineryFilter, setMachineryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState({
    start: '',
    end: ''
  });
  const [showForm, setShowForm] = useState(false);

  const filteredRecords = fuelRecords.filter(record => {
    const matchesSearch = record.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEntity = entityFilter === 'all' || record.entityType === entityFilter;
    const matchesMachinery = machineryFilter === 'all' || record.entityId === machineryFilter;
    
    let matchesDate = true;
    if (dateFilter.start && dateFilter.end) {
      const recordDate = record.date;
      const startDate = new Date(dateFilter.start);
      const endDate = new Date(dateFilter.end);
      matchesDate = recordDate >= startDate && recordDate <= endDate;
    }
    
    return matchesSearch && matchesEntity && matchesMachinery && matchesDate;
  });

  const totalFuelCost = fuelRecords.reduce((sum, record) => sum + record.totalCost, 0);
  const totalLiters = fuelRecords.reduce((sum, record) => sum + record.liters, 0);
  const averageCostPerLiter = totalLiters > 0 ? totalFuelCost / totalLiters : 0;

  const handleSave = (fuelData: Partial<FuelRecord>) => {
    console.log('Saving fuel record:', fuelData);
    // In real app, save to backend
    setShowForm(false);
  };

  const getAllEntities = () => {
    const entities = [
      ...machinery.map(m => ({ id: m.id, name: m.name, type: 'machinery' })),
      ...vehicles.map(v => ({ id: v.id, name: `${v.brand} ${v.model} - ${v.plate}`, type: 'vehicle' }))
    ];
    return entities;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Combustible</h1>
          <p className="text-gray-600 mt-1">Control de cargas de combustible para maquinaria y vehículos</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Carga</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gasto Total del Mes</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">S/ {totalFuelCost.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Litros</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalLiters.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Fuel className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Precio Promedio/Litro</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">S/ {averageCostPerLiter.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por equipo o ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los tipos</option>
            <option value="machinery">Maquinaria</option>
            <option value="vehicle">Vehículos</option>
          </select>

          <select
            value={machineryFilter}
            onChange={(e) => setMachineryFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los equipos</option>
            {getAllEntities().map(entity => (
              <option key={entity.id} value={entity.id}>
                {entity.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dateFilter.start}
            onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Fecha inicio"
          />

          <input
            type="date"
            value={dateFilter.end}
            onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Fecha fin"
          />
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Litros
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio/L
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medidor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{record.date.toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <div className="text-sm font-medium text-gray-900">{record.entityName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      record.entityType === 'machinery' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {record.entityType === 'machinery' ? 'Maquinaria' : 'Vehículo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.liters} L
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    S/ {record.unitCost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    S/ {record.totalCost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="truncate max-w-32">{record.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.hourmeter ? `${record.hourmeter} hrs` : `${record.odometer} km`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <Fuel className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay registros de combustible</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || entityFilter !== 'all' || machineryFilter !== 'all' || dateFilter.start || dateFilter.end
                ? 'No se encontraron registros con los filtros seleccionados'
                : 'Comienza registrando la primera carga de combustible'}
            </p>
            {!searchTerm && entityFilter === 'all' && machineryFilter === 'all' && !dateFilter.start && !dateFilter.end && (
              <button 
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Registrar Primera Carga
              </button>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <FuelForm
          machinery={machinery}
          vehicles={vehicles}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};