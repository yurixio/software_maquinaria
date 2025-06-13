import React, { useState } from 'react';
import { X, Save, Calendar, Settings, AlertTriangle } from 'lucide-react';
import { useData } from '../../hooks/useData';
import { useForm } from '../../hooks/useForm';

interface MaintenanceScheduleFormProps {
  onSave: (scheduleData: any) => void;
  onCancel: () => void;
}

export const MaintenanceScheduleForm: React.FC<MaintenanceScheduleFormProps> = ({
  onSave,
  onCancel
}) => {
  const { machinery, vehicles } = useData();
  const [entityType, setEntityType] = useState<'machinery' | 'vehicle'>('machinery');

  const serviceTypes = [
    'Mantenimiento Preventivo General',
    'Cambio de Aceite Motor',
    'Cambio de Filtros',
    'Revisión Sistema Hidráulico',
    'Revisión Sistema Eléctrico',
    'Inspección de Frenos',
    'Revisión de Transmisión',
    'Calibración de Sistemas',
    'Limpieza General',
    'Otros'
  ];

  const {
    data,
    errors,
    setValue,
    handleSubmit,
    submitError
  } = useForm({
    initialData: {
      entityId: '',
      serviceType: '',
      customServiceType: '',
      scheduledDate: '',
      estimatedDuration: 4,
      priority: 'media' as 'baja' | 'media' | 'alta',
      technicianName: '',
      notes: '',
      reminderDays: 3
    },
    validationSchema: {
      entityId: { required: true },
      serviceType: { required: true },
      scheduledDate: { required: true },
      estimatedDuration: { required: true, min: 0.5 },
      technicianName: { required: true, minLength: 2 },
      reminderDays: { required: true, min: 1, max: 30 }
    },
    onSubmit: async (formData) => {
      const selectedEntity = entityType === 'machinery' 
        ? machinery.find(m => m.id === formData.entityId)
        : vehicles.find(v => v.id === formData.entityId);

      const scheduleData = {
        ...formData,
        entityType,
        entityName: selectedEntity?.name || selectedEntity?.plate || '',
        serviceType: formData.serviceType === 'Otros' ? formData.customServiceType : formData.serviceType,
        scheduledDate: new Date(formData.scheduledDate),
        status: 'programado',
        createdAt: new Date(),
        createdBy: 'current-user'
      };

      onSave(scheduleData);
    }
  });

  const availableEntities = entityType === 'machinery' ? machinery : vehicles;

  const handleEntityTypeChange = (type: 'machinery' | 'vehicle') => {
    setEntityType(type);
    setValue('entityId', '');
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      baja: 'bg-green-100 text-green-800',
      media: 'bg-yellow-100 text-yellow-800',
      alta: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Programar Servicio de Mantenimiento
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
                Tipo de Servicio *
              </label>
              <select
                value={data.serviceType}
                onChange={(e) => setValue('serviceType', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.serviceType ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar tipo de servicio</option>
                {serviceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.serviceType && <p className="text-red-600 text-sm mt-1">{errors.serviceType}</p>}
            </div>

            {data.serviceType === 'Otros' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Especificar Servicio *
                </label>
                <input
                  type="text"
                  value={data.customServiceType}
                  onChange={(e) => setValue('customServiceType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe el tipo de servicio"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Programada *
              </label>
              <input
                type="date"
                value={data.scheduledDate}
                onChange={(e) => setValue('scheduledDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.scheduledDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.scheduledDate && <p className="text-red-600 text-sm mt-1">{errors.scheduledDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración Estimada (horas) *
              </label>
              <input
                type="number"
                step="0.5"
                value={data.estimatedDuration}
                onChange={(e) => setValue('estimatedDuration', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.estimatedDuration ? 'border-red-300' : 'border-gray-300'
                }`}
                min="0.5"
              />
              {errors.estimatedDuration && <p className="text-red-600 text-sm mt-1">{errors.estimatedDuration}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad
              </label>
              <select
                value={data.priority}
                onChange={(e) => setValue('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
              <div className="mt-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(data.priority)}`}>
                  Prioridad {data.priority.charAt(0).toUpperCase() + data.priority.slice(1)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Técnico Asignado *
              </label>
              <input
                type="text"
                value={data.technicianName}
                onChange={(e) => setValue('technicianName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.technicianName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nombre del técnico responsable"
              />
              {errors.technicianName && <p className="text-red-600 text-sm mt-1">{errors.technicianName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recordatorio (días antes) *
              </label>
              <input
                type="number"
                value={data.reminderDays}
                onChange={(e) => setValue('reminderDays', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.reminderDays ? 'border-red-300' : 'border-gray-300'
                }`}
                min="1"
                max="30"
              />
              {errors.reminderDays && <p className="text-red-600 text-sm mt-1">{errors.reminderDays}</p>}
              <p className="text-xs text-gray-500 mt-1">
                Se creará una alerta {data.reminderDays} días antes de la fecha programada
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas Adicionales
              </label>
              <textarea
                value={data.notes}
                onChange={(e) => setValue('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Instrucciones especiales, repuestos necesarios, etc..."
              />
            </div>
          </div>

          {/* Alert Preview */}
          {data.scheduledDate && data.reminderDays && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">
                    Alerta Automática
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Se creará una alerta recordatorio el{' '}
                    {new Date(new Date(data.scheduledDate).getTime() - data.reminderDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    {' '}para recordar el mantenimiento programado.
                  </p>
                </div>
              </div>
            </div>
          )}

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
              <span>Programar Servicio</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};