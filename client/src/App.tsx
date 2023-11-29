import './App.css'
import { Sidebar } from './components/sidebar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Projects } from './pages/projects'
import { Kanban } from './pages/kanban'
import { NoProjects } from './components/no-projects'
import { Teams } from './pages/teams'
import { Team } from './pages/team'
import Authentication from './pages/authentication'

function App() {

  return (
    <div className='grid grid-cols-5 bg-[#D9DADE] min-h-screen'>
      <BrowserRouter>
      <Sidebar />
        <Routes>
          <Route path='/authentication' element={<Authentication />} />
          <Route path='/projects' element={<Projects />} />
          <Route path='/kanban' element={<Kanban />} />
          <Route path='/noprojects' element={<NoProjects />} />
          <Route path='/teams' element={<Teams />} />
          <Route path='/team' element={<Team />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
