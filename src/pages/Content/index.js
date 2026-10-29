import {
  authFromLocalStorage,
  saveSraAuth,
  clearSraAuth,
} from '../../utils/sraAuth';

// Keep SRA++'s cached SRA login in sync with this page, so the popup works from any tab
let lastToken;

const syncSraAuth = () => {
  const auth = authFromLocalStorage(Object.entries(localStorage));
  if (auth?.accessToken === lastToken) return;
  lastToken = auth?.accessToken;
  if (auth) {
    saveSraAuth(auth);
  } else {
    // Logged out of SRA
    clearSraAuth();
  }
};

syncSraAuth();
// SRA is a single page app: logging in or out doesn't reload the page
setInterval(syncSraAuth, 3000);
