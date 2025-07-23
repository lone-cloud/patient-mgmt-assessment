'use client';

import { useState } from 'react';
import { CreatePatientRequest, PatientStatus } from '@/types/patient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
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

export default function PatientForm({ onSubmit, onCancel, isLoading = false }: PatientFormProps) {
  const [formData, setFormData] = useState<CreatePatientRequest>({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    status: 'Inquiry',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      if (dob > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future';
      }
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State/Province is required';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP/Postal code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        ...formData,
        middleName: formData.middleName?.trim() || undefined,
      });

      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '',
        status: 'Inquiry',
        street: '',
        city: '',
        state: '',
        zipCode: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={errors.firstName ? 'border-destructive' : ''}
                aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                disabled={isLoading}
              />
              {errors.firstName && (
                <p id="firstName-error" className="mt-1 text-sm text-destructive" role="alert">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                type="text"
                id="middleName"
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={errors.lastName ? 'border-destructive' : ''}
                aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                disabled={isLoading}
              />
              {errors.lastName && (
                <p id="lastName-error" className="mt-1 text-sm text-destructive" role="alert">
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={errors.dateOfBirth ? 'border-destructive' : ''}
                aria-describedby={errors.dateOfBirth ? 'dateOfBirth-error' : undefined}
                disabled={isLoading}
              />
              {errors.dateOfBirth && (
                <p id="dateOfBirth-error" className="mt-1 text-sm text-destructive" role="alert">
                  {errors.dateOfBirth}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: PatientStatus) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
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
            <div>
              <Label htmlFor="street">Street Address *</Label>
              <Input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className={errors.street ? 'border-destructive' : ''}
                aria-describedby={errors.street ? 'street-error' : undefined}
                disabled={isLoading}
              />
              {errors.street && (
                <p id="street-error" className="mt-1 text-sm text-destructive" role="alert">
                  {errors.street}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={errors.city ? 'border-destructive' : ''}
                  aria-describedby={errors.city ? 'city-error' : undefined}
                  disabled={isLoading}
                />
                {errors.city && (
                  <p id="city-error" className="mt-1 text-sm text-destructive" role="alert">
                    {errors.city}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="state">State/Province *</Label>
                <Input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={errors.state ? 'border-destructive' : ''}
                  aria-describedby={errors.state ? 'state-error' : undefined}
                  disabled={isLoading}
                />
                {errors.state && (
                  <p id="state-error" className="mt-1 text-sm text-destructive" role="alert">
                    {errors.state}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                <Input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className={errors.zipCode ? 'border-destructive' : ''}
                  aria-describedby={errors.zipCode ? 'zipCode-error' : undefined}
                  disabled={isLoading}
                />
                {errors.zipCode && (
                  <p id="zipCode-error" className="mt-1 text-sm text-destructive" role="alert">
                    {errors.zipCode}
                  </p>
                )}
              </div>
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
