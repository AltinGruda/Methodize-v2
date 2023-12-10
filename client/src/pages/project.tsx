import { Breadcrumb } from "@/components/breadcrumb";
import { UserNav } from "@/components/user-nav";
import { KanbanSquare, ListTodo } from "lucide-react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export function Project() {
    const param = useParams();
    const navigate = useNavigate();

    return (
        <div className="m-10 flex flex-col col-span-4 gap-y-5">
            <div className="flex justify-between items-center">
                <Breadcrumb />
                <UserNav />
            </div>
            <div className="grid grid-cols-2 w-full h-full">
                <div className="flex justify-start items-center flex-col">
                    <p className="p-2">Backlog</p>
                    <div className="border rounded-2xl flex justify-center items-center bg-blue-400 w-1/3 h-1/3 hover:scale-105 hover:shadow-2xl transition duration-500 hover:cursor-pointer" onClick={() => navigate(`/backlog/${param.id}`)}>
                        <ListTodo className="text-white" />
                    </div>
                </div>
                <div className="flex justify-start items-start flex-col">
                    <p className="p-2">Kanban Board</p>
                    <div className="border rounded-2xl flex justify-center items-center bg-blue-400 w-1/3 h-1/3 hover:scale-105 hover:shadow-2xl transition duration-500" onClick={() => navigate(`/kanban/${param.id}`)}>
                        <KanbanSquare className="text-white" />
                    </div>
                </div>
            </div>
        </div>
    )
}