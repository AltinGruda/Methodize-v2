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
import { Backlog } from './pages/backlog'
import { Project } from './pages/project'
import { SocketProvider } from './context/SocketContext'

function App() {
  const {isAuth} = useAuth();
  return (
    <div className='grid grid-cols-5 bg-[#D9DADE] min-h-screen'>
      <BrowserRouter>
        {isAuth && <Sidebar />}
        <SocketProvider>
          <Routes>
              <Route element={<PrivateRoutes />}>
                <Route path='/projects' element={<Projects />} />
                <Route path='/project/:id' element={<Project />} />
                <Route path='/backlog/:id' element={<Backlog />} />
                <Route path='/backlog' element={<Backlog />} />
                <Route path='/kanban/:id' element={<Kanban />} />
                <Route path='/noprojects' element={<NoProjects />} />
                <Route path='/teams' element={<Teams />} />
                <Route path='/team/:id' element={<Team />}  />
              </Route>
              <Route path='/login' element={<Authentication />} />
          </Routes>
        </SocketProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
