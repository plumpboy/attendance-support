import {
  createApi,
  fetchBaseQuery
} from '@reduxjs/toolkit/query/react';
import Request from '@utils/requestZoho';
import Transformer from '@utils/transformer';

// Get current URL of the page
const empid = document.querySelector('img#zpeople_userimage').getAttribute('empid');

// Get cookie key CSRF_TOKEN from current tab
const conreqcsr = document.cookie
  .split('; ')
  .find((row) => row.startsWith('CSRF_TOKEN=')) ?
  .split('=')[1];

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

// Create an API slice
export const leaveApi = createApi({
  reducerPath: 'attendanceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      headers.set('Accept', '*/*');
      headers.set('CSRF_TOKEN', conreqcsr);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getLeaveRequestsList: builder.query({
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
      transformResponse: (response) => Transformer.transform(response),
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
      transformResponse: (response) => Transformer.transform(response),
    }),
  }),
});

export const {
  getLeaveRequestsList,
  addLeaveRequest,
} = leaveApi;
