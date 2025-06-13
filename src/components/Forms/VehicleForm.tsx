import React, { useState } from 'react';
import { X, Upload, FileText, Save, Calendar } from 'lucide-react';
import { Vehicle, Warehouse, VehicleDocument } from '../../types';

interface VehicleFormProps {
  vehicle?: Vehicle;
  warehouses: Warehouse[];
  onSave: (vehicle: Partial<Vehicle>) => void;
  onCancel: () => void;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  vehicle,
  warehouses,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    plate: vehicle?.plate || '',
    brand: vehicle?.brand || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    mileage: vehicle?.mileage || 0,
    status: vehicle?.status || 'disponible' as const,
    soatExpiration: vehicle?.soatExpiration ? vehicle.soatExpiration.toISOString().split('T')[0] : '',
    technicalReviewExpiration: vehicle?.technicalReviewExpiration ? vehicle.technicalReviewExpiration.toISOString().split('T')[0] : '',
    warehouseId: vehicle?.warehouseId || '',
    documents: vehicle?.documents || []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const statuses = [
    { value: 'disponible', label: 'Disponible' },
    { value: 'alquilado', label: 'Alquilado' },
    { value: 'mantenimiento', label: 'Mantenimiento' },
    { value: 'fuera_servicio', label: 'Fuera de Servicio' }
  ];

  const documentTypes = [
    { value: 'soat', label: 'SOAT' },
    { value: 'revision_tecnica', label: 'Revisión Técnica' },
    { value: 'tarjeta_propiedad', label: 'Tarjeta de Propiedad' },
    { value: 'otros', label: 'Otros' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.plate.trim()) newErrors.plate = 'La placa es requerida';
    if (!formData.brand.trim()) newErrors.brand = 'La marca es requerida';
    if (!formData.model.trim()) newErrors.model = 'El modelo es requerido';
    if (!formData.warehouseId) newErrors.warehouseId = 'El almacén es requerido';
    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Año inválido';
    }
    if (!formData.soatExpiration) newErrors.soatExpiration = 'La fecha de vencimiento del SOAT es requerida';
    if (!formData.technicalReviewExpiration) newErrors.technicalReviewExpiration = 'La fecha de vencimiento de la revisión técnica es requerida';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const vehicleData = {
        ...formData,
        soatExpiration: new Date(formData.soatExpiration),
        technicalReviewExpiration: new Date(formData.technicalReviewExpiration)
      };
      onSave(vehicleData);
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      // Simulate document upload - in real app, upload to server
      const newDocument: VehicleDocument = {
        id: Date.now().toString(),
        type: type as any,
        name: file.name,
        url: URL.createObjectURL(file),
        uploadedAt: new Date()
      };
      
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, newDocument]
      }));
    }
  };

  const removeDocument = (documentId: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== documentId)
    }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const isDateExpiringSoon = (dateString: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  const isDateExpired = (dateString: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return date < today;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {vehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}
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
                Placa *
              </label>
              <input
                type="text"
                value={formData.plate}
                onChange={(e) => setFormData(prev => ({ ...prev, plate: e.target.value.toUpperCase() }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.plate ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: ABC-123"
              />
              {errors.plate && <p className="text-red-600 text-sm mt-1">{errors.plate}</p>}
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
                placeholder="Ej: Toyota"
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
                placeholder="Ej: Hilux"
              />
              {errors.model && <p className="text-red-600 text-sm mt-1">{errors.model}</p>}
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
                Kilometraje Actual
              </label>
              <input
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData(prev => ({ ...prev, mileage: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
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
                Vencimiento SOAT *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.soatExpiration}
                  onChange={(e) => setFormData(prev => ({ ...prev, soatExpiration: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.soatExpiration ? 'border-red-300' : 
                    isDateExpired(formData.soatExpiration) ? 'border-red-300 bg-red-50' :
                    isDateExpiringSoon(formData.soatExpiration) ? 'border-yellow-300 bg-yellow-50' :
                    'border-gray-300'
                  }`}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
              {errors.soatExpiration && <p className="text-red-600 text-sm mt-1">{errors.soatExpiration}</p>}
              {isDateExpired(formData.soatExpiration) && (
                <p className="text-red-600 text-sm mt-1">⚠️ SOAT vencido</p>
              )}
              {isDateExpiringSoon(formData.soatExpiration) && !isDateExpired(formData.soatExpiration) && (
                <p className="text-yellow-600 text-sm mt-1">⚠️ SOAT próximo a vencer</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vencimiento Revisión Técnica *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.technicalReviewExpiration}
                  onChange={(e) => setFormData(prev => ({ ...prev, technicalReviewExpiration: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.technicalReviewExpiration ? 'border-red-300' : 
                    isDateExpired(formData.technicalReviewExpiration) ? 'border-red-300 bg-red-50' :
                    isDateExpiringSoon(formData.technicalReviewExpiration) ? 'border-yellow-300 bg-yellow-50' :
                    'border-gray-300'
                  }`}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
              {errors.technicalReviewExpiration && <p className="text-red-600 text-sm mt-1">{errors.technicalReviewExpiration}</p>}
              {isDateExpired(formData.technicalReviewExpiration) && (
                <p className="text-red-600 text-sm mt-1">⚠️ Revisión técnica vencida</p>
              )}
              {isDateExpiringSoon(formData.technicalReviewExpiration) && !isDateExpired(formData.technicalReviewExpiration) && (
                <p className="text-yellow-600 text-sm mt-1">⚠️ Revisión técnica próxima a vencer</p>
              )}
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
          </div>

          {/* Documents Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Documentos
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {documentTypes.map(docType => (
                <div key={docType.value} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{docType.label}</h4>
                    <label className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1">
                      <Upload className="w-3 h-3" />
                      <span>Subir</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleDocumentUpload(e, docType.value)}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.documents
                      .filter(doc => doc.type === docType.value)
                      .map(doc => (
                        <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700 truncate">{doc.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDocument(doc.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
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
              <span>{vehicle ? 'Actualizar' : 'Guardar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};