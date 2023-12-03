import './App.css'
import { Sidebar } from './components/sidebar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Projects } from './pages/projects'
import { Kanban } from './pages/kanban'
import { NoProjects } from './components/no-projects'
import { Teams } from './pages/teams'
import { Team } from './pages/team'
import Authentication from './pages/authentication'
import { useAuth } from './context/useAuth'
import PrivateRoutes from './utils/PrivateRoutes'
import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

function App() {
  const {isAuth} = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    return () => {
      // Disconnect the socket when the component unmounts
      newSocket.disconnect();
      console.log('Socket Disconnected!')
    };
  }, []);

  return (
    <div className='grid grid-cols-5 bg-[#D9DADE] min-h-screen'>
      <BrowserRouter>
        {isAuth && <Sidebar />}
          <Routes>
              <Route element={<PrivateRoutes socket={socket} />}>
                <Route path='/projects' element={<Projects />} />
                <Route path='/kanban' element={<Kanban />} />
                <Route path='/noprojects' element={<NoProjects />} />
                <Route path='/teams' element={<Teams socket={socket} />} />
                <Route path='/team/:id' element={<Team socket={socket} />}  />
              </Route>
              <Route path='/login' element={<Authentication />} />
          </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
