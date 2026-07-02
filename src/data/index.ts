import axios from "axios"
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios"

const requestInterceptor = (config: InternalAxiosRequestConfig<any>) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Customize your request config here
  // Add Bearer token to the header etc
  return config
}

const requestInterceptorError = (error: any) => Promise.reject(error)

const responseInterceptor = (response: AxiosResponse<any, any>) => response

const responseInterceptorError = (error: any) => {
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

