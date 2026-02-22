export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  duration: number;
  status: 'ready' | 'processing' | 'error';
  thumbnailUrl?: string;
  hlsUrl?: string;
  createdAt?: string;
  uploadedBy?: string;
}

export interface VideoListResponse {
  videos: Video[];
}

export interface UploadProgressEvent {
  loaded: number;
  total: number;
}

export interface ApiError {
  message: string;
  error?: string;
}
