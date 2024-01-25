import Logo from '@/assets/logo.png'
import { LayoutDashboard, Users2, Video, Settings, AreaChart, Brush, Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export function Sidebar() {
    const location = useLocation();

   return (
    <div className="col-span-1 bg-[#121212] min-h-screen">
        <img src={Logo} alt="methodize logo" className='max-w-[70%] m-auto' />
        <div className='flex flex-col items-center'>
            <div className='flex flex-col items-start gap-y-6 gap-x-5 text-lg text-[#6C6C6C]'>   
                <div className='flex gap-y-6 gap-x-5 hover:text-[#D2D2D2] hover:cursor-pointer'>
                    <Home className={`${location.pathname === '/' ? 'text-white' : ''}`} />
                    <Link to="/" className={`${location.pathname === '/' ? 'text-white' : ''}`}>Home</Link>
                </div>
                <div className='flex gap-y-6 gap-x-5 hover:text-[#D2D2D2] hover:cursor-pointer'>
                    <LayoutDashboard className={`${location.pathname === '/dashboard' ? 'text-white' : ''}`} />
                    <Link to="/dashboard" className={`${location.pathname === '/dashboard' ? 'text-white' : ''}`}>Dashboard</Link>
                </div>
                <div className='flex gap-y-6 gap-x-5 hover:text-[#D2D2D2] hover:cursor-pointer'>
                    <AreaChart className={`${location.pathname === '/charts' ? 'text-white' : ''}`} />
                    <Link to="charts" className={`${location.pathname === '/charts' ? 'text-white' : ''}`}>Charts</Link>
                </div>
                <div className='flex gap-y-6 gap-x-5 hover:text-[#D2D2D2] hover:cursor-pointer'>
                    <Users2 className={`${location.pathname === '/teams' ? 'text-white' : ''}`} />
                    <Link to="teams" className={`${location.pathname === '/teams' ? 'text-white' : ''}`}>Teams</Link>
                </div>
                <div className='flex gap-y-6 gap-x-5 hover:text-[#D2D2D2] hover:cursor-pointer'>
                    <Video className={`${location.pathname === '/room' ? 'text-white' : ''}`} />
                    <Link to="room" className={`${location.pathname === '/room' ? 'text-white' : ''}`}>Meetings</Link>
                </div>
                <div className='flex gap-y-6 gap-x-5 hover:text-[#D2D2D2] hover:cursor-pointer'>
                    <Brush className={`${location.pathname === '/whiteboard' ? 'text-white' : ''}`} />
                    <Link to="whiteboard" className={`${location.pathname === '/whiteboard' ? 'text-white' : ''}`}>Whiteboard</Link>
                </div>
                <div className='flex gap-y-6 gap-x-5 hover:text-[#D2D2D2] hover:cursor-pointer sticky bottom-0 '>
                    <Settings />
                    <span>Settings</span>
                </div>
            </div>
        </div>
    </div>
   ) 
}