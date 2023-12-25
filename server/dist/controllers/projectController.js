"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkActiveSprint = exports.finishSprint = exports.startSprint = exports.getTaskComments = exports.commentTask = exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = exports.getAllTasks = exports.getProjectTasks = exports.deleteProject = exports.updateProjectTitle = exports.getProjectById = exports.getProjectsByTeam = exports.createProject = void 0;
const Project_1 = __importDefault(require("../models/Project"));
const Team_1 = __importDefault(require("../models/Team")); //
const Task_1 = __importDefault(require("../models/Task"));
const Comment_1 = __importDefault(require("../models/Comment"));
const Sprint_1 = __importDefault(require("../models/Sprint"));
// /project/:teamId/create-project
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const { teamId } = req.params;
        // Check if the team exists
        const team = yield Team_1.default.findById(teamId);
        if (!team) {
            return res.status(404).json('Team not found.');
        }
        // Create the project
        const project = yield Project_1.default.create({
            name,
            team: teamId,
        });
        // Update the team's projects array with the new project's ObjectId
        yield Team_1.default.findByIdAndUpdate(teamId, { $push: { projects: project._id } });
        return res.json(project);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json('Error creating the project.');
    }
});
exports.createProject = createProject;
const getProjectsByTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamId } = req.params;
        // Check if the team exists
        const team = yield Team_1.default.findById(teamId);
        if (!team) {
            return res.status(404).json('Team not found.');
        }
        // Retrieve all projects of the team
        const projects = yield Project_1.default.find({ team: teamId });
        return res.json(projects);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json('Error fetching projects.');
    }
});
exports.getProjectsByTeam = getProjectsByTeam;
const getProjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        const project = yield Project_1.default.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        return res.json(project);
    }
    catch (error) {
        console.error('Error getting project:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getProjectById = getProjectById;
// /project/:projectId
const updateProjectTitle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        const { name } = req.body;
        // Check if the project exists
        const project = yield Project_1.default.findById(projectId);
        if (!project) {
            return res.status(404).json('Project not found.');
        }
        // Update the project title
        project.name = name;
        yield project.save();
        return res.json(project);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json('Error updating project title.');
    }
});
exports.updateProjectTitle = updateProjectTitle;
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        // Check if the project exists
        const project = yield Project_1.default.findById(projectId);
        if (!project) {
            return res.status(404).json('Project not found.');
        }
        // Optional: If you want to delete tasks associated with the project
        yield Task_1.default.deleteMany({ projectId });
        // Update associated teams (assuming teams have a projects array)
        const teamsToUpdate = yield Team_1.default.find({ projects: projectId });
        teamsToUpdate.forEach((team) => __awaiter(void 0, void 0, void 0, function* () {
            const projectIndex = team.projects.indexOf(projectId);
            if (projectIndex !== -1) {
                team.projects.splice(projectIndex, 1);
            }
            yield team.save();
        }));
        // Delete the project
        yield Project_1.default.findByIdAndDelete(projectId);
        return res.json('Project deleted successfully.');
    }
    catch (error) {
        console.error(error);
        return res.status(500).json('Error deleting the project.');
    }
});
exports.deleteProject = deleteProject;
const getProjectTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId, sprintId } = req.params;
        // Check if the project exists
        const project = yield Project_1.default.findById(projectId);
        if (!project) {
            return res.status(404).json('Project not found.');
        }
        // Retrieve tasks based on projectId and optional sprintId
        const tasks = yield Task_1.default.find({ projectId, sprint: sprintId });
        return res.json(tasks);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json('Error fetching project tasks.');
    }
});
exports.getProjectTasks = getProjectTasks;
// Get all tasks of an user
const getAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const tasks = yield Task_1.default.find({ assigneeId: userId });
        if (!tasks) {
            return res.json('User has no tasks yet.');
        }
        return res.json(tasks);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json('Error fetching all tasks.');
    }
});
exports.getAllTasks = getAllTasks;
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        // Check if the project exists
        const project = yield Project_1.default.findById(projectId);
        if (!project) {
            return res.status(404).json('Project not found.');
        }
        // Retrieve tasks based on projectId and optional sprintId
        const tasks = yield Task_1.default.find({ projectId });
        return res.json(tasks);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json('Error fetching project tasks.');
    }
});
exports.getTasks = getTasks;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, assigneeId, due_date, projectId, comments, status, description, sprint } = req.body;
        // Check if the project exists
        const project = yield Project_1.default.findById(projectId);
        if (!project) {
            return res.status(404).json('Project not found.');
        }
        // Create the task
        const task = yield Task_1.default.create({
            name,
            assigneeId,
            due_date,
            projectId,
            comments,
            status,
            description,
            sprint
        });
        // Update the project's tasks array with the new task's ObjectId
        yield Project_1.default.findByIdAndUpdate(projectId, { $push: { tasks: task._id } });
        return res.json(task);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json('Error creating the task.');
    }
});
exports.createTask = createTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const { name, assigneeId, due_date, completed, comments, status, description } = req.body;
        // Check if the task exists
        const task = yield Task_1.default.findById(taskId);
        if (!task) {
            return res.status(404).json('Task not found.');
        }
        // Update task properties
        if (name)
            task.name = name;
        if (assigneeId)
            task.assigneeId = assigneeId;
        if (due_date)
            task.due_date = due_date;
        if (completed !== undefined)
            task.completed = completed;
        if (comments)
            task.comments = comments;
        if (status)
            task.status = status;
        if (description)
            task.description = description;
        // Save the updated task
        yield task.save();
        return res.json('Task updated successfully.');
    }
    catch (error) {
        console.error(error);
        return res.status(500).json('Error updating the task.');
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = req.params.taskId;
        // Check if the task exists
        const task = yield Task_1.default.findById(taskId);
        if (!task) {
            return res.status(404).json('Task not found.');
        }
        // Get the projectId associated with the task
        const projectId = task.projectId;
        // Delete the task
        yield Task_1.default.findByIdAndDelete(taskId);
        // Remove the task's ObjectId from the project's tasks array
        yield Project_1.default.findByIdAndUpdate(projectId, { $pull: { tasks: taskId } });
        return res.json('Task deleted successfully.');
    }
    catch (error) {
        console.error(error);
        return res.status(500).json('Error deleting the task.');
    }
});
exports.deleteTask = deleteTask;
const commentTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const { text, userId } = req.body;
        // Check if the task exists
        const task = yield Task_1.default.findById(taskId);
        if (!task) {
            return res.status(404).json('Task not found.');
        }
        // Create a comment
        const comment = yield Comment_1.default.create({
            text,
            userId,
            taskId,
        });
        // Update the task's comments array with the new comment's ObjectId
        yield Task_1.default.findByIdAndUpdate(taskId, { $push: { comments: comment._id } });
        return res.json(comment);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json('Error commenting on the task.');
    }
});
exports.commentTask = commentTask;
const getTaskComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        // Check if the task exists
        const task = yield Task_1.default.findById(taskId);
        if (!task) {
            return res.status(404).json('Task not found.');
        }
        const comments = yield Comment_1.default.find({ taskId });
        return res.json(comments);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json('Error retrieving comments.');
    }
});
exports.getTaskComments = getTaskComments;
const startSprint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId, durationInDays } = req.body;
        // Create a sprint with a start date and end date
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + durationInDays);
        const activeSprint = yield Sprint_1.default.findOne({
            projectId,
            endDate: { $gt: new Date() },
            isFinished: false, // Consider only active sprints
        });
        if (activeSprint) {
            return res.status(400).json('Cannot start a new sprint. There is already an active sprint.');
        }
        const sprint = yield Sprint_1.default.create({
            projectId,
            startDate,
            endDate,
        });
        // Update tasks in the backlog (excluding 'Archived' tasks) to be part of the sprint
        yield Task_1.default.updateMany({ projectId, status: { $nin: ['Archived'] } }, { sprint: sprint._id, status: 'To Do' });
        return res.json(sprint);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json('Error starting sprint.');
    }
});
exports.startSprint = startSprint;
const finishSprint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sprintId } = req.params;
        // Check if all tasks in the sprint are completed
        const incompleteTasks = yield Task_1.default.find({ sprint: sprintId, status: { $ne: 'Completed' } });
        if (incompleteTasks.length > 0) {
            return res.status(400).json('Cannot finish sprint. Some tasks are not completed.');
        }
        // Update the sprint's end date and set isFinished to true to mark it as finished
        const sprint = yield Sprint_1.default.findByIdAndUpdate(sprintId, { endDate: new Date(), isFinished: true });
        // Archive tasks from the completed sprint
        yield Task_1.default.updateMany({ sprint: sprintId, status: 'Completed' }, { isArchived: true, status: 'Archived' });
        return res.json('Sprint finished successfully.');
    }
    catch (error) {
        console.error(error);
        return res.status(500).json('Error finishing sprint.');
    }
});
exports.finishSprint = finishSprint;
const checkActiveSprint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        const activeSprint = yield Sprint_1.default.findOne({
            projectId,
            endDate: { $gt: new Date() },
            isFinished: false, // Only consider sprints that are not finished
        });
        return res.json(activeSprint);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json('Error checking active sprint.');
    }
});
exports.checkActiveSprint = checkActiveSprint;
