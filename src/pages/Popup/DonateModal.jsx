import React, { useEffect, useState } from 'react';

// Shared with ZWT's own reminder (zwt/js/app-controller.js), so it pops up once per day across both tabs
const SHOWN_ON_KEY = 'donateReminderShownOn';

// Same format as ZWT's Utils.formatDateToCustom: 29-Oct-2026
const today = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  return `${day}-${month}-${date.getFullYear()}`;
};

const DonateModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(SHOWN_ON_KEY).then((result) => {
      if (result[SHOWN_ON_KEY] === today()) return;
      chrome.storage.local.set({ [SHOWN_ON_KEY]: today() });
      setIsVisible(true);
    });
  }, []);

  if (!isVisible) return null;

  return (
    <div className="donate-overlay" onClick={() => setIsVisible(false)}>
      <div
        className="donate-content"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>☕ Enjoying SRA++?</h3>
        <p>If this extension saves you time, please consider buying me a coffee!</p>
        <img src="zwt/qr.png" alt="Donation QR Code" className="donate-qr" />
        <button
          type="button"
          className="donate-close"
          onClick={() => setIsVisible(false)}
          autoFocus
        >
          Maybe later
        </button>
      </div>
    </div>
  );
};

export default DonateModal;
