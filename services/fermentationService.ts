import { supabase } from './supabaseClient';
import { Ferment, FermentStatus, KefirType, User } from '../types';
import { IS_DEMO_MODE } from '../constants';

// --- Mock Data Helpers for Demo Mode ---
const MOCK_STORAGE_KEY = 'kefir_lover_mock_data';
const MOCK_USER_KEY = 'kefir_lover_mock_user';

const getMockData = (): Ferment[] => {
  const data = localStorage.getItem(MOCK_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const setMockData = (data: Ferment[]) => {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(data));
};

// --- Auth Services ---

export const getCurrentUser = async (): Promise<User | null> => {
  if (IS_DEMO_MODE) {
    const stored = localStorage.getItem(MOCK_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }
  
  if (!supabase) return null;
  
  const { data } = await supabase.auth.getSession();
  if (data.session?.user) {
    return { id: data.session.user.id, email: data.session.user.email || '' };
  }
  return null;
};

export const sendLoginOtp = async (email: string): Promise<{ error?: string }> => {
  if (IS_DEMO_MODE) {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    return {}; 
  }

  if (!supabase) return { error: "Supabase client not initialized" };

  // We set emailRedirectTo to the current origin (e.g., https://kefir-lover.vercel.app or http://localhost:3000)
  // This ensures the magic link redirects back to the correct place.
  const { error } = await supabase.auth.signInWithOtp({ 
    email,
    options: {
      emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
    }
  });
  if (error) return { error: error.message };
  
  return {};
};

export const verifyLoginOtp = async (email: string, token: string): Promise<{ error?: string, user?: User }> => {
  if (IS_DEMO_MODE) {
    await new Promise(r => setTimeout(r, 800));
    if (token === '123456') {
      const fakeUser = { id: 'demo-user-123', email };
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(fakeUser));
      return { user: fakeUser };
    }
    return { error: 'Invalid code. Try 123456' };
  }

  if (!supabase) return { error: "Supabase client not initialized" };

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  if (error) return { error: error.message };
  
  if (data.user) {
    return { user: { id: data.user.id, email: data.user.email || '' } };
  }
  
  return { error: "Verification failed" };
};

export const signOut = async () => {
  if (IS_DEMO_MODE) {
    localStorage.removeItem(MOCK_USER_KEY);
    return;
  }
  if (supabase) await supabase.auth.signOut();
};

// --- Data Services ---

export const getFerments = async (userId: string): Promise<Ferment[]> => {
  if (IS_DEMO_MODE) {
    return getMockData().sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
  }

  if (!supabase) return [];

  const { data, error } = await supabase
    .from('ferments')
    .select('*')
    .eq('user_id', userId)
    .order('start_time', { ascending: false });

  if (error) {
    console.error('Error fetching ferments:', error);
    return [];
  }
  return data as Ferment[];
};

export const getFermentById = async (id: string): Promise<Ferment | null> => {
  if (IS_DEMO_MODE) {
    return getMockData().find(f => f.id === id) || null;
  }

  if (!supabase) return null;

  const { data, error } = await supabase
    .from('ferments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Ferment;
};

export const createFerment = async (
  userId: string,
  type: KefirType,
  targetHours: number,
  notes: string,
  details: {
    milk_type?: string;
    milk_volume?: number;
    sugar_type?: string;
    sugar_amount?: number;
    water_volume?: number;
  } = {}
): Promise<Ferment | null> => {
  const newFerment: Partial<Ferment> = {
    user_id: userId,
    type,
    target_hours: targetHours,
    notes,
    start_time: new Date().toISOString(),
    status: FermentStatus.FERMENTING,
    ...details
  };

  if (IS_DEMO_MODE) {
    const entry: Ferment = {
      ...newFerment as Ferment,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    const current = getMockData();
    setMockData([entry, ...current]);
    return entry;
  }

  if (!supabase) return null;

  const { data, error } = await supabase
    .from('ferments')
    .insert(newFerment)
    .select()
    .single();

  if (error) {
    console.error(error);
    return null;
  }
  return data as Ferment;
};

export const finishFerment = async (id: string): Promise<void> => {
  if (IS_DEMO_MODE) {
    const current = getMockData();
    const updated = current.map(f => {
      if (f.id === id) {
        return {
          ...f,
          status: FermentStatus.FINISHED,
          end_time: new Date().toISOString()
        };
      }
      return f;
    });
    setMockData(updated);
    return;
  }

  if (!supabase) return;

  await supabase
    .from('ferments')
    .update({
      status: FermentStatus.FINISHED,
      end_time: new Date().toISOString(),
    })
    .eq('id', id);
};

export const archiveFerment = async (id: string): Promise<void> => {
  if (IS_DEMO_MODE) {
    const current = getMockData();
    const updated = current.map(f => {
      if (f.id === id) {
        return {
          ...f,
          status: FermentStatus.ARCHIVED,
          end_time: new Date().toISOString()
        };
      }
      return f;
    });
    setMockData(updated);
    return;
  }

  if (!supabase) return;

  await supabase
    .from('ferments')
    .update({
      status: FermentStatus.ARCHIVED,
      end_time: new Date().toISOString(),
    })
    .eq('id', id);
};

export const extendFerment = async (id: string, additionalHours: number): Promise<void> => {
  // We need to fetch current target first to add to it, 
  // but for optimization we can just assume the caller passes the new total 
  // or we do a stored procedure. For simplicity here:
  
  const ferment = await getFermentById(id);
  if (!ferment) return;
  
  const newTarget = (ferment.target_hours || 0) + additionalHours;

  if (IS_DEMO_MODE) {
    const current = getMockData();
    const updated = current.map(f => {
      if (f.id === id) {
        return { ...f, target_hours: newTarget };
      }
      return f;
    });
    setMockData(updated);
    return;
  }

  if (!supabase) return;

  await supabase
    .from('ferments')
    .update({ target_hours: newTarget })
    .eq('id', id);
};