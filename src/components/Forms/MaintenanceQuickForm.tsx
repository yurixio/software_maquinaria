import React, { useState } from 'react';
import { X, Save, Wrench, Calendar, DollarSign } from 'lucide-react';
import { useData } from '../../hooks/useData';
import { useForm } from '../../hooks/useForm';

interface MaintenanceQuickFormProps {
  onSave: (maintenanceData: any) => void;
  onCancel: () => void;
}

export const MaintenanceQuickForm: React.FC<MaintenanceQuickFormProps> = ({
  onSave,
  onCancel
}) => {
  const { machinery, vehicles } = useData();
  const [entityType, setEntityType] = useState<'machinery' | 'vehicle'>('machinery');

  const {
    data,
    errors,
    setValue,
    handleSubmit,
    submitError
  } = useForm({
    initialData: {
      entityId: '',
      type: 'preventivo' as 'preventivo' | 'correctivo',
      description: '',
      technicianName: '',
      laborHours: 1,
      laborCost: 0,
      spareParts: [] as any[],
      totalCost: 0,
      scheduledDate: new Date().toISOString().split('T')[0]
    },
    validationSchema: {
      entityId: { required: true },
      description: { required: true, minLength: 10 },
      technicianName: { required: true, minLength: 2 },
      laborHours: { required: true, min: 0.5 },
      laborCost: { required: true, min: 0 },
      scheduledDate: { required: true }
    },
    onSubmit: async (formData) => {
      const selectedEntity = entityType === 'machinery' 
        ? machinery.find(m => m.id === formData.entityId)
        : vehicles.find(v => v.id === formData.entityId);

      const maintenanceData = {
        ...formData,
        entityType,
        entityName: selectedEntity?.name || selectedEntity?.plate || '',
        date: new Date(formData.scheduledDate),
        totalCost: formData.laborCost,
        status: 'programado',
        createdAt: new Date(),
        createdBy: 'current-user'
      };

      onSave(maintenanceData);
    }
  });

  const availableEntities = entityType === 'machinery' ? machinery : vehicles;

  const handleEntityTypeChange = (type: 'machinery' | 'vehicle') => {
    setEntityType(type);
    setValue('entityId', '');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Registro Rápido de Mantenimiento
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
                Tipo de Equipo *
              </label>
              <select
                value={entityType}
                onChange={(e) => handleEntityTypeChange(e.target.value as 'machinery' | 'vehicle')}
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
                value={data.entityId}
                onChange={(e) => setValue('entityId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.entityId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar {entityType === 'machinery' ? 'maquinaria' : 'vehículo'}</option>
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
                Tipo de Mantenimiento *
              </label>
              <select
                value={data.type}
                onChange={(e) => setValue('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="preventivo">Preventivo</option>
                <option value="correctivo">Correctivo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Programada *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={data.scheduledDate}
                  onChange={(e) => setValue('scheduledDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.scheduledDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
              {errors.scheduledDate && <p className="text-red-600 text-sm mt-1">{errors.scheduledDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Técnico Responsable *
              </label>
              <input
                type="text"
                value={data.technicianName}
                onChange={(e) => setValue('technicianName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.technicianName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nombre del técnico"
              />
              {errors.technicianName && <p className="text-red-600 text-sm mt-1">{errors.technicianName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horas de Trabajo *
              </label>
              <input
                type="number"
                step="0.5"
                value={data.laborHours}
                onChange={(e) => setValue('laborHours', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.laborHours ? 'border-red-300' : 'border-gray-300'
                }`}
                min="0.5"
              />
              {errors.laborHours && <p className="text-red-600 text-sm mt-1">{errors.laborHours}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Costo de Mano de Obra (S/) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={data.laborCost}
                  onChange={(e) => setValue('laborCost', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 pl-8 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.laborCost ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              {errors.laborCost && <p className="text-red-600 text-sm mt-1">{errors.laborCost}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del Trabajo *
              </label>
              <textarea
                value={data.description}
                onChange={(e) => setValue('description', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe el trabajo de mantenimiento a realizar..."
              />
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Cost Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Resumen de Costos</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Mano de obra ({data.laborHours}h):</span>
                <span>S/ {data.laborCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-lg border-t pt-2">
                <span>Total:</span>
                <span>S/ {data.laborCost.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              * Este costo se agregará automáticamente a la categoría "Mantenimiento" en Finanzas
            </p>
          </div>

          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

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
              <span>Registrar Mantenimiento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};