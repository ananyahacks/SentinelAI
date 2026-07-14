import axios from 'axios'

// Point this at your FastAPI / Flask / Django ML backend.
// Kept isolated so every page imports one configured client.
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('sentinelai_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sentinelai_token')
    }
    return Promise.reject(error)
  }
)

export default axiosClient
