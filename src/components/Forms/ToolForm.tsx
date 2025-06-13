import React, { useState } from 'react';
import { X, Save, Wrench } from 'lucide-react';
import { Tool, Warehouse } from '../../types';

interface ToolFormProps {
  tool?: Tool;
  warehouses: Warehouse[];
  onSave: (tool: Partial<Tool>) => void;
  onCancel: () => void;
}

export const ToolForm: React.FC<ToolFormProps> = ({
  tool,
  warehouses,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: tool?.name || '',
    internalCode: tool?.internalCode || '',
    status: tool?.status || 'disponible' as const,
    observations: tool?.observations || '',
    warehouseId: tool?.warehouseId || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const statuses = [
    { value: 'disponible', label: 'Disponible' },
    { value: 'no_disponible', label: 'No Disponible' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.internalCode.trim()) newErrors.internalCode = 'El código interno es requerido';
    if (!formData.warehouseId) newErrors.warehouseId = 'El almacén es requerido';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {tool ? 'Editar Herramienta' : 'Nueva Herramienta'}
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
                Nombre de la Herramienta *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: Taladro Percutor Bosch"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código Interno *
              </label>
              <input
                type="text"
                value={formData.internalCode}
                onChange={(e) => setFormData(prev => ({ ...prev, internalCode: e.target.value.toUpperCase() }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.internalCode ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: TAL-001"
              />
              {errors.internalCode && <p className="text-red-600 text-sm mt-1">{errors.internalCode}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Almacén *
              </label>
              <select
                value={formData.warehouseId}
                onChange={(e) => setFormData(prev => ({ ...prev, warehouseId: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.warehouseId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar almacén</option>
                {warehouses.map(warehouse => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
              {errors.warehouseId && <p className="text-red-600 text-sm mt-1">{errors.warehouseId}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones
              </label>
              <textarea
                value={formData.observations}
                onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Observaciones adicionales sobre la herramienta..."
              />
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
              <span>{tool ? 'Actualizar' : 'Guardar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};