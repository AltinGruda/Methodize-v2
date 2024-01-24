import { UserNav } from "@/components/user-nav";
import { useEffect, useState } from "react";
import { TeamInterface } from "./teams";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createProject, getAllUsers, getProjectsByTeam } from "@/api/apiCalls";
import Avatar from "boring-avatars";
import { User } from "@/context/AuthContext";
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from "@/context/useAuth";
import { ProjectCards } from "@/components/project-cards";
import { useSocket } from "@/context/useSocket";
import { Info } from "lucide-react";


export const Team = () => {
    const param = useParams();
    const [team, setTeam] = useState<TeamInterface | null>(null);
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const { toast } = useToast();
    const { user: owner } = useAuth();
    const { socket } = useSocket();
    const navigate = useNavigate();

    const [projectNameInput, setProjectNameInput] = useState('');
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
          try {
            // Assuming useId returns a valid teamId
            const response = await fetch(`http://localhost:5000/team/${param.id}`);
            
            if (!response.ok) {
              throw new Error('Failed to fetch team data');
            }

            const teamData = await response.json();
            setTeam(teamData);
          } catch (error) {
            console.error('Error fetching team data:', error);
          } finally {
            setIsLoading(false);
          }
        };
      
        fetchData();
    }, [param.id]); // Add teamId as a dependency

    useEffect(() => {
      const fetchData = async () => {
        try {
          const users = await getAllUsers();
          setUsers(users);
        } catch (error) {
          console.error('Error fetching user names:', error);
        }
      };
  
      fetchData();
    }, []);

    useEffect(() => {
      console.log('Fetching projects for team:', team?._id);
      const fetchProjectsByTeam = async () => {
        try {
          const projects = await getProjectsByTeam(team?._id);
          console.log('Fetched projects:', projects);
          setProjects(projects);
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      };
      if (team?._id) {
        fetchProjectsByTeam();
      }
    }, [team?._id]);
    
    const handleNotification = (senderUser: string | undefined, receiverUser: string) => {
      socket?.emit("sendNotification", {
        senderName: senderUser,
        receiverName: receiverUser,
      });
    };

    if (isLoading) {
      return <p>Loading...</p>;
    }

    return (
        <div className="m-10 flex flex-col gap-5 col-span-4">
            <div className="flex justify-between items-center">
              <nav className="w-full rounded-md">
                <ol className="list-reset flex">
                    <li>
                        <a
                            href="/"
                            className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                        >Dashboard</a>
                    </li>
                    <li>
                        <span className="mx-2 text-neutral-500 dark:text-neutral-400 hover:cursor-pointer" onClick={() => navigate('/teams')}>/ teams /</span>
                    </li>
                    <li className="text-neutral-500 dark:text-neutral-400">
                        <a href={`${location.pathname}`}>team</a>
                    </li>
                </ol>
              </nav>
              <UserNav />
            </div>
            {team?.owner === owner?._id && 
              <div className="flex justify-between">
                {/* Add member to the team */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Add Members</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Members</DialogTitle>
                      <DialogDescription>
                        Add a member to the team.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          className="col-span-3"
                          onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="flex gap-5">
                          {users
                            .filter((user) => user.name.toLowerCase().includes(search))
                            .map((user) => (
                              <div key={user.name} className="flex flex-col items-center gap-y-2">
                                <p className="text-center">{user.name}</p>
                                <Avatar
                                  size={40}
                                  name={user.name} // Change this to user.name
                                  variant="beam"
                                  colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                                />
                                <DialogTrigger asChild>
                                  <Button onClick={() => {
                                    async function inviteUser() {
                                      try {
                                        await fetch(`http://localhost:5000/team/${param.id}/user/${user._id}`, {
                                          method: 'POST'
                                        })
                                        toast({
                                          title: `${user.name} has joined the team!`,
                                          description: "They're now part of the team and have access to all team projects."
                                        })
                                      } catch (error) {
                                        console.log(error);
                                        toast({
                                          variant: "destructive",
                                          title: 'Uh oh! Something went wrong.'
                                        })
                                      }
                                    }
                                    inviteUser();
                                    handleNotification(owner?.name, user.name);
                                  }}>Invite</Button>
                                </DialogTrigger>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                    {/* Create a new project */}
                    <Dialog>
                      <DialogTrigger asChild>
                          <Button variant="outline">Add Project</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                          <DialogTitle>Create a new project</DialogTitle>
                          </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="name" className="text-right">Name</Label>
                                  <Input id="name" className="col-span-3" onChange={(e) => setProjectNameInput(e.target.value)} />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                type="submit"
                                onClick={async () => {
                                  await createProject(projectNameInput, team?._id);
                                  // Fetch the updated projects after creating a new project
                                  setProjects(await getProjectsByTeam(team?._id));
                                }}
                              >
                                Create
                              </Button>
                            </DialogFooter>
                      </DialogContent>
                    </Dialog>
              </div>
            }
            <div>
                {team ? (
                  <h2 className="text-2xl">{team.name}</h2>
                ) : (
                  <p>Loading...</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                  {projects.length > 0 ? (
                    <ProjectCards projects={projects} />
                  ) : (
                    <div className="flex gap-2 m-20 justify-center items-center col-span-4">
                        <Info className="text-[#434447]" />
                        <p className="w-[50%] text-lg font-semibold text-[#434447] text-center">You have no projects. Click Add Project to create one.</p>
                    </div>
                  )}
                </div>
            </div>
        </div>
    )
}
