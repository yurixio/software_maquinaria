import { useState, useCallback } from 'react';
import { ValidationError } from '../types';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: any) => string | null;
}

interface ValidationSchema {
  [key: string]: ValidationRule;
}

export const useValidation = <T extends Record<string, any>>(schema: ValidationSchema) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = useCallback((name: string, value: any): string | null => {
    const rule = schema[name];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return 'Este campo es obligatorio';
    }

    // Skip other validations if field is empty and not required
    if (!value && !rule.required) return null;

    // String validations
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        return `Debe tener al menos ${rule.minLength} caracteres`;
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        return `No puede tener más de ${rule.maxLength} caracteres`;
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        return 'Formato inválido';
      }
    }

    // Number validations
    if (typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        return `Debe ser mayor o igual a ${rule.min}`;
      }
      if (rule.max !== undefined && value > rule.max) {
        return `Debe ser menor o igual a ${rule.max}`;
      }
    }

    // Date validations
    if (value instanceof Date) {
      if (isNaN(value.getTime())) {
        return 'Fecha inválida';
      }
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }, [schema]);

  const validateForm = useCallback((data: T): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(schema).forEach(fieldName => {
      const error = validateField(fieldName, data[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [schema, validateField]);

  const validateSingleField = useCallback((name: string, value: any): boolean => {
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
    return !error;
  }, [validateField]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  return {
    errors,
    validateForm,
    validateSingleField,
    clearErrors,
    clearFieldError
  };
};

// Common validation patterns
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  plate: /^[A-Z]{3}-\d{3}$/,
  serialNumber: /^[A-Z0-9]{6,20}$/,
  code: /^[A-Z0-9\-]{3,20}$/,
  currency: /^\d+(\.\d{1,2})?$/,
  percentage: /^(100|[1-9]?\d)(\.\d{1,2})?$/
};

// Common validation schemas
export const commonSchemas = {
  warehouse: {
    name: { required: true, minLength: 2, maxLength: 100 },
    address: { required: true, minLength: 5, maxLength: 200 },
    city: { required: true, minLength: 2, maxLength: 50 },
    phone: { pattern: validationPatterns.phone },
    manager: { maxLength: 100 }
  },
  machinery: {
    name: { required: true, minLength: 2, maxLength: 100 },
    category: { required: true },
    brand: { required: true, minLength: 2, maxLength: 50 },
    model: { required: true, minLength: 1, maxLength: 50 },
    serialNumber: { required: true, pattern: validationPatterns.serialNumber },
    year: { required: true, min: 1900, max: new Date().getFullYear() + 1 },
    hourmeter: { min: 0 },
    warehouseId: { required: true },
    purchasePrice: { min: 0 },
    currentValue: { min: 0 }
  },
  vehicle: {
    plate: { required: true, pattern: validationPatterns.plate },
    brand: { required: true, minLength: 2, maxLength: 50 },
    model: { required: true, minLength: 1, maxLength: 50 },
    year: { required: true, min: 1900, max: new Date().getFullYear() + 1 },
    mileage: { min: 0 },
    warehouseId: { required: true },
    soatExpiration: { required: true },
    technicalReviewExpiration: { required: true }
  },
  tool: {
    name: { required: true, minLength: 2, maxLength: 100 },
    internalCode: { required: true, pattern: validationPatterns.code },
    warehouseId: { required: true },
    category: { maxLength: 50 },
    brand: { maxLength: 50 },
    model: { maxLength: 50 }
  },
  sparePart: {
    code: { required: true, pattern: validationPatterns.code },
    name: { required: true, minLength: 2, maxLength: 100 },
    brand: { required: true, minLength: 2, maxLength: 50 },
    unitPrice: { required: true, min: 0 },
    minStock: { required: true, min: 0 }
  },
  fuel: {
    entityId: { required: true },
    date: { required: true },
    liters: { required: true, min: 0.1 },
    unitCost: { required: true, min: 0.01 },
    location: { required: true, minLength: 3, maxLength: 100 }
  },
  financial: {
    category: { required: true },
    description: { required: true, minLength: 3, maxLength: 200 },
    amount: { required: true, min: 0.01 },
    date: { required: true }
  },
  user: {
    name: { required: true, minLength: 2, maxLength: 100 },
    email: { required: true, pattern: validationPatterns.email },
    role: { required: true }
  }
};