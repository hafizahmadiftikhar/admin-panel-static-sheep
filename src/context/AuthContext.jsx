import { createContext, useContext, useEffect, useState } from 'react';
import { ADMIN_PROFILE } from '../data/mockData';

/**
 * Mock auth — no real backend. Any credentials "work". The session and the
 * editable admin profile are persisted to localStorage so a refresh keeps you
 * logged in and remembers profile edits.
 */
const AuthContext = createContext(null);

const SESSION_KEY = 'ddc.admin.session';
const PROFILE_KEY = 'ddc.admin.profile';

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    load(SESSION_KEY, false)
  );
  const [profile, setProfile] = useState(() => load(PROFILE_KEY, ADMIN_PROFILE));

  useEffect(() => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  // Any email/password is accepted — overwrite the displayed email with it.
  const login = (email) => {
    if (email) setProfile((p) => ({ ...p, email }));
    setIsAuthenticated(true);
  };

  const logout = () => setIsAuthenticated(false);

  const updateProfile = (patch) => setProfile((p) => ({ ...p, ...patch }));

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, profile, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
