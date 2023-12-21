import { Clock, MessageCircle, MoreVertical } from "lucide-react"
import { CardTitle, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Task } from "@/models/Task"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { AvatarFallback, Avatar } from "./ui/avatar"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { useState } from "react"
import { activeSprintTasks, checkActiveSprint, updateTask } from "@/api/apiCalls"
import { useParams } from "react-router-dom"

interface TaskCardProps {
    task: Task
    onDeleteTask: () => void;
    setActiveSprint: React.Dispatch<React.SetStateAction<Task[]>>
}

export const TaskCard: React.FC<TaskCardProps> = ({task, onDeleteTask, setActiveSprint}) => {
    const [taskParams, setTaskParams] = useState({});
    const param = useParams();

    function dateDaysLeft(date: string) {
        const dateNow = new Date(Date.now());
        const taskDate = new Date(date);

        const differenceInTime = taskDate.getTime() - dateNow.getTime();
        const daysLeft = Math.round(differenceInTime / (1000 * 3600 * 24));
        return daysLeft;
    }
    return (
        <div className="p-2 m-2 flex flex-col bg-[#EDEDED] rounded-md items-start space-y-3">
            <div className="flex justify-between items-start w-full">
                <CardTitle className="text-md font-normal">{task.name}</CardTitle>
                <div className="flex justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant='ghost'>
                        <MoreVertical className="text-[#6D7789]" />
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel className="hover:bg-accent hover:text-accent-foreground">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="ghost">Edit</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl">Edit Task</DialogTitle>
                                        <DialogDescription>
                                        Edit or Update Your Task here. Click save when you are done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-2">
                                                <Label
                                                    htmlFor="name"
                                                    className="text-left"
                                                >
                                                    Title
                                                </Label>
                                                <Input
                                                    id="name"
                                                    onChange={(e) => setTaskParams({...taskParams, name: e.target.value})}
                                                    placeholder="Title"
                                                    className="col-span-3"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-2">
                                                <Label htmlFor="description" className="text-left">
                                                    Description
                                                </Label>
                                                <Textarea
                                                    id="description"
                                                    rows={5}
                                                    onChange={(e) => setTaskParams({...taskParams, description: e.target.value})}
                                                    placeholder="Description"
                                                    className="col-span-3"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-2">
                                                <Label htmlFor="status" className="text-left">Status</Label>
                                            <select className="w-full p-2 border border-gray-300 rounded col-span-3" id="status" onChange={(e) => setTaskParams({...taskParams, status: e.target.value})}>
                                                <option value="" disabled>Select an option</option>
                                                <option value="To do">To do</option>
                                                <option value="In progress">In progress</option>
                                                <option value="In review">In review</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Backlog">Backlog</option>
                                            </select>
                                            </div>
                                        </div>

                                        <DialogFooter>
                                            <Button onClick={ async () => {
                                                try {
                                                    await updateTask(task._id, taskParams);
                                                    // there has to be a better way to force re-render, somehow setActiveSprint(prevTask => [...prevTask]) is not working
                                                    const sprint = await checkActiveSprint(param.id);
                                                    const sprintTasks = await activeSprintTasks(sprint.projectId, sprint._id);
                                                    setActiveSprint(sprintTasks);
                                                } catch (error) {
                                                    console.log(error);
                                                }
                                            }}>Save Changes</Button>
                                        </DialogFooter>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </DropdownMenuLabel>
                        <DropdownMenuLabel className="hover:bg-accent hover:text-accent-foreground">
                            {/* Delete alert */}
                            <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost">Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action will delete your task and cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction  onClick={ async () => {
                                        onDeleteTask();
                                    }}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuLabel>
                    </DropdownMenuContent>
                </DropdownMenu>
                </div>
            </div>

            <CardContent className="flex items-center justify-start w-full p-0">
                <MessageCircle className="text-gray-400" />
                <span className="text-gray-400">65</span>
                <div className="w-full flex justify-end gap-3 items-center">
                    <Button variant="ghost" className="bg-[#EDEBFE] rounded-full w-fit h-fit gap-2 text-[#5521B5] hover:text-[#5521B5]"><Clock className="w-5 h-5" />{dateDaysLeft(task.due_date)} days left</Button>
                    <Avatar>
                        <AvatarFallback>AG</AvatarFallback>
                    </Avatar>
                </div>
            </CardContent>
        </div>
    )
}