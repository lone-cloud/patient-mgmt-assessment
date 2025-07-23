import PatientManagementClient from '@/components/PatientManagementClient';
import { PatientService } from '@/services/patientService';

export default async function Home() {
  const initialPatients = PatientService.getAllPatients();

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PatientManagementClient initialPatients={initialPatients} />
      </div>
    </main>
  );
}
