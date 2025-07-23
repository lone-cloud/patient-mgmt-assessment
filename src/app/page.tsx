'use client';

import { useState, useEffect } from 'react';
import PatientForm from '@/components/PatientForm';
import PatientList from '@/components/PatientList';
import { Patient, CreatePatientRequest } from '@/types/patient';

export default function Home() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchPatients = async (searchQuery?: string) => {
    try {
      setIsLoading(true);
      const url = searchQuery
        ? `/api/patients?search=${encodeURIComponent(searchQuery)}`
        : '/api/patients';

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }

      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setNotification({
        type: 'error',
        message: 'Failed to load patients. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      setShowForm(false);
      setNotification({
        type: 'success',
        message: 'Patient added successfully!',
      });
    } catch (error) {
      console.error('Error adding patient:', error);
      setNotification({
        type: 'error',
        message:
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
      setNotification({
        type: 'success',
        message: 'Patient deleted successfully!',
      });
    } catch (error) {
      console.error('Error deleting patient:', error);
      setNotification({
        type: 'error',
        message: 'Failed to delete patient. Please try again.',
      });
    }
  };

  const handleSearch = (query: string) => {
    fetchPatients(query);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Management System</h1>
          <p className="text-gray-600">
            Efficiently manage critical patient data for healthcare providers
          </p>
        </div>

        {notification && (
          <div
            className={`mb-6 p-4 rounded-md ${
              notification.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 h-5 w-5 ${
                  notification.type === 'success' ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {notification.type === 'success' ? (
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <p className="ml-3 text-sm font-medium">{notification.message}</p>
              <button
                onClick={() => setNotification(null)}
                className="ml-auto flex-shrink-0 text-gray-400 hover:text-gray-600"
                aria-label="Close notification"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {!showForm && (
          <div className="mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Patient
            </button>
          </div>
        )}

        {showForm && (
          <div className="mb-8">
            <PatientForm
              onSubmit={handleAddPatient}
              onCancel={() => setShowForm(false)}
              isLoading={isSubmitting}
            />
          </div>
        )}

        <PatientList
          patients={patients}
          onDelete={handleDeletePatient}
          onSearch={handleSearch}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}
