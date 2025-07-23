'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreatePatientRequest, PatientStatus, Patient } from '@/types/patient';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PatientFormProps {
  onSubmit: (patient: CreatePatientRequest) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  initialData?: Patient;
}

const PATIENT_STATUSES: PatientStatus[] = ['Inquiry', 'Onboarding', 'Active', 'Churned'];

const patientSchema = z.object({
  firstName: z.string().min(1, 'First name is required').trim(),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required').trim(),
  dateOfBirth: z.string()
    .min(1, 'Date of birth is required')
    .refine((date) => {
      const dob = new Date(date);
      const today = new Date();
      return dob <= today;
    }, 'Date of birth cannot be in the future'),
  status: z.enum(['Inquiry', 'Onboarding', 'Active', 'Churned']),
  street: z.string().min(1, 'Street address is required').trim(),
  city: z.string().min(1, 'City is required').trim(),
  state: z.string().min(1, 'State/Province is required').trim(),
  zipCode: z.string().min(1, 'ZIP/Postal code is required').trim(),
});

type PatientFormData = z.infer<typeof patientSchema>;

export default function PatientForm({ onSubmit, onCancel, isLoading = false, initialData }: PatientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: initialData ? {
      firstName: initialData.firstName,
      middleName: initialData.middleName || '',
      lastName: initialData.lastName,
      dateOfBirth: initialData.dateOfBirth,
      status: initialData.status,
      street: initialData.street,
      city: initialData.city,
      state: initialData.state,
      zipCode: initialData.zipCode,
    } : {
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      status: 'Inquiry',
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });

  const statusValue = watch('status');

  const onFormSubmit = async (data: PatientFormData) => {
    try {
      const patientData: CreatePatientRequest = {
        ...data,
        middleName: data.middleName?.trim() || undefined,
      };
      
      await onSubmit(patientData);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Card className="w-full shadow-lg border-0">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="First Name"
                fieldName="firstName"
                register={register}
                errors={errors}
                isLoading={isLoading}
                required
                placeholder="e.g., John"
              />

              <FormField
                label="Middle Name"
                fieldName="middleName"
                register={register}
                errors={errors}
                isLoading={isLoading}
                placeholder="e.g., Michael"
              />

              <FormField
                label="Last Name"
                fieldName="lastName"
                register={register}
                errors={errors}
                isLoading={isLoading}
                required
                placeholder="e.g., Smith"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Date of Birth"
                fieldName="dateOfBirth"
                register={register}
                errors={errors}
                isLoading={isLoading}
                type="date"
                required
              />

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={statusValue}
                  onValueChange={(value: PatientStatus) => setValue('status', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500/10 transition-all duration-200">
                    <SelectValue placeholder="Choose patient status" />
                  </SelectTrigger>
                  <SelectContent>
                    {PATIENT_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <FormField
              label="Street Address"
              fieldName="street"
              register={register}
              errors={errors}
              isLoading={isLoading}
              required
              placeholder="e.g., 123 Main Street, Apt 4B"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="City"
                fieldName="city"
                register={register}
                errors={errors}
                isLoading={isLoading}
                required
                placeholder="e.g., New York"
              />

              <FormField
                label="State/Province"
                fieldName="state"
                register={register}
                errors={errors}
                isLoading={isLoading}
                required
                placeholder="e.g., NY"
              />

              <FormField
                label="ZIP/Postal Code"
                fieldName="zipCode"
                register={register}
                errors={errors}
                isLoading={isLoading}
                required
                placeholder="e.g., 10001"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              {onCancel && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel} 
                  disabled={isLoading}
                  className="px-6 py-2 transition-all duration-200 hover:bg-gray-50"
                >
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={isLoading}
                className="px-6 py-2 transition-all duration-200 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/20"
              >
                {isLoading 
                  ? `${initialData ? 'Updating' : 'Adding'} Patient...` 
                  : `${initialData ? 'Update' : 'Add'} Patient`
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
  );
}
