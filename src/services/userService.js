import {
  createApi,
  fetchBaseQuery
} from '@reduxjs/toolkit/query/react';
import Request from '@utils/requestZoho';
import Transformer from '@utils/transformer';
import axios from 'axios';

// Create an API slice
export const userService = createApi({
  reducerPath: 'userService',
  baseQuery: async ({ url, method, body }) => {
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
  },
  endpoints: (builder) => ({
    getUserData: builder.query({
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
  getUserData,
} = userService;

// export const { useAttendanceRequestApiMutation } = attendanceRequestApi;
