import { configureStore } from '@reduxjs/toolkit';
import { fixTimeRequestApi } from './api/fixTimeRequestService';
import { leaveRequestApi } from './api/leaveRequestService';
import { attendanceRequestApi } from './api/attendanceRequest';
import attendanceReducer from './state/attendance';
import settingReducer from './state/setting';

export const store = configureStore({
  reducer: {
    // state
    attendance: attendanceReducer,
    setting: settingReducer,
    // api
    [fixTimeRequestApi.reducerPath]: fixTimeRequestApi.reducer,
    [leaveRequestApi.reducerPath]: leaveRequestApi.reducer,
    [attendanceRequestApi.attendanceRequestApi]: attendanceRequestApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(fixTimeRequestApi.middleware)
      .concat(leaveRequestApi.middleware)
      .concat(attendanceRequestApi.middleware),
});
