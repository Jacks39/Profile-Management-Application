# Profile Management App

A React + TypeScript application for managing multiple user profiles with a mock Express API backend.

## Features

- ✅ Create, read, update, and delete user profiles
- ✅ Multiple profile management with profile switching
- ✅ Form validation (name, email, age)
- ✅ Express.js mock API backend
- ✅ Redux state management
- ✅ Material-UI components
- ✅ React Router navigation

## Tech Stack

**Frontend:**
- React 19
- TypeScript
- Redux Toolkit
- React Router
- Material-UI (MUI)
- Vite

**Backend:**
- Express.js
- CORS
- Node.js

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

### Option 1: Run Frontend and Backend Separately

**Terminal 1 - Start the API Server (Port 5000):**
```bash
npm run server
```

**Terminal 2 - Start the Frontend (Port 3000):**
```bash
npm run dev
```

### Option 2: Run Both Simultaneously

```bash
npm run dev:all
```

## API Endpoints

The mock API runs on `http://localhost:5000`

### Profiles API

- **GET** `/api/profiles` - Fetch all profiles
- **GET** `/api/profiles/:id` - Fetch single profile
- **POST** `/api/profiles` - Create new profile
- **PUT** `/api/profiles/:id` - Update existing profile
- **DELETE** `/api/profiles/:id` - Delete profile
- **GET** `/api/health` - Health check

### Example Request

**Create Profile (POST):**
```bash
curl -X POST http://localhost:5000/api/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "age": 30
  }'
```

**Update Profile (PUT):**
```bash
curl -X PUT http://localhost:5000/api/profiles/1234567890 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com",
    "age": 28
  }'
```

**Delete Profile (DELETE):**
```bash
curl -X DELETE http://localhost:5000/api/profiles/1234567890
```

## Application Routes

- **`/`** - Home page (All profiles)
- **`/profile`** - Profile details page
- **`/profile-form`** - Create new profile
- **`/profile-form?edit=true`** - Edit existing profile

## Project Structure

```
profile-management-app/
├── src/
│   ├── components/
│   │   └── Navigation.tsx
│   ├── pages/
│   │   ├── Profile.tsx (Home - All profiles)
│   │   ├── ProfileDetails.tsx (Single profile details)
│   │   ├── ProfileForm.tsx (Create/Edit form)
│   │   └── NotFound.tsx
│   ├── store/
│   │   ├── index.ts
│   │   └── profileSlice.ts
│   ├── types/
│   │   └── profile.ts
│   ├── utils/
│   │   └── mockApi.ts
│   ├── App.tsx
│   └── index.tsx
├── server.ts (Express API)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

## Form Validation

- **First Name:** Minimum 3 characters
- **Last Name:** Minimum 3 characters
- **Email:** Valid email format
- **Age:** Single or double digit (0-99), optional

## Browser Storage

Data is persisted on the server (in-memory). When the server restarts, all profiles will be cleared.

To persist data permanently, you can:
1. Connect to a real database (MongoDB, PostgreSQL, etc.)
2. Implement file-based storage
3. Use cloud services like Firebase

## Development

- Frontend hot reload: Enabled via Vite
- API debug: Check browser Network tab or terminal logs
- Redux DevTools: Available for debugging state

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

## License

ISC
