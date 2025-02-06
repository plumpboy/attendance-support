import {
  createSlice
} from '@reduxjs/toolkit';

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

const initialState = {
  // Define your initial state here
  baseURL: 'https://people.zoho.com',
  version: 'hrportal1524046581683',
  employeeId: '',
  currentMonthStartDate: (new Date(currentYear, currentMonth - 1, 21)).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .replace(/ /g, '-'),
  currentMonthEndDate: (new Date(currentYear, currentMonth, 20)).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .replace(/ /g, '-'),
  csrfToken: '',
  formId: '',
};

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setBaseUrl: (state, action) => {
      state.setting1 = action.payload;
    },
    setCSRF: (state, action) => {
      state.setting2 = action.payload;
    },
    setEmployeeId: (state, action) => {
      state.setting3 = action.payload;
    },
  },
});

export const {
  updateSetting1,
  updateSetting2
} = settingSlice.actions;

export default settingSlice.reducer;
