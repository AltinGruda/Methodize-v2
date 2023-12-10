import { activeSprintTasks, checkActiveSprint } from "@/api/apiCalls";
import { Breadcrumb } from "@/components/breadcrumb";
import { KanbanCards } from "@/components/kanban-cards";
import { UserNav } from "@/components/user-nav";
import { useAuth } from "@/context/useAuth";
import Avatar from "boring-avatars";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function Kanban() {
    const {user} = useAuth();
    const param = useParams();
    const [activeSprint, setActiveSprint] = useState();
    useEffect(() => {
        const getActiveSprintTasks = async () => {
            try {
                const sprint = await checkActiveSprint(param.id);
                const sprintTasks = await activeSprintTasks(sprint.projectId, sprint._id)
                setActiveSprint(sprintTasks);
            } catch (error) {
                console.log(error);       
            }
        }
        getActiveSprintTasks();
    }, [])

    console.log("Active sprint tasks:", activeSprint);

    return (
        <div className="m-10 flex flex-col gap-5 col-span-4">
            <div className="flex justify-between items-center">
                <Breadcrumb />
                <UserNav />
            </div>
            <div>
                <h2 className="text-2xl">Project Tsukinome</h2>
            </div>
            <div className="flex flex-col gap-y-2">
                <p className="font-semibold text-sm">Members on board</p>
                <div className="flex">
                    <div className="flex">
                        <Avatar 
                            key={user?._id}
                            size={25}
                            name={user?.name} // change this to user.name
                            variant="beam"
                            colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                        />
                        <div className="bg-[#469E90] flex justify-center items-center w-[25px] rounded-full">
                            <Plus className="text-white"/>
                        </div>
                    </div>
                </div>
            </div>
            <KanbanCards />
        </div>
    )
}