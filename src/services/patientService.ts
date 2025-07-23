import db from '@/lib/database';
import { Patient, CreatePatientRequest, UpdatePatientRequest } from '@/types/patient';

export class PatientService {
  static getAllPatients(): Patient[] {
    const stmt = db.prepare('SELECT * FROM patients ORDER BY createdAt DESC');
    return stmt.all() as Patient[];
  }

  static getPatientById(id: number): Patient | null {
    const stmt = db.prepare('SELECT * FROM patients WHERE id = ?');
    return stmt.get(id) as Patient | null;
  }

  static createPatient(patient: CreatePatientRequest): Patient {
    const stmt = db.prepare(`
      INSERT INTO patients (firstName, middleName, lastName, dateOfBirth, status, street, city, state, zipCode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      patient.firstName,
      patient.middleName || null,
      patient.lastName,
      patient.dateOfBirth,
      patient.status,
      patient.street,
      patient.city,
      patient.state,
      patient.zipCode,
    );

    return this.getPatientById(result.lastInsertRowid as number)!;
  }

  static updatePatient(patient: UpdatePatientRequest): Patient | null {
    const existingPatient = this.getPatientById(patient.id);
    if (!existingPatient) {
      return null;
    }

    const fieldsToUpdate = Object.keys(patient).filter(
      (key) => key !== 'id' && patient[key as keyof UpdatePatientRequest] !== undefined,
    );

    if (fieldsToUpdate.length === 0) {
      return existingPatient;
    }

    const setClause = fieldsToUpdate.map((field) => `${field} = ?`).join(', ');
    const values = fieldsToUpdate.map((field) => patient[field as keyof UpdatePatientRequest]);
    values.push(patient.id);

    const stmt = db.prepare(`UPDATE patients SET ${setClause} WHERE id = ?`);
    stmt.run(...values);

    return this.getPatientById(patient.id);
  }

  static deletePatient(id: number): boolean {
    const stmt = db.prepare('DELETE FROM patients WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  static searchPatients(query: string): Patient[] {
    const stmt = db.prepare(`
      SELECT * FROM patients 
      WHERE firstName LIKE ? OR lastName LIKE ? OR status LIKE ?
      ORDER BY createdAt DESC
    `);
    const searchTerm = `%${query}%`;
    return stmt.all(searchTerm, searchTerm, searchTerm) as Patient[];
  }
}
