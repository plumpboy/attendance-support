import { useCallback, useEffect, useState } from 'react';
import React from 'react';
import logo from '../../assets/img/icon-34.png';
import './Popup.css';
import { getTypeOfWork } from '../../api/sra';
import {
  SRA_URL,
  authFromLocalStorage,
  loadSraAuth,
  saveSraAuth,
  clearSraAuth,
  isUnauthorized,
} from '../../utils/sraAuth';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LogWorkPlanner from './LogWorkPlanner';

const SESSION_EXPIRED = 'SRA session expired, please log in to SRA again';

// The SRA login of the active tab when it is SRA, otherwise the one cached on the last SRA visit
const getSraAuth = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.url?.startsWith(SRA_URL)) {
    try {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => Object.entries(localStorage),
      });
      const auth = authFromLocalStorage(result?.result || []);
      if (auth) {
        await saveSraAuth(auth);
        return auth;
      }
    } catch (e) {
      console.error('Failed to read the SRA login from the page', e);
    }
  }
  return loadSraAuth();
};

const Popup = () => {
  // undefined while loading, null when not logged in
  const [sraAuth, setSraAuth] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workOption, setWorkOption] = useState([]);
  const [isLoadingWorkType, setIsLoadingWorkType] = useState(false);

  const getCurrentMonth = (date) => {
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2);
  };

  const [month, setMonth] = useState(getCurrentMonth(currentDate));

  useEffect(() => {
    getSraAuth().then(setSraAuth);
  }, []);

  // The cached token is no longer valid: forget it and ask for a new SRA visit
  const onSessionExpired = useCallback(() => {
    clearSraAuth();
    setSraAuth(null);
    setSuccessMessage('');
    setErrorMessage(SESSION_EXPIRED);
  }, []);

  useEffect(() => {
    if (sraAuth?.accessToken) {
      setIsLoadingWorkType(true);
      getTypeOfWork(sraAuth.accessToken)
        .then((data) => {
          const workType = data.typeOfWorks;
          const workTypeOption = workType.map((typeOfWork) => ({
            value: typeOfWork.id,
            label: typeOfWork.name,
          }));
          setWorkOption(workTypeOption);
        })
        .catch((e) => {
          if (isUnauthorized(e)) {
            onSessionExpired();
          } else {
            setErrorMessage(`Failed to load type of work: ${e.message}`);
          }
        })
        .finally(() => setIsLoadingWorkType(false));
    }
  }, [sraAuth, onSessionExpired]);

  // Logging in on SRA saves the login for SRA++ (content script), the popup then works from any tab
  const goToSRA = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    await chrome.tabs.update(tab.id, { url: SRA_URL });
    window.close();
  };

  const handleMonthChange = (date) => {
    setCurrentDate(date);
    setMonth(getCurrentMonth(date));
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="App">
      <header className={`App-header ${sraAuth ? 'wide' : ''}`}>
        <div class="title">
          <img src={logo} className="logo" alt="logo" />
          <p class="text-title">SRA Log Work</p>
        </div>
        {/* Above the form, so they stay visible when the planner is long */}
        {errorMessage !== '' && <div class="error-message">{errorMessage}</div>}

        {successMessage !== '' && (
          <div class="suceess-message">{successMessage}</div>
        )}
        {sraAuth && (
          <div class="container">
            <div class="date-input">
              <label htmlFor="month">Month: </label>
              <br />
              <div class="date-picker">
                <DatePicker
                  selected={currentDate}
                  onChange={handleMonthChange}
                  showMonthYearPicker={true}
                  dateFormat="yyyy-MM"
                  maxDate={new Date()}
                />
              </div>
            </div>
            <LogWorkPlanner
              accessToken={sraAuth.accessToken}
              userData={sraAuth.userData}
              month={month}
              workOption={workOption}
              isLoadingWorkType={isLoadingWorkType}
              onError={setErrorMessage}
              onSessionExpired={onSessionExpired}
              onSuccess={(message) => {
                setErrorMessage('');
                setSuccessMessage(message);
              }}
            />
          </div>
        )}
        {sraAuth === null && (
          <div class="go-to-sra">
            <button className="log-button" type="button" onClick={goToSRA}>
              Go to SRA
            </button>
            <p>Log in to SRA once, SRA++ then works from any tab</p>
          </div>
        )}
      </header>
    </div>
  );
};

export default Popup;
