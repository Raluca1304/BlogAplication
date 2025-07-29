// Common data types used throughout the application

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  authorId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

// Props interfaces for components
export interface LoginFormProps {
  username: string;
  password: string;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  onLogin: () => void;
}

export interface RegisterFormProps {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setEmail: (email: string) => void;
  onRegister: () => void;
} 