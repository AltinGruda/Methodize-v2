import { Request, Response } from 'express';
import Project from '../models/Project';
import Team from '../models/Team'; //
import Task from '../models/Task';
import User from '../models/User';
import Comment from '../models/Comment';

// /project/:teamId/create-project
export const createProject = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const { teamId } = req.params;

        // Check if the team exists
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json('Team not found.');
        }

        // Create the project
        const project = await Project.create({
            name,
            team: teamId,
        });

        // Update the team's projects array with the new project's ObjectId
        await Team.findByIdAndUpdate(teamId, { $push: { projects: project._id } });

        return res.json(project);
    } catch (error) {
        console.error(error);
        return res.status(500).json('Error creating the project.');
    }
};

// /project/:projectId
export const updateProjectTitle = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        const { name } = req.body;

        // Check if the project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json('Project not found.');
        }

        // Update the project title
        project.name = name;
        await project.save();

        return res.json(project);
    } catch (error) {
        console.error(error);
        return res.status(500).json('Error updating project title.');
    }
};

export const deleteProject = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;

        // Check if the project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json('Project not found.');
        }

        // Optional: If you want to delete tasks associated with the project
        await Task.deleteMany({ projectId });

        // Update associated teams (assuming teams have a projects array)
        const teamsToUpdate = await Team.find({ projects: projectId });
        teamsToUpdate.forEach(async (team: any) => {
            const projectIndex = team.projects.indexOf(projectId);
            if (projectIndex !== -1) {
                team.projects.splice(projectIndex, 1);
            }
            await team.save();
        });

        // Delete the project
        await Project.findByIdAndDelete(projectId);

        return res.json('Project deleted successfully.');
    } catch (error) {
        console.error(error);
        return res.status(500).json('Error deleting the project.');
    }
};

export const getProjectTasks = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;

        // Check if the project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json('Project not found.');
        }

        // Retrieve all tasks associated with the project
        const tasks = await Task.find({ projectId });

        return res.json(tasks);
    } catch (error) {
        console.error(error);
        return res.status(500).json('Error fetching project tasks.');
    }
};

export const createTask = async (req: Request, res: Response) => {
    try {
        const { name, assigneeId, due_date, projectId, comments, status } = req.body;
        // Check if the project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json('Project not found.');
        }

        // Create the task
        const task = await Task.create({
            name,
            assigneeId,
            due_date,
            projectId,
            comments,
            status,
        });

        // Update the project's tasks array with the new task's ObjectId
        await Project.findByIdAndUpdate(projectId, { $push: { tasks: task._id } });

        return res.json(task);
    } catch (error) {
        console.error(error);
        return res.status(500).json('Error creating the task.');
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const { taskId } = req.params;
        const { name, assigneeId, due_date, completed, comments, status } = req.body;

        // Check if the task exists
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json('Task not found.');
        }

        // Update task properties
        if (name) task.name = name;
        if (assigneeId) task.assigneeId = assigneeId;
        if (due_date) task.due_date = due_date;
        if (completed !== undefined) task.completed = completed;
        if (comments) task.comments = comments;
        if (status) task.status = status;

        // Save the updated task
        await task.save();

        return res.json('Task updated successfully.');
    } catch (error) {
        console.error(error);
        return res.status(500).json('Error updating the task.');
    }
};

export const commentTask = async (req: Request, res: Response) => {
    try {
        const { taskId } = req.params;
        const { text, userId } = req.body;

        // Check if the task exists
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json('Task not found.');
        }

        // Create a comment
        const comment = await Comment.create({
            text,
            userId,
            taskId,
        });

        // Update the task's comments array with the new comment's ObjectId
        await Task.findByIdAndUpdate(taskId, { $push: { comments: comment._id } });

        return res.json(comment);
    } catch (error) {
        console.error(error);
        return res.status(500).json('Error commenting on the task.');
    }
};