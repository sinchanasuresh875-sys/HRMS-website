const initialState = {
  user: null,
  token: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case 'auth/setUser':
      return { ...state, user: action.payload };
    case 'auth/setToken':
      return { ...state, token: action.payload };
    case 'auth/logout':
      return initialState;
    default:
      return state;
  }
}

export const setUser = (user) => ({ type: 'auth/setUser', payload: user });
export const setToken = (token) => ({ type: 'auth/setToken', payload: token });
export const logout = () => ({ type: 'auth/logout' });
