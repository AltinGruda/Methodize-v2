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
  import { useAuth } from "@/context/AuthContext"
  
  export function UserNav() {
    const { logout, user } = useAuth();

    return (
      <>
        
        <Bell className="mr-5"  />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* <Button variant="ghost" className="relative h-8 w-8 rounded-full"> */}
              {/* <Avatar className="h-10 w-10"> */}
                {/* <AvatarImage src="/avatars/01.png" alt="avatar profile image" /> */}
                {/* uncomment the other avatar images when you decide which to pick */}
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
                {/* <AvatarFallback>AG</AvatarFallback> */}
              {/* </Avatar> */}
            {/* </Button> */}
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