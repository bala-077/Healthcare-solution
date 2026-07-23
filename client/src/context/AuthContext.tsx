import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

type UserProfile = {
  _id: string;
  mobileNumber: string;
  name: string;
  occupation: string;
  profileImage?: string;
  connections: string[];
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  login: (token: string, userData?: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: UserProfile) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await storage.getItem('jwt');
      if (token) {
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error('Failed to restore auth status', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string, userData?: UserProfile) => {
    await storage.setItem('jwt', token);
    setIsAuthenticated(true);
    if (userData) {
      setUserState(userData);
    }
  };

  const logout = async () => {
    await storage.clear();
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Firebase signout error', error);
    }
    setIsAuthenticated(false);
    setUserState(null);
  };

  const setUser = (userData: UserProfile) => {
    setUserState(userData);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
