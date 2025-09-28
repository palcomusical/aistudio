import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { mockUsers } from '../constants';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  register: (newUser: Omit<User, 'id'>) => Promise<User>;
  deleteUser: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useLocalStorage<User[]>('bomcorte_users', mockUsers);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('bomcorte_current_user', null);

  const login = (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          const userToStore = { ...user };
          delete userToStore.password; // Don't store password in currentUser state
          setCurrentUser(userToStore);
          resolve(userToStore);
        } else {
          reject(new Error('Credenciais inválidas.'));
        }
      }, 500);
    });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = (newUser: Omit<User, 'id'>): Promise<User> => {
     return new Promise((resolve, reject) => {
      if (users.some(u => u.email === newUser.email)) {
        return reject(new Error('Este e-mail já está em uso.'));
      }
      const user: User = { ...newUser, id: `user-${Date.now()}` };
      setUsers(prev => [...prev, user]);
      resolve(user);
    });
  };

  const deleteUser = (userId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (currentUser?.id === userId) {
        return reject(new Error('Você não pode excluir a si mesmo.'));
      }
      setUsers(prev => prev.filter(u => u.id !== userId));
      resolve();
    });
  };

  const value = { currentUser, users, login, logout, register, deleteUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
