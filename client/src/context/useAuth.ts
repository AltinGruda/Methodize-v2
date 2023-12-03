import { useContext } from "react";
import AuthContext, { AuthContextProps } from "./AuthContext";

// Create a custom hook to use the AuthContext
export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
  
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
  
    return context;
  };