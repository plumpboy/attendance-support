import { call, put, takeLast } from 'redux-saga/effects';
import { fetchAttendanceApi } from '../api/attendanceApi';
import { FETCH_ATTENDANCE_REQUEST, fetchAttendanceSuccess, fetchAttendanceFailure } from '../actions/attendanceActions';

// Worker saga: will be fired on FETCH_ATTENDANCE_REQUEST actions
function* fetchInitData(action) {
  try {
    const attendanceData = yield call(fetchAttendanceRequest, action.payload);
    const fixTimeRequestData = yield call(fetchFixTimeRequest, action.payload);
    const requestData = yield call(fetchFixTimeRequest, action.payload);
    const userData = yield call(fetchUserDataRequest, action.payload);
    yield put(fetchAttendanceSuccess(data));
  } catch (e) {
    yield put(fetchAttendanceFailure(e.message));
  }
}

function* createAttendanceRequest(action) {
  try {
    const attendanceData = yield call(fetchAttendanceRequest, action.payload);
    const requestData = yield call(fetchRequest, action.payload);
    const userData = yield call(fetchUserDataRequest, action.payload);
    yield put(fetchAttendanceSuccess(data));
  } catch (e) {
    yield put(fetchAttendanceFailure(e.message));
  }
}

function* createAbsentRequest(action) {
  try {
    const attendanceData = yield call(fetchAttendanceRequest, action.payload);
    const requestData = yield call(fetchRequest, action.payload);
    const userData = yield call(fetchUserDataRequest, action.payload);
    yield put(fetchAttendanceSuccess(data));
  } catch (e) {
    yield put(fetchAttendanceFailure(e.message));
  }
}

// Watcher saga: spawns a new fetchAttendance task on each FETCH_ATTENDANCE_REQUEST
function* attendanceSaga() {
  yield takeLast(FETCH_INIT_ATTENDANCE_REQUEST, fetchAttendance);
}

export default attendanceSaga;
