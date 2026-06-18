import axios from "axios"
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios"

const requestInterceptor = (config: InternalAxiosRequestConfig<any>) => {
  // Customize your request config here
  // Add Bearer token to the header etc
  return config
}

const requestInterceptorError = (error: any) => Promise.reject(error)

const responseInterceptor = (response: AxiosResponse<any, any>) => response

const responseInterceptorError = (error: any) => {
  return Promise.reject(error)
}

export const YourApi = axios.create({
  baseURL: import.meta.env.VITE_API_ACCOUNTING_URL,
})

YourApi.interceptors.request.use(
  requestInterceptor,
  requestInterceptorError
)
YourApi.interceptors.response.use(
  responseInterceptor,
  responseInterceptorError
)

