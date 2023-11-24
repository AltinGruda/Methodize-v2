import { Breadcrumb } from "@/components/breadcrumb";
import { KanbanCards } from "@/components/kanban-cards";
import { UserNav } from "@/components/user-nav";
import Avatar from "boring-avatars";
import { Plus } from "lucide-react";
import { useState } from 'react'

export function Kanban() {
    const [users] = useState({
        'user1': {
            name: "altin"
        },
        'user2': {
            name: "filan"
        }
    });
    return (
        <div className="m-10 flex flex-col gap-5 col-span-4">
            <div className="flex justify-between items-center">
                <Breadcrumb />
                <UserNav />
            </div>
            <div>
                <h2 className="text-2xl">Project Tsukinome</h2>
            </div>
            <div className="flex flex-col gap-y-2">
                <p className="font-semibold text-sm">Members on board</p>
                <div className="flex">
                    <div className="flex">
                        {Object.keys(users).map(user => (
                            <Avatar 
                                key={user}
                                size={25}
                                name={users[user].name} // change this to user.name
                                variant="beam"
                                colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                            />
                        ))}
                        <div className="bg-[#469E90] flex justify-center items-center w-[25px] rounded-full">
                            <Plus className="text-white"/>
                        </div>
                    </div>
                </div>
            </div>
            <KanbanCards />
        </div>
    )
}