import React, { useState } from 'react';
import { X, Upload, Camera, Save } from 'lucide-react';
import { Machinery, Warehouse } from '../../types';

interface MachineryFormProps {
  machinery?: Machinery;
  warehouses: Warehouse[];
  onSave: (machinery: Partial<Machinery>) => void;
  onCancel: () => void;
}

export const MachineryForm: React.FC<MachineryFormProps> = ({
  machinery,
  warehouses,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: machinery?.name || '',
    category: machinery?.category || '',
    brand: machinery?.brand || '',
    model: machinery?.model || '',
    serialNumber: machinery?.serialNumber || '',
    year: machinery?.year || new Date().getFullYear(),
    hourmeter: machinery?.hourmeter || 0,
    condition: machinery?.condition || 'bueno' as const,
    status: machinery?.status || 'disponible' as const,
    warehouseId: machinery?.warehouseId || '',
    maintenanceIntervalHours: machinery?.maintenanceIntervalHours || 250,
    maintenanceIntervalDays: machinery?.maintenanceIntervalDays || 90,
    images: machinery?.images || []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Excavadora',
    'Retroexcavadora',
    'Cargador Frontal',
    'Volquete',
    'Grúa',
    'Compactadora',
    'Motoniveladora',
    'Bulldozer',
    'Otros'
  ];

  const conditions = [
    { value: 'excelente', label: 'Excelente' },
    { value: 'bueno', label: 'Bueno' },
    { value: 'regular', label: 'Regular' },
    { value: 'malo', label: 'Malo' }
  ];

  const statuses = [
    { value: 'disponible', label: 'Disponible' },
    { value: 'alquilado', label: 'Alquilado' },
    { value: 'mantenimiento', label: 'Mantenimiento' },
    { value: 'fuera_servicio', label: 'Fuera de Servicio' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.category) newErrors.category = 'La categoría es requerida';
    if (!formData.brand.trim()) newErrors.brand = 'La marca es requerida';
    if (!formData.model.trim()) newErrors.model = 'El modelo es requerido';
    if (!formData.serialNumber.trim()) newErrors.serialNumber = 'El número de serie es requerido';
    if (!formData.warehouseId) newErrors.warehouseId = 'El almacén es requerido';
    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Año inválido';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Simulate image upload - in real app, upload to server
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {machinery ? 'Editar Maquinaria' : 'Nueva Maquinaria'}
          </h2>
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
                Nombre *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: Excavadora CAT 320D"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca *
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.brand ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: Caterpillar"
              />
              {errors.brand && <p className="text-red-600 text-sm mt-1">{errors.brand}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modelo *
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.model ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: 320D"
              />
              {errors.model && <p className="text-red-600 text-sm mt-1">{errors.model}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Serie *
              </label>
              <input
                type="text"
                value={formData.serialNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.serialNumber ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: CAT320D001"
              />
              {errors.serialNumber && <p className="text-red-600 text-sm mt-1">{errors.serialNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año *
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.year ? 'border-red-300' : 'border-gray-300'
                }`}
                min="1900"
                max={new Date().getFullYear() + 1}
              />
              {errors.year && <p className="text-red-600 text-sm mt-1">{errors.year}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horómetro (horas)
              </label>
              <input
                type="number"
                value={formData.hourmeter}
                onChange={(e) => setFormData(prev => ({ ...prev, hourmeter: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condición
              </label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {conditions.map(condition => (
                  <option key={condition.value} value={condition.value}>
                    {condition.label}
                  </option>
                ))}
              </select>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intervalo Mantenimiento (horas)
              </label>
              <input
                type="number"
                value={formData.maintenanceIntervalHours}
                onChange={(e) => setFormData(prev => ({ ...prev, maintenanceIntervalHours: parseInt(e.target.value) || 250 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intervalo Mantenimiento (días)
              </label>
              <input
                type="number"
                value={formData.maintenanceIntervalDays}
                onChange={(e) => setFormData(prev => ({ ...prev, maintenanceIntervalDays: parseInt(e.target.value) || 90 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fotografías
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="flex justify-center">
                  <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Subir Fotos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  PNG, JPG hasta 10MB cada una
                </p>
              </div>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
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
              <span>{machinery ? 'Actualizar' : 'Guardar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};