import {
  createSlice
} from '@reduxjs/toolkit';

const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

const initialState = {
  // Define your initial state here
  baseURL: 'https://people.zoho.com/hrportal1524046581683',
  empid: '',
  userId: '',
  formattedFromDate: (new Date(currentYear, currentMonth - 1, 21)).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .replace(/ /g, '-'),
  formattedToDate: (new Date(currentYear, currentMonth, 20)).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .replace(/ /g, '-'),
  conreqcsr: '',
  erecno: '',
  formId: '',
};

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setData: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const {
  setData,
} = settingSlice.actions;

export default settingSlice.reducer;
