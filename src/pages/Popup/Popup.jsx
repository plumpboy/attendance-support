import { useEffect, useState } from 'react';
import React from 'react';
import logo from '../../assets/img/icon-34.png';
import './Popup.css';
import { getTypeOfWork } from '../../api/sra';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LogWorkPlanner from './LogWorkPlanner';

const Popup = () => {
  const [localStorageData, setLocalStorageData] = useState(null);
  const [isOnSRAPage, setIsOnSRAPage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workOption, setWorkOption] = useState([]);
  const [isLoadingWorkType, setIsLoadingWorkType] = useState(false);

  const getCurrentMonth = (date) => {
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2);
  };

  const [month, setMonth] = useState(getCurrentMonth(currentDate));
  let tabId;
  const setLocalStorage = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const fromPageLocalStore = await chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function() {
        return Object.entries(localStorage);
      },
    });
    const localStorageData = fromPageLocalStore?.[0]?.result?.reduce(
      (acc, [key, value]) => {
        // Check if value is a valid JSON
        try {
          const parsedValue = JSON.parse(value);
          return { ...acc, [key]: parsedValue };
        } catch (e) {
          // If not a valid JSON, return the original value
          return { ...acc, [key]: value };
        }
      },
      {}
    );
    console.log('localStorageData', localStorageData);
    setLocalStorageData(localStorageData);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // useEffect(() => {
  //   if (localStorageData && localStorageData?.accessToken) {
  //     chrome.tabs.query(
  //       { active: true, currentWindow: true },
  //       async function (tabs) {
  //         const fromPageLocalStore = await chrome.scripting.executeScript({
  //           target: { tabId: tabs[0].id },
  //           function() {
  //             return Object.entries(localStorage);
  //           },
  //         });

  //         const localStorageData = fromPageLocalStore?.[0]?.result?.reduce(
  //           (acc, [key, value]) => {
  //             // Check if value is a valid JSON
  //             try {
  //               const parsedValue = JSON.parse(value);
  //               return { ...acc, [key]: parsedValue };
  //             } catch (e) {
  //               // If not a valid JSON, return the original value
  //               return { ...acc, [key]: value };
  //             }
  //           },
  //           {}
  //         );
  //         console.log('localStorageData', localStorageData);
  //         setLocalStorageData(localStorageData);
  //       }
  //     );
  //   }
  // }, []);

  useEffect(() => {
    if (localStorageData?.accessToken) {
      setIsLoadingWorkType(true);
      getTypeOfWork(localStorageData.accessToken)
        .then((data) => {
          const workType = data.typeOfWorks;
          const workTypeOption = workType.map((typeOfWork) => ({
            value: typeOfWork.id,
            label: typeOfWork.name,
          }));
          setWorkOption(workTypeOption);
        })
        .catch((e) => {
          // 401 means the SRA session expired
          const message =
            e.response?.status === 401
              ? 'SRA session expired, please log in to SRA again'
              : `Failed to load type of work: ${e.message}`;
          setErrorMessage(message);
        })
        .finally(() => setIsLoadingWorkType(false));
    }
  }, [localStorageData]);

  useEffect(() => {
    chrome.tabs.query(
      { currentWindow: true, active: true },
      async function (tab) {
        const isOnSRAPage = tab[0].url.includes('sra.smartosc.com');
        tabId = tab[0].id;
        setIsOnSRAPage(isOnSRAPage);
      }
    );
  }, []);

  useEffect(() => {
    if (isOnSRAPage) {
      setLocalStorage();
    }
  }, [isOnSRAPage]);

  const goToSRA = async () => {
    await chrome.tabs.update(tabId, { url: 'https://sra.smartosc.com/' });
    return new Promise((resolve) => {
      chrome.tabs.onUpdated.addListener(function onUpdated(tabId, info) {
        if (info.status === 'complete') {
          setIsOnSRAPage(true);
        }
      });
    });
  };

  const handleMonthChange = (date) => {
    setCurrentDate(date);
    setMonth(getCurrentMonth(date));
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="App">
      <header className={`App-header ${isOnSRAPage ? 'wide' : ''}`}>
        <div class="title">
          <img src={logo} className="logo" alt="logo" />
          <p class="text-title">SRA Log Work</p>
        </div>
        {/* Above the form, so they stay visible when the planner is long */}
        {errorMessage !== '' && (
          <div class="error-message">
            {errorMessage}
          </div>
        )}

        {successMessage !== '' && (
          <div class="suceess-message">
            {successMessage}
          </div>
        )}
        {isOnSRAPage ? (
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
            {localStorageData?.accessToken ? (
              <LogWorkPlanner
                accessToken={localStorageData.accessToken}
                userData={localStorageData.userData}
                month={month}
                workOption={workOption}
                isLoadingWorkType={isLoadingWorkType}
                onError={setErrorMessage}
                onSuccess={(message) => {
                  setErrorMessage('');
                  setSuccessMessage(message);
                }}
              />
            ) : (
              localStorageData && (
                <p className="planner-note">You must log in SRA</p>
              )
            )}
          </div>
        ) : (
          <div class="go-to-sra">
            <button className="log-button" type="button" onClick={goToSRA}>
              Go to SRA
            </button>
            <br />
            <p> You need go to SRA to log work</p>
          </div>
        )}
      </header>
    </div>
  );
};

export default Popup;
