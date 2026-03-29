# Gestura Backend API

Backend server for Gestura learning platform.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Make sure MongoDB is running

3. Seed the database:
```bash
npm run seed
```

4. Start the server:
```bash
npm run dev
```

Server runs on http://localhost:5000

## API Endpoints

### Authentication
- POST /api/auth/register - Register user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Institutions
- GET /api/institutions - Get all institutions
- POST /api/institutions - Create institution (Admin only)

## Test Accounts

- Admin: admin@gestura.com / admin123
- Teacher: teacher@gestura.com / teacher123
- Student: lily@gestura.com / student123
- Parent: parent@gestura.com / parent123
