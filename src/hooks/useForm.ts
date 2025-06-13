import { useState, useCallback, useEffect } from 'react';
import { useValidation } from './useValidation';
import { FormState } from '../types';

interface UseFormOptions<T> {
  initialData: T;
  validationSchema?: any;
  onSubmit?: (data: T) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export const useForm = <T extends Record<string, any>>({
  initialData,
  validationSchema,
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true
}: UseFormOptions<T>) => {
  const [data, setData] = useState<T>(initialData);
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { errors, validateForm, validateSingleField, clearErrors } = useValidation(validationSchema || {});

  const isValid = Object.keys(errors).length === 0;

  const setValue = useCallback((name: keyof T, value: any) => {
    setData(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
    setSubmitError(null);

    if (validateOnChange && validationSchema) {
      validateSingleField(name as string, value);
    }
  }, [validateOnChange, validationSchema, validateSingleField]);

  const setValues = useCallback((newData: Partial<T>) => {
    setData(prev => ({ ...prev, ...newData }));
    setIsDirty(true);
    setSubmitError(null);
  }, []);

  const handleBlur = useCallback((name: keyof T) => {
    if (validateOnBlur && validationSchema) {
      validateSingleField(name as string, data[name]);
    }
  }, [validateOnBlur, validationSchema, validateSingleField, data]);

  const reset = useCallback((newData?: T) => {
    const resetData = newData || initialData;
    setData(resetData);
    setIsDirty(false);
    setIsSubmitting(false);
    setSubmitError(null);
    clearErrors();
  }, [initialData, clearErrors]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setSubmitError(null);

    if (validationSchema && !validateForm(data)) {
      return;
    }

    if (!onSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit(data);
      setIsDirty(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Error al enviar el formulario');
    } finally {
      setIsSubmitting(false);
    }
  }, [data, validationSchema, validateForm, onSubmit]);

  const formState: FormState<T> = {
    data,
    errors,
    isValid,
    isDirty,
    isSubmitting
  };

  return {
    ...formState,
    setValue,
    setValues,
    handleBlur,
    reset,
    handleSubmit,
    submitError
  };
};