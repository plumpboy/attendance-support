self.addEventListener('message', async (event) => {
  if (event.data && event.data.type === 'FETCH_API') {
    try {
      // Make an API call
      const response = await fetch('https://api.example.com/data');
      const data = await response.json();

      // Send data back to the client
      event.source.postMessage({ type: 'FETCH_API_SUCCESS', payload: data });
    } catch (error) {
      event.source.postMessage({ type: 'FETCH_API_FAILURE', error: error.message });
    }
  }
});
