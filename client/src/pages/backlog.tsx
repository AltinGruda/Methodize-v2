import { checkActiveSprint, createTask, finishSprint, getTasks, startSprint, updateTask } from "@/api/apiCalls";
import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserNav } from "@/components/user-nav";
import { Sprint } from "@/models/Sprint";
import { Task } from "@/models/Task";
import { CheckCircle2, ChevronsUpDown, Circle, HelpCircle, MoreVertical, ScanEye, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function Backlog() {
  const param = useParams();
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [duration, setDuration] = useState<number>();
  const [sprintState, setSprintState] = useState<boolean>();
  const [sprint, setSprint] = useState<Sprint>();
  const [changeStatus, setChangeStatus] = useState('');
  const [archivedTasks, setArchivedTasks] = useState([]);

  const getAllTasks = async () => {
    try {
      const tasks = await getTasks(param.id);
      const sprint: Sprint = await checkActiveSprint(param.id);

      // Separate tasks into active and archived
      const activeTasks = tasks.filter((task: Task) => task.status !== "Archived");
      const archivedTasks = tasks.filter((task: Task) => task.status === "Archived");

      setTasks(activeTasks);
      setArchivedTasks(archivedTasks);
      setSprintState(!!sprint)
      setSprint(sprint);
    } catch (error) {
      console.error('Error getting tasks:', error);
    }
  }

  useEffect(() => {
    getAllTasks();
  }, [param.id, sprint?._id]);

  function convertToDateString(due_date: string) {
    const dateObject = new Date(due_date);

    // Check if the conversion was successful
    if (isNaN(dateObject.getTime())) {
        // Invalid date
        throw new Error("Invalid date format");
    }

    const dateString = dateObject.toDateString();
    return dateString;
}

  return (
      <div className="m-10 flex flex-col gap-5 col-span-4">

          <div className="flex justify-between items-center">
              <Breadcrumb />
              <UserNav />
          </div>

          <Label htmlFor="search">Search Tasks</Label>
          <Input id="search" type="search" className="h-8 w-[150px] lg:w-[250px]" placeholder="Search tasks..." onChange={(e) => setSearch(e.target.value)} />
          <div className="flex justify-between">
            {/* create task */}
              <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary">Create Task</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                      <DialogTitle>Create a task</DialogTitle>
                      <DialogDescription>Choose any task status, but during sprint kickoff, all tasks automatically shift to 'To do'.🚀✨</DialogDescription>
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
                      </div>
                  </div>
                  <DialogFooter>
                    <DialogTrigger asChild>
                      <Button type="submit" onClick={ async () => {
                        try {
                          await createTask(name, date, status, param.id);
                          const tasks = await getTasks(param.id);
                          const activeTasks = tasks.filter((task: Task) => task.status !== "Archived");
                          const archivedTasks = tasks.filter((task: Task) => task.status === "Archived");
                          setTasks(activeTasks);
                          setArchivedTasks(archivedTasks);
                        } catch (error) {
                          console.error(error);
                        }
                      } }>Create</Button>
                    </DialogTrigger>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            {/* start a sprint */}
            {sprintState && <Button variant="secondary" onClick={ async () => {
                const response = await finishSprint(sprint?._id);
                console.log(response);
                getAllTasks();
            }}>
              Stop Sprint
            </Button>}
              <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className={sprintState ? "hidden" : ""}>Start Sprint</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Start a sprint</DialogTitle>
                        <DialogDescription>"Fuel your productivity! 🚀 Set the pace with a sprint—type your sprint duration, hit start, and watch tasks transform into triumphs. Ready, set, sprint!"</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="duration" className="text-left">
                              Duration in days
                          </Label>
                          <Input
                              id="duration"
                              type="number"
                              className="col-span-3"
                              onChange={(e) => setDuration(Number(e.target.value))}
                          />
                        </div>
                    </div>
                  <DialogFooter>
                    <DialogTrigger asChild>
                      <Button onClick={ async () => {
                        try {
                          await startSprint(param.id, duration);
                          getAllTasks();
                        } catch (error) {
                          console.error(error);
                        }
                      }}>Start</Button>
                    </DialogTrigger>
                  </DialogFooter>
                  </DialogContent>
              </Dialog>
          </div>
          <Table className="rounded-md border bg-[#FFFFFF]">
          <TableHeader>
              <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Due Date</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {tasks.filter((task: Task) => search.toLowerCase() === '' ? task : task.name.toLowerCase().includes(search)).map((task: Task) => (
              <TableRow key={task._id}>
                  <TableCell className="font-medium">TASK-{task._id.slice(-3)}</TableCell>
                  <TableCell>{task.name}</TableCell>
                  <TableCell className="flex gap-x-2">
                    {task.status === 'To do' && <Circle className="text-muted-foreground" />}
                    {task.status === 'In progress' && <Timer className="text-muted-foreground" />}
                    {task.status === 'In review' && <ScanEye className="text-muted-foreground" />}
                    {task.status === 'Completed' && <CheckCircle2 className="text-muted-foreground" />}
                    {task.status === 'Backlog' && <HelpCircle className="text-muted-foreground" />}
                    {task.status}
                  </TableCell>
                  <TableCell className="text-right">{convertToDateString(task.due_date)}</TableCell>
                  <td>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost'>
                            <MoreVertical />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost">Change Status</Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Change task status</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="status" className="text-right">
                                        Status
                                    </Label>
                                      <select className="w-full p-2 border border-gray-300 rounded col-span-3" id="status" value={changeStatus} onChange={(e) => setChangeStatus(e.target.value)}>
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
                                  <DialogTrigger asChild>
                                    <Button onClick={ async () => {
                                      try {
                                        await updateTask(changeStatus, task._id);
                                        setChangeStatus('');
                                        const tasks = await getTasks(param.id);
                                        const activeTasks = tasks.filter((task: Task) => task.status !== "Archived");
                                        setTasks(activeTasks);
                                      } catch (error) {
                                        console.error(error);
                                      }
                                    }}>Change</Button>
                                  </DialogTrigger>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </DropdownMenuLabel>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
              </TableRow>
              ))}
          </TableBody>
          </Table>

          {/* Archived Tasks */}
          <Collapsible>
            <div className="flex items-center justify-between space-x-4 bg-slate-50">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full">
                <h4 className="text-sm font-semibold mr-5">
                  Archived Tasks
                </h4>
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
            {/* Archived Tasks Collapsed */}
              <Table className="rounded-md border bg-[#FFFFFF]">
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {archivedTasks.map((task: Task) => (
                  <TableRow key={task._id}>
                    <TableCell className="font-medium">TASK-{task._id.slice(-3)}</TableCell>
                    <TableCell>{task.name}</TableCell>
                    <TableCell className="flex gap-x-2">
                      {task.status}
                    </TableCell>
                    <TableCell className="text-right">
                      {convertToDateString(task.due_date)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </CollapsibleContent>
          </Collapsible>
      </div>
  )
}