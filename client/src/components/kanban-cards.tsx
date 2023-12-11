import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { TaskCard } from "./task-card";
import { Card } from "./ui/card";
import { Task } from "@/models/Task";
import React from "react";
import { Plus } from "lucide-react";

interface Props {
    tasks: Task[]
}

export const KanbanCards: React.FC<Props> = ({tasks}) => {
    return (
        <div className="grid grid-cols-4 gap-4">
            <div>
                <div className="flex items-center">
                    <div className="flex gap-2">
                        <Button variant="secondary">TO DO</Button>
                        <Button variant="secondary" className="rounded-full bg-[#E5E5E5]">{tasks?.filter((task: Task) => task.status === "To Do").length}</Button>
                    </div>
                </div>
                <div>
                    <Separator className="my-2"/>
                </div>
                <Card className="bg-[#E8E8E8]">
                    {tasks?.filter((task: Task) => task.status === "To Do").map((task) => (
                        <TaskCard key={task._id} task={task} />
                    ))}
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
                            <Button variant="secondary" className="rounded-full bg-[#E5E5E5]">{tasks?.filter((task: Task) => task.status === "In progress").length}</Button>
                    </div>
                </div>
                <div>
                    <Separator className="my-2"/>
                </div>
                <Card className="bg-[#E8E8E8]">
                    {tasks?.filter((task: Task) => task.status === "In progress").map((task) => (
                        <TaskCard key={task._id} task={task} />
                    ))}
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
                        <Button variant="secondary" className="rounded-full bg-[#E5E5E5]">{tasks?.filter((task: Task) => task.status === "In review").length}</Button>
                    </div>
                </div>
                <div>
                    <Separator className="my-2"/>
                </div>
                <Card className="bg-[#E8E8E8]">
                    {tasks?.filter((task: Task) => task.status === "In review").map((task) => (
                        <TaskCard key={task._id} task={task} />
                    ))}                    <div className="flex justify-center items-center p-2">
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
                        <Button variant="secondary" className="rounded-full bg-[#E5E5E5]">{tasks?.filter((task: Task) => task.status === "Completed").length}</Button>
                    </div>
                </div>
                <div>
                    <Separator className="my-2"/>
                </div>
                <Card className="bg-[#E8E8E8]">
                    {tasks?.filter((task: Task) => task.status === "Completed").map((task) => (
                        <TaskCard key={task._id} task={task} />
                    ))}
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