export interface Profile {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
}

export interface ProfileState {
  profiles: Profile[];
  currentProfileId: string | null;
  loading: boolean;
  error: string | null;
}