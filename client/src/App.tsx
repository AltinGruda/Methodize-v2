import './App.css'
import { Sidebar } from './components/sidebar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Projects } from './pages/projects'
import { Kanban } from './pages/kanban'
import { NoProjects } from './components/no-projects'

function App() {

  return (
    <div className='grid grid-cols-5 bg-[#D9DADE] min-h-screen'>
      <BrowserRouter>
      <Sidebar />
        <Routes>
          <Route path='/projects' element={<Projects />} />
          <Route path='/kanban' element={<Kanban />} />
          {/* <Route path='/noprojects' element={<NoProjects />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
