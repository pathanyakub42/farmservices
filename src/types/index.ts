export interface Tractor {
  id: string;
  name: string;
  model: string;
  hp: number;
  price: number; // in INR
  image: string;
  description: string;
  stock: number;
  year?: number;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  message?: string;
  tehsil: string;
  village: string;
  interestedTractor?: string;
  date: string;
}

export interface Tehsil {
  id: string;
  name: string;
  villages: string[];
}

// Specific Models Available for Agristar
export const AVAILABLE_MODELS = [
  '1035 Dost',
  '241 Sonaplus', 
  '1035 Maha Shakti',
  '246 Dynatrack'
] as const;

export type AvailableModel = typeof AVAILABLE_MODELS[number];
