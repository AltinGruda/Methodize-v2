import Avatar from "boring-avatars";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProjectCards({projects}: any) {
    const navigate = useNavigate();
    return (
        <>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {projects.map((project: any) => (
                 <div
                 key={project._id}
                 className="bg-gradient-to-br from-purple-400 to-indigo-600 w-full gap-y-3 animate-in fade-in slide-in-from-top duration-300 rounded-lg cursor-pointer"
               >
                 <div className="flex items-center p-4">
                   <Avatar
                     size={40}
                     name={project.name}
                     variant="marble"
                     colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                   />
                   <div className="ml-4">
                     <p className="font-bold text-white">{project.name}</p>
                     <span className="text-[#F9FAFB] font-semibold">{project.tasks.length} tasks</span>
                   </div>
                 </div>
                 <div className="flex justify-between p-4">
                   {/* Options to navigate to backlog or kanban */}
                   <a onClick={(e) => navigate(`/backlog/${project._id}`)} className="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group">
                        <span className="w-48 h-48 rounded rotate-[-40deg] bg-purple-600 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                        <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">Backlog</span>
                    </a>
                    
                   {/* <Button
                     variant="outline"
                     onClick={(e) => {
                       e.stopPropagation(); // Prevents the click from triggering the parent onClick
                       navigate(`/backlog/${project._id}`);
                     }}
                   >
                     Backlog
                   </Button> */}
                   <Button
                     variant="outline"
                     onClick={(e) => {
                       e.stopPropagation();
                       navigate(`/kanban/${project._id}`);
                     }}
                   >
                     Kanban
                   </Button>
                 </div>
               </div>
            ))}
        </>
    )
}