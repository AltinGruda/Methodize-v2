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
router.post('/join-team/:teamId/:email', teamController_1.sendRequest);
router.put('/accept-request/:teamId/:email', teamController_1.handleResponse);
exports.default = router;
