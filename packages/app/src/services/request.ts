import axios, { AxiosRequestConfig } from 'axios';

export const request = axios.create({
  baseURL: 'http://192.168.31.59:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  responseType: 'json',
  timeout: 30 * 1000,
});

export const get = <T>(url: string, config?: AxiosRequestConfig) => {
  return request.get<T, API.Result<T>>(url, config);
};

export const post = <T>(url: string, data: any, config?: AxiosRequestConfig) => {
  return request.post<T, API.Result<T>>(url, data, config);
};

export const put = <T>(url: string, data: any, config?: AxiosRequestConfig) => {
  return request.put<T, API.Result<T>>(url, data, config);
};

request.interceptors.response.use((response) => {
  return response.data;
});
