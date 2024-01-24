import { getProjectsByTeams, getUserTasks } from "@/api/apiCalls";
import { Breadcrumb } from "@/components/breadcrumb";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card, CardHeader } from "@/components/ui/card";
import { UserNav } from "@/components/user-nav";
import { useAuth } from "@/context/useAuth"
import { Project } from "@/models/Project";
import { Task } from "@/models/Task";
import Avatar from "boring-avatars";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>();
    const [projects, setProjects] = useState<Project[]>();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const tasksResponse = await getUserTasks(user?._id)
            const taskData = tasksResponse.filter((task:Task) => task.status !== 'Archived' && task.status !== 'Completed');
            const projectsResponse = await getProjectsByTeams(user?.teams); 
            setTasks(taskData);
            setProjects(projectsResponse);
        }

        fetchData();
    }, [user])


    return (
        <div className="m-10 flex flex-col gap-5 col-span-4">
            <div className="flex justify-between items-center">
                <Breadcrumb />
                <UserNav />
            </div>
            <div className="flex flex-col items-center text-center">
                <p className="text-2xl font-semibold mb-2 text-indigo-600">Hello, {user?.name}!</p>
                <p className="text-gray-600">Welcome to your dashboard.</p>
            </div>

            <div className="grid grid-cols-2">
                <div className="flex flex-col items-center">
                <h3 className="text-xl font-semibold mb-4 text-indigo-600">Upcoming Tasks</h3>
                {tasks?.map((task: Task) => (
                    <div key={task._id} className="bg-gradient-to-br from-gray-100 to-white rounded-lg shadow-lg p-4 w-full sm:w-1/2 grid grid-cols-4 mb-4 animate-in fade-in slide-in-from-top duration-300 hover:shadow-2xl hover:bg-purple-100 cursor-pointer" onClick={() => navigate(`/kanban/${task.projectId}`)}>
                        <div className="flex items-center">
                            <div className='w-6 h-6 rounded-full bg-indigo-500 mr-3 col-span-1 animate-pulse'></div>
                        </div>
                        <div className="col-span-3">
                            <h2 className="text-lg font-bold text-gray-800">{task.name}</h2>
                            <p className="text-gray-600">
                            Due on {new Date(task.due_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                ))}
                {tasks?.length === 0 && 
                    <p className="font-normal">You have no assigned tasks.</p>
                }
                </div>
                <div className="flex flex-col items-center text-lg font-semibold">
                    <h3 className="text-2xl mb-4 text-indigo-600">Your Projects</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects?.map((project) => (
                            <div key={project._id}>
                            <AlertDialog>
                                <AlertDialogTrigger asChild className="w-full">
                                    {/* project cards */}
                                    <Card
                                        key={project._id}
                                        className="m-4 p-6 flex flex-col justify-between items-center bg-gradient-to-br from-purple-400 to-indigo-600 hover:scale-105 hover:shadow-2xl transition w-full gap-y-3 animate-in fade-in slide-in-from-top duration-300 rounded-lg"
                                    >
                                        <CardHeader className="flex items-center">
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
                                        </CardHeader>
                                    </Card>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Where do you want to go?</AlertDialogTitle>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogAction  onClick={() => navigate(`/backlog/${project._id}`) }>Backlog</AlertDialogAction>
                                        <AlertDialogAction  onClick={() => navigate(`/kanban/${project._id}`)}>Kanban</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            </div>
                        ))}
                        {projects?.length === 0 && (
                                <>
                                    <p className="col-span-3 font-normal text-sm">You have no projects. You have to create a <a href="/teams" className="text-blue-500">team</a> first.</p>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}