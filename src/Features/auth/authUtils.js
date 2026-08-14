const TOKEN_KEY = 'hrms_token';

export function setToken(token) {
  try { localStorage.setItem(TOKEN_KEY, token); } catch { /* ignore */ }
}

export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

export function removeToken() {
  try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
}
