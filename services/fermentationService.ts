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

// --- Helper: Parse Ferment Data (Handle Fallback Storage) ---
// If columns like milk_type are missing in DB, we store them in 'notes' as a JSON string.
// This function unpacks them so the UI doesn't know the difference.
const parseFerment = (f: any): Ferment => {
  if (!f) return f;
  let details: any = {};
  let cleanNotes = f.notes || '';

  // Check for our special fallback marker
  if (typeof f.notes === 'string' && f.notes.startsWith('__DETAILS_JSON__')) {
    try {
      const jsonStr = f.notes.replace('__DETAILS_JSON__', '');
      const parsed = JSON.parse(jsonStr);
      details = parsed.details || {};
      cleanNotes = parsed.originalNotes || "";
    } catch (e) {
      console.error("Error parsing fallback notes", e);
    }
  }

  return {
    ...f,
    notes: cleanNotes,
    // If the specific column is null/undefined, try to grab it from the parsed details
    milk_type: f.milk_type || details.milk_type,
    milk_volume: f.milk_volume || details.milk_volume,
    sugar_type: f.sugar_type || details.sugar_type,
    sugar_amount: f.sugar_amount || details.sugar_amount,
    water_volume: f.water_volume || details.water_volume,
  };
};

// --- Helper: Clean Undefined Values ---
// Removes keys with undefined values to prevent Supabase errors during insert
const cleanUndefined = (obj: any) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  );
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

  // We set emailRedirectTo to the current origin + /login (e.g., https://kefir-lover.vercel.app/login)
  // This ensures the magic link redirects explicitly to the login page where the hash handler exists.
  const { error } = await supabase.auth.signInWithOtp({ 
    email,
    options: {
      emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined
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
  // Parse each item to handle potential fallback data
  return (data as any[]).map(parseFerment);
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
  return parseFerment(data);
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
  // Base Object
  const commonFields = {
    user_id: userId,
    type,
    target_hours: targetHours,
    start_time: new Date().toISOString(),
    status: FermentStatus.FERMENTING,
  };

  // Clean undefined values from details before merging
  const fullObject = cleanUndefined({
    ...commonFields,
    notes,
    ...details
  });

  if (IS_DEMO_MODE) {
    const entry: Ferment = {
      ...(fullObject as any),
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    const current = getMockData();
    setMockData([entry, ...current]);
    return entry;
  }

  if (!supabase) return null;

  // Attempt 1: Try inserting normally (assuming columns exist)
  try {
    const { data, error } = await supabase
        .from('ferments')
        .insert(fullObject)
        .select()
        .single();

    if (!error && data) {
        return parseFerment(data);
    }
    
    // If we are here, there was an error. 
    // It might be because columns (milk_type, etc.) don't exist in the table yet.
    console.warn("Standard insert failed, attempting fallback...", error?.message);
    
  } catch (e) {
    console.warn("Exception during insert", e);
  }

  // Attempt 2: Fallback Strategy
  // Package the details into the 'notes' field string
  const fallbackNotes = '__DETAILS_JSON__' + JSON.stringify({
    originalNotes: notes,
    details: cleanUndefined(details)
  });

  const fallbackObject = cleanUndefined({
    ...commonFields,
    notes: fallbackNotes
    // We intentionally DO NOT include the ...details here so the DB doesn't reject them
  });

  const { data: retryData, error: retryError } = await supabase
    .from('ferments')
    .insert(fallbackObject)
    .select()
    .single();

  if (retryError) {
    console.error("Fallback insert failed:", retryError?.message);
    return null;
  }

  return parseFerment(retryData);
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