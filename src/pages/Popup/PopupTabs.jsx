import React, { useState } from 'react';
import Popup from './Popup';
import DonateModal from './DonateModal';
import AboutPage from './AboutPage';
import './PopupTabs.css';

const TABS = [
  { id: 'zwt', label: 'Zoho Working Time' },
  { id: 'sra', label: 'SRA++' },
];

const ACTIVE_TAB_KEY = 'popupActiveTab';

const getInitialTab = () => {
  try {
    const saved = localStorage.getItem(ACTIVE_TAB_KEY);
    if (TABS.some((tab) => tab.id === saved)) return saved;
  } catch (e) {}
  return 'zwt';
};

const PopupTabs = () => {
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [showAbout, setShowAbout] = useState(false);
  const selectTab = (tabId) => {
    setActiveTab(tabId);
    setShowAbout(false);
    try {
      localStorage.setItem(ACTIVE_TAB_KEY, tabId);
    } catch (e) {}
  };

  const toggleAbout = () => setShowAbout(!showAbout);

  return (
    <div className="popup-tabs">
      <nav className="popup-tabs-nav" role="tablist">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id && !showAbout;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`popup-tabs-button ${isActive ? 'active' : ''}`}
              onClick={() => selectTab(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
        <button
          type="button"
          className={`popup-about-button ${showAbout ? 'active' : ''}`}
          aria-pressed={showAbout}
          title="About"
          onClick={toggleAbout}
        >
          <span className="popup-about-icon" aria-hidden="true">
            i
          </span>
          About
        </button>
      </nav>
      <div className="popup-tabs-content">
        {/* Only mount the active tab, so an error in one tab can't break the other */}
        {activeTab === 'sra' && (
          <>
            <Popup />
            {/* ZWT shows its own reminder */}
            <DonateModal />
          </>
        )}
        {/* ZWT hides its own Home/About tabs when embedded (js/embed.js), this tab bar and About page replace them */}
        {activeTab === 'zwt' && (
          <iframe
            className="zwt-frame"
            src="zwt/index.html"
            title="Zoho Working Time"
          />
        )}
        {/* Over the tab instead of replacing it, so closing About doesn't reload the tab */}
        {showAbout && <AboutPage />}
      </div>
    </div>
  );
};

export default PopupTabs;
