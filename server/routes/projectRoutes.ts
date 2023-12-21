import express from 'express';
import { checkActiveSprint, commentTask, createProject, createTask, deleteProject, deleteTask, finishSprint, getProjectById, getProjectTasks, getProjectsByTeam, getTasks, startSprint, updateProjectTitle, updateTask } from '../controllers/projectController';

const router = express.Router();

// Create a project for a specific team
router.post('/:teamId/create-project', createProject);

// Get projects by team id
router.get('/:teamId', getProjectsByTeam);

// Get project by id
router.get('/byId/:projectId', getProjectById);

// Update the title of a specific project
router.put('/:projectId', updateProjectTitle);

// Delete a specific project
router.delete('/delete/:projectId', deleteProject);

// Get all tasks of a specific project sprint
router.get('/tasks/:projectId/:sprintId', getProjectTasks);

// Get all tasks of a specific project
router.get('/tasks/:projectId', getTasks);

// Create a task inside a project
router.post('/create-task', createTask);

// Delete a task of a project
router.delete('/delete-task/:taskId', deleteTask);

// Update a task inside a project
router.put('/task/:taskId', updateTask);

// Comment inside a task
router.post('/task/:taskId/comment', commentTask);

// Start a sprint for a project
router.post('/start-sprint', startSprint);

// Finish a sprint for a project
router.put('/finish-sprint/:sprintId', finishSprint);

// Check if a sprint is active
router.get('/check-sprint/:projectId', checkActiveSprint);

export default router;
