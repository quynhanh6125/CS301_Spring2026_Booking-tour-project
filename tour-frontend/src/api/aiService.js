import api from './axios';

export const aiService = {
  chat: (message, userId, role) => 
    api.get('/ai/chat', { params: { message, userId, role } }),
};