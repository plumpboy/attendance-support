import {
  createSlice
} from '@reduxjs/toolkit';
import {
  parse,
  differenceInMinutes,
  isBefore,
  isAfter,
  max,
  min,
  secondsToHours,
  startOfQuarter,
  differenceInSeconds,
} from 'date-fns';
import {
  ca
} from 'date-fns/locale';

const morningStart = parse('07:30', 'HH:mm', new Date());
const morningEnd = parse('12:00', 'HH:mm', new Date());
const afternoonStart = parse('13:15', 'HH:mm', new Date());
const afternoonEnd = parse('19:30', 'HH:mm', new Date());

const quarter_1 = {
  from: parse('08:00', 'HH:mm', new Date()),
  to: parse('10:00', 'HH:mm', new Date()),
};

const quarter_2 = {
  from: parse('10:00', 'HH:mm', new Date()),
  to: parse('12:00', 'HH:mm', new Date()),
};

const quarter_3 = {
  from: parse('13:15', 'HH:mm', new Date()),
  to: parse('15:15', 'HH:mm', new Date()),
};

const quarter_4 = {
  from: parse('15:15', 'HH:mm', new Date()),
  to: parse('17:15', 'HH:mm', new Date()),
};

const half_1 = {
  from: parse('08:00', 'HH:mm', new Date()),
  to: parse('12:00', 'HH:mm', new Date()),
};

const half_2 = {
  from: parse('13:15', 'HH:mm', new Date()),
  to: parse('17:15', 'HH:mm', new Date()),
};

