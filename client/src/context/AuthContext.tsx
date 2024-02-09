// UserContext.tsx
import { createContext, useEffect, useState } from 'react';
export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  teams: string[];
  __v: number;
}

export interface UserData {
  email: string;
  password: string;
}

export interface UserSignupData {
  email: string;
  name: string;
  password: string;
}

// Define the types for the authentication context
export interface AuthContextProps {
  isAuth: boolean;
  token: string | null;
  userId: string | null;
  error: Error | null;
  user: User | null;
  login: (userData: UserData) => void;
  logout: () => void;
  signup: (userData: UserSignupData) => void;
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
  
    // Use a callback to ensure state consistency
    setAuthState(prevState => {
      if (storedToken && storedUserId) {
        return {
          ...prevState,
          isAuth: true,
          token: storedToken,
          userId: storedUserId,
          user: parsedUser,
          error: null,
        };
      } else {
        return {
          ...prevState,
        };
      }
    });
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
    localStorage.removeItem('expiryDate');
  };

  const signup = async (userData: UserSignupData) => {
    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          name: userData.name
        })
      });
  
      if (response.status === 422) {
        throw new Error('Validation failed.');
      }
  
      if (response.status !== 200 && response.status !== 201) {
        console.log('Error!');
        throw new Error('Could not register the user!');
      }
  
      const resData = await response.json();
      console.log("Response data: ", resData)
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
  

  // Create a value object to be provided to consumers of the context
  const contextValue = {
    ...authState,
    login,
    logout,
    signup
  };


  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};




export default AuthContext;
