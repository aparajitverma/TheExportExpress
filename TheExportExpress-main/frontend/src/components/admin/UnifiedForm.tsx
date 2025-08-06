import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  XMarkIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon 
} from '@heroicons/react/24/outline';

// Unified form field interface
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'select' | 'textarea' | 'checkbox' | 'array' | 'object';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: (value: any) => string | null;
  fields?: FormField[]; // For nested objects
  arrayItemFields?: FormField[]; // For array items
  gridCols?: 1 | 2 | 3; // Grid layout
  section?: string; // Group fields into sections
}

interface UnifiedFormProps {
  title: string;
  fields: FormField[];
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
  submitText?: string;
  loading?: boolean;
}

export const UnifiedForm: React.FC<UnifiedFormProps> = ({
  title,
  fields,
  initialData = {},
  onSubmit,
  onClose,
  submitText = 'Save',
  loading = false
}) => {
  const [formData, setFormData] = useState<any>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Initialize form data structure
  useEffect(() => {
    const initializeData = (fieldsArray: FormField[], parentPath = '') => {
      fieldsArray.forEach(field => {
        const fieldPath = parentPath ? `${parentPath}.${field.name}` : field.name;
        
        if (!getNestedValue(formData, fieldPath)) {
          if (field.type === 'array') {
            setNestedValue(formData, fieldPath, []);
          } else if (field.type === 'object' && field.fields) {
            setNestedValue(formData, fieldPath, {});
            initializeData(field.fields, fieldPath);
          } else if (field.type === 'checkbox') {
            setNestedValue(formData, fieldPath, false);
          } else if (field.type === 'number') {
            setNestedValue(formData, fieldPath, 0);
          } else {
            setNestedValue(formData, fieldPath, '');
          }
        }
      });
    };

    initializeData(fields);
  }, [fields, formData]);

  // Helper functions for nested object manipulation
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const setNestedValue = (obj: any, path: string, value: any) => {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  };

  const updateFormData = (path: string, value: any) => {
    const newData = { ...formData };
    setNestedValue(newData, path, value);
    setFormData(newData);
    
    // Clear error for this field
    if (errors[path]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[path];
        return newErrors;
      });
    }
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const validateField = (field: FormField, parentPath = '') => {
      const fieldPath = parentPath ? `${parentPath}.${field.name}` : field.name;
      const value = getNestedValue(formData, fieldPath);

      // Required validation
      if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
        newErrors[fieldPath] = `${field.label} is required`;
        return;
      }

      // Custom validation
      if (field.validation && value) {
        const error = field.validation(value);
        if (error) {
          newErrors[fieldPath] = error;
          return;
        }
      }

      // Validate nested fields
      if (field.type === 'object' && field.fields) {
        field.fields.forEach(nestedField => {
          validateField(nestedField, fieldPath);
        });
      }

      // Validate array items
      if (field.type === 'array' && field.arrayItemFields && Array.isArray(value)) {
        value.forEach((item, index) => {
          field.arrayItemFields!.forEach(itemField => {
            validateField(itemField, `${fieldPath}.${index}`);
          });
        });
      }
    };

    fields.forEach(field => validateField(field));
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Array field helpers
  const addArrayItem = (fieldPath: string, field: FormField) => {
    const currentArray = getNestedValue(formData, fieldPath) || [];
    const newItem = field.arrayItemFields?.reduce((item, itemField) => {
      if (itemField.type === 'object') {
        item[itemField.name] = {};
      } else if (itemField.type === 'array') {
        item[itemField.name] = [];
      } else if (itemField.type === 'checkbox') {
        item[itemField.name] = false;
      } else if (itemField.type === 'number') {
        item[itemField.name] = 0;
      } else {
        item[itemField.name] = '';
      }
      return item;
    }, {}) || {};
    
    updateFormData(fieldPath, [...currentArray, newItem]);
  };

  const removeArrayItem = (fieldPath: string, index: number) => {
    const currentArray = getNestedValue(formData, fieldPath) || [];
    updateFormData(fieldPath, currentArray.filter((_: any, i: number) => i !== index));
  };

  // Render field based on type
  const renderField = (field: FormField, parentPath = '', arrayIndex?: number) => {
    const fieldPath = arrayIndex !== undefined 
      ? `${parentPath}.${arrayIndex}.${field.name}`
      : parentPath 
        ? `${parentPath}.${field.name}` 
        : field.name;
    
    const value = getNestedValue(formData, fieldPath);
    const error = errors[fieldPath];
    const fieldId = fieldPath.replace(/\./g, '_');

    const baseInputClasses = `w-full px-3 py-2 bg-gray-700/50 border rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      error ? 'border-red-500/50' : 'border-gray-600/50'
    }`;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <div key={fieldPath}>
            <label htmlFor={fieldId} className="block text-sm font-medium text-gray-300 mb-2">
              {field.label} {field.required && <span className="text-red-400">*</span>}
            </label>
            <input
              id={fieldId}
              type={field.type}
              value={value || ''}
              onChange={(e) => updateFormData(fieldPath, e.target.value)}
              placeholder={field.placeholder}
              className={baseInputClasses}
            />
            {error && (
              <p className="mt-1 text-sm text-red-400 flex items-center">
                <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={fieldPath}>
            <label htmlFor={fieldId} className="block text-sm font-medium text-gray-300 mb-2">
              {field.label} {field.required && <span className="text-red-400">*</span>}
            </label>
            <input
              id={fieldId}
              type="number"
              value={value || 0}
              onChange={(e) => updateFormData(fieldPath, Number(e.target.value))}
              placeholder={field.placeholder}
              className={baseInputClasses}
            />
            {error && (
              <p className="mt-1 text-sm text-red-400 flex items-center">
                <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={fieldPath}>
            <label htmlFor={fieldId} className="block text-sm font-medium text-gray-300 mb-2">
              {field.label} {field.required && <span className="text-red-400">*</span>}
            </label>
            <select
              id={fieldId}
              value={value || ''}
              onChange={(e) => updateFormData(fieldPath, e.target.value)}
              className={baseInputClasses}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && (
              <p className="mt-1 text-sm text-red-400 flex items-center">
                <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={fieldPath}>
            <label htmlFor={fieldId} className="block text-sm font-medium text-gray-300 mb-2">
              {field.label} {field.required && <span className="text-red-400">*</span>}
            </label>
            <textarea
              id={fieldId}
              value={value || ''}
              onChange={(e) => updateFormData(fieldPath, e.target.value)}
              placeholder={field.placeholder}
              rows={3}
              className={baseInputClasses}
            />
            {error && (
              <p className="mt-1 text-sm text-red-400 flex items-center">
                <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={fieldPath} className="flex items-center">
            <input
              id={fieldId}
              type="checkbox"
              checked={value || false}
              onChange={(e) => updateFormData(fieldPath, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
            />
            <label htmlFor={fieldId} className="ml-2 block text-sm text-gray-300">
              {field.label} {field.required && <span className="text-red-400">*</span>}
            </label>
            {error && (
              <p className="ml-6 text-sm text-red-400 flex items-center">
                <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
          </div>
        );

      case 'object':
        return (
          <div key={fieldPath} className="space-y-4">
            <h4 className="text-lg font-medium text-gray-200 border-b border-gray-700 pb-2">
              {field.label}
            </h4>
            <div className={`grid gap-4 ${field.gridCols ? `grid-cols-${field.gridCols}` : 'grid-cols-1'}`}>
              {field.fields?.map(nestedField => renderField(nestedField, fieldPath))}
            </div>
          </div>
        );

      case 'array':
        const arrayValue = value || [];
        return (
          <div key={fieldPath} className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-300">
                {field.label} {field.required && <span className="text-red-400">*</span>}
              </label>
              <button
                type="button"
                onClick={() => addArrayItem(fieldPath, field)}
                className="inline-flex items-center px-3 py-1 border border-blue-500 rounded-md shadow-sm bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                Add {field.label.slice(0, -1)} {/* Remove 's' from plural */}
              </button>
            </div>
            
            {arrayValue.map((item: any, index: number) => (
              <div key={index} className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-sm font-medium text-gray-200">
                    {field.label.slice(0, -1)} #{index + 1}
                  </h5>
                  <button
                    type="button"
                    onClick={() => removeArrayItem(fieldPath, index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {field.arrayItemFields?.map(itemField => renderField(itemField, fieldPath, index))}
                </div>
              </div>
            ))}
            
            {arrayValue.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4 border-2 border-dashed border-gray-700 rounded-lg">
                No {field.label.toLowerCase()} added yet. Click the button above to add one.
              </p>
            )}
            
            {error && (
              <p className="text-sm text-red-400 flex items-center">
                <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Group fields by section
  const groupedFields = fields.reduce((groups: Record<string, FormField[]>, field) => {
    const section = field.section || 'main';
    if (!groups[section]) groups[section] = [];
    groups[section].push(field);
    return groups;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-gray-200">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-8">
            {Object.entries(groupedFields).map(([sectionName, sectionFields]) => (
              <div key={sectionName}>
                {sectionName !== 'main' && (
                  <h3 className="text-lg font-medium text-gray-200 border-b border-gray-700 pb-2 mb-4">
                    {sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}
                  </h3>
                )}
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                  {sectionFields.map(field => (
                    <div key={field.name} className={field.gridCols === 2 ? 'md:col-span-2' : ''}>
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700 bg-gray-800/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {(isSubmitting || loading) ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <CheckCircleIcon className="w-4 h-4 mr-2" />
              )}
              {submitText}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};