/* eslint-disable no-console */
import axios from 'axios';
import Transformer from '@utils/transformer';

// Create an axios instance
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Accept': '*/*',
    'CSRF_TOKEN': conreqcsr,
  },
});

export const baseQuery = async ({ url, method, body }) => {
  try {
    const response = await axiosInstance({
      url,
      method,
      data: body,
    });
    return {
      data: Transformer.transform(response.data),
    };
  } catch (axiosError) {
    let err = axiosError;
    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message,
      },
    };
  }
};

export function requestZoho() {
  const BASE_URL =
    window.location.origin + '/' + window.location.pathname.split('/')[1];
  axios.defaults.baseURL = BASE_URL;

  axios.defaults.headers.common.Accept = 'application/json';
  axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  axios.defaults.headers.common['accept-encoding'] = 'gzip, deflate, br, zstd';
  axios.defaults.headers.common['accept-language'] =
    'en-US,en;q=0.9,vi-VN;q=0.8,vi;q=0.7,ja;q=0.6,fr-FR;q=0.5,fr;q=0.4';
  axios.defaults.headers.common['content-type'] =
    'application/x-www-form-urlencoded; charset=UTF-8';

  return axios;
}
