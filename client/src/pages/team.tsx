import { Breadcrumb } from "@/components/breadcrumb";
import { UserNav } from "@/components/user-nav";
import { useEffect, useState } from "react";
import { TeamInterface } from "./teams";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getAllUsers } from "@/api/apiCalls";
import Avatar from "boring-avatars";
import { User } from "@/context/AuthContext";
import { useToast } from '@/components/ui/use-toast';
import { Socket } from 'socket.io-client'
import { useAuth } from "@/context/useAuth";
interface Props {
  socket: Socket | null;
}

export const Team: React.FC<Props> = ({socket}) => {
    const param = useParams();
    const [team, setTeam] = useState<TeamInterface | null>(null);
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const { toast } = useToast();
    const { user: owner } = useAuth();
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

    const handleNotification = (senderUser: string | undefined, receiverUser: string) => {
      socket?.emit("sendNotification", {
        senderName: senderUser,
        receiverName: receiverUser,
      });
    };

    return (
        <div className="m-10 flex flex-col gap-5 col-span-4">
            <div className="flex justify-between items-center">
                <Breadcrumb />
                <UserNav socket={socket} />
            </div>
            <div className="flex">
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
                              <Button onClick={() => {
                                // http://localhost:5000/team/656b9393d30231c33cb5ba39/user/656a5170440865d55b2d7817
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
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div>
                {team ? (
                  <h2 className="text-2xl">{team.name}</h2>
                ) : (
                  <p>Loading...</p>
                )}
            </div>
        </div>
    )
}
