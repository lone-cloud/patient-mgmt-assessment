'use client';

import { useState } from 'react';
import PatientForm from '@/components/PatientForm';
import PatientList from '@/components/PatientList';
import { Patient, CreatePatientRequest } from '@/types/patient';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PatientManagementClientProps {
  initialPatients: Patient[];
}

export default function PatientManagementClient({ initialPatients }: PatientManagementClientProps) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleAddPatient = async (patientData: CreatePatientRequest) => {
    try {
      setIsSubmitting(true);

      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add patient');
      }

      const newPatient = await response.json();
      setPatients((prev) => [newPatient, ...prev]);
      setIsModalOpen(false);
      toast({
        title: 'Success',
        description: 'Patient added successfully!',
      });
    } catch (error) {
      console.error('Error adding patient:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to add patient. Please try again.',
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePatient = async (patientId: number) => {
    try {
      const response = await fetch(`/api/patients/${patientId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete patient');
      }

      setPatients((prev) => prev.filter((patient) => patient.id !== patientId));
      toast({
        title: 'Success',
        description: 'Patient deleted successfully!',
      });
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete patient. Please try again.',
      });
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Management System</h1>
        <p className="text-gray-600">
          Efficiently manage critical patient data for healthcare providers
        </p>
      </div>

      <div className="mb-8">
        <Button onClick={() => setIsModalOpen(true)} className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Add New Patient
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogDescription>
              Enter the patient information below to add them to the system.
            </DialogDescription>
          </DialogHeader>
          <PatientForm
            onSubmit={handleAddPatient}
            onCancel={() => setIsModalOpen(false)}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      <PatientList patients={patients} onDelete={handleDeletePatient} />
    </>
  );
}
