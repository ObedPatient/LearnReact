// src/types/index.ts
export interface Contact {
  id: string;
  imageUrl: string;
  name: string;
  title: string;
  email: string;
  address: string;
  phone: string;
  status: string;
}

export interface PaginatedResponse {
  content: Contact[];
  totalPages: number;
  totalElements: number;
  number: number;
}