import React from 'react';
import { Menu, User, LogOut, Settings, HelpCircle, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useRealTimeUpdates } from '../../hooks/useRealTimeUpdates';
import { GlobalSearch } from '../Common/GlobalSearch';
import { NotificationCenter } from '../Common/NotificationCenter';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isConnected, lastUpdate } = useRealTimeUpdates();

  const handleNavigate = (url: string) => {
    // In a real app, use router navigation
    console.log('Navigate to:', url);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          
          <GlobalSearch onNavigate={handleNavigate} />
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <div className="flex items-center space-x-1 text-green-600" title="Conectado - Actualizaciones en tiempo real">
                <Wifi className="w-4 h-4" />
                <span className="text-xs hidden sm:inline">En línea</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-red-600" title="Desconectado">
                <WifiOff className="w-4 h-4" />
                <span className="text-xs hidden sm:inline">Sin conexión</span>
              </div>
            )}
          </div>

          {/* Help Button */}
          <button 
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Ayuda y soporte"
          >
            <HelpCircle className="w-5 h-5 text-gray-600" />
          </button>

          {/* Notifications */}
          <NotificationCenter />
          
          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            
            {/* Settings */}
            <button 
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Configuración"
            >
              <Settings className="w-4 h-4 text-gray-600" />
            </button>
            
            {/* Logout */}
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Last Update Indicator */}
      {lastUpdate && (
        <div className="text-xs text-gray-500 text-right mt-1">
          Última actualización: {lastUpdate.toLocaleTimeString()}
        </div>
      )}
    </header>
  );
};