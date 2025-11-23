export enum KefirType {
  MILK_KEFIR = 'milk_kefir',
  WATER_KEFIR = 'water_kefir',
}

export enum FermentStatus {
  FERMENTING = 'fermenting',
  FINISHED = 'finished',
  ARCHIVED = 'archived',
}

export interface Ferment {
  id: string;
  user_id: string;
  type: KefirType;
  start_time: string; // ISO String
  target_hours: number;
  end_time?: string; // ISO String
  status: FermentStatus;
  notes?: string;
  created_at: string;
  // Specific fields
  milk_type?: string;
  milk_volume?: number;
  sugar_type?: string;
  sugar_amount?: number;
  water_volume?: number;
}

export interface User {
  id: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}