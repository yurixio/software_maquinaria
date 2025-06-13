import React, { useState } from 'react';
import { X, Save, Calendar, User, MapPin } from 'lucide-react';
import { Rental, Machinery, Vehicle } from '../../types';

interface RentalFormProps {
  rental?: Rental;
  machinery: Machinery[];
  vehicles: Vehicle[];
  onSave: (rental: Partial<Rental>) => void;
  onCancel: () => void;
}

export const RentalForm: React.FC<RentalFormProps> = ({
  rental,
  machinery,
  vehicles,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    clientName: rental?.clientName || '',
    clientContact: rental?.clientContact || '',
    clientEmail: rental?.clientEmail || '',
    clientPhone: rental?.clientPhone || '',
    clientAddress: rental?.clientAddress || '',
    clientDocument: rental?.clientDocument || '',
    entityType: rental?.machineryId ? 'machinery' : rental?.vehicleId ? 'vehicle' : 'machinery',
    entityId: rental?.machineryId || rental?.vehicleId || '',
    startDate: rental?.startDate ? rental.startDate.toISOString().split('T')[0] : '',
    endDate: rental?.endDate ? rental.endDate.toISOString().split('T')[0] : '',
    dailyRate: rental?.dailyRate || 0,
    deposit: rental?.deposit || 0,
    description: rental?.description || '',
    deliveryAddress: rental?.deliveryAddress || '',
    operatorIncluded: rental?.operatorIncluded || false,
    operatorName: rental?.operatorName || '',
    operatorCost: rental?.operatorCost || 0,
    fuelIncluded: rental?.fuelIncluded || false,
    transportCost: rental?.transportCost || 0,
    terms: rental?.terms || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.clientName.trim()) newErrors.clientName = 'El nombre del cliente es requerido';
    if (!formData.clientContact.trim()) newErrors.clientContact = 'El contacto es requerido';
    if (!formData.entityId) newErrors.entityId = 'Debe seleccionar un equipo';
    if (!formData.startDate) newErrors.startDate = 'La fecha de inicio es requerida';
    if (!formData.endDate) newErrors.endDate = 'La fecha de fin es requerida';
    if (formData.dailyRate <= 0) newErrors.dailyRate = 'La tarifa diaria debe ser mayor a 0';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const selectedEntity = formData.entityType === 'machinery' 
        ? machinery.find(m => m.id === formData.entityId)
        : vehicles.find(v => v.id === formData.entityId);

      const days = Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24));
      const baseAmount = days * formData.dailyRate;
      const operatorAmount = formData.operatorIncluded ? days * formData.operatorCost : 0;
      const totalAmount = baseAmount + operatorAmount + formData.transportCost;

      const rentalData = {
        ...formData,
        entityName: selectedEntity?.name || (selectedEntity as Vehicle)?.plate || '',
        machineryId: formData.entityType === 'machinery' ? formData.entityId : undefined,
        vehicleId: formData.entityType === 'vehicle' ? formData.entityId : undefined,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        totalAmount,
        status: 'cotizado' as const,
        paymentStatus: 'pendiente' as const,
        checkInPhotos: [],
        checkOutPhotos: [],
        workingHours: []
      };
      
      onSave(rentalData);
    }
  };

  const availableEntities = formData.entityType === 'machinery' 
    ? machinery.filter(m => m.status === 'disponible')
    : vehicles.filter(v => v.status === 'disponible');

  const calculateTotal = () => {
    if (!formData.startDate || !formData.endDate || formData.dailyRate <= 0) return 0;
    
    const days = Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24));
    const baseAmount = days * formData.dailyRate;
    const operatorAmount = formData.operatorIncluded ? days * formData.operatorCost : 0;
    return baseAmount + operatorAmount + formData.transportCost;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {rental ? 'Editar Alquiler' : 'Nuevo Alquiler'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Client Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Información del Cliente</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Cliente *
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.clientName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Empresa o persona"
                />
                {errors.clientName && <p className="text-red-600 text-sm mt-1">{errors.clientName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Persona de Contacto *
                </label>
                <input
                  type="text"
                  value={formData.clientContact}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientContact: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.clientContact ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Nombre del contacto"
                />
                {errors.clientContact && <p className="text-red-600 text-sm mt-1">{errors.clientContact}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@empresa.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+51 987654321"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.clientAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientAddress: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Dirección del cliente"
                />
              </div>
            </div>
          </div>

          {/* Equipment Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Selección de Equipo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Equipo *
                </label>
                <select
                  value={formData.entityType}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    entityType: e.target.value as 'machinery' | 'vehicle',
                    entityId: ''
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="machinery">Maquinaria</option>
                  <option value="vehicle">Vehículo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipo *
                </label>
                <select
                  value={formData.entityId}
                  onChange={(e) => setFormData(prev => ({ ...prev, entityId: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.entityId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar equipo</option>
                  {availableEntities.map(entity => (
                    <option key={entity.id} value={entity.id}>
                      {'name' in entity ? entity.name : `${entity.brand} ${entity.model} - ${entity.plate}`}
                    </option>
                  ))}
                </select>
                {errors.entityId && <p className="text-red-600 text-sm mt-1">{errors.entityId}</p>}
              </div>
            </div>
          </div>

          {/* Rental Period and Pricing */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Período y Tarifas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.startDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && <p className="text-red-600 text-sm mt-1">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Fin *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.endDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.endDate && <p className="text-red-600 text-sm mt-1">{errors.endDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarifa Diaria (S/) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.dailyRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dailyRate: parseFloat(e.target.value) || 0 }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.dailyRate ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.dailyRate && <p className="text-red-600 text-sm mt-1">{errors.dailyRate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Depósito (S/)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.deposit}
                  onChange={(e) => setFormData(prev => ({ ...prev, deposit: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Additional Services */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Servicios Adicionales</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.operatorIncluded}
                  onChange={(e) => setFormData(prev => ({ ...prev, operatorIncluded: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Incluir operador
                </label>
              </div>

              {formData.operatorIncluded && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Operador
                    </label>
                    <input
                      type="text"
                      value={formData.operatorName}
                      onChange={(e) => setFormData(prev => ({ ...prev, operatorName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nombre del operador"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Costo Diario Operador (S/)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.operatorCost}
                      onChange={(e) => setFormData(prev => ({ ...prev, operatorCost: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.fuelIncluded}
                  onChange={(e) => setFormData(prev => ({ ...prev, fuelIncluded: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Combustible incluido
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Costo de Transporte (S/)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.transportCost}
                  onChange={(e) => setFormData(prev => ({ ...prev, transportCost: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Description and Delivery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del Trabajo *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe el trabajo a realizar..."
              />
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Dirección de Entrega</span>
              </label>
              <textarea
                value={formData.deliveryAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Dirección donde se entregará el equipo..."
              />
            </div>
          </div>

          {/* Total Calculation */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Resumen de Costos</h4>
            <div className="space-y-2 text-sm">
              {formData.startDate && formData.endDate && (
                <div className="flex justify-between">
                  <span>Días de alquiler:</span>
                  <span>{Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))} días</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tarifa base:</span>
                <span>S/ {(formData.dailyRate * Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) || 0).toFixed(2)}</span>
              </div>
              {formData.operatorIncluded && (
                <div className="flex justify-between">
                  <span>Operador:</span>
                  <span>S/ {(formData.operatorCost * Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) || 0).toFixed(2)}</span>
                </div>
              )}
              {formData.transportCost > 0 && (
                <div className="flex justify-between">
                  <span>Transporte:</span>
                  <span>S/ {formData.transportCost.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-medium text-lg border-t pt-2">
                <span>Total:</span>
                <span>S/ {calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{rental ? 'Actualizar' : 'Crear'} Alquiler</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};