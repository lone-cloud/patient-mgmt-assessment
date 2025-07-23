export type PatientStatus = 'Inquiry' | 'Onboarding' | 'Active' | 'Churned';

export interface Patient {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  status: PatientStatus;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientRequest {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  status: PatientStatus;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {
  id: number;
}
