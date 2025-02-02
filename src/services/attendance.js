import Request from '@utils/requestZoho';
import Transformer from '@utils/transformer';

//get current url of the page

const empid = document
  .querySelector('img#zpeople_userimage')
  .getAttribute('empid');
// get cookie key CSRF_TOKEN from current tab
const conreqcsr = document.cookie
  .split('; ')
  .find((row) => row.startsWith('CSRF_TOKEN='))
  ?.split('=')[1];
const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

const fromDate = new Date(currentYear, currentMonth - 1, 21);
const toDate = new Date(currentYear, currentMonth, 20);

const formattedFromDate = fromDate
  .toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  .replace(/ /g, '-');

const formattedToDate = toDate
  .toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  .replace(/ /g, '-');

// const BASE_URL = 'https://people.zoho.com/hrportal1524046581683/AttendanceAction.zp';
// fetch("https://people.zoho.com/hrportal1524046581683/AttendanceAction.zp", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "en-US,en;q=0.9,vi-VN;q=0.8,vi;q=0.7,ja;q=0.6,fr-FR;q=0.5,fr;q=0.4",
//     "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
//     "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "x-requested-with": "XMLHttpRequest"
//   },
//   "referrer": "https://people.zoho.com/hrportal1524046581683/zp",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": "mode=getAttFiloInfo&conreqcsr=e097dad269e084ada74788a94de591e207c42151478f274096dffe2bff7ce41cc12879456bbf290ed607ca033f7876cf7697987c54c13b503ad774f7f1fbedb1&isAddRegRequest=true&fromDate=21-Dec-2024&toDate=20-Jan-2025&erecno=412762000145976089",
//   "method": "POST",
//   "mode": "cors",
//   "credentials": "include"
// });

/**
 * fetch the current user attandance data
 *
 * @returns {function(*)}
 */
export function fetchAttandanceData() {
  return Request.post('/AttendanceAction.zp', {
    mode: 'getAttFiloInfo',
    conreqcsr,
    isAddRegRequest: true,
    fromDate: formattedFromDate,
    toDate: formattedToDate,
    erecno: empid,
  }).then((res) => {
    const data = Transformer.fetch(res.data);

    return data;
  });
}

/**
 *
 * @returns {function(*)}
 */
export function getUserData(accessToken) {
  return Request.get('/users/current-user', {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  }).then((res) => {
    const data = Transformer.fetch(res.data);

    return data;
  });
}

/**
 *
 * @returns {function(*)}
 */
export function postWorkLogs(accessToken, data) {
  return Request.post('/user/worklogs', data, {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  }).then((res) => {
    const data = Transformer.fetch(res.data);

    return data;
  });
}

/**
 *
 * @returns {function(*)}
 */
export function getTypeOfWork(accessToken) {
  return Request.get('/timesheet/type-of-work', {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  }).then((res) => {
    const data = Transformer.fetch(res.data);

    return data;
  });
}

/**
 *
 * @returns {function(*)}
 */
export function getProjects(accessToken, params) {
  return Request.get('/projects/all', {
    params,
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  }).then((res) => {
    const data = Transformer.fetch(res.data);

    return data;
  });
}
