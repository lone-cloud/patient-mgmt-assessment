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
import { toast } from 'sonner';

interface PatientManagementClientProps {
  initialPatients: Patient[];
}

export default function PatientManagementClient({ initialPatients }: PatientManagementClientProps) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

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
      toast.success('Patient added successfully!');
    } catch (error) {
      console.error('Error adding patient:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to add patient. Please try again.',
      );
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPatient = async (patientData: CreatePatientRequest) => {
    if (!editingPatient) return;

    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/patients/${editingPatient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update patient');
      }

      const updatedPatient = await response.json();
      setPatients((prev) =>
        prev.map((patient) => (patient.id === editingPatient.id ? updatedPatient : patient)),
      );
      setEditingPatient(null);
      setIsModalOpen(false);
      toast.success('Patient updated successfully!');
    } catch (error) {
      console.error('Error updating patient:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to update patient. Please try again.',
      );
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditModal = (patient: Patient) => {
    setEditingPatient(patient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPatient(null);
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
      toast.success('Patient deleted successfully!');
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast.error('Failed to delete patient. Please try again.');
    }
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-4xl max-h-screen overflow-y-auto m-0 sm:m-6 w-full sm:w-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {editingPatient ? 'Edit Patient' : 'Add New Patient'}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              {editingPatient
                ? 'Update the patient information below.'
                : 'Enter the patient information below to add them to the system.'}
            </DialogDescription>
          </DialogHeader>
          <PatientForm
            onSubmit={editingPatient ? handleEditPatient : handleAddPatient}
            onCancel={handleCloseModal}
            isLoading={isSubmitting}
            initialData={editingPatient || undefined}
          />
        </DialogContent>
      </Dialog>

      <PatientList
        patients={patients}
        onEdit={handleOpenEditModal}
        onDelete={handleDeletePatient}
        onAdd={() => setIsModalOpen(true)}
      />
    </>
  );
}
