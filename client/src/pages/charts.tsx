import { getUserTasks } from "@/api/apiCalls";
import { Breadcrumb } from "@/components/breadcrumb";
import { UserNav } from "@/components/user-nav";
import { useAuth } from "@/context/useAuth";
import { Task } from "@/models/Task";
import 'chart.js/auto'
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { Pie, Bar } from 'react-chartjs-2'

export function Charts() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getUserTasks(user?._id);
                setTasks(response);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [user?._id])

    if (!tasks) {
        // Handle the case where tasks is undefined
        console.error("Tasks is undefined");
    }

    // Count occurrences of each status
    const statusCounts: Record<string, number> = tasks.reduce((acc, task) => {
        const { status } = task;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});
    const labels = ["To Do", "In progress", "In review", "Completed"]
    // Get unique labels
    const uniqueLabels: string[] = [
        ...new Set([...Object.keys(statusCounts), ...labels]),
    ];

    const tasksCompleted = statusCounts['Completed'] ?? 0;
    const tasksNotCompleted = uniqueLabels.map(label => label !== 'Completed' && label !== 'Archived' && statusCounts[label] || 0).reduce((acc, c) => acc+c, 0)

    const data = {
        labels: uniqueLabels,
        datasets: [
          {
            label: '# of Tasks',
            data: uniqueLabels.map((label) => statusCounts[label] || 0),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };

      
    const taskData = {
        labels: ['Completed', 'Not Completed'],
        datasets: [
        {
            label: 'Completed',
            data: [tasksCompleted],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Not Completed',
            data:  [tasksNotCompleted],
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        ],
    };

    return (
        <>
            <div className="m-10 p-8 bg-white rounded-lg shadow-md col-span-4">
                <div className="flex justify-between items-center mb-6">
                    <Breadcrumb />
                    <UserNav />
                </div>
                <div className="grid grid-cols-2 gap-8">
                    {tasks.length === 0 && 
                        <div className="col-span-2 flex justify-center items-center gap-x-2">
                                <Info className="text-[#434447]" />
                                <p className="w-fit text-lg font-semibold text-[#434447] text-center">You have no tasks yet.</p>
                        </div>
                    }
                    <div className="bg-gray-100 p-6 rounded-md">
                        <Pie
                            data={data}
                            options={{
                                plugins: {
                                    legend: {
                                        display: true,
                                        position: 'bottom',
                                    },
                                },
                                aspectRatio: 1, // Adjust the aspect ratio as needed
                            }}
                        />
                        <p className="text-center">Task status distribution</p>
                    </div>
                    <div className="bg-gray-100 p-6 rounded-md">
                        <Bar
                            data={taskData}
                            options={{
                                plugins: {
                                    legend: {
                                        display: true,
                                        position: 'bottom',
                                    },
                                },
                                aspectRatio: 1, // Adjust the aspect ratio as needed
                                scales: {
                                    x: {
                                        display: false, // Hide the x-axis labels
                                    },
                                },
                            }}
                        />
                        <p className="text-center">Completed / Not Completed task rapport</p>
                    </div>
                </div>
            </div>
        </>
    )
}