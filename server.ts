import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (simulating a database)
interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
}

let profiles: Profile[] = [];

// Routes

// GET all profiles
app.get('/api/profiles', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: profiles,
    message: 'Profiles fetched successfully',
  });
});

// GET single profile by ID
app.get('/api/profiles/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const profile = profiles.find(p => p.id === id);

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Profile not found',
    });
  }

  res.json({
    success: true,
    data: profile,
    message: 'Profile fetched successfully',
  });
});

// POST - Create new profile
app.post('/api/profiles', (req: Request, res: Response) => {
  const { firstName, lastName, email, age } = req.body;

  // Validation
  if (!firstName || !lastName || !email) {
    return res.status(400).json({
      success: false,
      message: 'First name, last name, and email are required',
    });
  }

  const newProfile: Profile = {
    id: Date.now().toString(),
    firstName,
    lastName,
    email,
    age: age || undefined,
  };

  profiles.push(newProfile);

  res.status(201).json({
    success: true,
    data: newProfile,
    message: 'Profile created successfully',
  });
});

// PUT - Update existing profile
app.put('/api/profiles/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, email, age } = req.body;

  const profileIndex = profiles.findIndex(p => p.id === id);

  if (profileIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Profile not found',
    });
  }

  // Validation
  if (!firstName || !lastName || !email) {
    return res.status(400).json({
      success: false,
      message: 'First name, last name, and email are required',
    });
  }

  const updatedProfile: Profile = {
    id,
    firstName,
    lastName,
    email,
    age: age || undefined,
  };

  profiles[profileIndex] = updatedProfile;

  res.json({
    success: true,
    data: updatedProfile,
    message: 'Profile updated successfully',
  });
});

// DELETE - Delete profile
app.delete('/api/profiles/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const profileIndex = profiles.findIndex(p => p.id === id);

  if (profileIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Profile not found',
    });
  }

  const deletedProfile = profiles[profileIndex];
  profiles.splice(profileIndex, 1);

  res.json({
    success: true,
    data: deletedProfile,
    message: 'Profile deleted successfully',
  });
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock API server running on http://localhost:${PORT}`);
  console.log(`📝 API Endpoints:`);
  console.log(`   GET    http://localhost:${PORT}/api/profiles`);
  console.log(`   GET    http://localhost:${PORT}/api/profiles/:id`);
  console.log(`   POST   http://localhost:${PORT}/api/profiles`);
  console.log(`   PUT    http://localhost:${PORT}/api/profiles/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/profiles/:id`);
});
