import { MoreHorizontal, Plus, PlusCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { TaskCard } from "./task-card";
import { Card } from "./ui/card";

export function KanbanCards() {
    return (
        <div className="grid grid-cols-4 gap-4">
            <div>
                <div className="flex items-center">
                    <div className="flex gap-2">
                        <Button variant="secondary">TO DO</Button>
                        <Button variant="secondary" className="rounded-full bg-[#E5E5E5]">3</Button>
                    </div>
                    <div className="flex justify-end w-full gap-2">
                        <PlusCircle />
                        <MoreHorizontal />
                    </div>
                </div>
                <div>
                    <Separator className="my-2"/>
                </div>
                <Card className="bg-[#E8E8E8]">
                    <TaskCard />
                    <TaskCard />
                    <TaskCard />
                    <div className="flex justify-center items-center p-2">
                        <Button variant="ghost">
                            <Plus />
                            Add Task
                        </Button>
                    </div>
                </Card>
            </div>
            <div>
                <div className="flex items-center">
                    <div className="flex gap-2">
                            <Button variant="secondary">IN PROGRESS</Button>
                            <Button variant="secondary" className="rounded-full bg-[#E5E5E5]">3</Button>
                    </div>
                    <div className="flex justify-end w-full gap-2">
                            <PlusCircle />
                            <MoreHorizontal />
                    </div>
                </div>
                <div>
                    <Separator className="my-2"/>
                </div>
                <Card className="bg-[#E8E8E8]">
                    <TaskCard />
                    <TaskCard />
                    <TaskCard />
                    <div className="flex justify-center items-center p-2">
                        <Button variant="ghost">
                            <Plus />
                            Add Task
                        </Button>
                    </div>
                </Card>
            </div>
            <div>
                <div className="flex items-center">
                    <div className="flex gap-2">
                        <Button variant="secondary">IN PROGRESS</Button>
                        <Button variant="secondary" className="rounded-full bg-[#E5E5E5]">3</Button>
                    </div>
                    <div className="flex justify-end w-full gap-2">
                        <PlusCircle />
                        <MoreHorizontal />
                    </div>
                </div>
                <div>
                    <Separator className="my-2"/>
                </div>
                <Card className="bg-[#E8E8E8]">
                    <TaskCard />
                    <div className="flex justify-center items-center p-2">
                        <Button variant="ghost">
                            <Plus />
                            Add Task
                        </Button>
                    </div>
                </Card>
            </div>
            <div>
                <div className="flex items-center">
                    <div className="flex gap-2">
                        <Button variant="secondary">COMPLETED</Button>
                        <Button variant="secondary" className="rounded-full bg-[#E5E5E5]">3</Button>
                    </div>
                    <div className="flex justify-end w-full gap-2">
                        <PlusCircle />
                        <MoreHorizontal />
                    </div>
                </div>
                <div>
                    <Separator className="my-2"/>
                </div>
                <Card className="bg-[#E8E8E8]">
                    <TaskCard />
                    <div className="flex justify-center items-center p-2">
                        <Button variant="ghost">
                            <Plus />
                            Add Task
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}