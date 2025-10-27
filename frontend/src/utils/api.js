import axios from 'axios'

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (credentials) => API.post('/login', credentials),
  register: (userData) => API.post('/register', userData),
  logout: () => API.post('/logout'),
  getUser: () => API.get('/user'),
}

export const formsAPI = {
  getForms: () => API.get('/forms'),
  createForm: (formData) => API.post('/forms', formData),
  getForm: (id) => API.get(`/forms/${id}`),
  updateForm: (id, formData) => API.put(`/forms/${id}`, formData),
  deleteForm: (id) => API.delete(`/forms/${id}`),
}

export default API