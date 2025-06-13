import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar, Filter, Search } from 'lucide-react';
import { FinancialRecord, ExpenseCategory } from '../../types';
import { FinanceForm } from '../Forms/FinanceForm';

// Mock data with Viático category
const mockFinancialRecords: FinancialRecord[] = [
  {
    id: '1',
    type: 'ingreso',
    category: 'Alquiler',
    subcategory: 'Excavadora',
    description: 'Alquiler Excavadora CAT 320D - Proyecto Lima Norte',
    amount: 2500,
    currency: 'PEN',
    date: new Date('2024-03-15'),
    status: 'pagado',
    relatedEntity: 'machinery',
    relatedEntityId: '1',
    createdAt: new Date('2024-03-15'),
    createdBy: 'admin'
  },
  {
    id: '2',
    type: 'egreso',
    category: 'Combustible',
    description: 'Carga de combustible - Excavadora CAT 320D',
    amount: 582,
    currency: 'PEN',
    date: new Date('2024-03-14'),
    status: 'pagado',
    relatedEntity: 'machinery',
    relatedEntityId: '1',
    createdAt: new Date('2024-03-14'),
    createdBy: 'admin'
  },
  {
    id: '3',
    type: 'egreso',
    category: 'Sueldos',
    subcategory: 'Operadores',
    description: 'Sueldo operador - Juan Pérez',
    amount: 1800,
    currency: 'PEN',
    date: new Date('2024-03-01'),
    status: 'pagado',
    isRecurring: true,
    createdAt: new Date('2024-03-01'),
    createdBy: 'admin'
  },
  {
    id: '4',
    type: 'egreso',
    category: 'Viático',
    subcategory: 'Alimentación',
    description: 'Viáticos para operador en obra - Proyecto Cañete',
    amount: 150,
    currency: 'PEN',
    date: new Date('2024-03-16'),
    status: 'pagado',
    createdAt: new Date('2024-03-16'),
    createdBy: 'admin'
  },
  {
    id: '5',
    type: 'egreso',
    category: 'Viático',
    subcategory: 'Transporte',
    description: 'Pasajes y movilidad para técnico',
    amount: 80,
    currency: 'PEN',
    date: new Date('2024-03-15'),
    status: 'pagado',
    createdAt: new Date('2024-03-15'),
    createdBy: 'admin'
  }
];

const expenseCategories: ExpenseCategory[] = [
  {
    id: '1',
    name: 'Sueldos',
    type: 'fijo',
    subcategories: ['Operadores', 'Administrativos', 'Mecánicos'],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    createdBy: 'admin'
  },
  {
    id: '2',
    name: 'Combustible',
    type: 'variable',
    subcategories: ['Diesel', 'Gasolina'],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    createdBy: 'admin'
  },
  {
    id: '3',
    name: 'Mantenimiento',
    type: 'variable',
    subcategories: ['Preventivo', 'Correctivo', 'Repuestos'],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    createdBy: 'admin'
  },
  {
    id: '4',
    name: 'Servicios',
    type: 'fijo',
    subcategories: ['Agua', 'Luz', 'Internet', 'Teléfono'],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    createdBy: 'admin'
  },
  {
    id: '5',
    name: 'Reparaciones Urgentes',
    type: 'inesperado',
    subcategories: ['Accidentes', 'Averías', 'Multas'],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    createdBy: 'admin'
  },
  {
    id: '6',
    name: 'Viático',
    type: 'variable',
    subcategories: ['Alimentación', 'Hospedaje', 'Transporte', 'Otros gastos'],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    createdBy: 'admin'
  }
];

export const FinanceManagement: React.FC = () => {
  const [records] = useState<FinancialRecord[]>(mockFinancialRecords);
  const [showForm, setShowForm] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records.filter(record => {
    const matchesType = typeFilter === 'all' || record.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || record.category === categoryFilter;
    const matchesSearch = record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesCategory && matchesSearch;
  });

  const totalIncome = records.filter(r => r.type === 'ingreso').reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses = records.filter(r => r.type === 'egreso').reduce((sum, r) => sum + r.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  const handleSave = (financeData: Partial<FinancialRecord>) => {
    console.log('Saving financial record:', financeData);
    setShowForm(false);
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(records.map(r => r.category))];
    return categories;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión Financiera</h1>
          <p className="text-gray-600 mt-1">Control de ingresos, gastos y rentabilidad - {new Date().toLocaleDateString()}</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Registro</span>
        </button>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-green-600 mt-1">S/ {totalIncome.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gastos Totales</p>
              <p className="text-2xl font-bold text-red-600 mt-1">S/ {totalExpenses.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ganancia Neta</p>
              <p className={`text-2xl font-bold mt-1 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                S/ {netProfit.toLocaleString()}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <DollarSign className={`w-6 h-6 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Margen de Ganancia</p>
              <p className={`text-2xl font-bold mt-1 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : '0.0'}%
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <TrendingUp className={`w-6 h-6 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Expense Categories Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gastos por Categoría</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {expenseCategories.map(category => {
            const categoryExpenses = records
              .filter(r => r.type === 'egreso' && r.category === category.name)
              .reduce((sum, r) => sum + r.amount, 0);
            
            const typeColors = {
              fijo: 'bg-blue-50 text-blue-700 border-blue-200',
              variable: 'bg-yellow-50 text-yellow-700 border-yellow-200',
              inesperado: 'bg-red-50 text-red-700 border-red-200'
            };
            
            return (
              <div key={category.id} className={`border rounded-lg p-4 ${typeColors[category.type]}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{category.name}</h4>
                  <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
                    {category.type}
                  </span>
                </div>
                <p className="text-2xl font-bold">S/ {categoryExpenses.toLocaleString()}</p>
                <p className="text-sm opacity-75 mt-1">
                  {category.subcategories.length} subcategorías
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por descripción o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los tipos</option>
              <option value="ingreso">Ingresos</option>
              <option value="egreso">Gastos</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas las categorías</option>
              {getUniqueCategories().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recurrente
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{record.date.toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      record.type === 'ingreso' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {record.type === 'ingreso' ? 'Ingreso' : 'Gasto'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{record.category}</div>
                      {record.subcategory && (
                        <div className="text-gray-500 text-xs">{record.subcategory}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {record.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={record.type === 'ingreso' ? 'text-green-600' : 'text-red-600'}>
                      {record.type === 'ingreso' ? '+' : '-'}S/ {record.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      record.status === 'pagado' ? 'bg-green-100 text-green-800' :
                      record.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {record.status === 'pagado' ? 'Pagado' :
                       record.status === 'pendiente' ? 'Pendiente' : 'Vencido'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.isRecurring ? (
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        Recurrente
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay registros financieros</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || typeFilter !== 'all' || categoryFilter !== 'all'
                ? 'No se encontraron registros con los filtros seleccionados'
                : 'Comienza registrando tu primer movimiento financiero'}
            </p>
            {!searchTerm && typeFilter === 'all' && categoryFilter === 'all' && (
              <button 
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Registrar Primer Movimiento
              </button>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <FinanceForm
          expenseCategories={expenseCategories}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};