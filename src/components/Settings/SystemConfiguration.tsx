import React, { useState } from 'react';
import { Save, Upload, Calendar, DollarSign, AlertTriangle, Settings, Globe, Palette } from 'lucide-react';
import { SystemConfig, AlertSettings, MaintenanceSettings, BackupSettings } from '../../types';
import { useForm } from '../../hooks/useForm';
import { useData } from '../../hooks/useData';

// Mock system configuration
const mockSystemConfig: SystemConfig = {
  id: '1',
  companyName: 'MaquiRent S.A.C.',
  companyLogo: '',
  currency: 'PEN',
  taxRate: 18,
  defaultWarehouseId: '1',
  alertSettings: {
    documentExpirationDays: 30,
    stockMinimumThreshold: 5,
    maintenanceDueDays: 7,
    fuelLowThreshold: 20
  },
  maintenanceSettings: {
    defaultIntervalHours: 250,
    defaultIntervalDays: 90,
    reminderDays: 7
  },
  backupSettings: {
    autoBackup: true,
    backupFrequency: 'weekly',
    retentionDays: 30
  },
  holidays: [
    new Date('2024-01-01'), // Año Nuevo
    new Date('2024-05-01'), // Día del Trabajo
    new Date('2024-07-28'), // Independencia
    new Date('2024-12-25')  // Navidad
  ],
  exchangeRate: 3.75,
  language: 'es',
  theme: 'light',
  updatedAt: new Date(),
  updatedBy: 'admin'
};

const currencies = [
  { code: 'PEN', name: 'Sol Peruano', symbol: 'S/' },
  { code: 'USD', name: 'Dólar Americano', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' }
];

const languages = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' }
];

const themes = [
  { code: 'light', name: 'Claro' },
  { code: 'dark', name: 'Oscuro' }
];

