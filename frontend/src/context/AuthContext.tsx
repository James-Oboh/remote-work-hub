import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth"; 
import { User } from "../types"; 

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: string | null;
  login: (username: string, token: string) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  role: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
      const savedUser = authService.getUser();
      const savedToken = authService.getToken();

      if (savedUser && savedToken) {
          setUser(savedUser);
          setToken(savedToken);
          setRole(savedUser.role);
      }
      setLoading(false);
  }, []);

  const login = (username: string, token: string) => {
      const fullUser = authService.getUser();
      if (fullUser) {
          setUser(fullUser);
          setToken(token);
          setRole(fullUser.role);
          navigate("/");
      } else {
          console.error("User data not found after login.");
      }
  };

  const logout = () => {
      authService.logout();
      setUser(null);
      setToken(null);
      setRole(null);
      navigate("/login");
  };

  return (
      <AuthContext.Provider value={{ user, token, role, login, logout, loading }}>
          {children}
      </AuthContext.Provider>
  );
};
