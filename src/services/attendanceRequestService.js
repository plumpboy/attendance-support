import Request from '@utils/requestZoho';
import Transformer from '@utils/transformer';
import { useSelector } from 'react-redux';

//get setting
const {
  conreqcsr,
  empid,
  formattedFromDate,
  formattedToDate,
  formId,
} = useSelector((state) => state.setting);

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
  return Request.post('AttendanceAction.zp', {
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
export function getFixTimeRequest() {
  return Request.post('AttendanceAction.zp', {
    mode: 'getMyRequest',
    conreqcsr,
    erecno: [erecno],
    sDate: formattedFromDate,
    eDate: formattedToDate,
  }).then((res) => {
    const data = Transformer.fetch(res.data);

    return data;
  });
}

/**
 *
 * @returns {function(*)}
 */
export function addFixTimeRequest(data) {
  return Request.post('AttendanceAction.zp', {
    mode: 'bulkAttendReg',
    conreqcsr,
    erecno,
    fdate: data.date,
    dataObj: {
      [fdate]: {
        fromDate: data.date,
        toDate: data.date,
        ftime: data.fromTime,
        ttime: data.toTime,
      },
    }
  }).then((res) => {
    const data = Transformer.fetch(res.data);

    return data;
  });
}

/**
 *
 * @returns {function(*)}
 */
export function getLeaveRequestsList() {
  return Request.post('leave_view_actions.zp', {
    key: "applications_view",
    viewMode: 1,
    from: formattedFromDate,
    to: formattedToDate,
    typeofleave: -1,
    employee: [empid],
    conreqcsr,
    status: -1,
    sortType: 1,
    sortBy: 3,
    sIndx: 1,
    limit: 20,
  }).then((res) => {
    const data = Transformer.fetch(res.data);

    return data;
  });
}

/**
 *
 * @returns {function(*)}
 */
export function addLeaveRequestsList(data) {
  return Request.post('addUpdateRecord.zp', {
    "isPicklistIdEnabled": "true",
    "Employee_ID": empid,
    "Leavetype": data.leaveType, // "412762000037993337", // Annual Leave //
    "From": data.date,
    "To": data.date,
    "bereavement_leave_type": "",
    "Reasonforleave": data.reason, // placeholder
    "zp_tableName": "P_EmployeeLeave",
    "loginUserZUID": userId,
    "conreqcsr": conreqcsr,
    "zp_formId": formId,
    "zp_mode": "addRecord",
    [data.date]: {
      "count": count.toString(), // quantity of leave days
      "session": session, // 0, 1, 2, 3, 4
      ...(session != 0 && {"inactive": false}) // false if not full day
    },
    "isHour": false,
    "isDayBased": true,
    "Daystaken": count,
    "isDraft": "false"
  }).then((res) => {
    const data = Transformer.fetch(res.data);

    return data;
  });
}

/**
 *
 * @returns {function(*)}
 */
export function getLeaveType(data) {
  return Request.post('leave_common_action.zp', {
    "key": "leavetype_appl",
    "employee": empid,
    "isView": false,
    "conreqcsr": conreqcsr,
  }).then((res) => {
    const data = Transformer.fetch(res.data.leave_data);

    return data;
  });
}
