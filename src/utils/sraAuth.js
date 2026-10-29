// SRA login (access token and user) cached in the extension's storage, so SRA++ works from any tab.
// The content script refreshes it on every SRA page visit, the popup clears it when SRA answers 401.

const SRA_AUTH_KEY = 'sraAuth';

export const SRA_URL = 'https://sra.smartosc.com/';

const parseValue = (value) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

// SRA login from the SRA page's localStorage entries ([key, value] pairs), null when logged out
export function authFromLocalStorage(entries) {
  const data = Object.fromEntries(
    entries.map(([key, value]) => [key, parseValue(value)])
  );
  return data.accessToken
    ? { accessToken: data.accessToken, userData: data.userData }
    : null;
}

export async function loadSraAuth() {
  const result = await chrome.storage.local.get(SRA_AUTH_KEY);
  return result[SRA_AUTH_KEY] || null;
}

export async function saveSraAuth(auth) {
  await chrome.storage.local.set({ [SRA_AUTH_KEY]: auth });
}

export async function clearSraAuth() {
  await chrome.storage.local.remove(SRA_AUTH_KEY);
}

export const isUnauthorized = (error) => error?.response?.status === 401;
