import Request from '../utils/requestSRA'
import Transformer from '../utils/transformer'

/**
 * get conreqcsr token
 *
 */
export function getConreqcsrToken(document) {
  const conreqcsr = document.cookie
    .split('; ')
    .find((row) => row.startsWith('CSRF_TOKEN='))
    ?.split('=')[1];

  return conreqcsr;
}

/**
 *
 */
export function getFormId(accessToken, data) {
  const formId = document.querySelector('select#viewList').getAttribute('formid')

  return formId;
}

/**
 *
 */
export function getBaseUrl(accessToken) {
  const baseUrl = window.location.origin + '/' + window.location.pathname.split('/')[1];

  return baseUrl;
}

/**
 *
 */
export function getEmployeeId(accessToken, params) {
  return document
    .querySelector('img#zpeople_userimage')
    .getAttribute('empid');
}

/**
 *
 */
export function getUserId(accessToken, params) {
  const userId = document.querySelector('.Activity span').getAttribute('uid');

  return userId;
}
