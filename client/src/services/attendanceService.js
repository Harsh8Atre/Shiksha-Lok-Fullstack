import api from './api';

export const getSessionAttendance = (sessionId) => api.get(`/attendance/session/${sessionId}`);
export const getStudentAttendance = (studentId) => api.get(`/attendance/student/${studentId}`);

export default { getSessionAttendance, getStudentAttendance };
