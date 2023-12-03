// import {
//     Avatar,
//     AvatarFallback,
//     AvatarImage,
//   } from "@/components/ui/avatar"
  import { Button } from "@/components/ui/button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import Avatar from "boring-avatars"
  import { Bell } from "lucide-react" 
  import { useAuth } from "@/context/useAuth"
  import { Socket } from 'socket.io-client'
  import { useEffect, useState } from "react"
  import { useNavigate } from "react-router-dom"
  
  interface Props {
    socket: Socket | null;
  }

  export const UserNav: React.FC<Props> = ({ socket }) => {
    const { logout, user } = useAuth();
    const [notifications, setNotifications] = useState<{ senderName: string }[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
      socket?.on("getNotification", (data) => {
        console.log("Notification received:", data);
        setNotifications((prev) => [data, ...prev]);
        console.log("Updated notifications:", notifications);
      });
    }, [socket, notifications]);
    
    

    const displayNotification = ({ senderName } : {senderName: string}) => {
      // if(notifications.length === 0) return <span>No new notifications.</span>
      return (
        <span onClick={() => navigate('/teams')} className="hover:cursor-pointer">
          {`${senderName} invited you to a team.`}
        </span>
      );
    };

    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost'>
              <Bell />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              {notifications.map(noti => displayNotification(noti))}
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full w-10 h-10">
                  <div className="h-10 w-10">
                      <Avatar
                        size={40}
                        name={user?.name}// change this to user.name
                        variant="beam"
                        colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}      
                      />
                  </div>
                </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>New Team</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    )
  }