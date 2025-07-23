import { NextRequest, NextResponse } from 'next/server';
import { PatientService } from '@/services/patientService';
import { CreatePatientRequest } from '@/types/patient';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const patients = search
      ? PatientService.searchPatients(search)
      : PatientService.getAllPatients();

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const requiredFields = [
      'firstName',
      'lastName',
      'dateOfBirth',
      'status',
      'street',
      'city',
      'state',
      'zipCode',
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const validStatuses = ['Inquiry', 'Onboarding', 'Active', 'Churned'];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: Inquiry, Onboarding, Active, Churned' },
        { status: 400 },
      );
    }

    const patientData: CreatePatientRequest = {
      firstName: body.firstName.trim(),
      middleName: body.middleName?.trim() || undefined,
      lastName: body.lastName.trim(),
      dateOfBirth: body.dateOfBirth,
      status: body.status,
      street: body.street.trim(),
      city: body.city.trim(),
      state: body.state.trim(),
      zipCode: body.zipCode.trim(),
    };

    const patient = PatientService.createPatient(patientData);
    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}
