import apiClient from './client';
import { Video } from '../types';

export const listVideos = async (): Promise<Video[]> => {
  const response = await apiClient.get<Video[] | { videos: Video[] }>('/api/videos');
  const data = response.data;
  if (Array.isArray(data)) return data;
  return data.videos || [];
};

export const getVideo = async (id: string): Promise<Video> => {
  const response = await apiClient.get<Video>(`/api/videos/${id}`);
  return response.data;
};

export const uploadVideo = async (
  title: string,
  description: string,
  file: File,
  onUploadProgress?: (progressEvent: { loaded: number; total?: number }) => void
): Promise<Video> => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('file', file);

  const response = await apiClient.post<Video>('/api/videos/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
  return response.data;
};

export const getVideoStatus = async (id: string): Promise<{ status: string }> => {
  const response = await apiClient.get<{ status: string }>(`/api/videos/${id}/status`);
  return response.data;
};
