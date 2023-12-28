import { Request, Response } from 'express';
import Project from '../models/Project';
import Team from '../models/Team'; //
import Task from '../models/Task';
import User from '../models/User';
import Comment from '../models/Comment';
import Sprint from '../models/Sprint';

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

export const getProjectsByTeam = async (req: Request, res: Response) => {
    try {
        const { teamId } = req.params;

        // Check if the team exists
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json('Team not found.');
        }

        // Retrieve all projects of the team
        const projects = await Project.find({ team: teamId });

        return res.json(projects);
    } catch (error) {
        console.error(error);
        return res.status(500).json('Error fetching projects.');
    }
};

export const getProjectById = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
    
        const project = await Project.findById(projectId);
    
        if (!project) {
          return res.status(404).json({ error: 'Project not found' });
        }
    
        return res.json(project);
      } catch (error) {
        console.error('Error getting project:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
}


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
        const { projectId, sprintId } = req.params;

        // Check if the project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json('Project not found.');
        }

          // Retrieve tasks based on projectId and optional sprintId
          const tasks = await Task.find({ projectId, sprint: sprintId });

        return res.json(tasks);
    } catch (error) {
        console.error(error);
        return res.status(500).json('Error fetching project tasks.');
    }
};

// Get all tasks of an user
export const getAllTasks = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const tasks = await Task.find({ assigneeId: userId });
        if(!tasks) {
            return res.json('User has no tasks yet.')
        }

        return res.json(tasks)
    } catch (error) {
        console.error(error);
        return res.status(500).json('Error fetching all tasks.')
    }
}

export const getTasks = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;

        // Check if the project exists
        const project = await Project.find({ _id: projectId });
        if (!project) {
            return res.status(404).json('Project not found.');
        }
        
        // Retrieve tasks based on projectId and optional sprintId
        const tasks = await Task.find({ projectId: projectId });
        console.log(tasks);

        return res.json(tasks);
    } catch (error) {
        console.error(error);
        return res.status(500).json('Error fetching project tasks.');
    }
};

export const createTask = async (req: Request, res: Response) => {
    try {
        const { name, assigneeId, due_date, projectId, comments, status, description , sprint} = req.body;
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
            description,
            sprint
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
        const { name, assigneeId, due_date, completed, comments, status, description } = req.body;
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
        if (description) task.description = description;
        // Save the updated task
        await task.save();

        return res.json('Task updated successfully.');
    } catch (error) {
        console.error(error);
        return res.status(500).json('Error updating the task.');
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const taskId = req.params.taskId;

        // Check if the task exists
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json('Task not found.');
        }

        // Get the projectId associated with the task
        const projectId = task.projectId;

        // Delete the task
        await Task.findByIdAndDelete(taskId);

        // Remove the task's ObjectId from the project's tasks array
        await Project.findByIdAndUpdate(projectId, { $pull: { tasks: taskId } });

        return res.json('Task deleted successfully.');
    } catch (error) {
        console.error(error);
        return res.status(500).json('Error deleting the task.');
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

export const getTaskComments = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
  
      // Check if the task exists
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json('Task not found.');
      }
  
      const comments = await Comment.find({ taskId });
  
      return res.json(comments);
    } catch (error) {
      console.error(error);
      return res.status(500).json('Error retrieving comments.');
    }
};

export const startSprint = async (req: Request, res: Response) => {
    try {
        const { projectId, durationInDays } = req.body;

        // Create a sprint with a start date and end date
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + durationInDays);

        const activeSprint = await Sprint.findOne({
            projectId,
            endDate: { $gt: new Date() },
            isFinished: false, // Consider only active sprints
        });

        if (activeSprint) {
            return res.status(400).json('Cannot start a new sprint. There is already an active sprint.');
        }

        const sprint = await Sprint.create({
            projectId,
            startDate,
            endDate,
        });

        // Update tasks in the backlog (excluding 'Archived' tasks) to be part of the sprint
        await Task.updateMany({ projectId, status: { $nin: ['Archived'] } }, { sprint: sprint._id, status: 'To Do' });

        return res.json(sprint);
    } catch (error) {
        console.error(error);
        return res.status(500).json('Error starting sprint.');
    }
};



export const finishSprint = async (req: Request, res: Response) => {
    try {
        const { sprintId } = req.params;

        // Check if all tasks in the sprint are completed
        const incompleteTasks = await Task.find({ sprint: sprintId, status: { $ne: 'Completed' } });
        if (incompleteTasks.length > 0) {
            return res.status(400).json('Cannot finish sprint. Some tasks are not completed.');
        }

        // Update the sprint's end date and set isFinished to true to mark it as finished
        const sprint = await Sprint.findByIdAndUpdate(sprintId, { endDate: new Date(), isFinished: true });

        // Archive tasks from the completed sprint
        await Task.updateMany({ sprint: sprintId, status: 'Completed' }, { isArchived: true, status: 'Archived' });

        return res.json('Sprint finished successfully.');
    } catch (error) {
        console.error(error);
        return res.status(500).json('Error finishing sprint.');
    }
};


export const checkActiveSprint = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;

        const activeSprint = await Sprint.findOne({
            projectId,
            endDate: { $gt: new Date() },
            isFinished: false, // Only consider sprints that are not finished
        });

        return res.json(activeSprint);
    } catch (error) {
        console.error(error);
        return res.status(500).json('Error checking active sprint.');
    }
};