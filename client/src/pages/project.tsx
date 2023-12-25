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
            <div className="grid grid-cols-2 gap-8">
                <div className="flex justify-center items-center flex-col bg-blue-500 text-white rounded-lg p-8 hover:shadow-lg transition duration-300 hover:cursor-pointer transform hover:scale-105" onClick={() => navigate(`/backlog/${param.id}`)}>
                    <ListTodo className="text-4xl mb-4" />
                    <p className="text-lg font-semibold">Backlog</p>
                </div>
                <div className="flex justify-center items-center flex-col bg-blue-500 text-white rounded-lg p-8 hover:shadow-lg transition duration-300 hover:cursor-pointer transform hover:scale-105" onClick={() => navigate(`/kanban/${param.id}`)}>
                    <KanbanSquare className="text-4xl mb-4" />
                    <p className="text-lg font-semibold">Kanban Board</p>
                </div>
            </div>
        </div>
    );
}
