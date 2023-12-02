// UserContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  __v: number;
}

export interface UserData {
  email: string;
  password: string;
}

// Define the types for the authentication context
interface AuthContextProps {
  isAuth: boolean;
  token: string | null;
  userId: string | null;
  error: Error | null;
  user: User | null;
  login: (userData: UserData) => void;
  logout: () => void;
}

interface AuthState {
  isAuth: boolean;
  token: string | null;
  userId: string | null;
  user: User | null;
  error: Error | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Define the AuthProviderProps type
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuth: false,
    token: null,
    userId: null,
    user: null,
    error: null,
  });
  
  useEffect(() => {
    // Check local storage for the JWT token
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    const storedUser: string | null = localStorage.getItem('user');
    const parsedUser: User | null = storedUser ? JSON.parse(storedUser) : null;
    if (storedToken && storedUserId) {
      setAuthState({
        isAuth: true,
        token: storedToken,
        userId: storedUserId,
        user: parsedUser,
        error: null,
      });
    } else {
      setAuthState({
        ...authState,
      });
    }
  }, []);

  const login = async (userData: UserData) => {
    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password
        })
      });
  
      if (response.status === 422) {
        throw new Error('Validation failed.');
      }
  
      if (response.status !== 200 && response.status !== 201) {
        console.log('Error!');
        throw new Error('Could not authenticate you!');
      }
  
      const resData = await response.json();

      setAuthState({
        isAuth: true,
        token: resData.token,
        userId: resData.userId,
        user: resData.user,
        error: null,
      });
  
      localStorage.setItem('token', resData.token);
      localStorage.setItem('userId', resData.userId);
      localStorage.setItem('user', JSON.stringify(resData.user));
  
      const remainingMilliseconds = 60 * 60 * 1000;
      const expiryDate = new Date(
        new Date().getTime() + remainingMilliseconds
      );
      localStorage.setItem('expiryDate', expiryDate.toISOString());
      // this.setAutoLogout(remainingMilliseconds);
    } catch (err) {
      console.log(err);

      setAuthState({
        isAuth: false,
        token: null,
        userId: null,
        user: null,
        error: err as Error,
      });
    }
  };

  // Function to handle logout
  const logout = () => {
    setAuthState({
      isAuth: false,
      token: null,
      userId: null,
      user: null,
      error: null,
    });

    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
  };

  // Create a value object to be provided to consumers of the context
  const contextValue = {
    ...authState,
    login,
    logout,
  };


  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the AuthContext
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};


export default AuthContext;
