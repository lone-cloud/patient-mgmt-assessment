import { Patient } from '@/types/patient';

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatFullName = (patient: Patient) => {
  return `${patient.firstName}${patient.middleName ? ` ${patient.middleName}` : ''} ${patient.lastName}`;
};

export const formatAddress = (patient: Patient) => {
  return `${patient.street}, ${patient.city}, ${patient.state} ${patient.zipCode}`;
};
