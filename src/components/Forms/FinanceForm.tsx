import React, { useState } from 'react';
import { X, Save, DollarSign, Calendar } from 'lucide-react';
import { FinancialRecord, ExpenseCategory } from '../../types';

interface FinanceFormProps {
  expenseCategories: ExpenseCategory[];
  onSave: (record: Partial<FinancialRecord>) => void;
  onCancel: () => void;
}

export const FinanceForm: React.FC<FinanceFormProps> = ({
  expenseCategories,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    type: 'egreso' as 'ingreso' | 'egreso',
    category: '',
    subcategory: '',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    isRecurring: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const incomeCategories = [
    'Alquiler',
    'Transporte',
    'Operador',
    'Servicios Adicionales',
    'Otros Ingresos'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.category) newErrors.category = 'La categoría es requerida';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (formData.amount <= 0) newErrors.amount = 'El monto debe ser mayor a 0';
    if (!formData.date) newErrors.date = 'La fecha es requerida';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave({
        ...formData,
        date: new Date(formData.date)
      });
    }
  };

  const selectedCategory = expenseCategories.find(cat => cat.name === formData.category);
  const availableSubcategories = formData.type === 'egreso' 
    ? selectedCategory?.subcategories || []
    : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Nuevo Registro Financiero
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
                Tipo de Movimiento *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  type: e.target.value as 'ingreso' | 'egreso',
                  category: '', // Reset category when type changes
                  subcategory: ''
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="egreso">Gasto</option>
                <option value="ingreso">Ingreso</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
              {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  category: e.target.value,
                  subcategory: '' // Reset subcategory when category changes
                }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar categoría</option>
                {formData.type === 'ingreso' 
                  ? incomeCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))
                  : expenseCategories.map(cat => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name} ({cat.type})
                      </option>
                    ))
                }
              </select>
              {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
            </div>

            {availableSubcategories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategoría
                </label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar subcategoría</option>
                  {availableSubcategories.map(subcat => (
                    <option key={subcat} value={subcat}>{subcat}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monto (S/) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.amount ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe el motivo del ingreso o gasto..."
              />
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Es un movimiento recurrente (se repite mensualmente)
                </span>
              </label>
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
              <span>Registrar Movimiento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};