export const SystemConfiguration: React.FC = () => {
  const { warehouses } = useData();
  const [config, setConfig] = useState<SystemConfig>(mockSystemConfig);
  const [activeTab, setActiveTab] = useState('general');
  const [logoPreview, setLogoPreview] = useState<string | null>(config.companyLogo || null);

  const {
    data,
    errors,
    setValue,
    handleSubmit,
    submitError
  } = useForm({
    initialData: {
      companyName: config.companyName,
      currency: config.currency,
      taxRate: config.taxRate,
      defaultWarehouseId: config.defaultWarehouseId,
      exchangeRate: config.exchangeRate,
      language: config.language,
      theme: config.theme,
      // Alert settings
      documentExpirationDays: config.alertSettings.documentExpirationDays,
      stockMinimumThreshold: config.alertSettings.stockMinimumThreshold,
      maintenanceDueDays: config.alertSettings.maintenanceDueDays,
      fuelLowThreshold: config.alertSettings.fuelLowThreshold,
      // Maintenance settings
      defaultIntervalHours: config.maintenanceSettings.defaultIntervalHours,
      defaultIntervalDays: config.maintenanceSettings.defaultIntervalDays,
      reminderDays: config.maintenanceSettings.reminderDays,
      // Backup settings
      autoBackup: config.backupSettings.autoBackup,
      backupFrequency: config.backupSettings.backupFrequency,
      retentionDays: config.backupSettings.retentionDays
    },
    validationSchema: {
      companyName: { required: true, minLength: 2, maxLength: 100 },
      currency: { required: true },
      taxRate: { required: true, min: 0, max: 100 },
      defaultWarehouseId: { required: true },
      exchangeRate: { min: 0.01 },
      documentExpirationDays: { required: true, min: 1, max: 365 },
      stockMinimumThreshold: { required: true, min: 0 },
      maintenanceDueDays: { required: true, min: 1, max: 90 },
      fuelLowThreshold: { required: true, min: 0, max: 100 },
      defaultIntervalHours: { required: true, min: 1 },
      defaultIntervalDays: { required: true, min: 1 },
      reminderDays: { required: true, min: 1, max: 30 },
      retentionDays: { required: true, min: 1, max: 365 }
    },
    onSubmit: async (formData) => {
      const updatedConfig: SystemConfig = {
        ...config,
        companyName: formData.companyName,
        companyLogo: logoPreview || '',
        currency: formData.currency,
        taxRate: formData.taxRate,
        defaultWarehouseId: formData.defaultWarehouseId,
        exchangeRate: formData.exchangeRate,
        language: formData.language,
        theme: formData.theme,
        alertSettings: {
          documentExpirationDays: formData.documentExpirationDays,
          stockMinimumThreshold: formData.stockMinimumThreshold,
          maintenanceDueDays: formData.maintenanceDueDays,
          fuelLowThreshold: formData.fuelLowThreshold
        },
        maintenanceSettings: {
          defaultIntervalHours: formData.defaultIntervalHours,
          defaultIntervalDays: formData.defaultIntervalDays,
          reminderDays: formData.reminderDays
        },
        backupSettings: {
          autoBackup: formData.autoBackup,
          backupFrequency: formData.backupFrequency,
          retentionDays: formData.retentionDays
        },
        updatedAt: new Date(),
        updatedBy: 'current-user'
      };

      console.log('Saving system configuration:', updatedConfig);
      setConfig(updatedConfig);
    }
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('El logo debe ser menor a 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addHoliday = () => {
    const dateInput = document.getElementById('new-holiday') as HTMLInputElement;
    if (dateInput && dateInput.value) {
      const newDate = new Date(dateInput.value);
      setConfig(prev => ({
        ...prev,
        holidays: [...prev.holidays, newDate].sort((a, b) => a.getTime() - b.getTime())
      }));
      dateInput.value = '';
    }
  };

  const removeHoliday = (index: number) => {
    setConfig(prev => ({
      ...prev,
      holidays: prev.holidays.filter((_, i) => i !== index)
    }));
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'alerts', name: 'Alertas', icon: AlertTriangle },
    { id: 'maintenance', name: 'Mantenimiento', icon: Calendar },
    { id: 'financial', name: 'Financiero', icon: DollarSign },
    { id: 'appearance', name: 'Apariencia', icon: Palette },
    { id: 'system', name: 'Sistema', icon: Globe }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h1>
          <p className="text-gray-600 mt-1">Personaliza el comportamiento y apariencia del sistema</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo de la Empresa
                  </label>
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <Upload className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Subir Logo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG hasta 2MB</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Empresa *
                  </label>
                  <input
                    type="text"
                    value={data.companyName}
                    onChange={(e) => setValue('companyName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.companyName ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.companyName && <p className="text-red-600 text-sm mt-1">{errors.companyName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Almacén por Defecto *
                  </label>
                  <select
                    value={data.defaultWarehouseId}
                    onChange={(e) => setValue('defaultWarehouseId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.defaultWarehouseId ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar almacén</option>
                    {warehouses.map(warehouse => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </option>
                    ))}
                  </select>
                  {errors.defaultWarehouseId && <p className="text-red-600 text-sm mt-1">{errors.defaultWarehouseId}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Alerts Tab */}
          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Días de Aviso para Vencimiento de Documentos *
                  </label>
                  <input
                    type="number"
                    value={data.documentExpirationDays}
                    onChange={(e) => setValue('documentExpirationDays', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.documentExpirationDays ? 'border-red-300' : 'border-gray-300'
                    }`}
                    min="1"
                    max="365"
                  />
                  {errors.documentExpirationDays && <p className="text-red-600 text-sm mt-1">{errors.documentExpirationDays}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Umbral de Stock Mínimo Global *
                  </label>
                  <input
                    type="number"
                    value={data.stockMinimumThreshold}
                    onChange={(e) => setValue('stockMinimumThreshold', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.stockMinimumThreshold ? 'border-red-300' : 'border-gray-300'
                    }`}
                    min="0"
                  />
                  {errors.stockMinimumThreshold && <p className="text-red-600 text-sm mt-1">{errors.stockMinimumThreshold}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Días de Aviso para Mantenimiento *
                  </label>
                  <input
                    type="number"
                    value={data.maintenanceDueDays}
                    onChange={(e) => setValue('maintenanceDueDays', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.maintenanceDueDays ? 'border-red-300' : 'border-gray-300'
                    }`}
                    min="1"
                    max="90"
                  />
                  {errors.maintenanceDueDays && <p className="text-red-600 text-sm mt-1">{errors.maintenanceDueDays}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Umbral de Combustible Bajo (%) *
                  </label>
                  <input
                    type="number"
                    value={data.fuelLowThreshold}
                    onChange={(e) => setValue('fuelLowThreshold', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.fuelLowThreshold ? 'border-red-300' : 'border-gray-300'
                    }`}
                    min="0"
                    max="100"
                  />
                  {errors.fuelLowThreshold && <p className="text-red-600 text-sm mt-1">{errors.fuelLowThreshold}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Maintenance Tab */}
          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Intervalo por Defecto (Horas) *
                  </label>
                  <input
                    type="number"
                    value={data.defaultIntervalHours}
                    onChange={(e) => setValue('defaultIntervalHours', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.defaultIntervalHours ? 'border-red-300' : 'border-gray-300'
                    }`}
                    min="1"
                  />
                  {errors.defaultIntervalHours && <p className="text-red-600 text-sm mt-1">{errors.defaultIntervalHours}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Intervalo por Defecto (Días) *
                  </label>
                  <input
                    type="number"
                    value={data.defaultIntervalDays}
                    onChange={(e) => setValue('defaultIntervalDays', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.defaultIntervalDays ? 'border-red-300' : 'border-gray-300'
                    }`}
                    min="1"
                  />
                  {errors.defaultIntervalDays && <p className="text-red-600 text-sm mt-1">{errors.defaultIntervalDays}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Días de Recordatorio *
                  </label>
                  <input
                    type="number"
                    value={data.reminderDays}
                    onChange={(e) => setValue('reminderDays', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.reminderDays ? 'border-red-300' : 'border-gray-300'
                    }`}
                    min="1"
                    max="30"
                  />
                  {errors.reminderDays && <p className="text-red-600 text-sm mt-1">{errors.reminderDays}</p>}
                </div>
              </div>

              {/* Holidays */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Días Feriados
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="date"
                      id="new-holiday"
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={addHoliday}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Agregar
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {config.holidays.map((holiday, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm">{holiday.toLocaleDateString()}</span>
                        <button
                          type="button"
                          onClick={() => removeHoliday(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Financial Tab */}
          {activeTab === 'financial' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Moneda *
                  </label>
                  <select
                    value={data.currency}
                    onChange={(e) => setValue('currency', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.currency ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.symbol} - {currency.name}
                      </option>
                    ))}
                  </select>
                  {errors.currency && <p className="text-red-600 text-sm mt-1">{errors.currency}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tasa de Impuesto (%) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={data.taxRate}
                    onChange={(e) => setValue('taxRate', parseFloat(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.taxRate ? 'border-red-300' : 'border-gray-300'
                    }`}
                    min="0"
                    max="100"
                  />
                  {errors.taxRate && <p className="text-red-600 text-sm mt-1">{errors.taxRate}</p>}
                </div>

                {data.currency !== 'PEN' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Cambio (PEN por {data.currency})
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={data.exchangeRate}
                      onChange={(e) => setValue('exchangeRate', parseFloat(e.target.value))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.exchangeRate ? 'border-red-300' : 'border-gray-300'
                      }`}
                      min="0.01"
                    />
                    {errors.exchangeRate && <p className="text-red-600 text-sm mt-1">{errors.exchangeRate}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idioma
                  </label>
                  <select
                    value={data.language}
                    onChange={(e) => setValue('language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {languages.map(language => (
                      <option key={language.code} value={language.code}>
                        {language.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tema
                  </label>
                  <select
                    value={data.theme}
                    onChange={(e) => setValue('theme', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {themes.map(theme => (
                      <option key={theme.code} value={theme.code}>
                        {theme.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={data.autoBackup}
                      onChange={(e) => setValue('autoBackup', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Respaldo Automático
                    </span>
                  </label>
                </div>

                {data.autoBackup && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frecuencia de Respaldo
                      </label>
                      <select
                        value={data.backupFrequency}
                        onChange={(e) => setValue('backupFrequency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="daily">Diario</option>
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensual</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Días de Retención *
                      </label>
                      <input
                        type="number"
                        value={data.retentionDays}
                        onChange={(e) => setValue('retentionDays', parseInt(e.target.value))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.retentionDays ? 'border-red-300' : 'border-gray-300'
                        }`}
                        min="1"
                        max="365"
                      />
                      {errors.retentionDays && <p className="text-red-600 text-sm mt-1">{errors.retentionDays}</p>}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Configuración</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};