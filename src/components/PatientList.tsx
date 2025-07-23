'use client';

import { useState } from 'react';
import { Patient, PatientStatus } from '@/types/patient';

interface PatientListProps {
  patients: Patient[];
  onEdit?: (patient: Patient) => void;
  onDelete?: (patientId: number) => void;
  onSearch?: (query: string) => void;
  isLoading?: boolean;
}

const STATUS_COLORS: Record<PatientStatus, string> = {
  Inquiry: 'bg-blue-100 text-blue-800',
  Onboarding: 'bg-yellow-100 text-yellow-800',
  Active: 'bg-green-100 text-green-800',
  Churned: 'bg-red-100 text-red-800',
};

export default function PatientList({
  patients,
  onEdit,
  onDelete,
  onSearch,
  isLoading = false,
}: PatientListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatFullName = (patient: Patient) => {
    return `${patient.firstName}${patient.middleName ? ` ${patient.middleName}` : ''} ${patient.lastName}`;
  };

  const formatAddress = (patient: Patient) => {
    return `${patient.street}, ${patient.city}, ${patient.state} ${patient.zipCode}`;
  };

  const handleDeleteClick = (patientId: number) => {
    setShowDeleteConfirm(patientId);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm && onDelete) {
      onDelete(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading patients...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Patient Dashboard</h2>
        <div className="w-full sm:w-auto">
          <label htmlFor="search" className="sr-only">
            Search patients
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search by name or status..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Patient Count */}
      <div className="bg-gray-50 px-4 py-2 rounded-md">
        <p className="text-sm text-gray-600">
          {patients.length === 0
            ? 'No patients found'
            : `Showing ${patients.length} patient${patients.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Patient Cards - Mobile View */}
      <div className="sm:hidden space-y-4">
        {patients.map((patient) => (
          <div key={patient.id} className="bg-white p-4 rounded-lg shadow-md border">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{formatFullName(patient)}</h3>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[patient.status]}`}
              >
                {patient.status}
              </span>
            </div>

            <div className="space-y-1 text-sm text-gray-600 mb-3">
              <p>
                <span className="font-medium">DOB:</span> {formatDate(patient.dateOfBirth)}
              </p>
              <p>
                <span className="font-medium">Address:</span> {formatAddress(patient)}
              </p>
              <p>
                <span className="font-medium">Added:</span> {formatDate(patient.createdAt)}
              </p>
            </div>

            <div className="flex space-x-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(patient)}
                  className="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => handleDeleteClick(patient.id)}
                  className="px-3 py-1 text-sm text-red-600 bg-red-50 rounded hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Patient Table - Desktop View */}
      <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Patient
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date of Birth
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Address
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Added
              </th>
              {(onEdit || onDelete) && (
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{formatFullName(patient)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(patient.dateOfBirth)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[patient.status]}`}
                  >
                    {patient.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                  {formatAddress(patient)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(patient.createdAt)}
                </td>
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(patient)}
                        className="text-blue-600 hover:text-blue-900 focus:outline-none focus:underline"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => handleDeleteClick(patient.id)}
                        className="text-red-600 hover:text-red-900 focus:outline-none focus:underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {patients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No patients found. Add your first patient to get started.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this patient? This action cannot be undone.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
