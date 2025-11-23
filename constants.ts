import { KefirType } from './types';

export const APP_NAME = "Kefir Lover";

export const KEFIR_TYPES = [
  { label: 'Milk Kefir', value: KefirType.MILK_KEFIR, icon: 'fa-bottle-droplet', color: 'bg-stone-100 text-stone-800 border-stone-200' },
  { label: 'Water Kefir', value: KefirType.WATER_KEFIR, icon: 'fa-glass-water', color: 'bg-sky-50 text-sky-800 border-sky-200' },
];

export const DEFAULT_MILK_HOURS = 24;
export const DEFAULT_WATER_HOURS = 96;

export const MILK_MIN_HOURS = 12;
export const MILK_MAX_HOURS = 24;

export const WATER_MIN_HOURS = 24;
export const WATER_MAX_HOURS = 120;

// Fallback logic for demo purposes if Supabase keys aren't present
export const IS_DEMO_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL;