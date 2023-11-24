import { Breadcrumb } from "@/components/breadcrumb";
import { Team } from "@/components/team-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserNav } from "@/components/user-nav";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon } from "lucide-react";

export function Teams() {
    return (
        <div className="m-10 flex flex-col col-span-4 gap-y-5">
            <div className="flex justify-between items-center">
                <Breadcrumb />
                <UserNav />
            </div>
            <div className="flex justify-between">
                <div className="flex gap-x-4 w-[50%] items-center">
                        <h2 className="text-3xl font-semibold">Teams</h2>
                        <span className="text-[#848D9C]"> · 5</span>
                        <Input type="search" placeholder="Search teams..." className="w-[50%] bg-[#E2E3E5]" />
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
                    <Button variant="default">
                        Add Team
                    </Button>
                </div>
            </div>
            <div className="flex gap-x-5">
                <Team />
                <Team />
            </div>
        </div>
    )
}