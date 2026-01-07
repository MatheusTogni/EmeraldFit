import axios from 'axios'
import { API_CONFIG } from '@/config/api'

// Criar instância do axios configurada
const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de requisição
api.interceptors.request.use(
  (config) => {
    // Aqui você pode adicionar tokens de autenticação futuramente
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor de resposta
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Tratamento de erros globais
    if (error.response) {
      console.error('Erro na resposta:', error.response.data)
    } else if (error.request) {
      console.error('Erro na requisição:', error.request)
    } else {
      console.error('Erro:', error.message)
    }
    return Promise.reject(error)
  }
)

export default api
