fetch("https://people.zoho.com/hrportal1524046581683/AttendanceAction.zp", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9,vi-VN;q=0.8,vi;q=0.7,ja;q=0.6,fr-FR;q=0.5,fr;q=0.4",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest"
  },
  "referrer": "https://people.zoho.com/hrportal1524046581683/zp",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "mode=getAttFiloInfo&conreqcsr=9d69f7f627c1d81aa499ba74a070958e62448b02fe6948a602279f56d8721c6dcf9f40cf2ee2bf5cd98a43fa350550901bceb8df98a9e3e890c0b5f316a74c5c&isAddRegRequest=true&fromDate=21-Dec-2024&toDate=20-Jan-2025&erecno=412762000145976089",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});

import Request from '../utils/requestSRA'
import Transformer from '../utils/transformer'

/**
 * get conreqcsr token
 *
 * @returns {function(*)}
 */
export function fetchLogData(accessToken, params) {
  return Request.get('/timesheet-overview', {
      params,
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      }
    })
    .then(res => {
      const data = Transformer.fetch(res.data)

      return data;
    })
}

/**
 *
 * @returns {function(*)}
 */
export function getUserData(accessToken) {
  return Request.get('/users/current-user', {
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      }
    })
    .then(res => {
      const data = Transformer.fetch(res.data)

      return data;
    })
}

/**
 *
 * @returns {function(*)}
 */
export function postWorkLogs(accessToken, data) {
  return Request.post('/user/worklogs', data, {
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      }
    })
    .then(res => {
      const data = Transformer.fetch(res.data)

      return data;
    })
}

/**
 *
 * @returns {function(*)}
 */
export function getTypeOfWork(accessToken) {
  return Request.get('/timesheet/type-of-work', {
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      }
    })
    .then(res => {
      const data = Transformer.fetch(res.data)

      return data;
    })
}

/**
 *
 * @returns {function(*)}
 */
export function getProjects(accessToken, params) {
  return Request.get('/projects/all', {
      params,
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      }
    })
    .then(res => {
      const data = Transformer.fetch(res.data)

      return data;
    })
}
