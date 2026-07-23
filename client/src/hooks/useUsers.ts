import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/axios';

export const useMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await apiClient.get('/users/me');
      return data.data;
    },
    retry: false, // Don't retry on 401s, let the interceptor handle logout
  });
};

export const useDiscoverUsers = () => {
  return useQuery({
    queryKey: ['discoverUsers'],
    queryFn: async () => {
      const { data } = await apiClient.get('/users/discover');
      return data.data;
    },
  });
};

export const useAllUsers = (searchQuery: string = '') => {
  return useQuery({
    queryKey: ['allUsers', searchQuery],
    queryFn: async () => {
      const { data } = await apiClient.get('/users/all', { params: { search: searchQuery } });
      return data.data;
    },
  });
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await apiClient.get(`/users/${userId}`);
      return data.data;
    },
    enabled: !!userId,
  });
};
