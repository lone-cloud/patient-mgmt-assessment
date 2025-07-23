import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'patients.db');

const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

const createPatientsTable = `
  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    middleName TEXT,
    lastName TEXT NOT NULL,
    dateOfBirth TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Inquiry', 'Onboarding', 'Active', 'Churned')),
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zipCode TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

db.exec(createPatientsTable);

const createUpdateTrigger = `
  CREATE TRIGGER IF NOT EXISTS update_patients_updated_at
  AFTER UPDATE ON patients
  FOR EACH ROW
  BEGIN
    UPDATE patients SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END
`;

db.exec(createUpdateTrigger);

export default db;
