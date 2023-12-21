import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { TaskCard } from "./task-card";
import { Card } from "./ui/card";
import { Task } from "@/models/Task";
import React, { useState } from "react";
import { Check, Plus } from "lucide-react";
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { activeSprintTasks, checkActiveSprint, createTask, getAllUsers, getTasks } from "@/api/apiCalls";
import { User } from "@/context/AuthContext";
import Avatar from "boring-avatars";
import { useParams } from "react-router-dom";
import { toast } from "./ui/use-toast";

interface Props {
    tasks: Task[]
    onDeleteTask: (taskId: string) => void;
    setActiveSprint: React.Dispatch<React.SetStateAction<Task[]>>
}

export const KanbanCards: React.FC<Props> = ({tasks, onDeleteTask, setActiveSprint}) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('');
    const [allUsers, setAllUsers] = useState<User[]>();

    const [users, setUsers] = useState<User[]>(); // Add this state for users
    const [selectedUser, setSelectedUser] = useState<User | null>();

    const [isUserAdded, setIsUserAdded] = useState(false);

    // Get project id from page params
    const param = useParams();

    // Function to handle user search
    const handleUserSearch = async (query) => {
        // Check if the input is empty
        if (!query.trim()) {
          // If it's empty, you might want to display a default set of users or skip the search
          setUsers([]);
          return;
        }
    
        const fetchUsers = await getAllUsers();
        setAllUsers(fetchUsers);
        const filteredUsers = allUsers?.filter((user) =>
          user.name.toLowerCase().includes(query.toLowerCase())
        );
        setUsers(filteredUsers);
    };

    // Function to handle user selection
    const handleUserSelection = (user) => {
        if (!isUserAdded) {
            // User is not added, so add the user
            setSelectedUser(user);
          } else {
            // User is added, so remove the user
            setSelectedUser(null);
          }
      
          setIsUserAdded(!isUserAdded);
    };

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
                      <TaskCard key={task._id} task={task} onDeleteTask={() => onDeleteTask(task._id)} setActiveSprint={setActiveSprint} />
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
                        {/* Create task modal */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost">Add Task</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Create a task</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            className="col-span-3"
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        <Label htmlFor="date" className="text-right">
                                            Due Date
                                        </Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            className="col-span-3"
                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                        <Label htmlFor="status" className="text-right">
                                            Status
                                        </Label>
                                        <select className="w-full p-2 border border-gray-300 rounded col-span-3" id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                                            <option value="" disabled>Select an option</option>
                                            <option value="To do">To do</option>
                                            <option value="In progress">In progress</option>
                                            <option value="In review">In review</option>
                                            <option value="Backlog">Backlog</option>
                                        </select>
                                        <Label htmlFor="assignee" className="text-right">
                                            Assignee
                                        </Label>
                                        <div className="relative col-span-3">
                                            <Input
                                                id="assignee"
                                                onChange={(e) => {
                                                    handleUserSearch(e.target.value); // Trigger user search
                                                }}
                                            />

                                            {/* Display filtered users */}
                                            {users && users.length > 0 && (
                                            <div className="absolute bg-white w-full mt-1 border border-gray-300 rounded shadow-md">
                                                {users.map((user) => (
                                                    <div
                                                        key={user._id}
                                                        className={`p-2 cursor-pointer hover:bg-gray-100 ${
                                                            selectedUser === user ? 'bg-gray-100' : ''
                                                        } flex justify-between items-center`}
                                                    >
                                                        {user.name}
                                                        <Button
                                                            variant="default"
                                                            className={`p-2 w-7 h-7 text-white bg-blue-500 hover:bg-blue-600 rounded-b ${
                                                                isUserAdded && selectedUser?._id === user._id
                                                                ? 'bg-green-500 hover:bg-green-600'
                                                                : 'bg-blue-500 hover:bg-blue-600'
                                                            }`}
                                                            onClick={() => handleUserSelection(user)}
                                                            >
                                                            {isUserAdded && selectedUser?._id === user._id ? <Check /> : <Plus />}
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                            )}
                                        </div>
                                        {selectedUser && 
                                            <div className="flex justify-end">
                                                <Avatar
                                                    size={40}
                                                    name={selectedUser?.name}// change this to user.name
                                                    variant="beam"
                                                    colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}      
                                                />
                                            </div>
                                        }
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogTrigger asChild>
                                    <Button type="submit" onClick={ async () => {
                                        try {
                                            const sprint = await checkActiveSprint(param.id);
                                            const sprintTasks = await activeSprintTasks(sprint.projectId, sprint._id);
                                            await createTask(name, date, status, param.id, selectedUser?._id, sprint._id);
                                            setSelectedUser(null);
                                            setActiveSprint(sprintTasks);
                                        } catch (error) {
                                            console.error(error);
                                            toast({
                                                title: "You cannot create tasks when sprint is not started.",
                                                description: "Please head to backlog and start sprint to create tasks.",
                                                variant: "destructive"
                                              })
                                        }
                                    } }>Create</Button>
                                    </DialogTrigger>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
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