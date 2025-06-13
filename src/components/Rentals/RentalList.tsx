import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, Edit, Calendar, Clock, User, MapPin, DollarSign } from 'lucide-react';
import { Rental } from '../../types';
import { useData } from '../../hooks/useData';
import { RentalForm } from '../Forms/RentalForm';
import { RentalDetails } from './RentalDetails';
import { ExportButton } from '../Common/ExportButton';

// Mock rental data
const mockRentals: Rental[] = [
  {
    id: '1',
    clientName: 'Constructora ABC S.A.C.',
    clientContact: 'Juan Pérez',
    clientEmail: 'juan.perez@constructoraabc.com',
    clientPhone: '+51 987654321',
    clientAddress: 'Av. Industrial 456, Lima',
    clientDocument: '20123456789',
    machineryId: '1',
    entityName: 'Excavadora CAT 320D',
    startDate: new Date('2024-03-10'),
    endDate: new Date('2024-03-20'),
    dailyRate: 800,
    totalAmount: 8800,
    deposit: 2000,
    status: 'activo',
    paymentStatus: 'parcial',
    description: 'Excavación para cimientos de edificio residencial',
    deliveryAddress: 'Av. Los Constructores 789, San Isidro',
    operatorIncluded: true,
    operatorName: 'Carlos Mendoza',
    operatorCost: 150,
    fuelIncluded: false,
    transportCost: 300,
    checkInPhotos: [],
    checkOutPhotos: [],
    checkInHourmeter: 1250,
    workingHours: [
      { date: new Date('2024-03-10'), hours: 8, description: 'Excavación inicial' },
      { date: new Date('2024-03-11'), hours: 7.5, description: 'Continuación excavación' },
      { date: new Date('2024-03-12'), hours: 8, description: 'Nivelación terreno' }
    ],
    createdAt: new Date('2024-03-08'),
    createdBy: 'admin'
  },
  {
    id: '2',
    clientName: 'Empresa Minera XYZ',
    clientContact: 'María García',
    clientEmail: 'maria.garcia@mineraxyz.com',
    clientPhone: '+51 976543210',
    clientAddress: 'Carretera Central Km 25, Huancayo',
    clientDocument: '20987654321',
    vehicleId: '1',
    entityName: 'Toyota Hilux ABC-123',
    startDate: new Date('2024-03-05'),
    endDate: new Date('2024-03-15'),
    dailyRate: 200,
    totalAmount: 2200,
    deposit: 500,
    status: 'completado',
    paymentStatus: 'pagado',
    description: 'Transporte de personal y materiales',
    deliveryAddress: 'Mina La Esperanza, Junín',
    operatorIncluded: false,
    fuelIncluded: true,
    transportCost: 150,
    checkInPhotos: [],
    checkOutPhotos: [],
    checkInOdometer: 35000,
    checkOutOdometer: 35850,
    actualEndDate: new Date('2024-03-15'),
    workingHours: [
      { date: new Date('2024-03-05'), hours: 10, description: 'Transporte inicial' },
      { date: new Date('2024-03-06'), hours: 8, description: 'Transporte materiales' },
      { date: new Date('2024-03-07'), hours: 9, description: 'Transporte personal' }
    ],
    createdAt: new Date('2024-03-03'),
    createdBy: 'admin'
  }
];

const statusColors = {
  cotizado: 'bg-gray-100 text-gray-800',
  confirmado: 'bg-blue-100 text-blue-800',
  activo: 'bg-green-100 text-green-800',
  completado: 'bg-purple-100 text-purple-800',
  cancelado: 'bg-red-100 text-red-800'
};

const statusLabels = {
  cotizado: 'Cotizado',
  confirmado: 'Confirmado',
  activo: 'Activo',
  completado: 'Completado',
  cancelado: 'Cancelado'
};

const paymentStatusColors = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  parcial: 'bg-orange-100 text-orange-800',
  pagado: 'bg-green-100 text-green-800',
  vencido: 'bg-red-100 text-red-800'
};

const paymentStatusLabels = {
  pendiente: 'Pendiente',
  parcial: 'Parcial',
  pagado: 'Pagado',
  vencido: 'Vencido'
};

