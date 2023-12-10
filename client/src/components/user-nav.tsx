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
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSocket } from "@/context/useSocket"
import { toast } from "./ui/use-toast"


export const UserNav = () => {
  const { logout, user } = useAuth();
  const [notifications, setNotifications] = useState<{ senderName: string }[]>([]);
  const navigate = useNavigate();
  const { socket } = useSocket();

  useEffect(() => {
    socket?.on("getNotification", (data) => {
      console.log("Notification received:", data);
      setNotifications((prev) => [data, ...prev]);
      console.log("Updated notifications:", notifications);
      toast({
        title: "You've received a new notification!",
      })
    });
  }, [socket, notifications]);
  
  

  const displayNotification = ({ senderName } : {senderName: string}) => {
    return (
      <span onClick={() => navigate('/teams')} className="hover:cursor-pointer">
        {senderName && `${senderName} invited you to a team.`}
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
            {!notifications.length && 'No notifications yet!'}
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