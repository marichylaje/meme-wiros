// src/context/UserContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';

const UserContext = createContext({
  user: null as null | { id: string; email: string },
  isLoggedIn: false,
  login: (token: string) => {},
  logout: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<null | { id: string; email: string }>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwt.decode(token);
        if (decoded && decoded.id && decoded.email) {
          setUser({ id: decoded.id, email: decoded.email });
        }
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    const decoded: any = jwt.decode(token);
    if (decoded && decoded.id && decoded.email) {
      setUser({ id: decoded.id, email: decoded.email });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