const daysList = {
  "regDetails": {
    "15-Feb-2025": {
      "isNewBreakConf": true,
      "isAutoBreakConf": true,
      "breakTime": 0,
      "dispMonthDate": "Feb 15",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "isWeekend": true,
      "dispDay": "Sat"
    },
    "18-Feb-2025": {
      "isNewBreakConf": true,
      "isAutoBreakConf": true,
      "breakTime": 0,
      "dispMonthDate": "Feb 18",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "dispDay": "Tue"
    },
    "endDate": "21-Feb-2025",
    "06-Feb-2025": {
      "isNewBreakConf": true,
      "isAutoBreakConf": true,
      "breakTime": 0,
      "dispMonthDate": "Feb 06",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "dispDay": "Thu"
    },
    "26-Jan-2025": {
      "isNewBreakConf": true,
      "isAutoBreakConf": true,
      "breakTime": 0,
      "dispMonthDate": "Jan 26",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "isWeekend": true,
      "isAbsent": true,
      "dispDay": "Sun"
    },
    "03-Feb-2025": {
      "isNewBreakConf": true,
      "tDate": "03-Feb-2025",
      "isAutoBreakConf": true,
      "totalhrs": 24960,
      "breakTime": 0,
      "todate": "18:24",
      "dispMonthDate": "Feb 03",
      "fDate": "03-Feb-2025",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "dispDay": "Mon",
      "fromdate": "10:13"
    },
    "27-Jan-2025": {
      "isNewBreakConf": true,
      "isAutoBreakConf": true,
      "breakTime": 0,
      "dispMonthDate": "Jan 27",
      "isHoliday": true,
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "isAbsent": true,
      "dispDay": "Mon"
    },
    "21-Feb-2025": {
      "isNewBreakConf": true,
      "isAutoBreakConf": true,
      "breakTime": 0,
      "dispMonthDate": "Feb 21",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "dispDay": "Fri"
    },
    "23-Jan-2025": {
      "isNewBreakConf": true,
      "tDate": "23-Jan-2025",
      "isAutoBreakConf": true,
      "totalhrs": 32880,
      "breakTime": 0,
      "todate": "19:37",
      "dispMonthDate": "Jan 23",
      "fDate": "23-Jan-2025",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "dispDay": "Thu",
      "fromdate": "09:14"
    },
    "12-Feb-2025": {
      "isNewBreakConf": true,
      "isAutoBreakConf": true,
      "breakTime": 0,
      "dispMonthDate": "Feb 12",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "dispDay": "Wed"
    },
    "07-Feb-2025": {
      "isNewBreakConf": true,
      "isAutoBreakConf": true,
      "breakTime": 0,
      "dispMonthDate": "Feb 07",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "dispDay": "Fri"
    },
    "13-Feb-2025": {
      "isNewBreakConf": true,
      "isAutoBreakConf": true,
      "breakTime": 0,
      "dispMonthDate": "Feb 13",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "dispDay": "Thu"
    },
    "09-Feb-2025": {
      "isNewBreakConf": true,
      "isAutoBreakConf": true,
      "breakTime": 0,
      "dispMonthDate": "Feb 09",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "isWeekend": true,
      "dispDay": "Sun"
    },
    "dayList": [
      "21-Jan-2025",
      "22-Jan-2025",
      "23-Jan-2025",
      "24-Jan-2025",
      "25-Jan-2025",
      "26-Jan-2025",
      "27-Jan-2025",
      "28-Jan-2025",
      "29-Jan-2025",
      "30-Jan-2025",
      "31-Jan-2025",
      "01-Feb-2025",
      "02-Feb-2025",
      "03-Feb-2025",
      "04-Feb-2025",
      "05-Feb-2025",
      "06-Feb-2025",
      "07-Feb-2025",
      "08-Feb-2025",
      "09-Feb-2025",
      "10-Feb-2025",
      "11-Feb-2025",
      "12-Feb-2025",
      "13-Feb-2025",
      "14-Feb-2025",
      "15-Feb-2025",
      "16-Feb-2025",
      "17-Feb-2025",
      "18-Feb-2025",
      "19-Feb-2025",
      "20-Feb-2025",
      "21-Feb-2025"
    ],
    "31-Jan-2025": {
      "isNewBreakConf": true,
      "isAutoBreakConf": true,
      "breakTime": 0,
      "dispMonthDate": "Jan 31",
      "isHoliday": true,
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "isAbsent": true,
      "dispDay": "Fri"
    },
    "01-Feb-2025": {
      "isNewBreakConf": true,
      "isAutoBreakConf": true,
      "breakTime": 0,
      "dispMonthDate": "Feb 01",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "isWeekend": true,
      "isAbsent": true,
      "dispDay": "Sat"
    },
    "04-Feb-2025": {
      "isNewBreakConf": true,
      "tDate": "04-Feb-2025",
      "isAutoBreakConf": true,
      "totalhrs": 1740,
      "breakTime": 0,
      "todate": "10:15",
      "dispMonthDate": "Feb 04",
      "fDate": "04-Feb-2025",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "dispDay": "Tue",
      "fromdate": "09:46"
    },
    "10-Feb-2025": {
      "isNewBreakConf": true,
      "isAutoBreakConf": true,
      "breakTime": 0,
      "dispMonthDate": "Feb 10",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "dispDay": "Mon"
    },
    "22-Jan-2025": {
      "isNewBreakConf": true,
      "tDate": "22-Jan-2025",
      "isAutoBreakConf": true,
      "totalhrs": 23820,
      "breakTime": 0,
      "todate": "19:09",
      "dispMonthDate": "Jan 22",
      "fDate": "22-Jan-2025",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "dispDay": "Wed",
      "fromdate": "11:17"
    },
    "25-Jan-2025": {
      "isNewBreakConf": true,
      "isAutoBreakConf": true,
      "breakTime": 0,
      "dispMonthDate": "Jan 25",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "isWeekend": true,
      "isAbsent": true,
      "dispDay": "Sat"
    },
    "05-Feb-2025": {
      "isNewBreakConf": true,
      "isAutoBreakConf": true,
      "breakTime": 0,
      "dispMonthDate": "Feb 05",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "dispDay": "Wed"
    },
    "28-Jan-2025": {
      "isNewBreakConf": true,
      "isAutoBreakConf": true,
      "breakTime": 0,
      "dispMonthDate": "Jan 28",
      "isHoliday": true,
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "isAbsent": true,
      "dispDay": "Tue"
    },
    "02-Feb-2025": {
      "isNewBreakConf": true,
      "isAutoBreakConf": true,
      "breakTime": 0,
      "dispMonthDate": "Feb 02",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "isWeekend": true,
      "isAbsent": true,
      "dispDay": "Sun"
    },
    "11-Feb-2025": {
      "isNewBreakConf": true,
      "isAutoBreakConf": true,
      "breakTime": 0,
      "dispMonthDate": "Feb 11",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "dispDay": "Tue"
    },
    "16-Feb-2025": {
      "isNewBreakConf": true,
      "isAutoBreakConf": true,
      "breakTime": 0,
      "dispMonthDate": "Feb 16",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "isWeekend": true,
      "dispDay": "Sun"
    },
    "19-Feb-2025": {
      "isNewBreakConf": true,
      "isAutoBreakConf": true,
      "breakTime": 0,
      "dispMonthDate": "Feb 19",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "dispDay": "Wed"
    },
    "30-Jan-2025": {
      "isNewBreakConf": true,
      "isAutoBreakConf": true,
      "breakTime": 0,
      "dispMonthDate": "Jan 30",
      "isHoliday": true,
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "isAbsent": true,
      "dispDay": "Thu"
    },
    "20-Feb-2025": {
      "isNewBreakConf": true,
      "isAutoBreakConf": true,
      "breakTime": 0,
      "dispMonthDate": "Feb 20",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "dispDay": "Thu"
    },
    "24-Jan-2025": {
      "isNewBreakConf": true,
      "tDate": "24-Jan-2025",
      "isAutoBreakConf": true,
      "totalhrs": 24960,
      "breakTime": 0,
      "todate": "19:39",
      "dispMonthDate": "Jan 24",
      "fDate": "24-Jan-2025",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "dispDay": "Fri",
      "fromdate": "11:28"
    },
    "14-Feb-2025": {
      "isNewBreakConf": true,
      "isAutoBreakConf": true,
      "breakTime": 0,
      "dispMonthDate": "Feb 14",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "dispDay": "Fri"
    },
    "29-Jan-2025": {
      "isNewBreakConf": true,
      "isAutoBreakConf": true,
      "breakTime": 0,
      "dispMonthDate": "Jan 29",
      "isHoliday": true,
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "isAbsent": true,
      "dispDay": "Wed"
    },
    "17-Feb-2025": {
      "isNewBreakConf": true,
      "isAutoBreakConf": true,
      "breakTime": 0,
      "dispMonthDate": "Feb 17",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "dispDay": "Mon"
    },
    "08-Feb-2025": {
      "isNewBreakConf": true,
      "isAutoBreakConf": true,
      "breakTime": 0,
      "dispMonthDate": "Feb 08",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "isWeekend": true,
      "dispDay": "Sat"
    },
    "startDate": "21-Jan-2025",
    "21-Jan-2025": {
      "isNewBreakConf": true,
      "tDate": "21-Jan-2025",
      "isAutoBreakConf": true,
      "totalhrs": 29160,
      "breakTime": 0,
      "todate": "18:31",
      "dispMonthDate": "Jan 21",
      "fDate": "21-Jan-2025",
      "shiftAllowedTimings": {
        "shiftAllowedFromTime": 90,
        "shiftAllowedToTime": 90
      },
      "dispDay": "Tue",
      "fromdate": "09:10"
    }
  },
  "isPopulateReqd": false
}

