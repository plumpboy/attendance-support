import { createSlice } from '@reduxjs/toolkit';
import {
  parse,
  differenceInMinutes,
  isBefore,
  isAfter,
  max,
  min,
} from 'date-fns';

const getCurrentMonth = () => {
  const date = new Date();
  const month = date.getMonth() + 1; // getMonth() returns month from 0-11
  const year = date.getFullYear();

  return `${month < 10 ? '0' : ''}${month}-${year}`;
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
    //   totalHours: '6.5',
    // },
  ],
  absentDays: [
    // {
    //   date: '01-01-2021',
    //   from: '9:00',
    //   to: '14:00',
    //   totalHours: '5',
    // },
  ],
  leaveDays: [
    // {
    //   date: '01-01-2021',
    // },
  ],
  absentRequests: [
    // {
    //   date: '01-01-2021',
    //   from: '9:00',
    //   to: '14:00',
    //   totalHours: '5',
    // },
  ],
  leaveRequests: [],
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
  const { lateDays, absentDays, absentRequests } = state;
  let { remainAbsentRequests } = state.status;

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
  const { lateDays, absentDays, leaveDays, leaveRequests } = state;
  let { remainLeaveRequests } = state.status;

  // apply leave request on leaveDays, absentDays, and lateDays from 6th
  remainLeaveRequests = applyRequestsOnDays(
    leaveDays,
    leaveRequests,
    remainLeaveRequests
  );
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
  const morningStart = parse('07:30', 'HH:mm', new Date());
  const morningEnd = parse('12:00', 'HH:mm', new Date());
  const afternoonStart = parse('13:15', 'HH:mm', new Date());
  const afternoonEnd = parse('19:30', 'HH:mm', new Date());

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
/*
  add case for apply leave request on late days
  leave can be use for 0.25, 0.5 or 1 day
  and working day is 8 hours, checkin checkout must in 7:30 to 12:00, 13:15 to 19:30
 */
function applyLeaveRequestOnLateDays(state) {
  const { lateDays, leaveRequests } = state;
  let { remainLeaveRequests } = state.status;

  lateDays.forEach((day) => {
    if (remainLeaveRequests > 0) {
      const totalHours = parseFloat(day.totalHours);
      const checkin = day.from;
      const checkout = day.to;

      const isValidCheckinCheckout =
        ((checkin >= '7:30' && checkin <= '12:00') ||
          (checkin >= '13:15' && checkin <= '19:30')) &&
        ((checkout >= '7:30' && checkout <= '12:00') ||
          (checkout >= '13:15' && checkout <= '19:30'));
      if (!isValidCheckinCheckout) {
        const requiredHours = 8 - totalHours;
        if (requiredHours <= 2 && remainLeaveRequests >= 0.25) {
          leaveRequests.push({
            ...day,
            leaveType: '0.25 day',
            from: '7:30',
            to: '9:30',
          });
          remainLeaveRequests -= 0.25;
        } else if (requiredHours <= 4 && remainLeaveRequests >= 0.5) {
          leaveRequests.push({
            ...day,
            leaveType: '0.5 day',
            from: '7:30',
            to: '11:30',
          });
          remainLeaveRequests -= 0.5;
        } else if (requiredHours <= 8 && remainLeaveRequests >= 1) {
          leaveRequests.push({
            ...day,
            leaveType: '1 day',
            from: '7:30',
            to: '15:30',
          });
          remainLeaveRequests -= 1;
        }
      } else if (checkout < '7:30' || checkout > '19:30') {
        const requiredHours = 8 - totalHours;
        if (requiredHours <= 2 && remainLeaveRequests >= 0.25) {
          leaveRequests.push({
            ...day,
            leaveType: '0.25 day',
            from: '17:30',
            to: '19:30',
          });
          remainLeaveRequests -= 0.25;
        } else if (requiredHours <= 4 && remainLeaveRequests >= 0.5) {
          leaveRequests.push({
            ...day,
            leaveType: '0.5 day',
            from: '15:30',
            to: '19:30',
          });
          remainLeaveRequests -= 0.5;
        } else if (requiredHours <= 8 && remainLeaveRequests >= 1) {
          leaveRequests.push({
            ...day,
            leaveType: '1 day',
            from: '11:30',
            to: '19:30',
          });
          remainLeaveRequests -= 1;
        }
      }

      if (isValidCheckinCheckout) {
        if (totalHours <= 2 && remainLeaveRequests >= 0.25) {
          leaveRequests.push({ ...day, leaveType: '0.25 day' });
          remainLeaveRequests -= 0.25;
        } else if (totalHours <= 4 && remainLeaveRequests >= 0.5) {
          leaveRequests.push({ ...day, leaveType: '0.5 day' });
          remainLeaveRequests -= 0.5;
        } else if (totalHours <= 8 && remainLeaveRequests >= 1) {
          leaveRequests.push({ ...day, leaveType: '1 day' });
          remainLeaveRequests -= 1;
        }
      }
    }
  });

  return {
    ...state,
    status: {
      ...state.status,
      remainLeaveRequests,
    },
    leaveRequests,
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
function submitRequest(state) {
  // update the status in state
  return state;
}

export const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    applyRequests: (state) => {
      return applyRequests(state);
    },
    submitRequest: (state) => {
      return submitRequest(state);
    },
  },
});

// Action creators are generated for each case reducer function
export const { applyRequests, submitRequest } = attendanceSlice.actions;

export default attendanceSlice.reducer;
