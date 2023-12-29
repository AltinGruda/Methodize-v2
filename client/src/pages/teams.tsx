import { Breadcrumb } from "@/components/breadcrumb";
import { Team } from "@/components/team-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserNav } from "@/components/user-nav";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { createTeam, getUserTeams } from "@/api/apiCalls";
import { useAuth } from "@/context/useAuth";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";



export interface TeamInterface {
    _id: string;
    name: string;
    owner: string;
    members: [];
}
export const Teams = () => {
    const { userId } = useAuth();
    const [teams, setTeams] = useState<TeamInterface[]>([]);

    const [teamName, setTeamName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userTeams = await getUserTeams(userId);
                setTeams(userTeams);
            } catch (error) {
                console.error('Error fetching user teams:', error);
            }
        };
        
        fetchData();
    }, [userId]); // Add user as a dependency if it's used in getUserTeams
    return (
        <div className="m-10 flex flex-col col-span-4 gap-y-5">
            <div className="flex justify-between items-center">
                <Breadcrumb />
                <UserNav />
            </div>
            <div className="flex justify-between">
                <div className="flex gap-x-4 w-[50%] items-center">
                        <h2 className="text-3xl font-semibold">Teams</h2>
                        <span className="text-[#848D9C]"> · {teams.length}</span>
                </div>
                <div>
                    <span className="text-[#848D9C]">Sort by:</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="link"
                                size="sm"
                                className="-ml-3 h-8 data-[state=open]:bg-accent"
                            >
                                <span>Date added</span>
                                <ArrowUpDown className="ml-2 h-4 w-4"  />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="bg-white">
                            <DropdownMenuItem className="flex">
                                <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                                Asc
                            </DropdownMenuItem> 
                            <DropdownMenuItem className="flex">
                                <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                                Dsc
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="default">
                                Add Team
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                            <DialogTitle>Create a new team</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                                    <Input id="name" className="col-span-3" onChange={(e) => setTeamName(e.target.value)} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                type="submit"
                                onClick={async () => {
                                    await createTeam(teamName, userId);
                                    setTeams(await getUserTeams(userId));
                                }}
                                >
                                Create
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className="flex gap-x-5">
                {teams.map((team) => (
                    team._id && <Team key={team._id} team={team} />
                ))}
            </div>
            {teams.length === 0 &&
                <>
                    <div>
                        <div className="starsec"></div>
                        <div className="starthird"></div>
                        <div className="starfourth"></div>
                        <div className="starfifth"></div>
                    </div>
                    <div className="flex gap-2 m-20 justify-center items-start">
                        <Info className="text-[#434447]" />
                        <p className="w-[50%] text-lg font-semibold text-[#434447] text-center">You have no teams. Click Add Team to create one or ask for an invite from your project manager.</p>
                    </div>
                </>
            }
        </div>
    )
}