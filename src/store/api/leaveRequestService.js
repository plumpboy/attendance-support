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
export const leaveRequestApi = createApi({
  reducerPath: 'leaveRequestApi',
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
    // key: applications_view
    // viewMode: 1
    // from: 01-Jan-2025
    // to: 31-Dec-2025
    // typeofleave: -1
    // employee: ["412762000145976089"]
    // conreqcsr: 9d69f7f627c1d81aa499ba74a070958e62448b02fe6948a602279f56d8721c6dcf9f40cf2ee2bf5cd98a43fa350550901bceb8df98a9e3e890c0b5f316a74c5c
    // status: 1
    // sortType: 1
    // sortBy: 3
    // sIndx: 1
    // limit: 20

    // Get leave requests list
    //   {
    //     "data": [
    //         {
    //             "dateofrequest": "10-Feb-2025",
    //             "erecno": "412762000145976089",
    //             "allowdelete": false,
    //             "leavetaken": 1,
    //             "approval_status": -1,
    //             "allowedit": false,
    //             "leaveunit": "Day(s)",
    //             "emp_name": "Phạm Trí Trung",
    //             "photo": "https://contacts.zoho.com/file?ID=786352376&fs=thumb",
    //             "rec_id": "412762000270688355",
    //             "ltyp_name": "Annual Leave",
    //             "ltyp_type": 0,
    //             "approval_disp": "Pending",
    //             "from": "10-Feb-2025",
    //             "to": "10-Feb-2025",
    //             "emp_id": "3872"
    //         }
    //     ],
    //     "count": 1,
    //     "allowAdd": true,
    //     "status": "success"
    // }
    getLeaveRequestsList: builder.query({
      query: (from, to) => ({
        url: 'leave_view_actions.zp',
        method: 'POST',
        body: new URLSearchParams({
          key: "applications_view",
          viewMode: 1,
          from,
          to,
          typeofleave: -1,
          employee: [empid],
          conreqcsr,
          status: -1,
          sortType: 1,
          sortBy: 3,
          sIndx: 1,
          limit: 20,
        }),
      }),
      transformResponse: (response) => Transformer.transform(response),
    }),

    // {
    //   "isPicklistIdEnabled": "true",
    //   "Employee_ID": "412762000145976089",
    //   "Leavetype": "412762000037993337",
    //   "From": "04-Feb-2025",
    //   "To": "04-Feb-2025",
    //   "bereavement_leave_type": "",
    //   "Reasonforleave": "personal reason",
    //   "zp_tableName": "P_EmployeeLeave",
    //   "loginUserZUID": "786352376",
    //   "conreqcsr": "9d69f7f627c1d81aa499ba74a070958e62448b02fe6948a602279f56d8721c6dcf9f40cf2ee2bf5cd98a43fa350550901bceb8df98a9e3e890c0b5f316a74c5c",
    //   "zp_formId": "412762000000035693",
    //   "zp_mode": "addRecord",
    //   "04-Feb-2025": {
    //     "count": "0.5",
    //     "session": "2",
    //     "inactive": false
    //   },
    //   "isHour": "false",
    //   "isDayBased": "true",
    //   "Daystaken": "0.5",
    //   "isDraft": "false"
    // }
    addLeaveRequest: builder.query({
      query: () => ({
        url: '',
        method: 'POST',
        body: new URLSearchParams({
          "isPicklistIdEnabled": "true",
          "Employee_ID": empid,
          "Leavetype": "412762000037993337", // Annual Leave
          "From": fdate,
          "To": fdate,
          "bereavement_leave_type": "",
          "Reasonforleave": "personal reason", // placeholder
          "zp_tableName": "P_EmployeeLeave",
          "loginUserZUID": userId,
          "conreqcsr": conreqcsr,
          "zp_formId": formId,
          "zp_mode": "addRecord",
          [fdate]: {
            "count": count.toString(),
            "session": session, // 0, 1, 2, 3, 4
            ...(count != 1 && {"inactive": false}) // false if not full day
          },
          "isHour": "false",
          "isDayBased": "true",
          "Daystaken": count,
          "isDraft": "false"
        }),
      }),
      transformResponse: (response) => Transformer.transform(response),
    }),
  }),
});

export const {
  getLeaveRequestsList,
  addLeaveRequest,
} = leaveRequestApi;
