import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/axios';

export const useChatHistory = (receiverId: string) => {
  return useQuery({
    queryKey: ['chat', receiverId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/chats/${receiverId}`);
      return data.data;
    },
    enabled: !!receiverId,
  });
};

export const useRecentChats = () => {
  return useQuery({
    queryKey: ['recentChats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/chats/recent');
      return data.data;
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ receiverId, message, sharedPostId }: { receiverId: string | string[], message?: string, sharedPostId?: string }) => {
      const { data } = await apiClient.post('/chats', { receiverId, message, sharedPostId });
      return data.data; 
    },
    onSuccess: (data, variables) => {
      if (Array.isArray(variables.receiverId)) {
        variables.receiverId.forEach(id => {
          queryClient.invalidateQueries({ queryKey: ['chat', id] });
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ['chat', variables.receiverId] });
      }
      queryClient.invalidateQueries({ queryKey: ['recentChats'] });
    },
  });
};
