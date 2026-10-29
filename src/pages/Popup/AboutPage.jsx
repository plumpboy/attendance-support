import React from 'react';
import logo from '../../assets/img/icon-128.png';
import { CONSTANTS } from '../../zwt/js/constants';

const { name, version } = chrome.runtime.getManifest();
const { WORK_HOURS } = CONSTANTS;

// { hours: 19, minutes: 30 } -> 7:30 PM
const formatTime = ({ hours, minutes }) =>
  `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${
    hours < 12 ? 'AM' : 'PM'
  }`;

const AboutPage = () => (
  <div className="about-page">
    <div className="about-header">
      <img src={logo} alt="" className="about-logo" />
      <h2>{name}</h2>
      <p className="about-subtitle">
        SRA++ &amp; Zoho working time in one extension
      </p>
      <p className="about-version">Version {version}</p>
    </div>

    <section className="about-section">
      <h3>Support Development Team</h3>
      <div className="about-donate">
        <p>If you find this extension helpful, buy me a coffee!</p>
        <img src="zwt/qr.png" alt="Donation QR Code" className="donate-qr" />
      </div>
    </section>

    <div className="about-columns">
      <section className="about-section">
        <h3>SRA++</h3>
        <p>Log a whole month of work on SRA in one go.</p>
        <ul>
          <li>Finds every working day with allocated hours not logged yet</li>
          <li>
            Splits each project's day between types of work, e.g. Coding 4h +
            Testing 4h
          </li>
          <li>A different type of work for each project</li>
          <li>Preview, edit or delete every work log before logging</li>
          <li>Remembers each project's split for next month</li>
        </ul>
        <h4>How to use</h4>
        <ol>
          <li>Log in to SRA once, then open SRA++ from any tab</li>
          <li>Pick the month, then the types of work and hours per project</li>
          <li>Click "Preview work logs", check the list, then "Log"</li>
        </ol>
      </section>

      <section className="about-section">
        <h3>Zoho working time</h3>
        <p>Working time and attendance from Zoho People.</p>
        <ul>
          <li>Today's work duration and recommended check-out time</li>
          <li>Monthly report: days below 6h, days 6h-8h, requested days</li>
          <li>
            Auto log: attendance requests and minimum leave for days below 8h
          </li>
          <li>Manual log: pick attendance or leave day by day</li>
        </ul>
        <h4>How to use</h4>
        <ol>
          <li>Log in to Zoho People</li>
          <li>Open the extension, "Zoho working time" tab</li>
          <li>Use "Auto log" or "Manual log" to settle days below 8h</li>
        </ol>
      </section>
    </div>

    <section className="about-section">
      <h3>Work Hours Configuration</h3>
      <div className="about-config">
        <div>
          <strong>Work Hours:</strong> {formatTime(WORK_HOURS.START)} -{' '}
          {formatTime(WORK_HOURS.END)}
        </div>
        <div>
          <strong>Lunch Break:</strong> {formatTime(WORK_HOURS.LUNCH_START)} -{' '}
          {formatTime(WORK_HOURS.LUNCH_END)}
        </div>
        <div>
          <strong>Late Start Threshold:</strong>{' '}
          {formatTime(WORK_HOURS.LATE_START_THRESHOLD)}
        </div>
        <div>
          <strong>Standard Work Hours:</strong> {WORK_HOURS.STANDARD_WORK_HOURS}{' '}
          hours
        </div>
        <div>
          <strong>Limited Work Hours:</strong> {WORK_HOURS.LIMITED_WORK_HOURS}{' '}
          hours (for late starts)
        </div>
      </div>
    </section>

    <p className="about-footer">
      For support or feedback, please contact the development team.
    </p>
  </div>
);

export default AboutPage;
