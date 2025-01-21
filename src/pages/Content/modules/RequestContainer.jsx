import React, { useState } from 'react';

const RequestContainer = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Sample list of items
  const items = [
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
            <div className="close-button">
              <button onClick={() => setIsPopupVisible(false)}>Close</button>
            </div>
            <h2>Items List</h2>
            {items.map((item) => (
              <div key={item.id} className="item">
                <div className="item-title">{item.title}</div>
                <div className="item-description">{item.description}</div>
                <div className="item-buttons">
                  <button className="ok-button" onClick={() => handleOk(item)}>
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
        </div>
      )}
    </div>
  );
};

export default RequestContainer;
