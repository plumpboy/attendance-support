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

const initialState = {
  status: {
    lateDaysCount: 0,
    absentDaysCount: 0,
    leaveDaysCount: 0,
    remainFixTimeRequests: 0,
    remainLeaveRequests: 0,
    standardWorkingDays: 0,
  },
  currentMonthFixTimeRequests: [],
  currentMonthLeaveRequests: [],
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
  fixTimeRequests: [

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
    remainAbsentRequests: 0,
    remainLeaveRequests: 0,
    standardWorkingDays: 0,
  };

  dayslist.regDetails.dayList.forEach((key) => {
    const day = dayslist.regDetails[key];
    if (day.isWeekend || day.isHoliday) {
      return;
    }
    day.fromdate = day.fromdate || '00:00';
    day.todate = day.todate || '00:00';
    const paidableHours = calculatePaidableHours(day.fromdate, day.todate); // hour in minutes
    if (paidableHours >= 360 && paidableHours < 480) {
      lateDays.push({
        date: key,
        from: day.fromdate,
        to: day.todate,
        paidableHours: paidableHours,
        totalHours: totalHours,
      });
      status.lateDaysCount += 1;
    } else if (paidableHours < 360) {
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

  let paidableMinutes = 0;

  if (isBefore(checkin, morningStart)) checkin = morningStart;
  if (isAfter(checkout, afternoonEnd)) checkout = afternoonEnd;

  if (isBefore(checkin, morningEnd) && isAfter(checkout, morningStart)) {
    const morningCheckin = max([checkin, morningStart]);
    const morningCheckout = min([checkout, morningEnd]);
    paidableMinutes += differenceInMinutes(morningCheckout, morningCheckin);
  }

  if (isBefore(checkin, afternoonEnd) && isAfter(checkout, afternoonStart)) {
    const afternoonCheckin = max([checkin, afternoonStart]);
    const afternoonCheckout = min([checkout, afternoonEnd]);
    paidableMinutes += differenceInMinutes(afternoonCheckout, afternoonCheckin);
  }

  return paidableMinutes;
}

function timeRangeContains(outerStart, outerEnd, innerStart, innerEnd) {
  function timeToMinutes(time) {
    if (typeof time === 'string') {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    }
    return time;
  }

  const outerStartTime = timeToMinutes(outerStart);
  const outerEndTime = timeToMinutes(outerEnd);
  const innerStartTime = timeToMinutes(innerStart);
  const innerEndTime = timeToMinutes(innerEnd);

  return outerStartTime <= innerStartTime && outerEndTime >= innerEndTime;
}

function calculateMissingTimeAndLeaveRequests(checkIn, checkOut, requiredWorkMinutes) {
  function timeToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  requiredWorkMinutes = requiredWorkMinutes || 8 * 60;

  let checkInTime = timeToMinutes(checkIn);
  let checkOutTime = timeToMinutes(checkOut);

  let workedMinutes = 0;
  for (const [start, end] of validWorkingPeriods) {
    let startWork = Math.max(checkInTime, start);
    let endWork = Math.min(checkOutTime, end);
    if (startWork < endWork) {
      workedMinutes += (endWork - startWork);
    }
  }

  let missingMinutes = Math.max(0, requiredWorkMinutes - workedMinutes);
  const originMissingMinutes = missingMinutes;
  if (missingMinutes === 0) {
    return {
      missingMinutes,
      leaveRequests: []
    };
  }

  const leaveOptions = {
    "2h": [
      [timeToMinutes("08:00"), timeToMinutes("10:00")],
      [timeToMinutes("10:00"), timeToMinutes("12:00")],
      [timeToMinutes("13:15"), timeToMinutes("15:15")],
      [timeToMinutes("15:15"), timeToMinutes("17:15")]
    ],
    "4h": [
      [timeToMinutes("08:00"), timeToMinutes("12:00")],
      [timeToMinutes("13:15"), timeToMinutes("17:15")]
    ],
    "8h": [
      [timeToMinutes("08:00"), timeToMinutes("17:15")]
    ]
  };

  let leaveRequests = [];
  let availableLeaves = [];

  for (const [type, ranges] of Object.entries(leaveOptions)) {
    for (const [start, end] of ranges) {
      if (!timeRangeContains(checkInTime, checkOutTime, start, end)) {
        availableLeaves.push({
          type,
          from: start,
          to: end,
          duration: end - start
        });
      }
    }
  }

  availableLeaves.sort((a, b) => a.duration - b.duration);

  availableLeaves = availableLeaves.filter((leave, index, arr) => {
    return !arr.some(other => other.duration < leave.duration && timeRangeContains(other.from, other.to, leave.from, leave.to));
  });

  let mergedLeaves = [];
  for (let i = 0; i < availableLeaves.length; i++) {
    let current = availableLeaves[i];
    if (mergedLeaves.length > 0 && mergedLeaves[mergedLeaves.length - 1].to === current.from) {
      let totalDuration = mergedLeaves[mergedLeaves.length - 1].duration + current.duration;
      if (totalDuration === 240 || totalDuration === 480) { // Only merge if sum is 4h or 8h
        let mergedLeave = {
          type: totalDuration === 240 ? "4h" : "8h",
          from: mergedLeaves[mergedLeaves.length - 1].from,
          to: current.to,
          duration: totalDuration
        };
        mergedLeaves.pop();
        mergedLeaves.push(mergedLeave);
      } else {
        mergedLeaves.push(current);
      }
    } else {
      mergedLeaves.push(current);
    }
  }

  for (const leave of mergedLeaves) {
    if (missingMinutes <= 0) break;
    leaveRequests.push({
      type: leave.type,
      from: leave.from,
      to: leave.to
    });
    missingMinutes -= leave.duration;
  }

  return {
    originMissingMinutes,
    leaveRequests
  };
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
function submitRequests(state) {
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
    applyRequest: (state) => {
      return applyRequests(state);
    },
    submitRequest: (state) => {
      return submitRequests(state);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  applyRequest,
  submitRequest
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
