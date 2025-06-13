import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';
import { useNotifications } from './hooks/useNotifications';
import { LoginForm } from './components/Auth/LoginForm';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { MachineryList } from './components/Machinery/MachineryList';
import { VehicleList } from './components/Vehicles/VehicleList';
import { WarehouseList } from './components/Warehouses/WarehouseList';
import { FuelManagement } from './components/Fuel/FuelManagement';
import { ToolList } from './components/Tools/ToolList';
import { SparePartList } from './components/SpareParts/SparePartList';
import { AlertsManagement } from './components/Alerts/AlertsManagement';
import { ReportsManagement } from './components/Reports/ReportsManagement';
import { FinanceManagement } from './components/Finance/FinanceManagement';
import { UserManagement } from './components/Users/UserManagement';
import { SystemConfiguration } from './components/Settings/SystemConfiguration';
import { ToastContainer } from './components/Common/ToastContainer';
import { LoadingSpinner } from './components/Common/LoadingSpinner';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { toasts, removeToast } = useToast();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4">Cargando sistema...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'warehouses':
        return <WarehouseList />;
      case 'machinery':
        return <MachineryList />;
      case 'vehicles':
        return <VehicleList />;
      case 'fuel':
        return <FuelManagement />;
      case 'tools':
        return <ToolList />;
      case 'spareparts':
        return <SparePartList />;
      case 'alerts':
        return <AlertsManagement />;
      case 'reports':
        return <ReportsManagement />;
      case 'finance':
        return <FinanceManagement />;
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <SystemConfiguration />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderPage()}
      </Layout>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;