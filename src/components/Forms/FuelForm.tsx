import React, { useState } from 'react';
import { X, Save, Fuel } from 'lucide-react';
import { FuelRecord, Machinery, Vehicle } from '../../types';

interface FuelFormProps {
  machinery: Machinery[];
  vehicles: Vehicle[];
  onSave: (fuelRecord: Partial<FuelRecord>) => void;
  onCancel: () => void;
}

export const FuelForm: React.FC<FuelFormProps> = ({
  machinery,
  vehicles,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    entityType: 'machinery' as 'machinery' | 'vehicle',
    entityId: '',
    date: new Date().toISOString().split('T')[0],
    liters: 0,
    unitCost: 0,
    location: '',
    odometer: 0,
    hourmeter: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.entityId) newErrors.entityId = 'Debe seleccionar una máquina o vehículo';
    if (!formData.date) newErrors.date = 'La fecha es requerida';
    if (formData.liters <= 0) newErrors.liters = 'Los litros deben ser mayor a 0';
    if (formData.unitCost <= 0) newErrors.unitCost = 'El costo unitario debe ser mayor a 0';
    if (!formData.location.trim()) newErrors.location = 'La ubicación es requerida';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const selectedEntity = formData.entityType === 'machinery' 
        ? machinery.find(m => m.id === formData.entityId)
        : vehicles.find(v => v.id === formData.entityId);

      const fuelRecord = {
        ...formData,
        entityName: selectedEntity?.name || selectedEntity?.plate || '',
        totalCost: formData.liters * formData.unitCost,
        date: new Date(formData.date),
        odometer: formData.entityType === 'vehicle' ? formData.odometer : undefined,
        hourmeter: formData.entityType === 'machinery' ? formData.hourmeter : undefined
      };
      
      onSave(fuelRecord);
    }
  };

  const availableEntities = formData.entityType === 'machinery' ? machinery : vehicles;
  const selectedEntity = availableEntities.find(e => e.id === formData.entityId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Fuel className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Registro de Combustible
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo *
              </label>
              <select
                value={formData.entityType}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  entityType: e.target.value as 'machinery' | 'vehicle',
                  entityId: '' // Reset selection when type changes
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="machinery">Maquinaria</option>
                <option value="vehicle">Vehículo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.entityType === 'machinery' ? 'Maquinaria' : 'Vehículo'} *
              </label>
              <select
                value={formData.entityId}
                onChange={(e) => setFormData(prev => ({ ...prev, entityId: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.entityId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar {formData.entityType === 'machinery' ? 'maquinaria' : 'vehículo'}</option>
                {availableEntities.map(entity => (
                  <option key={entity.id} value={entity.id}>
                    {'name' in entity ? entity.name : `${entity.brand} ${entity.model} - ${entity.plate}`}
                  </option>
                ))}
              </select>
              {errors.entityId && <p className="text-red-600 text-sm mt-1">{errors.entityId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.date ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Litros *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.liters}
                onChange={(e) => setFormData(prev => ({ ...prev, liters: parseFloat(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.liters ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.liters && <p className="text-red-600 text-sm mt-1">{errors.liters}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Costo por Litro (S/) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.unitCost}
                onChange={(e) => setFormData(prev => ({ ...prev, unitCost: parseFloat(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.unitCost ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.unitCost && <p className="text-red-600 text-sm mt-1">{errors.unitCost}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Costo Total (S/)
              </label>
              <input
                type="text"
                value={`S/ ${(formData.liters * formData.unitCost).toFixed(2)}`}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lugar de Carga *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.location ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: Grifo Petroperú - Av. Principal"
              />
              {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
            </div>

            {formData.entityType === 'vehicle' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kilometraje Actual
                </label>
                <input
                  type="number"
                  value={formData.odometer}
                  onChange={(e) => setFormData(prev => ({ ...prev, odometer: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
                {selectedEntity && 'mileage' in selectedEntity && (
                  <p className="text-sm text-gray-500 mt-1">
                    Último registro: {selectedEntity.mileage.toLocaleString()} km
                  </p>
                )}
              </div>
            )}

            {formData.entityType === 'machinery' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horómetro Actual
                </label>
                <input
                  type="number"
                  value={formData.hourmeter}
                  onChange={(e) => setFormData(prev => ({ ...prev, hourmeter: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
                {selectedEntity && 'hourmeter' in selectedEntity && (
                  <p className="text-sm text-gray-500 mt-1">
                    Último registro: {selectedEntity.hourmeter.toLocaleString()} hrs
                  </p>
                )}
              </div>
            )}
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
              <span>Registrar Carga</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};