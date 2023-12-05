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
exports.commentTask = exports.updateTask = exports.createTask = exports.getProjectTasks = exports.deleteProject = exports.updateProjectTitle = exports.createProject = void 0;
const Project_1 = __importDefault(require("../models/Project"));
const Team_1 = __importDefault(require("../models/Team")); //
const Task_1 = __importDefault(require("../models/Task"));
const Comment_1 = __importDefault(require("../models/Comment"));
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
        const { projectId } = req.params;
        // Check if the project exists
        const project = yield Project_1.default.findById(projectId);
        if (!project) {
            return res.status(404).json('Project not found.');
        }
        // Retrieve all tasks associated with the project
        const tasks = yield Task_1.default.find({ projectId });
        return res.json(tasks);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json('Error fetching project tasks.');
    }
});
exports.getProjectTasks = getProjectTasks;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, assigneeId, due_date, projectId, comments, status } = req.body;
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
        const { name, assigneeId, due_date, completed, comments, status } = req.body;
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
