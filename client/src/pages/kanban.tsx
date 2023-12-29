import { activeSprintTasks, checkActiveSprint, deleteTask, getProjectById, updateStatus } from "@/api/apiCalls";
import { KanbanCards } from "@/components/kanban-cards";
import { UserNav } from "@/components/user-nav";
import { useAuth } from "@/context/useAuth";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext } from 'react-beautiful-dnd';
import { Task } from "@/models/Task";
import { Project } from "@/models/Project";
import { Info } from "lucide-react";
// import { Sprint } from "@/models/Sprint";

export function Kanban() {
    const {user} = useAuth();
    const param = useParams();
    const [activeSprint, setActiveSprint] = useState<Task[]>([]);
    const [project, setProject] = useState<Project>();
    const navigate = useNavigate();

    useEffect(() => {
        const getActiveSprintTasks = async () => {
            try {
                const sprint = await checkActiveSprint(param.id);
                const sprintTasks = await activeSprintTasks(sprint.projectId, sprint._id);

                const project = await getProjectById(param.id);
                setProject(project);
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
                await updateStatus(taskId, destinationStatus);
    
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

    const handleDeleteTask = async (taskId: string) => {
        try {
            await deleteTask(taskId);
            // Update the local state by filtering out the deleted task
            setActiveSprint((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
        } catch (error) {
            console.error(error);
        }
    };
  
    async function filterFunction(e: ChangeEvent<HTMLSelectElement>) {
        try {
            e.preventDefault();
            if(user?._id === e.target.value) {
                const filteredSprintTasks = activeSprint.filter(task => task.assigneeId && task.assigneeId === user?._id)
                setActiveSprint(filteredSprintTasks);
            } else {
                const sprint = await checkActiveSprint(param.id);
                const sprintTasks = await activeSprintTasks(sprint.projectId, sprint._id);
                setActiveSprint(sprintTasks);
            }
        } catch (error) {
            console.error(error);
        }
    }

    if(activeSprint.length === 0) {
        return (
            <div className="w-full flex justify-center items-center col-span-4 gap-x-2">
                <Info className="text-[#434447]" />
                <p className="text-lg font-semibold text-[#434447] ">No sprint is active for this project. Head to <a href={`/backlog/${param.id}`} className="text-blue-500">backlog</a> and start a sprint.</p>
            </div>
        )
    }
    return (
        <div className="m-10 flex flex-col gap-5 col-span-4">
            <div className="flex justify-between items-center">
                <div className="w-full">
                    <nav className="w-full rounded-md">
                        <ol className="list-reset flex">
                            <li>
                                <a
                                    href="/"
                                    className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                                >Dashboard</a>
                            </li>
                            <li>
                                <span className="mx-2 text-neutral-500 dark:text-neutral-400 hover:cursor-pointer">/</span>
                            </li>
                            <li className="text-neutral-500 dark:text-neutral-400">
                                <a href={`${location.pathname}`}>kanban</a>
                            </li>
                        </ol>
                    </nav>
                </div>
                <UserNav />
            </div>

            <div>
                <h2 className="text-2xl">{project?.name}</h2>
                <div className="flex justify-between">
                    <div className="mb-4 mt-4">
                        <label htmlFor="filter" className="font-bold mr-2">
                            Filter By:
                        </label>
                        <select
                            id="filter"
                            className="border border-gray-300 p-2 rounded-lg"
                            onChange={e => filterFunction(e)}
                        >
                            <option value="">All</option>
                            <option value={`${user?._id}`}>My Tasks</option>
                        </select>
                    </div>
                    {/* Backlog button */}
                    <div className="flex h-fit">
                        <a onClick={() => navigate(`/backlog/${param.id}`)} className="relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-indigo-600 transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-50 group hover:cursor-pointer">
                        <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-indigo-600 group-hover:h-full"></span>
                        <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </span>
                        <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </span>
                        <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">Backlog</span>
                        </a>
                    </div>
                </div>
            </div>            
            
            <DragDropContext onDragEnd={handleDragEnd}>
                <KanbanCards tasks={activeSprint} onDeleteTask={handleDeleteTask} setActiveSprint={setActiveSprint} />
            </DragDropContext>
        </div>
    )
}