import {
  createApi,
  fetchBaseQuery
} from '@reduxjs/toolkit/query/react';
import Request from '@utils/requestZoho';
import Transformer from '@utils/transformer';
import axios from 'axios';

// Get current URL of the page
const empid = document.querySelector('img#zpeople_userimage').getAttribute('empid');

// Get cookie key CSRF_TOKEN from current tab
const conreqcsr = document.cookie
  .split('; ')
  .find((row) => row.startsWith('CSRF_TOKEN='))
  ?.split('=')[1];

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

const fromDate = new Date(currentYear, currentMonth - 1, 21);
const toDate = new Date(currentYear, currentMonth, 20);

const formattedFromDate = fromDate
  .toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  .replace(/ /g, '-');

const formattedToDate = toDate
  .toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  .replace(/ /g, '-');

// Define the base URL for the API
const BASE_URL = 'https://people.zoho.com/hrportal1524046581683/AttendanceAction.zp';

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Accept': '*/*',
    'CSRF_TOKEN': conreqcsr,
  },
});

// Create an API slice
export const attendanceApi = createApi({
  reducerPath: 'attendanceApi',
  baseQuery: async ({
    url,
    method,
    body
  }) => {
    try {
      const response = await axiosInstance({
        url,
        method,
        data: body,
      });
      return {
        data: Transformer.transform(response.data)
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
  },
  endpoints: (builder) => ({
    getAttendanceData: builder.query({
      query: () => ({
        url: '',
        method: 'POST',
        body: new URLSearchParams({
          mode: 'bulkAttendReg',
          conreqcsr,
          empid,
          fromDate: formattedFromDate,
          toDate: formattedToDate,
        }),
      }),
    }),
    addLeaveRequest: builder.query({
      query: () => ({
        url: '',
        method: 'POST',
        body: new URLSearchParams({
          mode: 'bulkAttendReg',
          conreqcsr,
          empid,
          fromDate: formattedFromDate,
          toDate: formattedToDate,
        }),
      }),
    }),
  }),
});

export const {
  getLeaveRequestsList,
  addLeaveRequest,
} = attendanceApi;
