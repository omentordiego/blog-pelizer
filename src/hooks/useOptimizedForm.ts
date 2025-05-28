
import { useState, useCallback } from 'react';

interface UseOptimizedFormProps<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
}

export const useOptimizedForm = <T extends Record<string, any>>({
  initialValues,
  onSubmit,
}: UseOptimizedFormProps<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, onSubmit]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    setValue,
    errors,
    setErrors,
    isSubmitting,
    handleSubmit,
    reset,
  };
};
