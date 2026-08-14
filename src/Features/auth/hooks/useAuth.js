import { useState } from 'react';
import * as api from '../api/authApi';
import { setToken, removeToken } from '../authUtils';

export default function useAuth() {
  const [user, setUser] = useState(null);

  async function login(credentials) {
    const res = await api.login(credentials);
    if (res?.token) {
      setToken(res.token);
      setUser(res.user || { email: credentials.email });
    }
    return res;
  }

  function logout() {
    removeToken();
    setUser(null);
  }

  return { user, login, logout };
}
