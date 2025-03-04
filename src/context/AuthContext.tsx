
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define types for the user
interface User {
  uid: string;
  email: string;
  username: string;
  profilePhoto: string | null;
  role: 'admin' | 'editor';
  teamId: string;
  emailVerified: boolean;
  subscribedToUpdates: boolean;
}

// Define context value type
interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  login: (userData: User, authToken: string) => void;
  logout: () => void;
  updateUserProfile: (updatedData: Partial<User>) => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// Custom hook for using the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Effect to load user and token from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        setCurrentUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = (userData: User, authToken: string) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
    setCurrentUser(userData);
    setToken(authToken);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCurrentUser(null);
    setToken(null);
  };

  // Update user profile
  const updateUserProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...updatedData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  };

  // Context value
  const value: AuthContextType = {
    currentUser,
    token,
    login,
    logout,
    updateUserProfile,
    isAdmin: currentUser?.role === 'admin',
    isAuthenticated: !!currentUser && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;