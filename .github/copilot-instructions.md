# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a Next.js patient management application for healthcare providers built with:

- **Next.js 15** with App Router and TypeScript
- **Tailwind CSS** for styling
- **SQLite** for local data persistence
- **ESLint** with accessibility linting
- **Prettier** for code formatting

## Key Features

- Patient data input forms (names, DOB, status, address)
- Patient data viewing dashboard
- Accessibility-compliant UI components
- Local SQLite database for data persistence

## Development Guidelines

- Use TypeScript for all components and utilities
- Follow Next.js App Router patterns
- Implement responsive design with Tailwind CSS
- Ensure accessibility compliance (WCAG guidelines)
- Use proper form validation and error handling
- Structure components for reusability

## Database Schema

- Patient table with fields: id, firstName, middleName, lastName, dateOfBirth, status, street, city, state, zipCode, createdAt, updatedAt
- Status options: Inquiry, Onboarding, Active, Churned
