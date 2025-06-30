export interface Customer {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
}

export interface LoginResponse {
  token: string;                 
  customer: Customer;    
}