import { createContext } from 'react';
import type { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);