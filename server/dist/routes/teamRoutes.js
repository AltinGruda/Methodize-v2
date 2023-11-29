"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teamControllers_1 = require("../controllers/teamControllers");
const router = express_1.default.Router();
router.post('/create', teamControllers_1.create);
router.get('/list/:id', teamControllers_1.listTeams);
router.post('/join-team/:teamId/:fullname', teamControllers_1.sendRequest);
router.put('/accept-request/:teamId/:fullname', teamControllers_1.handleResponse);
exports.default = router;