export const RentalList: React.FC = () => {
  const { machinery, vehicles } = useData();
  const [rentals] = useState<Rental[]>(mockRentals);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState({
    start: '',
    end: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRental, setSelectedRental] = useState<Rental | undefined>();

  const filteredRentals = rentals.filter(rental => {
    const matchesSearch = rental.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rental.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rental.clientContact.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || rental.status === statusFilter;
    const matchesClient = clientFilter === 'all' || rental.clientName === clientFilter;
    
    let matchesDate = true;
    if (dateFilter.start && dateFilter.end) {
      const startDate = new Date(dateFilter.start);
      const endDate = new Date(dateFilter.end);
      matchesDate = rental.startDate >= startDate && rental.endDate <= endDate;
    }
    
    return matchesSearch && matchesStatus && matchesClient && matchesDate;
  });

  const handleSave = (rentalData: Partial<Rental>) => {
    console.log('Saving rental:', rentalData);
    setShowForm(false);
    setSelectedRental(undefined);
  };

  const handleEdit = (rental: Rental) => {
    setSelectedRental(rental);
    setShowForm(true);
  };

  const handleViewDetails = (rental: Rental) => {
    setSelectedRental(rental);
    setShowDetails(true);
  };

  const getTotalWorkingHours = (rental: Rental): number => {
    return rental.workingHours?.reduce((total, record) => total + record.hours, 0) || 0;
  };

  const getUniqueClients = () => {
    return [...new Set(rentals.map(r => r.clientName))];
  };

  const activeRentals = rentals.filter(r => r.status === 'activo').length;
  const totalRevenue = rentals.filter(r => r.status === 'completado').reduce((sum, r) => sum + r.totalAmount, 0);
  const pendingPayments = rentals.filter(r => r.paymentStatus === 'pendiente' || r.paymentStatus === 'parcial').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Alquileres</h1>
          <p className="text-gray-600 mt-1">
            Control de alquileres de maquinaria y vehículos - {activeRentals} activos
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <ExportButton
            data={filteredRentals}
            module="rentals"
            title="Registro de Alquileres"
          />
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Alquiler</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alquileres Activos</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{activeRentals}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Alquileres</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{rentals.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Completados</p>
              <p className="text-2xl font-bold text-green-600 mt-1">S/ {totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pagos Pendientes</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{pendingPayments}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
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
              placeholder="Buscar cliente, máquina..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los estados</option>
            <option value="cotizado">Cotizado</option>
            <option value="confirmado">Confirmado</option>
            <option value="activo">Activo</option>
            <option value="completado">Completado</option>
            <option value="cancelado">Cancelado</option>
          </select>

          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los clientes</option>
            {getUniqueClients().map(client => (
              <option key={client} value={client}>{client}</option>
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

      {/* Rentals Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horas Trabajadas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRentals.map((rental) => (
                <tr key={rental.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{rental.clientName}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {rental.clientContact}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{rental.entityName}</div>
                    {rental.operatorIncluded && (
                      <div className="text-sm text-gray-500">+ Operador</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {rental.startDate.toLocaleDateString()} - {rental.endDate.toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {Math.ceil((rental.endDate.getTime() - rental.startDate.getTime()) / (1000 * 60 * 60 * 24))} días
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {getTotalWorkingHours(rental)}h
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[rental.status]}`}>
                      {statusLabels[rental.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paymentStatusColors[rental.paymentStatus]}`}>
                      {paymentStatusLabels[rental.paymentStatus]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    S/ {rental.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2 justify-end">
                      <button 
                        onClick={() => handleViewDetails(rental)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(rental)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRentals.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron alquileres</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all' || clientFilter !== 'all'
                ? 'Intenta con otros filtros de búsqueda'
                : 'Comienza registrando tu primer alquiler'}
            </p>
            {!searchTerm && statusFilter === 'all' && clientFilter === 'all' && (
              <button 
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Registrar Primer Alquiler
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <RentalForm
          rental={selectedRental}
          machinery={machinery}
          vehicles={vehicles}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setSelectedRental(undefined);
          }}
        />
      )}

      {showDetails && selectedRental && (
        <RentalDetails
          rental={selectedRental}
          onClose={() => {
            setShowDetails(false);
            setSelectedRental(undefined);
          }}
          onEdit={() => {
            setShowDetails(false);
            setShowForm(true);
          }}
        />
      )}
    </div>
  );
};