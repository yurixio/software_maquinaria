import React, { useState } from 'react';
import { X, Save, Package, Plus, Minus } from 'lucide-react';
import { SparePart, Warehouse, Machinery } from '../../types';

interface SparePartFormProps {
  sparePart?: SparePart;
  warehouses: Warehouse[];
  machinery: Machinery[];
  onSave: (sparePart: Partial<SparePart>) => void;
  onCancel: () => void;
}

export const SparePartForm: React.FC<SparePartFormProps> = ({
  sparePart,
  warehouses,
  machinery,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: sparePart?.name || '',
    code: sparePart?.code || '',
    brand: sparePart?.brand || '',
    unitPrice: sparePart?.unitPrice || 0,
    minStock: sparePart?.minStock || 5,
    stockByWarehouse: sparePart?.stockByWarehouse || {},
    compatibleMachinery: sparePart?.compatibleMachinery || [],
    suppliers: sparePart?.suppliers || ['']
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.code.trim()) newErrors.code = 'El código es requerido';
    if (!formData.brand.trim()) newErrors.brand = 'La marca es requerida';
    if (formData.unitPrice <= 0) newErrors.unitPrice = 'El precio debe ser mayor a 0';
    if (formData.minStock < 0) newErrors.minStock = 'El stock mínimo no puede ser negativo';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const cleanSuppliers = formData.suppliers.filter(s => s.trim() !== '');
      onSave({
        ...formData,
        suppliers: cleanSuppliers
      });
    }
  };

  const handleStockChange = (warehouseId: string, stock: number) => {
    setFormData(prev => ({
      ...prev,
      stockByWarehouse: {
        ...prev.stockByWarehouse,
        [warehouseId]: Math.max(0, stock)
      }
    }));
  };

  const handleMachineryToggle = (machineryId: string) => {
    setFormData(prev => ({
      ...prev,
      compatibleMachinery: prev.compatibleMachinery.includes(machineryId)
        ? prev.compatibleMachinery.filter(id => id !== machineryId)
        : [...prev.compatibleMachinery, machineryId]
    }));
  };

  const addSupplier = () => {
    setFormData(prev => ({
      ...prev,
      suppliers: [...prev.suppliers, '']
    }));
  };

  const removeSupplier = (index: number) => {
    setFormData(prev => ({
      ...prev,
      suppliers: prev.suppliers.filter((_, i) => i !== index)
    }));
  };

  const updateSupplier = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      suppliers: prev.suppliers.map((supplier, i) => i === index ? value : supplier)
    }));
  };

  const getTotalStock = () => {
    return Object.values(formData.stockByWarehouse).reduce((sum, stock) => sum + stock, 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {sparePart ? 'Editar Repuesto' : 'Nuevo Repuesto'}
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
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Repuesto *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: Filtro de Aceite Hidráulico"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.code ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: FLT-HID-001"
              />
              {errors.code && <p className="text-red-600 text-sm mt-1">{errors.code}</p>}
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
                Precio Unitario (S/) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.unitPrice ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.unitPrice && <p className="text-red-600 text-sm mt-1">{errors.unitPrice}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Mínimo
              </label>
              <input
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData(prev => ({ ...prev, minStock: parseInt(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.minStock ? 'border-red-300' : 'border-gray-300'
                }`}
                min="0"
              />
              {errors.minStock && <p className="text-red-600 text-sm mt-1">{errors.minStock}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Total Actual
              </label>
              <input
                type="text"
                value={`${getTotalStock()} unidades`}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
            </div>
          </div>

          {/* Stock by Warehouse */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Stock por Almacén
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {warehouses.map(warehouse => (
                <div key={warehouse.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{warehouse.name}</h4>
                    <span className="text-sm text-gray-500">{warehouse.city}</span>
                  </div>
                  <input
                    type="number"
                    value={formData.stockByWarehouse[warehouse.id] || 0}
                    onChange={(e) => handleStockChange(warehouse.id, parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Compatible Machinery */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Maquinaria Compatible
            </label>
            <div className="border border-gray-200 rounded-lg p-4 max-h-48 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {machinery.map(machine => (
                  <label key={machine.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.compatibleMachinery.includes(machine.id)}
                      onChange={() => handleMachineryToggle(machine.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{machine.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {formData.compatibleMachinery.length} máquinas seleccionadas
            </p>
          </div>

          {/* Suppliers */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Proveedores
              </label>
              <button
                type="button"
                onClick={addSupplier}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Proveedor</span>
              </button>
            </div>
            <div className="space-y-2">
              {formData.suppliers.map((supplier, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={supplier}
                    onChange={(e) => updateSupplier(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nombre del proveedor"
                  />
                  {formData.suppliers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSupplier(index)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
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
              <span>{sparePart ? 'Actualizar' : 'Guardar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};