chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'FETCH_API') {
    try {
      const response = await fetch('https://api.example.com/data');
      const data = await response.json();

      // Send data back to content scripts
      chrome.runtime.sendMessage({ type: 'FETCH_API_SUCCESS', payload: data });
    } catch (error) {
      chrome.runtime.sendMessage({ type: 'FETCH_API_FAILURE', error: error.message });
    }
  }
});
