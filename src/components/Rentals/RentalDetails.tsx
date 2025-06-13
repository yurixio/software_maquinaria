import React, { useState } from 'react';
import { X, Edit, Calendar, Clock, User, MapPin, DollarSign, Plus, Save } from 'lucide-react';
import { Rental, WorkingHoursRecord } from '../../types';

interface RentalDetailsProps {
  rental: Rental;
  onClose: () => void;
  onEdit: () => void;
}

export const RentalDetails: React.FC<RentalDetailsProps> = ({
  rental,
  onClose,
  onEdit
}) => {
  const [workingHours, setWorkingHours] = useState<WorkingHoursRecord[]>(rental.workingHours || []);
  const [newHoursRecord, setNewHoursRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    hours: 0,
    description: ''
  });
  const [showAddHours, setShowAddHours] = useState(false);

  const handleAddWorkingHours = () => {
    if (newHoursRecord.hours > 0 && newHoursRecord.description.trim()) {
      const newRecord: WorkingHoursRecord = {
        date: new Date(newHoursRecord.date),
        hours: newHoursRecord.hours,
        description: newHoursRecord.description,
        recordedBy: 'current-user',
        recordedAt: new Date()
      };

      setWorkingHours(prev => [...prev, newRecord]);
      setNewHoursRecord({
        date: new Date().toISOString().split('T')[0],
        hours: 0,
        description: ''
      });
      setShowAddHours(false);

      // In real app, save to backend
      console.log('Adding working hours record:', newRecord);
    }
  };

  const getTotalHours = () => {
    return workingHours.reduce((total, record) => total + record.hours, 0);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      cotizado: 'bg-gray-100 text-gray-800',
      confirmado: 'bg-blue-100 text-blue-800',
      activo: 'bg-green-100 text-green-800',
      completado: 'bg-purple-100 text-purple-800',
      cancelado: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      parcial: 'bg-orange-100 text-orange-800',
      pagado: 'bg-green-100 text-green-800',
      vencido: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Detalles del Alquiler
              </h2>
              <p className="text-sm text-gray-600">
                {rental.clientName} - {rental.entityName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Editar</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status and Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Estado del Alquiler</h3>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(rental.status)}`}>
                {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Estado de Pago</h3>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPaymentStatusColor(rental.paymentStatus)}`}>
                {rental.paymentStatus.charAt(0).toUpperCase() + rental.paymentStatus.slice(1)}
              </span>
            </div>
          </div>

          {/* Client Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Cliente</p>
                <p className="font-medium">{rental.clientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Contacto</p>
                <p className="font-medium">{rental.clientContact}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{rental.clientEmail || 'No especificado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Teléfono</p>
                <p className="font-medium">{rental.clientPhone || 'No especificado'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Dirección</p>
                <p className="font-medium">{rental.clientAddress || 'No especificada'}</p>
              </div>
            </div>
          </div>

          {/* Rental Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles del Alquiler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Equipo</p>
                <p className="font-medium">{rental.entityName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Período</p>
                <p className="font-medium">
                  {rental.startDate.toLocaleDateString()} - {rental.endDate.toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tarifa Diaria</p>
                <p className="font-medium">S/ {rental.dailyRate.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="font-medium text-lg">S/ {rental.totalAmount.toLocaleString()}</p>
              </div>
              {rental.deposit && (
                <div>
                  <p className="text-sm text-gray-600">Depósito</p>
                  <p className="font-medium">S/ {rental.deposit.toLocaleString()}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Operador Incluido</p>
                <p className="font-medium">{rental.operatorIncluded ? 'Sí' : 'No'}</p>
                {rental.operatorIncluded && rental.operatorName && (
                  <p className="text-sm text-gray-500">{rental.operatorName}</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Descripción</p>
              <p className="font-medium">{rental.description}</p>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Registro de Horas Trabajadas
              </h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Total: <span className="font-medium">{getTotalHours()}h</span>
                </span>
                <button
                  onClick={() => setShowAddHours(true)}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Horas</span>
                </button>
              </div>
            </div>

            {showAddHours && (
              <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Registrar Horas Trabajadas</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={newHoursRecord.date}
                      onChange={(e) => setNewHoursRecord(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Horas
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={newHoursRecord.hours}
                      onChange={(e) => setNewHoursRecord(prev => ({ ...prev, hours: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="8.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <input
                      type="text"
                      value={newHoursRecord.description}
                      onChange={(e) => setNewHoursRecord(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Descripción del trabajo"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => setShowAddHours(false)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddWorkingHours}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar</span>
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {workingHours.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No hay registros de horas trabajadas
                </p>
              ) : (
                workingHours.map((record, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{record.date.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{record.hours}h</span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {record.recordedAt?.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">{record.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Delivery Information */}
          {rental.deliveryAddress && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Entrega</h3>
              <div className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <p className="font-medium">{rental.deliveryAddress}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};