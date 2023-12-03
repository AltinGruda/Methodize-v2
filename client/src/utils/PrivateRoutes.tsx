import { useEffect, useState } from 'react';
import { useAuth } from '@/context/useAuth';
import { Outlet, Navigate } from 'react-router-dom';
import { Socket } from 'socket.io-client'

interface Props {
  socket: Socket | null;
}

const PrivateRoutes: React.FC<Props> = ({ socket }) => {
  const { isAuth, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  
  useEffect(() => {
    // Check if authentication data is available
    if (!isAuth) {
      // Redirect to login if not authenticated
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [isAuth]);

  
  useEffect(() => {
    if (isAuth && socket && socket.connected) {
      socket.emit('newUser', user);
      console.log('Emitted a new user')
    }
  }, [isAuth, socket, user]);

  console.log(socket);
  
  if (isLoading) {
    // You can add a loading spinner or placeholder here
    return <div>Loading...</div>;
  }

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
