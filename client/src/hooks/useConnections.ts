import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/axios';

export const useConnect = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (receiverId: string) => {
      const { data } = await apiClient.post('/users/connect', { receiverId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discoverUsers'] });
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
};

export const useAcceptConnection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (senderId: string) => {
      const { data } = await apiClient.post('/users/connect/accept', { senderId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['discoverUsers'] });
      queryClient.invalidateQueries({ queryKey: ['connectionRequests'] });
      queryClient.invalidateQueries({ queryKey: ['myConnections'] });
    },
  });
};

export const useMyConnections = () => {
  return useQuery({
    queryKey: ['myConnections'],
    queryFn: async () => {
      const { data } = await apiClient.get('/users/connections');
      return data.data;
    },
  });
};
export const useConnectionRequests = () => {
  return useQuery({
    queryKey: ['connectionRequests'],
    queryFn: async () => {
      const { data } = await apiClient.get('/users/connection-requests');
      return data.data;
    },
  });
};
