import { createSlice } from '@reduxjs/toolkit';

const extensionSlice = createSlice({
  name: 'extension',
  initialState: { data: null, loading: false, error: null },
  reducers: {
    fetchDataRequest: (state) => {
      state.loading = true;
    },
    fetchDataSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchDataFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchDataRequest, fetchDataSuccess, fetchDataFailure } = extensionSlice.actions;
export default extensionSlice.reducer;
