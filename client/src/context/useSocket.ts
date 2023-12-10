import { useContext } from "react";
import { SocketContextData } from "./SocketContext";
import SocketContext from "./SocketContext";

export const useSocket = (): SocketContextData => {
    const context = useContext(SocketContext);
  
    if (!context) {
      throw new Error('useSocket must be used within a SocketProvider');
    }
  
    return context;
};