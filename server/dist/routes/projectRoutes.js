"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_1 = require("../controllers/projectController");
const router = express_1.default.Router();
// Create a project for a specific team
router.post('/:teamId/create-project', projectController_1.createProject);
// Get projects by team id
router.get('/:teamId', projectController_1.getProjectsByTeam);
// Get project by id
router.get('/byId/:projectId', projectController_1.getProjectById);
// Update the title of a specific project
router.put('/:projectId', projectController_1.updateProjectTitle);
// Delete a specific project
router.delete('/delete/:projectId', projectController_1.deleteProject);
// Get all tasks of an user (from every project, even the archived ones)
router.get('/tasks/:userId', projectController_1.getAllTasks);
// Get all tasks of a specific project sprint
router.get('/tasks/:projectId/:sprintId', projectController_1.getProjectTasks);
// Get all tasks of a specific project
router.get('/tasks/:projectId', projectController_1.getTasks);
// Create a task inside a project
router.post('/create-task', projectController_1.createTask);
// Delete a task of a project
router.delete('/delete-task/:taskId', projectController_1.deleteTask);
// Update a task inside a project
router.put('/task/:taskId', projectController_1.updateTask);
// Comment inside a task
router.post('/task/:taskId/comment', projectController_1.commentTask);
// Get all comments of a task
router.get('/task/:taskId/comments', projectController_1.getTaskComments);
// Start a sprint for a project
router.post('/start-sprint', projectController_1.startSprint);
// Finish a sprint for a project
router.put('/finish-sprint/:sprintId', projectController_1.finishSprint);
// Check if a sprint is active
router.get('/check-sprint/:projectId', projectController_1.checkActiveSprint);
exports.default = router;
