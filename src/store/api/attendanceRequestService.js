import {
  createApi,
  fetchBaseQuery
} from '@reduxjs/toolkit/query/react';
import Request from '@utils/requestZoho';
import Transformer from '@utils/transformer';
import axios from 'axios';

// Define the base URL for the API
const BASE_URL = 'https://people.zoho.com/hrportal1524046581683/AttendanceAction.zp';

// Create an API slice
export const attendanceRequestApi = createApi({
  reducerPath: 'attendanceRequestService',
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
      transformResponse: (response) => Transformer.transform(response),
    }),
  }),
});

export const {
  getAttendanceData,
} = attendanceRequestService;

// export const { useAttendanceRequestApiMutation } = attendanceRequestApi;
