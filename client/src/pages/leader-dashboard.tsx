import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { UserNav } from "@/components/user-nav"
import { useAuth } from "@/context/useAuth"
import Avatar from "boring-avatars"
import { useEffect, useState } from "react"
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"
import { Task } from "@/models/Task"
import { getUserByName, getUserTasks } from "@/api/apiCalls"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Info } from "lucide-react"
import { Bar, Pie } from "react-chartjs-2"


export const LeaderDashboard = () => {
    const [teamsWithMembers, setTeamsWithMembers] = useState([]);
    const {userId, user} = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);

    async function fetchData(name: string) {
        try {
            const userData = await getUserByName(name);
            const response = await getUserTasks(userData[0]._id);
            setTasks(response);
        } catch (error) {
            console.error(error);
        }
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



    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:5000/team/list-leader-teams/${userId}`); // Adjust the endpoint accordingly
          const result = await response.json();
          setTeamsWithMembers(result);
        } catch (error) {
          console.error('Error fetching team information:', error);
        }
      };
  
      fetchData();
    }, [userId]);

    return (
        <div className="m-10 flex flex-col gap-5 col-span-4">
            <div className="flex justify-between items-center">
                <Breadcrumb />
                <UserNav />
            </div>
            <Separator />
            {teamsWithMembers.length === 0 ? (
                <p>No teams found.</p>
            ) : (
                <div>
                    {teamsWithMembers.map((team, teamIndex) => (
                        <div key={teamIndex}>
                            <div className="flex justify-center">
                                <h3 className="text-lg font-semibold">{team.team}</h3>
                            </div>
                            <div className="flex">
                                {team.members.map((member, memberIndex) => (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Card
                                            key={memberIndex}
                                            className="m-2 flex flex-col justify-center items-center bg-[#EDEDED] hover:scale-105 hover:shadow-2xl transition w-1/5 gap-y-3"
                                            onClick={async () => { 
                                                await fetchData(member)
                                            }}
                                        >
                                            <CardHeader className="flex items-center">
                                            <Avatar
                                                size={40}
                                                name={member} // Set the user's name as the Avatar's name
                                                variant="beam"
                                                colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                                            />
                                            <CardTitle className="font-semibold text-lg">{member}</CardTitle>
                                            <span className="text-[#727D8F] font-semibold">{user?.name === member ? "Team Leader" : "Developer"}</span>
                                            </CardHeader>
                                        </Card>
                                    </DialogTrigger>
                                    <DialogContent className="min-w-fit">
                                        <div className="bg-white rounded-lg shadow-md col-span-4">
                                            <div className="grid grid-cols-2 gap-8">
                                                {tasks.length === 0 && 
                                                    <div className="col-span-2 flex justify-center items-center gap-x-2">
                                                            <Info className="text-[#434447]" />
                                                            <p className="w-fit text-lg font-semibold text-[#434447] text-center">No tasks yet.</p>
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
                                                </div>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                ))}
                            </div>
                            <div className="flex justify-end">
                                <Button variant={"secondary"} onClick={ async () => {
                                    const doc = new jsPDF({orientation: 'landscape'});
                                    autoTable(doc, {
                                        html: `#table${teamIndex}`
                                    });
                                    doc.text(team.team, 10, 10);
                                    doc.save('raporti.pdf')
                                }} className="mb-2">Generate Report</Button>
                            </div>
                            <table className="hidden" id={`table${teamIndex}`}>
                                <thead>
                                    <tr>
                                        <th>Full Name</th>
                                        <th>Role</th>
                                    </tr>
                                    </thead>
                                    {team.members.map((member, memberIndex) => (
                                    <tbody key={memberIndex}>
                                        <tr>
                                            <td>{member}</td>
                                            <td>{user?.name === member ? "Team Leader" : "Developer"}</td>
                                        </tr>
                                </tbody>
                                    ))}
                            </table>
                            <Separator className="mb-5" />
                        </div>
                    ))}
                </div>
                )}
        </div>
    )
}