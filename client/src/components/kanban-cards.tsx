import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { TaskCard } from "./task-card";
import { Card } from "./ui/card";
import { Task } from "@/models/Task";
import React from "react";
import { Plus } from "lucide-react";
import { Droppable, Draggable } from 'react-beautiful-dnd';

interface Props {
    tasks: Task[]
}

export const KanbanCards: React.FC<Props> = ({tasks}) => {

    const renderDroppableColumn = (status: string, columnTasks: Task[]) => (
        <Droppable droppableId={status} key={status}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {columnTasks.map((task, index) => (
                <Draggable draggableId={task._id} index={index} key={task._id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskCard key={task._id} task={task} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
    );

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
                    {renderDroppableColumn('To Do', tasks.filter((task) => task.status === 'To Do'))}
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
                    {renderDroppableColumn('In progress', tasks.filter((task) => task.status === 'In progress'))}
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
                    {renderDroppableColumn('In review', tasks.filter((task) => task.status === 'In review'))}                   
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
                        <Button variant="secondary" className="rounded-full bg-[#E5E5E5]">{tasks?.filter((task: Task) => task.status === "Completed").length}</Button>
                    </div>
                </div>
                <div>
                    <Separator className="my-2"/>
                </div>
                <Card className="bg-[#E8E8E8]">
                    {renderDroppableColumn('Completed', tasks.filter((task) => task.status === 'Completed'))}
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