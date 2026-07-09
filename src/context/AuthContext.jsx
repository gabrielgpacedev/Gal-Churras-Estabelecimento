import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'galchurras-estabelecimento-auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = (data) => setUser(data ?? { name: 'Estabelecimento' });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
