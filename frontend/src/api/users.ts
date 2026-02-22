import apiClient from './client';
import { User } from '../types';

export const listUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<User[] | { users: User[] }>('/api/users');
  const data = response.data;
  if (Array.isArray(data)) return data;
  return data.users || [];
};

export const updateUserRole = async (userId: string, role: string): Promise<User> => {
  const response = await apiClient.patch<User>(`/api/users/${userId}/role`, { role });
  return response.data;
};
