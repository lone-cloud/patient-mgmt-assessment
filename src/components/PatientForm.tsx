'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreatePatientRequest, PatientStatus } from '@/types/patient';
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
}

const PATIENT_STATUSES: PatientStatus[] = ['Inquiry', 'Onboarding', 'Active', 'Churned'];

// Zod validation schema - much more elegant!
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

export default function PatientForm({ onSubmit, onCancel, isLoading = false }: PatientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
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
      // Transform data to match the expected type
      const patientData: CreatePatientRequest = {
        ...data,
        middleName: data.middleName?.trim() || undefined,
      };
      
      await onSubmit(patientData);
      reset(); // Reset form on successful submission
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="First Name"
              fieldName="firstName"
              register={register}
              errors={errors}
              isLoading={isLoading}
              required
            />

            <FormField
              label="Middle Name"
              fieldName="middleName"
              register={register}
              errors={errors}
              isLoading={isLoading}
            />

            <FormField
              label="Last Name"
              fieldName="lastName"
              register={register}
              errors={errors}
              isLoading={isLoading}
              required
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

            <div>
              <Label htmlFor="status">Status *</Label>
              <Select
                value={statusValue}
                onValueChange={(value: PatientStatus) => setValue('status', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
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

          <div className="space-y-4">
            <FormField
              label="Street Address"
              fieldName="street"
              register={register}
              errors={errors}
              isLoading={isLoading}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="City"
                fieldName="city"
                register={register}
                errors={errors}
                isLoading={isLoading}
                required
              />

              <FormField
                label="State/Province"
                fieldName="state"
                register={register}
                errors={errors}
                isLoading={isLoading}
                required
              />

              <FormField
                label="ZIP/Postal Code"
                fieldName="zipCode"
                register={register}
                errors={errors}
                isLoading={isLoading}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding Patient...' : 'Add Patient'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