const getCurrentMonth = () => {
  const date = new Date();
  const month = date.getMonth() + 1; // getMonth() returns month from 0-11
  const year = date.getFullYear();

  return `${month < 10 ? '0' : ''}${month}-${year}`;
};

const mapDaysToLateAndAbsent = (dayslist) => {
  const lateDays = [];
  const absentDays = [];
  const status = {
    lateDaysCount: 0,
    absentDaysCount: 0,
    leaveDaysCount: 0,
    presentDays: 0,
    remainAbsentRequests: 0,
    remainLeaveRequests: 0,
    standardWorkingDays: 0,
  };

  dayslist.regDetails.dayList.forEach((key) => {
    const day = dayslist.regDetails[key];
    const paidableHours = calculatePaidableHours(day.fromdate, day.todate); // Convert minutes to hours
    if (paidableHours >= 6 && paidableHours < 8) {
      lateDays.push({
        date: key,
        from: day.fromdate,
        to: day.todate,
        paidableHours: paidableHours,
        totalHours: totalHours,
      });
      status.lateDaysCount += 1;
    } else if (paidableHours < 6) {
      absentDays.push({
        date: key,
        from: day.fromdate,
        to: day.todate,
        paidableHours: paidableHours,
        totalHours: totalHours,
      });
      status.absentDaysCount += 1;
    }
  });

  return {
    lateDays,
    absentDays,
    status
  };
};

