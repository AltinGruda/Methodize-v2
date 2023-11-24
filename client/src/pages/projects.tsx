import { Breadcrumb } from "@/components/breadcrumb";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import { ProjectCards } from "@/components/project-cards";
import { UserNav } from "@/components/user-nav";

export function Projects() {
    return (
        <div className="m-10 flex flex-col gap-5 col-span-4">
            <div className="flex justify-between items-center">
                <Breadcrumb />
                <UserNav />
            </div>
            {/* navigation */}
            <div className="flex items-center justify-between gap-x-4">
                <div className="flex gap-x-4 w-[50%] items-center">
                    <h2 className="text-3xl font-semibold">Projects</h2>
                    <span className="text-[#848D9C]"> · 193</span>
                    <Input type="search" placeholder="Search projects..." className="w-[50%] bg-[#E2E3E5]" />
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
                        Add Project
                    </Button>
                </div>
            </div>
            {/* Projects cards */}
            <div className="grid grid-cols-3 gap-5">
                <ProjectCards />
                <ProjectCards />
                <ProjectCards />
                <ProjectCards />
                <ProjectCards />
                <ProjectCards />
            </div>
        </div>
    )
}