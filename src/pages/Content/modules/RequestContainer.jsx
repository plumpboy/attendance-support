import React, { useState, useEffect } from 'react';
import { fetchAttandanceData } from '@services/attendance';

const RequestContainer = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('requests');
  const [attandanceData, setAttandanceData] = useState([]);

  useEffect(() => {
    fetchAttandanceData().then((data) => {
      setAttandanceData(data);
    });
  }, []);

  useEffect(() => {
    console.log('attandanceData', attandanceData);
  }, [attandanceData]);
  // Sample list of items
  const requests = [
    { id: 1, date: '20-01-2025', from: '6:00', to: '8:00', type: 'Fix-time' },
    { id: 2, date: '20-01-2025', from: '6:00', to: '8:00', type: 'Leave' },
    { id: 3, date: '20-01-2025', from: '6:00', to: '8:00', type: 'Fix-time' },
    { id: 4, date: '20-01-2025', from: '6:00', to: '8:00', type: 'Leave' },
    { id: 5, date: '20-01-2025', from: '6:00', to: '8:00', type: 'Fix-time' },
    { id: 6, date: '20-01-2025', from: '6:00', to: '8:00', type: 'Leave' },
    { id: 7, date: '20-01-2025', from: '6:00', to: '8:00', type: 'Leave' },
    { id: 8, date: '20-01-2025', from: '6:00', to: '8:00', type: 'Leave' },
  ];

  const handleOk = (item) => {
    alert(`You clicked OK for ${item.title}`);
  };

  const handleSkip = (item) => {
    alert(`You clicked Skip for ${item.title}`);
  };

  const togglePopup = () => {
    const bottomPaging = document.querySelector('.zpl_tblpagination');
    console.log('bottomPaging', bottomPaging);
    if (bottomPaging) {
      bottomPaging.style.display = !isPopupVisible ? 'none' : 'flex';
    }
    setIsPopupVisible(!isPopupVisible);
  };

  return (
    <div className="zas-root">
      {/* Toggle Button */}
      <button className="toggle-button" onClick={togglePopup}>
        Attendance Support
      </button>

      {/* Popup */}
      {isPopupVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <h2>Items List</h2>
              <button
                className="close-button"
                onClick={() => setIsPopupVisible(false)}
              >
                Close
              </button>
            </div>
            <div className="tabs">
              <button
                className={`tab-button ${
                  activeTab === 'status' ? 'active' : ''
                }`}
                onClick={() => setActiveTab('status')}
              >
                Status
              </button>
              <button
                className={`tab-button ${
                  activeTab === 'requests' ? 'active' : ''
                }`}
                onClick={() => setActiveTab('requests')}
              >
                Create Requests
              </button>
            </div>
            <div className="tab-content">
              {activeTab === 'status' && (
                <div className="status-content">
                  <h3>Status Tab Content</h3>
                  <p>This is the content for the Status tab.</p>
                </div>
              )}
              {activeTab === 'requests' && (
                <div className="items-list">
                  <div className="item header">
                    <h3>Date</h3>
                    <h3>Type</h3>
                    <h3>From</h3>
                    <h3>To</h3>
                    <h3>Actions</h3>
                  </div>
                  {requests.map((item) => (
                    <div key={item.id} className="item">
                      <p>{item.date}</p>
                      <p>{item.type}</p>
                      <p>{item.from}</p>
                      <p>{item.to}</p>
                      <div className="item-buttons">
                        <button
                          className="ok-button"
                          onClick={() => handleOk(item)}
                        >
                          Submit
                        </button>
                        <button
                          className="skip-button"
                          onClick={() => handleSkip(item)}
                        >
                          Skip
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestContainer;
