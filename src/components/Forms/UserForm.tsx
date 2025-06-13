import React, { useState } from 'react';
import { X, Save, User, Upload, Eye, EyeOff } from 'lucide-react';
import { User as UserType, UserRole } from '../../types';
import { useForm } from '../../hooks/useForm';
import { commonSchemas } from '../../hooks/useValidation';

interface UserFormProps {
  user?: UserType;
  onSave: (user: Partial<UserType>) => void;
  onCancel: () => void;
}

const roles: { value: UserRole; label: string; description: string }[] = [
  {
    value: 'admin',
    label: 'Administrador',
    description: 'Acceso completo a todos los módulos y configuración del sistema'
  },
  {
    value: 'warehouse',
    label: 'Almacenero',
    description: 'Gestión de inventario, herramientas y repuestos'
  },
  {
    value: 'mechanic',
    label: 'Mecánico',
    description: 'Registro de mantenimientos y estado de maquinaria'
  },
  {
    value: 'accountant',
    label: 'Contador',
    description: 'Acceso a reportes financieros y gestión de pagos'
  },
  {
    value: 'viewer',
    label: 'Solo Lectura',
    description: 'Acceso de consulta sin permisos de modificación'
  }
];

export const UserForm: React.FC<UserFormProps> = ({
  user,
  onSave,
  onCancel
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);

  const {
    data,
    errors,
    isValid,
    setValue,
    handleSubmit,
    submitError
  } = useForm({
    initialData: {
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || 'viewer' as UserRole,
      password: '',
      confirmPassword: '',
      avatar: user?.avatar || ''
    },
    validationSchema: {
      ...commonSchemas.user,
      password: user ? {} : { required: true, minLength: 6 },
      confirmPassword: user ? {} : { 
        required: true,
        custom: (value: string) => {
          if (value !== data.password) {
            return 'Las contraseñas no coinciden';
          }
          return null;
        }
      }
    },
    onSubmit: async (formData) => {
      const userData: Partial<UserType> = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        avatar: avatarPreview || undefined
      };

      if (!user) {
        // New user
        userData.createdAt = new Date();
        userData.createdBy = 'current-user'; // In real app, get from auth context
      } else {
        // Existing user
        userData.id = user.id;
        userData.updatedAt = new Date();
        userData.updatedBy = 'current-user';
      }

      onSave(userData);
    }
  });

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('La imagen debe ser menor a 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
        setValue('avatar', result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user ? 'Editar Usuario' : 'Nuevo Usuario'}
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
          {/* Avatar Upload */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                <Upload className="w-3 h-3 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Foto de perfil</h3>
              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG hasta 2MB. Recomendado 200x200px
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setValue('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: Juan Pérez García"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico *
              </label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setValue('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="usuario@empresa.com"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol del Usuario *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {roles.map((role) => (
                  <label
                    key={role.value}
                    className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                      data.role === role.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={data.role === role.value}
                      onChange={(e) => setValue('role', e.target.value as UserRole)}
                      className="sr-only"
                    />
                    <div className="flex flex-1">
                      <div className="flex flex-col">
                        <span className={`block text-sm font-medium ${
                          data.role === role.value ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {role.label}
                        </span>
                        <span className={`block text-xs ${
                          data.role === role.value ? 'text-blue-700' : 'text-gray-500'
                        }`}>
                          {role.description}
                        </span>
                      </div>
                    </div>
                    {data.role === role.value && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
              {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role}</p>}
            </div>

            {!user && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={data.password}
                      onChange={(e) => setValue('password', e.target.value)}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Contraseña *
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={data.confirmPassword}
                    onChange={(e) => setValue('confirmPassword', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Repetir contraseña"
                  />
                  {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </>
            )}
          </div>

          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

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
              disabled={!isValid}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{user ? 'Actualizar' : 'Crear'} Usuario</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};