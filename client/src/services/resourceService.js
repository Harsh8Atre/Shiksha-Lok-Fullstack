import api from './api';

export const uploadResource = (formData) => api.post('/resources', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
export const getCourseResources = (courseId) => api.get(`/resources/course/${courseId}`);
export const deleteResource = (id) => api.delete(`/resources/${id}`);

export default { uploadResource, getCourseResources, deleteResource };
