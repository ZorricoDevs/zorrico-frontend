import { useState, useCallback, useMemo } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  pan?: boolean;
  aadhaar?: boolean;
  custom?: (value: any) => string | null;
  min?: number;
  max?: number;
}

export interface FieldConfig {
  rules?: ValidationRule;
  initialValue?: any;
}

export interface FormConfig {
  [fieldName: string]: FieldConfig;
}

export interface UseFormValidationReturn {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  setValue: (field: string, value: any) => void;
  setError: (field: string, error: string) => void;
  clearError: (field: string) => void;
  validateField: (field: string) => boolean;
  validateForm: () => boolean;
  handleChange: (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (field: string) => () => void;
  handleSubmit: (onSubmit: (values: Record<string, any>) => Promise<void>) => (event: React.FormEvent) => Promise<void>;
  reset: () => void;
  setSubmitting: (submitting: boolean) => void;
}

const validateValue = (value: any, rules?: ValidationRule): string | null => {
  if (!rules) {return null;}

  // Required validation
  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return 'This field is required';
  }

  // Skip other validations if value is empty and not required
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return null;
  }

  const stringValue = String(value);

  // Length validations
  if (rules.minLength && stringValue.length < rules.minLength) {
    return `Minimum length is ${rules.minLength} characters`;
  }

  if (rules.maxLength && stringValue.length > rules.maxLength) {
    return `Maximum length is ${rules.maxLength} characters`;
  }

  // Number validations
  if (typeof value === 'number') {
    if (rules.min !== undefined && value < rules.min) {
      return `Minimum value is ${rules.min}`;
    }
    if (rules.max !== undefined && value > rules.max) {
      return `Maximum value is ${rules.max}`;
    }
  }

  // Email validation
  if (rules.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(stringValue)) {
      return 'Please enter a valid email address';
    }
  }

  // Phone validation (Indian)
  if (rules.phone) {
    const phoneRegex = /^[+]?[0-9]{10,15}$/;
    if (!phoneRegex.test(stringValue.replace(/\s/g, ''))) {
      return 'Please enter a valid phone number';
    }
  }

  // PAN validation
  if (rules.pan) {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(stringValue.toUpperCase())) {
      return 'Please enter a valid PAN number (e.g., ABCDE1234F)';
    }
  }

  // Aadhaar validation
  if (rules.aadhaar) {
    const aadhaarRegex = /^\d{12}$/;
    if (!aadhaarRegex.test(stringValue.replace(/\s/g, ''))) {
      return 'Please enter a valid 12-digit Aadhaar number';
    }
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    return 'Please enter a valid format';
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      return customError;
    }
  }

  return null;
};

export const useFormValidation = (config: FormConfig): UseFormValidationReturn => {
  // Initialize values from config
  const initialValues = useMemo(() => {
    const values: Record<string, any> = {};
    Object.keys(config).forEach(field => {
      values[field] = config[field].initialValue ?? '';
    });
    return values;
  }, [config]);

  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((field: string, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));

    // Clear error when value changes
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const setError = useCallback((field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const clearError = useCallback((field: string) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  }, []);

  const validateField = useCallback((field: string): boolean => {
    const fieldConfig = config[field];
    const value = values[field];
    const error = validateValue(value, fieldConfig?.rules);

    if (error) {
      setError(field, error);
      return false;
    } else {
      clearError(field);
      return true;
    }
  }, [config, values, setError, clearError]);

  const validateForm = useCallback((): boolean => {
    let isFormValid = true;
    const newErrors: Record<string, string> = {};

    Object.keys(config).forEach(field => {
      const fieldConfig = config[field];
      const value = values[field];
      const error = validateValue(value, fieldConfig?.rules);

      if (error) {
        newErrors[field] = error;
        isFormValid = false;
      }
    });

    setErrors(newErrors);
    return isFormValid;
  }, [config, values]);

  const handleChange = useCallback((field: string) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;
      setValue(field, value);
    };
  }, [setValue]);

  const handleBlur = useCallback((field: string) => {
    return () => {
      setTouched(prev => ({ ...prev, [field]: true }));
      validateField(field);
    };
  }, [validateField]);

  const handleSubmit = useCallback((onSubmit: (values: Record<string, any>) => Promise<void>) => {
    return async (event: React.FormEvent) => {
      event.preventDefault();

      if (isSubmitting) {return;}

      setIsSubmitting(true);

      // Mark all fields as touched
      const allTouched: Record<string, boolean> = {};
      Object.keys(config).forEach(field => {
        allTouched[field] = true;
      });
      setTouched(allTouched);

      try {
        if (validateForm()) {
          await onSubmit(values);
        }
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [config, values, validateForm, isSubmitting]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setSubmitting = useCallback((submitting: boolean) => {
    setIsSubmitting(submitting);
  }, []);

  const isValid = useMemo(() => {
    return Object.keys(errors).every(field => !errors[field]);
  }, [errors]);

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    setValue,
    setError,
    clearError,
    validateField,
    validateForm,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setSubmitting
  };
};
