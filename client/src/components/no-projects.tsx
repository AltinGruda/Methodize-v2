import { Info } from "lucide-react";
import { UserNav } from "./user-nav";
import './no-projects.css'
import { useAuth } from "@/context/useAuth";

export function NoProjects() {
    const { user } = useAuth();
    return (
        <div className="m-10 col-span-4">
            <div>
                <div className="starsec"></div>
                <div className="starthird"></div>
                <div className="starfourth"></div>
                <div className="starfifth"></div>
            </div>
            <div className="flex justify-end">
                <UserNav />
            </div>
            <div className="grid grid-cols-2 m-20">
                <div className="flex flex-col gap-8">
                    <span className="text-[#434447] text-lg">Welcome {user?.name}!</span>
                    <p className="text-7xl font-thin">Let's start by adding your first project.</p>
                </div>
                <div className="flex justify-center items-center">                    
                    <p className="text-lg">Head to <a href="/projects" className="text-blue-500">projects</a> and click the Add Project.</p>
                </div>
            </div>
            <div className="flex gap-2 m-20">
                <Info className="text-[#434447]" />
                <p className="w-[50%] text-xs font-semibold text-[#434447]">If you don't have the details to add your project please reach out to your project manager or ask them to invite you to relevant projects.</p>
            </div>
            
        </div>
    )
}