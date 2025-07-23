'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  fieldName: string;
  error?: { message?: string };
}

export const ErrorMessage = ({ fieldName, error }: ErrorMessageProps) => {
  if (!error?.message) return null;
  
  return (
    <p 
      id={`${fieldName}-error`} 
      className="text-sm text-red-600 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200" 
      role="alert"
    >
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      {error.message}
    </p>
  );
};

interface FormFieldProps {
  label: string;
  fieldName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  errors: Record<string, { message?: string } | undefined>;
  isLoading: boolean;
  type?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export const FormField = ({ 
  label, 
  fieldName, 
  register, 
  errors, 
  isLoading, 
  type = 'text', 
  required = false,
  placeholder,
  className 
}: FormFieldProps) => {
  const hasError = !!errors[fieldName];
  
  return (
    <div className={`space-y-2 ${className || ''}`}>
      <Label 
        htmlFor={fieldName}
        className="text-sm font-medium text-gray-700 flex items-center gap-1"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        {...register(fieldName)}
        type={type}
        id={fieldName}
        placeholder={placeholder}
        className={`
          transition-all duration-200 
          ${hasError 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/10'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
        `}
        aria-describedby={hasError ? `${fieldName}-error` : undefined}
        disabled={isLoading}
      />
      <ErrorMessage fieldName={fieldName} error={errors[fieldName]} />
    </div>
  );
};
