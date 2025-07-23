# Patient Management System

A user-friendly, web-based application that allows healthcare providers to efficiently manage critical patient data.

## Technology Stack

- **Frontend**: Next.js 15 with React 19 and TypeScript
- **Styling**: Tailwind CSS for modern, responsive design
- **UI Components**: shadcn/ui with Sonner for toast notifications
- **Database**: SQLite with better-sqlite3 for local data persistence
- **Code Quality**: ESLint with accessibility rules and Prettier formatting
- **API**: Next.js API routes for backend functionality

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd patient-mgmt-assessment
```

2. Install dependencies:

```bash
npm install
```

3.Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Adding a New Patient

1. Click the "Add New Patient" button on the main dashboard
2. Fill in all required patient information fields
3. Select the appropriate patient status
4. Click "Add Patient" to save

### Viewing Patients

- All patients are displayed in a responsive dashboard
- Patient information is automatically sorted by creation date (newest first)

### Managing Patients

- Click the Edit icon (✏️) to modify patient information
- Click the Delete icon (🗑️) to remove a patient record with confirmation dialog

## Database Schema

The application uses a SQLite database with the following patient table structure:

```sql
CREATE TABLE patients (
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
);
```

## API Endpoints

- `GET /api/patients` - Retrieve all patients (with optional search query)
- `POST /api/patients` - Create a new patient
- `GET /api/patients/[id]` - Retrieve a specific patient
- `PUT /api/patients/[id]` - Update a patient
- `DELETE /api/patients/[id]` - Delete a patient

## Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

## Accessibility

This application follows WCAG accessibility guidelines:

- Semantic HTML structure
- Proper ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes
- Form validation with clear error messages

## Code Quality

- **ESLint**: Configured with Next.js, TypeScript, and accessibility rules
- **Prettier**: Automatic code formatting
- **TypeScript**: Full type safety throughout the application
- **Error Handling**: Comprehensive error handling for all user interactions

## License

This project is licensed under the MIT License.
