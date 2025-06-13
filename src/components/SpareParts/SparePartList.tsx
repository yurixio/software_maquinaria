import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, Edit, Package, AlertTriangle, Truck } from 'lucide-react';
import { SparePart } from '../../types';
import { useData } from '../../hooks/useData';
import { SparePartForm } from '../Forms/SparePartForm';

const predefinedCategories = [
  { value: 'filtro_aire_primario', label: 'Filtro de Aire Primario' },
  { value: 'filtro_aire_secundario', label: 'Filtro de Aire Secundario' },
  { value: 'filtro_petroleo', label: 'Filtro de Petróleo' },
  { value: 'filtro_aceite', label: 'Filtro de Aceite' },
  { value: 'filtro_hidraulico', label: 'Filtro Hidráulico' },
  { value: 'grasa', label: 'Grasa' },
  { value: 'aceite', label: 'Aceite' },
  { value: 'otros', label: 'Otros' }
];

export const SparePartList: React.FC = () => {
  const { spareParts, warehouses, machinery } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedSparePart, setSelectedSparePart] = useState<SparePart | undefined>();

  const filteredSpareParts = spareParts.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         part.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         part.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const totalStock = Object.values(part.stockByWarehouse).reduce((sum, stock) => sum + stock, 0);
    const matchesLowStock = !lowStockOnly || totalStock <= part.minStock;
    
    const matchesWarehouse = warehouseFilter === 'all' || 
                           (part.stockByWarehouse[warehouseFilter] && part.stockByWarehouse[warehouseFilter] > 0);
    
    const matchesCategory = categoryFilter === 'all' || part.predefinedCategory === categoryFilter;
    
    return matchesSearch && matchesLowStock && matchesWarehouse && matchesCategory;
  });

  const getTotalStock = (part: SparePart) => {
    return Object.values(part.stockByWarehouse).reduce((sum, stock) => sum + stock, 0);
  };

  const getStockStatus = (part: SparePart) => {
    const totalStock = getTotalStock(part);
    if (totalStock === 0) return 'sin_stock';
    if (totalStock <= part.minStock) return 'stock_bajo';
    return 'stock_normal';
  };

  const getCompatibleMachineryNames = (machineryIds: string[]) => {
    return machineryIds.map(id => {
      const machine = machinery.find(m => m.id === id);
      return machine?.name || id;
    }).join(', ');
  };

  const handleSave = (sparePartData: Partial<SparePart>) => {
    console.log('Saving spare part:', sparePartData);
    setShowForm(false);
    setSelectedSparePart(undefined);
  };

  const handleEdit = (sparePart: SparePart) => {
    setSelectedSparePart(sparePart);
    setShowForm(true);
  };

  const lowStockParts = spareParts.filter(part => getTotalStock(part) <= part.minStock).length;
  const outOfStockParts = spareParts.filter(part => getTotalStock(part) === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Repuestos</h1>
          <p className="text-gray-600 mt-1">
            Gestión de inventario de repuestos - {lowStockParts} con stock bajo, {outOfStockParts} sin stock
          </p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Repuesto</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Repuestos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{spareParts.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stock Normal</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {spareParts.length - lowStockParts}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{lowStockParts}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sin Stock</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{outOfStockParts}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por nombre, código o marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todas las categorías</option>
            {predefinedCategories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <select
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los almacenes</option>
            {warehouses.map(warehouse => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) => setLowStockOnly(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Solo stock bajo</span>
          </label>

          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Repuesto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marca
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Mínimo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Unitario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compatibilidad
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSpareParts.map((part) => {
                const totalStock = getTotalStock(part);
                const stockStatus = getStockStatus(part);
                const categoryLabel = predefinedCategories.find(c => c.value === part.predefinedCategory)?.label || 'Otros';
                
                return (
                  <tr key={part.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{part.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {part.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {categoryLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {part.brand}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${
                          stockStatus === 'sin_stock' ? 'text-red-600' :
                          stockStatus === 'stock_bajo' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {totalStock}
                        </span>
                        {stockStatus !== 'stock_normal' && (
                          <AlertTriangle className={`w-4 h-4 ${
                            stockStatus === 'sin_stock' ? 'text-red-500' : 'text-yellow-500'
                          }`} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {part.minStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      S/ {part.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500 max-w-32 truncate">
                          {part.compatibleMachinery.length} máquinas
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2 justify-end">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(part)}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredSpareParts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron repuestos</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || warehouseFilter !== 'all' || categoryFilter !== 'all' || lowStockOnly
                ? 'Intenta con otros filtros de búsqueda' 
                : 'Comienza registrando tu primer repuesto'}
            </p>
            {!searchTerm && warehouseFilter === 'all' && categoryFilter === 'all' && !lowStockOnly && (
              <button 
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Registrar Primer Repuesto
              </button>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <SparePartForm
          sparePart={selectedSparePart}
          warehouses={warehouses}
          machinery={machinery}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setSelectedSparePart(undefined);
          }}
        />
      )}
    </div>
  );
};