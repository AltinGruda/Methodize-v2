import './App.css'
import { Sidebar } from './components/sidebar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Kanban } from './pages/kanban'
import { NoProjects } from './components/no-projects'
import { Teams } from './pages/teams'
import { Team } from './pages/team'
import Authentication from './pages/authentication'
import { useAuth } from './context/useAuth'
import PrivateRoutes from './utils/PrivateRoutes'
import { Backlog } from './pages/backlog'
import { Project } from './pages/project'
import { SocketProvider } from './context/SocketContext'
import { Notes } from './components/notes'
import { Dashboard } from './pages/dashboard'
import Room from './pages/room'
import Rooms from './pages/rooms'
import { Charts } from './pages/charts'
import { Whiteboard } from './pages/whiteboard'
import { LandingPage } from './pages/landing-page'
import { LeaderDashboard } from './pages/leader-dashboard'

function App() {
  const {isAuth} = useAuth();
  return (
    <div className='grid grid-cols-5 bg-[#D9DADE] min-h-screen'>
      <BrowserRouter>
          {isAuth && <Sidebar /> }
          {isAuth && <Notes />}
          <SocketProvider>
            <Routes>
                <Route element={<PrivateRoutes />}>
                  <Route path='/' element={<Dashboard />} />
                  <Route path='/dashboard' element={<LeaderDashboard />} />
                  <Route path='/project/:id' element={<Project />} />
                  <Route path='/backlog/:id' element={<Backlog />} />
                  <Route path='/kanban/:id' element={<Kanban />} />
                  <Route path='/noprojects' element={<NoProjects />} />
                  <Route path='/teams' element={<Teams />} />
                  <Route path='/team/:id' element={<Team />}  />
                  <Route path='/room' element={<Room />} />
                  <Route path='/room/all' element={<Rooms />} />
                  <Route path='/charts' element={<Charts />} />
                  <Route path='/whiteboard' element={<Whiteboard />} />
                </Route>
                <Route path='/home' element={<LandingPage />} />
                <Route path='/login' element={<Authentication />} />
            </Routes>
          </SocketProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