const initialState = {
  status: {
    lateDaysCount: 0,
    absentDaysCount: 0,
    leaveDaysCount: 0,
    presentDays: 0,
    remainAbsentRequests: 0,
    remainLeaveRequests: 0,
    standardWorkingDays: 0,
  },
  lateDays: [
    // {
    //   date: '01-01-2021',
    //   from: '9:00',
    //   to: '15:00',
    //   paidableHours: '4',
    //   totalHours: '6.5',
    // },
  ],
  absentDays: [
    // {
    //   "mode": "bulkAttendReg",
    //   "conreqcsr": "9d69f7f627c1d81aa499ba74a070958e62448b02fe6948a602279f56d8721c6dcf9f40cf2ee2bf5cd98a43fa350550901bceb8df98a9e3e890c0b5f316a74c5c",
    //   "erecno": "412762000145976089",
    //   "fdate": "04-Feb-2025",
    //   "dataObj": {
    //     "04-Feb-2025": {
    //       "fromDate": "04-Feb-2025",
    //       "toDate": "04-Feb-2025",
    //       "ftime": 586,
    //       "ttime": 1155
    //     }
    //   }
    // },
  ],
  absentRequests: [

  ],
  leaveRequests: [{
      // "isPicklistIdEnabled": true,
      // "Employee_ID": "412762000145976089",
      // "Leavetype": "412762000037993337",
      // "From": "29-Jan-2025",
      // "To": "29-Jan-2025",
      // "bereavement_leave_type": "",
      // "Reasonforleave": "personal reason",
      // "zp_tableName": "P_EmployeeLeave",
      // "loginUserZUID": "786352376",
      // "conreqcsr": "e097dad269e084ada74788a94de591e207c42151478f274096dffe2bff7ce41cc12879456bbf290ed607ca033f7876cf7697987c54c13b503ad774f7f1fbedb1",
      // "zp_formId": "412762000000035693",
      // "zp_mode": "addRecord",
      // "29-Jan-2025": {
      //   "count": 1,
      //   "session": 0
      // },
      // "isHour": false,
      // "isDayBased": true,
      // "Daystaken": 1,
      // "isDraft": false,
    },
    {
      // "isPicklistIdEnabled": true,
      // "Employee_ID": "412762000145976089",
      // "Leavetype": "412762000037993337",
      // "From": "04-Feb-2025",
      // "To": "04-Feb-2025",
      // "bereavement_leave_type": "",
      // "Reasonforleave": "personal reason",
      // "zp_tableName": "P_EmployeeLeave",
      // "loginUserZUID": "786352376",
      // "conreqcsr": "9d69f7f627c1d81aa499ba74a070958e62448b02fe6948a602279f56d8721c6dcf9f40cf2ee2bf5cd98a43fa350550901bceb8df98a9e3e890c0b5f316a74c5c",
      // "zp_formId": "412762000000035693",
      // "zp_mode": "addRecord",
      // "04-Feb-2025": {
      //   "count": 0.5,
      //   "session": 2,
      //   "inactive": false
      // },
      // "isHour": false,
      // "isDayBased": true,
      // "Daystaken": 0.5,
      // "isDraft": false,
    },
    {
      // "isPicklistIdEnabled": true,
      // "Employee_ID": "412762000145976089",
      // "Leavetype": "412762000037993337",
      // "From": "04-Feb-2025",
      // "To": "04-Feb-2025",
      // "bereavement_leave_type": "",
      // "Reasonforleave": "personal reason",
      // "zp_tableName": "P_EmployeeLeave",
      // "loginUserZUID": "786352376",
      // "conreqcsr": "9d69f7f627c1d81aa499ba74a070958e62448b02fe6948a602279f56d8721c6dcf9f40cf2ee2bf5cd98a43fa350550901bceb8df98a9e3e890c0b5f316a74c5c",
      // "zp_formId": "412762000000035693",
      // "zp_mode": "addRecord",
      // "04-Feb-2025": {
      //   "count": 0.25,
      //   "session": 1,
      //   "inactive": false
      // },
      // "isHour": false,
      // "isDayBased": true,
      // "Daystaken": 0.25,
      // "isDraft": false,
    }
  ],
  currentMonth: getCurrentMonth(),
};

