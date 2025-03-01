export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  credits?: number;
} 