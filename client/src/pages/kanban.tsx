import { activeSprintTasks, checkActiveSprint, updateTask, updateTaskOrder } from "@/api/apiCalls";
import { Breadcrumb } from "@/components/breadcrumb";
import { KanbanCards } from "@/components/kanban-cards";
import { UserNav } from "@/components/user-nav";
import { useAuth } from "@/context/useAuth";
import Avatar from "boring-avatars";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext } from 'react-beautiful-dnd';
import { Task } from "@/models/Task";
// import { Sprint } from "@/models/Sprint";

export function Kanban() {
    const {user} = useAuth();
    const param = useParams();
    const [activeSprint, setActiveSprint] = useState<Task[]>([]);
    
    useEffect(() => {
        const getActiveSprintTasks = async () => {
        try {
            const sprint = await checkActiveSprint(param.id);
            const sprintTasks = await activeSprintTasks(sprint.projectId, sprint._id);
            setActiveSprint(sprintTasks);
        } catch (error) {
            console.log(error);
        }
        };

        getActiveSprintTasks();
    }, [param.id]);

    const handleDragEnd = async (result: any) => {
        try {

            if (!result.destination) {
                return; // Dragged outside of droppable area
            }

            const sourceStatus = result.source.droppableId;
            const destinationStatus = result.destination.droppableId;
            const taskId = result.draggableId;
            const sourceIndex = result.source.index;
            const destinationIndex = result.destination.index;

            if (activeSprint.length === 0) {
                return; // Ensure activeSprint is not empty
            }

            const currentSprint = activeSprint[0];

            // If the task is moved within the same column
            if (sourceStatus === destinationStatus) {
                const updatedTasks = [...activeSprint];
                const movedTask = updatedTasks.find((task) => task._id === taskId);

                if (movedTask) {
                    updatedTasks.splice(sourceIndex, 1);
                    updatedTasks.splice(destinationIndex, 0, movedTask);

                    // Update the local state with the new order of tasks
                    setActiveSprint(updatedTasks);
                }
            } else {
                // Update the status of the task in the backend
                await updateTask(destinationStatus, taskId);
    
                if (currentSprint) {
                    // Refresh the active sprint tasks after updating
                    const updatedActiveSprint = await activeSprintTasks(currentSprint.projectId, currentSprint.sprint);
                    setActiveSprint(updatedActiveSprint);
                }
            }
        } catch (error) {
            console.error(error);
        }
  };
  

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
            
            <DragDropContext onDragEnd={handleDragEnd}>
                <KanbanCards tasks={activeSprint} />
            </DragDropContext>
        </div>
    )
}