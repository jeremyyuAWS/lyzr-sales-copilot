import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  const mockUser = {
    id: 'demo-user-id',
    email: 'demo@sales-copilot.com',
  } as User;

  useEffect(() => {
    loadDemoProfile();
  }, []);

  const loadDemoProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'arkojit.kolay@example.com')
      .maybeSingle();

    if (data) {
      setProfile(data);
    } else {
      setProfile({
        id: 'demo-user-id',
        email: 'demo@sales-copilot.com',
        full_name: 'Arkojit Kolay',
        role: 'AE',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
    setLoading(false);
  };

  const signIn = async () => {};
  const signUp = async () => {};
  const signOut = async () => {};

  return (
    <AuthContext.Provider value={{ user: mockUser, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
