'use client';

import { useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import { Edit, Trash2, Plus, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

import { formatDate, formatFullName, formatAddress } from '@/lib/format';
import { Patient, PatientStatus } from '@/types/patient';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PatientListProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (patientId: number) => void;
  onAdd?: () => void;
}

const STATUS_COLORS: Record<PatientStatus, string> = {
  Inquiry: 'bg-blue-100 text-blue-800',
  Onboarding: 'bg-yellow-100 text-yellow-800',
  Active: 'bg-green-100 text-green-800',
  Churned: 'bg-red-100 text-red-800',
};

export default function PatientList({ patients, onEdit, onDelete, onAdd }: PatientListProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);

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

  const columnHelper = createColumnHelper<Patient>();

  const columns = [
    columnHelper.accessor((row) => formatFullName(row), {
      id: 'name',
      header: 'Patient',
      enableSorting: true,
    }),
    columnHelper.accessor('dateOfBirth', {
      header: 'Date of Birth',
      cell: (info) => formatDate(info.getValue()),
      enableSorting: true,
      sortingFn: 'datetime',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[info.getValue()]}`}
        >
          {info.getValue()}
        </span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor((row) => formatAddress(row), {
      id: 'address',
      header: 'Address',
      cell: (info) => <span className="max-w-xs truncate block">{info.getValue()}</span>,
      enableSorting: true,
    }),
    columnHelper.accessor('createdAt', {
      header: 'Added',
      cell: (info) => formatDate(info.getValue()),
      enableSorting: true,
      sortingFn: 'datetime',
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(row.original)}
            title="Edit patient"
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteClick(row.original.id)}
            className="text-destructive hover:text-destructive"
            title="Delete patient"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: patients,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-10">
        <h2 className="text-2xl font-bold">Patient Dashboard</h2>
        {onAdd && (
          <Button onClick={onAdd} className="mt-2 sm:mt-0">
            <Plus className="mr-2 h-4 w-4" />
            Add New Patient
          </Button>
        )}
      </div>

      <div className="bg-gray-50 px-4 py-2 rounded-md">
        <p className="text-sm text-gray-600">
          {patients.length === 0
            ? 'No patients found'
            : `Showing ${patients.length} patient${patients.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      <div className="md:hidden space-y-4">
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(patient)}
                title="Edit patient"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteClick(patient.id)}
                title="Delete patient"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-6 py-3">
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        type="button"
                        className="flex items-center space-x-1 cursor-pointer select-none hover:text-gray-900 focus:outline-none focus:text-gray-900 text-left font-medium text-xs text-gray-500 uppercase tracking-wider transition-colors"
                        onClick={header.column.getToggleSortingHandler()}
                        title={`Sort by ${header.column.columnDef.header as string}`}
                      >
                        <span>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        <span className="ml-1">
                          {{
                            asc: <ChevronUp className="h-4 w-4" />,
                            desc: <ChevronDown className="h-4 w-4" />,
                          }[header.column.getIsSorted() as string] ?? (
                            <ChevronsUpDown className="h-4 w-4 opacity-50" />
                          )}
                        </span>
                      </button>
                    ) : (
                      <span className="font-medium text-xs text-gray-500 uppercase tracking-wider">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </span>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No patients found. Add your first patient to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this patient? This action cannot be undone.
            </p>
            <div className="flex space-x-3 justify-end">
              <Button variant="outline" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
