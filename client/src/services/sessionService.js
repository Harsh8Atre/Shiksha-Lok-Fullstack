import api from './api';

export const getSessions = () => api.get('/sessions');
export const getSession = (id) => api.get(`/sessions/${id}`);
export const getSessionByRoom = (roomId) => api.get(`/sessions/room/${roomId}`);
export const createSession = (data) => api.post('/sessions', data);
export const startSession = (id) => api.post(`/sessions/${id}/start`);
export const endSession = (id) => api.post(`/sessions/${id}/end`);

export default {
  getSessions,
  getSession,
  getSessionByRoom,
  createSession,
  startSession,
  endSession
};
