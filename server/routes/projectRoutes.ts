import express from 'express';
import { commentTask, createProject, createTask, deleteProject, getProjectTasks, updateProjectTitle, updateTask } from '../controllers/projectController';

const router = express.Router();

// Create a project for a specific team
router.post('/:teamId/create-project', createProject);

// Update the title of a specific project
router.put('/:projectId', updateProjectTitle);

// Delete a specific project
router.delete('/delete/:projectId', deleteProject);

// Get all tasks of a specific project
router.get('/tasks/:projectId', getProjectTasks);

// Create a task inside a project
router.post('/create-task', createTask);

// Update a task inside a project
router.put('/task/:taskId', updateTask);

// Comment inside a task
router.post('/task/:taskId/comment', commentTask);


export default router;
