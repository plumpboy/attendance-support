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

// Create an API slice
export const fixTimeRequestApi = createApi({
  reducerPath: 'fixTimeRequestApi',
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
    // mode: getMyRequest
    // conreqcsr: 9d69f7f627c1d81aa499ba74a070958e62448b02fe6948a602279f56d8721c6dcf9f40cf2ee2bf5cd98a43fa350550901bceb8df98a9e3e890c0b5f316a74c5c
    // sDate: 01-Feb-2025
    // eDate: 28-Feb-2025
    // erecno: ["412762000145976089"]
    getFixTimeRequestsList: builder.query({
      query: ({erecno, sDate, eDate}) => ({
        url: 'AttendanceAction.zp',
        method: 'POST',
        body: new URLSearchParams({
          mode: 'getMyRequest',
          conreqcsr,
          erecno: [erecno],
          sDate: sDate,
          eDate: eDate,
        }),
      }),
      transformResponse: (response) => Transformer.transform(response),
    }),
    // {
    //   "mode": "bulkAttendReg",
    //   "conreqcsr": "e097dad269e084ada74788a94de591e207c42151478f274096dffe2bff7ce41cc12879456bbf290ed607ca033f7876cf7697987c54c13b503ad774f7f1fbedb1",
    //   "erecno": "412762000145976089",
    //   "fdate": "22-Jan-2025",
    //   "dataObj": {
    //     "22-Jan-2025": {
    //       "fromDate": "22-Jan-2025",
    //       "toDate": "22-Jan-2025",
    //       "ftime": 540,
    //       "ttime": 1149
    //     }
    //   }
    // }
    addFixTimeRequest: builder.query({
      query: (fdate, ftime, ttime) => ({
        url: 'AttendanceAction.zp',
        method: 'POST',
        body: new URLSearchParams({
          mode: 'bulkAttendReg',
          conreqcsr,
          erecno,
          fdate,
          dataObj: {
            [fdate]: {
              fromDate: fdate,
              toDate: fdate,
              ftime,
              ttime,
            },
          }
        }),
      }),
      transformResponse: (response) => Transformer.transform(response),
    }),
  }),
});

export const {
  getFixTimeRequestsList,
  addFixTimeRequest,
} = fixTimeRequestApi;
