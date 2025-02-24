import { put, takeLatest } from 'redux-saga/effects';
import { fetchDataRequest, fetchDataSuccess, fetchDataFailure } from '../redux/extensionSlice';

function* fetchFromServiceWorkerSaga() {
  try {
    if (chrome && chrome.runtime) {
      // Send a message to the Service Worker
      chrome.runtime.sendMessage({ type: 'FETCH_API' });

      // Wait for response from Service Worker
      yield new Promise((resolve, reject) => {
        chrome.runtime.onMessage.addListener((message) => {
          if (message.type === 'FETCH_API_SUCCESS') {
            resolve(message.payload);
          } else if (message.type === 'FETCH_API_FAILURE') {
            reject(message.error);
          }
        });
      })
        .then((data) => put(fetchDataSuccess(data)))
        .catch((error) => put(fetchDataFailure(error)));
    } else {
      throw new Error('Chrome Extension runtime not available');
    }
  } catch (error) {
    yield put(fetchDataFailure(error.message));
  }
}

export function* watchExtensionFetch() {
  yield takeLatest(fetchDataRequest.type, fetchFromServiceWorkerSaga);
}
