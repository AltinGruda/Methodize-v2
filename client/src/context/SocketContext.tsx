import React, { createContext, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

// Define the shape of your socket context data
export interface SocketContextData {
  socket: Socket | null;
}

// Create the socket context with an initial value
const SocketContext = createContext<SocketContextData>({ socket: null });

// Define a provider component that will wrap your app and provide the socket context
interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Cleanup when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;