import Logo from '@/assets/logo.png'
import { LayoutDashboard, KanbanSquareDashed, ListTodo, Users2, Video, MessagesSquare, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Sidebar() {
   return (
    <div className="col-span-1 bg-[#121212]">
        <img src={Logo} alt="methodize logo" className='max-w-[70%] m-auto' />
        <div className='flex flex-col items-center'>
            <div className='flex flex-col items-start gap-y-6 gap-x-5 text-lg text-[#6C6C6C]'>   
                <div className='flex gap-y-6 gap-x-5 hover:text-[#D2D2D2] hover:cursor-pointer'>
                    <LayoutDashboard />
                    <span>Dashboard</span>
                </div>
                <div className='flex gap-y-6 gap-x-5 hover:text-[#D2D2D2] hover:cursor-pointer'>
                    <KanbanSquareDashed />
                    <Link to="projects">Projects</Link>
                </div>
                <div className='flex gap-y-6 gap-x-5 hover:text-[#D2D2D2] hover:cursor-pointer'>
                    <ListTodo />
                    <Link to="kanban">Tasks</Link>
                </div>
                <div className='flex gap-y-6 gap-x-5 hover:text-[#D2D2D2] hover:cursor-pointer'>
                    <Users2 />
                    <span>Teams</span>
                </div>
                <div className='flex gap-y-6 gap-x-5 hover:text-[#D2D2D2] hover:cursor-pointer'>
                    <Video />
                    <span>Meeting</span>
                </div>
                <div className='flex gap-y-6 gap-x-5 hover:text-[#D2D2D2] hover:cursor-pointer'>
                    <MessagesSquare />
                    <span>Chat</span>
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