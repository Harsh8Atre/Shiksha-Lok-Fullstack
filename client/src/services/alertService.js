import api from './api';

export const createAlert = (data) => api.post('/alerts', data);
export const getAlerts = () => api.get('/alerts');
export const markAlertAsRead = (id) => api.put(`/alerts/${id}/read`);

export default { createAlert, getAlerts, markAlertAsRead };
