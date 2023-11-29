// UserContext.tsx
import { createContext, useContext, useState } from 'react';

export interface User {
  name: string;
  email: string;
  password: string;
}

export interface UserData {
  email: string;
  password: string;
}

interface UserContextProps {
  user: User | null;
  login: (userData: UserData) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (userData: UserData) => {
      try {
        const response = await fetch('http://localhost:5000/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: userData.email,
                password: userData.password
            })
        });
        const userDetails = await response.json();
        if (response.ok) {
            console.log('User logging in, redirecting soon!');
            setUser(userDetails);
        }
    } catch (error) {
        console.log(error);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('http://localhost:5000/logout');
        if (response.ok) {
            console.log('User logging in, redirecting soon!');
            setUser(null);
        }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context as UserContextProps;
};


export default UserContext;