/*
  logic to apply remainAttendanceRequests and remainLeaveDays
  based on the number of remainAbsentRequests and remainLeaveRequests:
    - opitimize the calculation by the priority: remainAbsentRequests -> remainLeaveRequests,
    - absentRequests request can only apply for the days that are not in leaveDays
    - leaveRequests request can apply for the all days
    - user have 5 lateDays, 3 absent requests monthy
      so from 6th late day, we need apply absent/leave request on that day
      and absent/leave request on each absent or leave day
    - for late day and absent day, we need to calculate the total working hours,
      the day that have less total hours have more priority to apply absent/leave request
*/
function applyRequests(state) {
  state = applyAbsentRequests(state);
  state = applyLeaveRequests(state);

  return state;
}

function applyAbsentRequests(state) {
  const {
    lateDays,
    absentDays,
    absentRequests
  } = state;
  let {
    remainAbsentRequests
  } = state.status;

  // apply absent request on absentDays and lateDays from 6th
  remainAbsentRequests = applyRequestsOnDays(
    absentDays,
    absentRequests,
    remainAbsentRequests
  );
  remainAbsentRequests = applyRequestsOnDays(
    lateDays,
    absentRequests,
    remainAbsentRequests
  );

  return {
    ...state,
    status: {
      ...state.status,
      remainAbsentRequests,
    },
    absentRequests,
  };
}

function applyLeaveRequests(state) {
  const {
    lateDays,
    absentDays,
    leaveRequests
  } = state;
  let {
    remainLeaveRequests
  } = state.status;

  remainLeaveRequests = applyRequestsOnDays(
    absentDays,
    leaveRequests,
    remainLeaveRequests
  );
  remainLeaveRequests = applyRequestsOnDays(
    lateDays,
    leaveRequests,
    remainLeaveRequests
  );

  return {
    ...state,
    status: {
      ...state.status,
      remainLeaveRequests,
    },
    leaveRequests,
  };
}

