import axios from 'axios';
import { storage } from './storage';
import { Platform } from 'react-native';

// User's Local IP address for physical device Expo Go testing
const BASE_URL = 'https://healthcare-solution-1.onrender.com/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await storage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  if (error.response && error.response.status === 401) {
    // We will handle logout in a higher-level hook or context, 
    // but clearing storage here ensures local state is wiped if server rejects token
    await storage.clear();
  }
  return Promise.reject(error);
});
