import React, { useState } from 'react';

const RequestContainer = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('items');

  // Sample list of items
  const items = [
    { id: 1, title: 'Item 1', description: 'Description for item 1' },
    { id: 2, title: 'Item 2', description: 'Description for item 2' },
    { id: 3, title: 'Item 3', description: 'Description for item 3' },
    { id: 1, title: 'Item 1', description: 'Description for item 1' },
    { id: 2, title: 'Item 2', description: 'Description for item 2' },
    { id: 3, title: 'Item 3', description: 'Description for item 3' },
    { id: 1, title: 'Item 1', description: 'Description for item 1' },
    { id: 2, title: 'Item 2', description: 'Description for item 2' },
    { id: 3, title: 'Item 3', description: 'Description for item 3' },
  ];

  const handleOk = (item) => {
    alert(`You clicked OK for ${item.title}`);
  };

  const handleSkip = (item) => {
    alert(`You clicked Skip for ${item.title}`);
  };

  return (
    <div className="zas-root">
      {/* Toggle Button */}
      <button
        className="toggle-button"
        onClick={() => setIsPopupVisible(!isPopupVisible)}
      >
        Toggle Popup
      </button>

      {/* Popup */}
      {isPopupVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="header">
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
                  activeTab === 'items' ? 'active' : ''
                }`}
                onClick={() => setActiveTab('items')}
              >
                Items
              </button>
              <button
                className={`tab-button ${
                  activeTab === 'status' ? 'active' : ''
                }`}
                onClick={() => setActiveTab('status')}
              >
                Status
              </button>
            </div>
            <div className="tab-content">
              {activeTab === 'items' && (
                <div className="items-list">
                  {items.map((item) => (
                    <div key={item.id} className="item">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <div className="item-buttons">
                        <button
                          className="ok-button"
                          onClick={() => handleOk(item)}
                        >
                          OK
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
              {activeTab === 'status' && (
                <div className="status-content">
                  <h3>Status Tab Content</h3>
                  <p>This is the content for the Status tab.</p>
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
