'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Reusable Error Display Component
interface ErrorMessageProps {
  fieldName: string;
  error?: { message?: string };
}

export const ErrorMessage = ({ fieldName, error }: ErrorMessageProps) => {
  if (!error?.message) return null;
  
  return (
    <p id={`${fieldName}-error`} className="mt-1 text-sm text-destructive" role="alert">
      {error.message}
    </p>
  );
};

// Reusable Form Field Component
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
    <div className={className}>
      <Label htmlFor={fieldName}>
        {label} {required && '*'}
      </Label>
      <Input
        {...register(fieldName)}
        type={type}
        id={fieldName}
        placeholder={placeholder}
        className={hasError ? 'border-destructive' : ''}
        aria-describedby={hasError ? `${fieldName}-error` : undefined}
        disabled={isLoading}
      />
      <ErrorMessage fieldName={fieldName} error={errors[fieldName]} />
    </div>
  );
};
