import { Check, Clock, Info, MessageCircle, MoreVertical, Plus } from "lucide-react"
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
import { useEffect, useState } from "react"
import { activeSprintTasks, checkActiveSprint, getAllUsers, getUserById, updateTask } from "@/api/apiCalls"
import { useParams } from "react-router-dom"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Separator } from "./ui/separator"
import CommentBox from "./comment-box"
import { User } from "@/context/AuthContext"

interface TaskCardProps {
    task: Task
    onDeleteTask: () => void;
    setActiveSprint: React.Dispatch<React.SetStateAction<Task[]>>
}

export const TaskCard: React.FC<TaskCardProps> = ({task, onDeleteTask, setActiveSprint}) => {
    const [taskParams, setTaskParams] = useState({});
    const param = useParams();

    const [allUsers, setAllUsers] = useState<User[]>();
    const [users, setUsers] = useState<User[]>(); // Add this state for users
    const [selectedUser, setSelectedUser] = useState<User | null>();
    const [assignee, setAssignee] = useState();

    const [isUserAdded, setIsUserAdded] = useState(false);

    function dateDaysLeft(date: string) {
        const dateNow = new Date(Date.now());
        const taskDate = new Date(date);

        const differenceInTime = taskDate.getTime() - dateNow.getTime();
        const daysLeft = Math.round(differenceInTime / (1000 * 3600 * 24));
        return daysLeft;
    }

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
            setTaskParams({...taskParams, assigneeId: user._id});
          } else {
            // User is added, so remove the user
            setSelectedUser(null);
          }
      
          setIsUserAdded(!isUserAdded);
    };

    useEffect(() => {
        async function getAssignee() {
            const response = await getUserById(task.assigneeId);
            console.log("Fetch user: ", response);
            setAssignee(response);
        }
        getAssignee();
    }, [task.assigneeId])

    console.log(assignee)
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
                        {/* View task */}
                        <DropdownMenuLabel className="hover:bg-accent hover:text-accent-foreground">
                            <Sheet>
                                <SheetTrigger className="w-full h-10 px-4 py-2">
                                    View
                                </SheetTrigger>
                                <SheetContent className="w-full h-3/4" side="bottom">
                                    <SheetHeader className="mb-5">
                                        <div className="flex">
                                            <span className="font-bold text-[#6D7789]">{task.status} / </span>
                                            <span className="font-bold text-[#38baec]">&nbsp;Task-{task._id.slice(-3)}</span>
                                        </div>
                                        <SheetTitle className="text-lg text-gray-700">{task.name}</SheetTitle>
                                        <Separator />
                                    </SheetHeader>
                                    <div className="grid grid-cols-6 w-full h-[80%] max-h-[80%]">
                                        <div className="border-r-2 col-span-3">
                                            {task.description && 
                                                <p className="text-lg text-gray-700">{task.description}</p>
                                            }
                                            {!task.description && 
                                                <div className="p-5">
                                                    <p className="mb-5 text-lg text-gray-700">
                                                    A task is a work unit derived from a user story, typically handled by one person. In Scrum, tasks break down larger goals into manageable parts for sprints.
                                                    </p>
                                                    <p className="text-lg text-gray-700 font-bold">Why Describe Tasks:</p>
                                                    <ol className="list-decimal pl-5 mb-5">
                                                        <li className="text-gray-700">
                                                            <strong>Break Down User Stories:</strong> Clarify and manage smaller components of user stories.
                                                        </li>
                                                        <li className="text-gray-700">
                                                            <strong>Empower Team Members:</strong> Provide clear instructions, empowering team members.
                                                        </li>
                                                        <li className="text-gray-700">
                                                            <strong>Facilitate Collaboration:</strong> Ensure everyone understands tasks, promoting seamless collaboration on the task board.
                                                        </li>
                                                    </ol>

                                                    <p className="text-gray-700 flex gap-x-2"><Info />Navigate to the 'Edit Task' section to provide and add your task description.</p>
                                              </div>
                                            }
                                        </div>
                                        <div className="border-r-2 col-span-1 p-5">
                                            <div className="flex flex-col space-y-6">
                                                <div className="p-4 bg-white border border-gray-300 rounded-lg shadow">
                                                    <h2 className="text-xl font-bold text-gray-800 mb-2">Due Date</h2>
                                                    <div className="flex items-center">
                                                        <span className="text-gray-600">Deadline:</span>
                                                        <span className="ml-2 text-red-500 font-bold">{dateDaysLeft(task.due_date)}</span>
                                                    </div>
                                                </div>

                                                {assignee && <>
                                                    <div className="p-4 bg-white border border-gray-300 rounded-lg shadow">
                                                        <h2 className="text-xl font-bold text-gray-800 mb-2">Assigned To</h2>
                                                        <div className="flex items-center">
                                                            <span className="ml-2 text-gray-800 font-bold">{assignee[0].name}</span>
                                                        </div>
                                                    </div>
                                                </>}

                                                <div className="p-4 bg-white border border-gray-300 rounded-lg shadow">
                                                    <h2 className="text-xl font-bold text-gray-800 mb-2">Status</h2>
                                                    <div className="flex items-center">
                                                        <span className="text-gray-600">Task:</span>
                                                        <span className="ml-2 text-blue-500 font-bold">{task.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <CommentBox taskId={task._id} />
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </DropdownMenuLabel>
                        <DropdownMenuLabel className="hover:bg-accent hover:text-accent-foreground">
                            {/* Edit dialog */}
                            <Dialog>
                                <DialogTrigger asChild className="w-full">
                                    <Button variant="ghost" >Edit</Button>
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
                                            <div className="grid grid-cols-4 items-center gap-2">
                                                <Label htmlFor="assignee">Assignee:</Label>
                                                <Input
                                                    id="assignee"
                                                    onChange={(e) => {
                                                        handleUserSearch(e.target.value); // Trigger user search
                                                    }}
                                                    className="col-span-3"
                                                />
                                                {/* Don't remove this empty div, added for layout purposes */}
                                                <div></div>
                                                {/* Display filtered users */}
                                                {users && users.length > 0 && (
                                                <div className="flex flex-col justify-center col-span-3 bg-white w-1/3 mt-1 border border-gray-300 rounded shadow-md">
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
                            <AlertDialogTrigger asChild className="w-full">
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
                <MessageCircle className="text-gray-400 transform -scale-100 rotate-90" />
                <span className="text-gray-400"></span>
                <div className="w-full flex justify-end gap-3 items-center">
                    <Button variant="ghost" className="bg-[#EDEBFE] rounded-full w-fit h-fit gap-2 text-[#5521B5] hover:text-[#5521B5]"><Clock className="w-5 h-5" />{dateDaysLeft(task.due_date)} days left</Button>
                </div>
            </CardContent>
        </div>
    )
}