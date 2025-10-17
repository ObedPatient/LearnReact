import axios from 'axios';
import type { PaginatedResponse, Contact } from '../types';

// Base URL for the Spring Boot backend
const BASE_URL = 'http://localhost:8080';

// Fetch all contacts with pagination
export const getAllContacts = async (page: number = 0, size: number = 10): Promise<PaginatedResponse> => {
  try {
    const response = await axios.get<PaginatedResponse>(`${BASE_URL}/contacts`, {
      params: { page, size },
    });
    return response.data;
  } catch (error: any) {
    // Log detailed error information
    if (axios.isAxiosError(error)) {
      console.error('getAllContacts error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
      throw new Error(`Failed to fetch contacts: ${error.message}${error.response?.status ? ` (Status: ${error.response.status})` : ''}`);
    } else {
      console.error('getAllContacts error:', error);
      throw new Error('Failed to fetch contacts: Unknown error');
    }
  }
};

// Fetch a single contact by ID
export const getContact = async (id: string): Promise<Contact> => {
  try {
    const response = await axios.get<Contact>(`${BASE_URL}/contacts/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('getContact error:', error);
    throw new Error(`Failed to fetch contact: ${error.message}`);
  }
};

// Save a new contact
export const saveContact = async (contact: Contact): Promise<Contact> => {
  try {
    const response = await axios.post<Contact>(`${BASE_URL}/contacts`, contact);
    return response.data;
  } catch (error: any) {
    console.error('saveContact error:', error);
    throw new Error(`Failed to save contact: ${error.message}`);
  }
};

// Update an existing contact
export const updateContact = async (id: string, contact: Contact): Promise<Contact> => {
  try {
    const response = await axios.put<Contact>(`${BASE_URL}/contacts/${id}`, contact);
    return response.data;
  } catch (error: any) {
    console.error('updateContact error:', error);
    throw new Error(`Failed to update contact: ${error.message}`);
  }
};

// Update contact image
export const updateImage = async (id: string, file: File): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('file', file);
    await axios.put(`${BASE_URL}/contacts/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } catch (error: any) {
    console.error('updateImage error:', error);
    throw new Error(`Failed to update image: ${error.message}`);
  }
};

// Delete a contact
export const deleteContact = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/contacts/${id}`);
  } catch (error: any) {
    console.error('deleteContact error:', error);
    throw new Error(`Failed to delete contact: ${error.message}`);
  }
};