function calculatePaidableHours(from, to) {
  let checkin = parse(from, 'HH:mm', new Date());
  let checkout = parse(to, 'HH:mm', new Date());

  let paidableSeconds = 0;

  if (isBefore(checkin, morningStart)) checkin = morningStart;
  if (isAfter(checkout, afternoonEnd)) checkout = afternoonEnd;

  if (isBefore(checkin, morningEnd) && isAfter(checkout, morningStart)) {
    const morningCheckin = max([checkin, morningStart]);
    const morningCheckout = min([checkout, morningEnd]);
    paidableSeconds += differenceInMinutes(morningCheckout, morningCheckin) * 60;
  }

  if (isBefore(checkin, afternoonEnd) && isAfter(checkout, afternoonStart)) {
    const afternoonCheckin = max([checkin, afternoonStart]);
    const afternoonCheckout = min([checkout, afternoonEnd]);
    paidableSeconds += differenceInMinutes(afternoonCheckout, afternoonCheckin) * 60;
  }

  return paidableSeconds;
}
/*
  based on checkin and checkout time, quarter_1, quarter_2, quarter_3, quarter_4
  half_1, half_2, calculate the time range must be used to apply leave request
 */
function applyLeaveRequestOnLateDays(state) {
  const {
    lateDays
  } = state;
  lateDays.forEach((day) => {
    const {
      from,
      to,
      paidableHours
    } = day;
    const leaveTime = calculateLeaveTime(from, to, paidableHours);
    day.leaveTime = leaveTime;
  });
  return state;
}

// based on checkin and checkout time, morningStart, morningEnd
// afternoonStart, afternoonEnd, calculate the time must be used to apply leave request

function calculateLeaveTime(from, to, paidableHours) {
  let checkin = parse(from, 'HH:mm', new Date());
  let checkout = parse(to, 'HH:mm', new Date());

  // morningCheckin = min([checkin, morningStart]);
  // morningCheckout = max([checkout, morningEnd]);

  // afternoonCheckin = checkin > afternoonStart ? checkin : afternoonStart;
  // afternoonCheckout = checkout < afternoonEnd ? checkout : afternoonEnd;

  morningPaidableHours = calculateMorningPaidableHours(checkin, checkout);
  afternoonPaidableHours = calculateAfternoonPaidableHours(checkin, checkout);

  const morningAvaiableLeaveTime = calculateMorningLeaveTime(checkin, checkout);
}

// based on checkin and checkout time, morningStart, morningEnd
// calculate morning paidable hours
function calculateMorningPaidableHours(checkin, checkout) {
  const morningCheckin = max([checkin, morningStart]);
  const morningCheckout = min([checkout, morningEnd]);

  return calculatePaidableHours(morningCheckin, morningCheckout);
}

function calculateAfternoonPaidableHours(checkin, checkout) {
  const afternoonCheckin = max([checkin, afternoonStart]);
  const afternoonCheckout = isBefore(checkout, afternoonStart) ? afternoonStart : min([checkout, afternoonEnd]);

  return calculatePaidableHours(afternoonCheckin, afternoonCheckout);
}

function applyRequestsOnDays(days, requests, remainRequests) {
  days.sort((a, b) => {
    const totalHoursA = a.totalHours.split(':');
    const totalHoursB = b.totalHours.split(':');
    return totalHoursA[0] - totalHoursB[0];
  });

  for (let i = 0; i < days.length && remainRequests > 0; i++) {
    requests.push(days[i]);
    days.splice(i, 1);
    i--; // adjust index after removal
    remainRequests--;
  }

  return remainRequests;
}

/*
  logic to submit the request to the server
  after send the request to the server (do in another service),
  update the status of the request
*/
function submitRequest(state) {
  // update the status in state
  return state;
}

export const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    initDayData: (state, data) => {
      return mapDaysToLateAndAbsent(data || daysList);
    },
    initRequestData: (state, data) => {
      return mapDaysToLateAndAbsent(data || daysList);
    },
    initCurrentStatusData: (state, data) => {
      return mapDaysToLateAndAbsent(data || daysList);
    },
    applyRequests: (state) => {
      return applyRequests(state);
    },
    submitRequest: (state) => {
      return submitRequest(state);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  applyRequests,
  submitRequest
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
