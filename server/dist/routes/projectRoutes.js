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
// Update the title of a specific project
router.put('/:projectId', projectController_1.updateProjectTitle);
// Delete a specific project
router.delete('/delete/:projectId', projectController_1.deleteProject);
// Get all tasks of a specific project
router.get('/tasks/:projectId', projectController_1.getProjectTasks);
// Create a task inside a project
router.post('/create-task', projectController_1.createTask);
// Update a task inside a project
router.put('/task/:taskId', projectController_1.updateTask);
// Comment inside a task
router.post('/task/:taskId/comment', projectController_1.commentTask);
exports.default = router;
