export interface Trip {
  id?: number;
  destination: string;
  budget: number;
  travelStyle: 'BACKPACKER' | 'LUXURY' | 'STANDARD';
  requiresVisa: boolean;
  groupSize: string;
  startDate: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  username: string;
}