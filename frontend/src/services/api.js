// API service for making HTTP requests
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update-profile', data),
};

// Course APIs
export const courseAPI = {
  getAllCourses: (params) => api.get('/courses', { params }),
  getCourse: (id) => api.get(`/courses/${id}`),
  createCourse: (data) => api.post('/courses', data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  getInstructorCourses: () => api.get('/courses/instructor/my-courses'),
  addVideo: (courseId, data) => api.post(`/courses/${courseId}/videos`, data),
  deleteVideo: (courseId, videoId) =>
    api.delete(`/courses/${courseId}/videos/${videoId}`),
  publishCourse: (id) => api.put(`/courses/${id}/publish`),
  addVideoComment: (courseId, videoId, data) =>
    api.post(`/courses/${courseId}/videos/${videoId}/comments`, data),
  addResource: (courseId, data) => api.post(`/courses/${courseId}/resources`, data),
  deleteResource: (courseId, resourceId) =>
    api.delete(`/courses/${courseId}/resources/${resourceId}`),
  addLesson: (courseId, data) => api.post(`/courses/${courseId}/lessons`, data),
  updateLesson: (courseId, lessonId, data) =>
    api.put(`/courses/${courseId}/lessons/${lessonId}`, data),
  deleteLesson: (courseId, lessonId) =>
    api.delete(`/courses/${courseId}/lessons/${lessonId}`),
};

// Enrollment APIs
export const enrollmentAPI = {
  enrollCourse: (data) => api.post('/enrollments/enroll', data),
  getStudentEnrollments: () => api.get('/enrollments/my-enrollments'),
  getEnrollmentDetails: (courseId) => api.get(`/enrollments/${courseId}`),
  updateProgress: (courseId, data) =>
    api.put(`/enrollments/${courseId}/progress`, data),
  getCourseEnrollments: (courseId) =>
    api.get(`/enrollments/${courseId}/students`),
  issueCertificate: (courseId) =>
    api.post(`/enrollments/${courseId}/certificate`),
};

// Quiz APIs
export const quizAPI = {
  getCourseQuizzes: (courseId) => api.get(`/quizzes/course/${courseId}`),
  getQuiz: (id) => api.get(`/quizzes/${id}`),
  createQuiz: (data) => api.post('/quizzes', data),
  updateQuiz: (id, data) => api.put(`/quizzes/${id}`, data),
  deleteQuiz: (id) => api.delete(`/quizzes/${id}`),
  submitQuiz: (data) => api.post('/quizzes/submit', data),
  getQuizAttempts: (courseId) => api.get(`/quizzes/course/${courseId}/attempts`),
  publishQuiz: (id) => api.put(`/quizzes/${id}/publish`),
};

// Payment APIs
export const paymentAPI = {
  processPayment: (data) => api.post('/payments/process', data),
  getPaymentHistory: () => api.get('/payments/history'),
  getPaymentDetails: (paymentId) => api.get(`/payments/${paymentId}`),
  requestRefund: (paymentId, data) => api.post(`/payments/${paymentId}/refund`, data),
  getInstructorEarnings: () => api.get('/payments/instructor/earnings'),
  updatePaymentStatus: (paymentId, data) => api.put(`/payments/${paymentId}/status`, data),
};

export default api;
