"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teamController_1 = require("../controllers/teamController");
const router = express_1.default.Router();
router.post('/create', teamController_1.create);
router.get('/list/:id', teamController_1.listTeams);
router.get('/:id', teamController_1.getTeamById);
// router.post('/join-team/:teamId/:email', sendRequest);
// router.put('/accept-request/:teamId/:email', handleResponse)
router.post('/:teamId/user/:userId', teamController_1.addUserToTeam);
router.get('/team-users/:teamId', teamController_1.getAllTeamUsers);
router.delete('/:teamId/remove-user/:userId', teamController_1.removeUser);
exports.default = router;
