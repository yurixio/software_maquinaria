import React from 'react';
import { 
  Home, 
  Warehouse, 
  Truck, 
  Car, 
  Wrench, 
  Package, 
  AlertTriangle, 
  FileText, 
  DollarSign, 
  Settings, 
  Users,
  Fuel,
  Package2,
  Calendar
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isCollapsed: boolean;
}

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'warehouses', icon: Warehouse, label: 'Almacenes' },
  { id: 'machinery', icon: Truck, label: 'Maquinaria' },
  { id: 'vehicles', icon: Car, label: 'Vehículos' },
  { id: 'rentals', icon: Calendar, label: 'Alquileres' },
  { id: 'fuel', icon: Fuel, label: 'Combustible' },
  { id: 'tools', icon: Wrench, label: 'Herramientas' },
  { id: 'spareparts', icon: Package2, label: 'Repuestos' },
  { id: 'alerts', icon: AlertTriangle, label: 'Alertas' },
  { id: 'reports', icon: FileText, label: 'Reportes' },
  { id: 'finance', icon: DollarSign, label: 'Finanzas' },
  { id: 'users', icon: Users, label: 'Usuarios' },
  { id: 'settings', icon: Settings, label: 'Configuración' }
];

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, isCollapsed }) => {
  const handleLogoClick = () => {
    onPageChange('dashboard');
  };

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-6">
        <div 
          className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleLogoClick}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Truck className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-gray-900">MaquiRent</h1>
              <p className="text-xs text-gray-500">Sistema de Gestión</p>
            </div>
          )}
        </div>
      </div>
      
      <nav className="px-3 pb-6">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="ml-3">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};