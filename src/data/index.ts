import axios from "axios"
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios"
import { disconnectSocket } from "@/socket"

const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

const requestInterceptorError = (error: unknown) => Promise.reject(error)

const responseInterceptor = (response: AxiosResponse) => response

// Токен хугацаа дууссан/буруу бол (401) хэрэглэгчийг автоматаар /login руу шилжүүлнэ
const responseInterceptorError = (error: AxiosError) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token')
    disconnectSocket()
    if (window.location.pathname !== '/login') {
      window.location.href = '/login'
    }
  }
  return Promise.reject(error)
}

export const BackApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

BackApi.interceptors.request.use(
  requestInterceptor,
  requestInterceptorError
)
BackApi.interceptors.response.use(
  responseInterceptor,
  responseInterceptorError
)