import React, { useState, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';
import { useNotifications } from './hooks/useNotifications';
import { LoginForm } from './components/Auth/LoginForm';
import { Layout } from './components/Layout/Layout';
import { ToastContainer } from './components/Common/ToastContainer';
import { LoadingSpinner } from './components/Common/LoadingSpinner';

// Lazy load components for better performance
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard').then(m => ({ default: m.Dashboard })));
const MachineryList = lazy(() => import('./components/Machinery/MachineryList').then(m => ({ default: m.MachineryList })));
const VehicleList = lazy(() => import('./components/Vehicles/VehicleList').then(m => ({ default: m.VehicleList })));
const WarehouseList = lazy(() => import('./components/Warehouses/WarehouseList').then(m => ({ default: m.WarehouseList })));
const FuelManagement = lazy(() => import('./components/Fuel/FuelManagement').then(m => ({ default: m.FuelManagement })));
const ToolList = lazy(() => import('./components/Tools/ToolList').then(m => ({ default: m.ToolList })));
const SparePartList = lazy(() => import('./components/SpareParts/SparePartList').then(m => ({ default: m.SparePartList })));
const AlertsManagement = lazy(() => import('./components/Alerts/AlertsManagement').then(m => ({ default: m.AlertsManagement })));
const ReportsManagement = lazy(() => import('./components/Reports/ReportsManagement').then(m => ({ default: m.ReportsManagement })));
const FinanceManagement = lazy(() => import('./components/Finance/FinanceManagement').then(m => ({ default: m.FinanceManagement })));
const UserManagement = lazy(() => import('./components/Users/UserManagement').then(m => ({ default: m.UserManagement })));
const SystemConfiguration = lazy(() => import('./components/Settings/SystemConfiguration').then(m => ({ default: m.SystemConfiguration })));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="text-gray-600 mt-4">Cargando módulo...</p>
    </div>
  </div>
);

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
    const pageComponents = {
      dashboard: Dashboard,
      warehouses: WarehouseList,
      machinery: MachineryList,
      vehicles: VehicleList,
      fuel: FuelManagement,
      tools: ToolList,
      spareparts: SparePartList,
      alerts: AlertsManagement,
      reports: ReportsManagement,
      finance: FinanceManagement,
      users: UserManagement,
      settings: SystemConfiguration
    };

    const Component = pageComponents[currentPage as keyof typeof pageComponents] || Dashboard;

    return (
      <Suspense fallback={<PageLoader />}>
        <Component />
      </Suspense>
    );
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