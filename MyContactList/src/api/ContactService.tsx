// src/api/ContactService.ts
import axiosInstance from "./axios";
import type { Contact, PaginatedResponse } from "../types";

const API_URL = "http://localhost:8080/contacts";

export const saveContact = async (formData: FormData): Promise<Contact> => {
  try {
    const { data } = await axiosInstance.post<Contact>(API_URL, formData);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to save contact");
  }
};

export const getContact = async (id: string): Promise<Contact> => {
  const { data } = await axiosInstance.get<Contact>(`${API_URL}/${id}`);
  return data;
};

export const getAllContacts = async (
  page: number = 0,
  size: number = 10
): Promise<PaginatedResponse> => {
  const { data } = await axiosInstance.get<PaginatedResponse>(
    `${API_URL}?page=${page}&size=${size}`
  );
  return {
    ...data,
    content: data.content.map((contact: Contact) => ({
      ...contact,
    })),
  };
};

export const updateContact = async (contact: Contact): Promise<Contact> => {
  const { data } = await axiosInstance.put<Contact>(
    `${API_URL}/${contact.id}`,
    contact
  );
  return data;
};

export const updateImage = async (formData: FormData): Promise<void> => {
  await axiosInstance.put(`${API_URL}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteContact = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${API_URL}/${id}`);
};
