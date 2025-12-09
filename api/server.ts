import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

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
    age,
  };

  profiles.push(newProfile);

  res.status(201).json({
    success: true,
    data: newProfile,
    message: 'Profile created successfully',
  });
});

// PUT - Update profile
app.put('/api/profiles/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, email, age } = req.body;

  const profile = profiles.find(p => p.id === id);

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Profile not found',
    });
  }

  if (firstName) profile.firstName = firstName;
  if (lastName) profile.lastName = lastName;
  if (email) profile.email = email;
  if (age !== undefined) profile.age = age;

  res.json({
    success: true,
    data: profile,
    message: 'Profile updated successfully',
  });
});

// DELETE - Delete profile
app.delete('/api/profiles/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = profiles.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Profile not found',
    });
  }

  profiles.splice(index, 1);

  res.json({
    success: true,
    message: 'Profile deleted successfully',
  });
});

export default app;
